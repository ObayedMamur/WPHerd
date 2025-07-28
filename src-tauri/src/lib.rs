use std::process::Command;
use std::env;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn execute_command(command: String) -> Result<String, String> {
    // Preprocess command to use full paths for common tools
    let processed_command = preprocess_command(&command);

    let output = if cfg!(target_os = "windows") {
        Command::new("cmd")
            .args(["/C", &processed_command])
            .env("PATH", get_extended_path())
            .output()
    } else {
        Command::new("sh")
            .args(["-c", &processed_command])
            .env("PATH", get_extended_path())
            .output()
    };

    match output {
        Ok(output) => {
            let stdout = String::from_utf8_lossy(&output.stdout);
            let stderr = String::from_utf8_lossy(&output.stderr);

            if output.status.success() {
                let result = if stdout.is_empty() && !stderr.is_empty() {
                    stderr.to_string()
                } else {
                    stdout.to_string()
                };
                Ok(result)
            } else {
                let error_msg = if stderr.is_empty() {
                    format!("Command failed with exit code: {}", output.status.code().unwrap_or(-1))
                } else {
                    stderr.to_string()
                };
                Err(error_msg)
            }
        }
        Err(e) => Err(format!("Failed to execute command: {}", e)),
    }
}

fn preprocess_command(command: &str) -> String {
    let mut processed = command.to_string();

    // Replace 'wp' with full path and add memory limit if it exists
    if let Some(wp_path) = find_wp_cli_path() {
        let wp_with_memory = format!("php -d memory_limit=512M {}", wp_path);
        processed = processed.replace(" wp ", &format!(" {} ", wp_with_memory));
        if processed.starts_with("wp ") {
            processed = processed.replacen("wp ", &format!("{} ", wp_with_memory), 1);
        }
    }

    // Replace 'mysql' with full path if it exists
    if let Some(mysql_path) = find_mysql_path() {
        processed = processed.replace(" mysql ", &format!(" {} ", mysql_path));
        if processed.starts_with("mysql ") {
            processed = processed.replacen("mysql ", &format!("{} ", mysql_path), 1);
        }
    }



    processed
}



fn find_wp_cli_path() -> Option<String> {
    // First try using 'which' command to find wp
    if let Ok(output) = Command::new("which").arg("wp").output() {
        if output.status.success() {
            let path = String::from_utf8_lossy(&output.stdout).trim().to_string();
            if !path.is_empty() {
                return Some(path);
            }
        }
    }

    // Fallback to common WP-CLI installation paths
    let mut paths = vec![
        "/usr/local/bin/wp".to_string(),
        "/opt/homebrew/bin/wp".to_string(),
        "/usr/bin/wp".to_string(),
    ];

    // Add Herd-specific path for current user
    if let Ok(home) = env::var("HOME") {
        paths.push(format!("{}/Library/Application Support/Herd/bin/wp", home));
    }

    for path in paths {
        if std::path::Path::new(&path).exists() {
            return Some(path);
        }
    }

    None
}

fn find_mysql_path() -> Option<String> {
    // First try using 'which' command to find mysql
    if let Ok(output) = Command::new("which").arg("mysql").output() {
        if output.status.success() {
            let path = String::from_utf8_lossy(&output.stdout).trim().to_string();
            if !path.is_empty() {
                return Some(path);
            }
        }
    }

    // Fallback to common MySQL installation paths
    let mut paths = vec![
        "/usr/local/mysql/bin/mysql".to_string(),
        "/opt/homebrew/bin/mysql".to_string(),
        "/usr/bin/mysql".to_string(),
    ];

    // Add Herd-specific path for current user
    if let Ok(home) = env::var("HOME") {
        paths.push(format!("{}/Library/Application Support/Herd/bin/mysql", home));
    }

    for path in paths {
        if std::path::Path::new(&path).exists() {
            return Some(path);
        }
    }

    None
}

fn get_extended_path() -> String {
    let current_path = env::var("PATH").unwrap_or_default();
    let mut additional_paths = vec![
        "/usr/local/bin".to_string(),
        "/opt/homebrew/bin".to_string(),
        "/usr/bin".to_string(),
        "/bin".to_string(),
        "/usr/local/mysql/bin".to_string(),
    ];

    // Add Herd-specific path for current user
    if let Ok(home) = env::var("HOME") {
        additional_paths.push(format!("{}/Library/Application Support/Herd/bin", home));
    }

    let mut all_paths = vec![current_path];
    all_paths.extend(additional_paths);

    all_paths.join(":")
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, execute_command])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
