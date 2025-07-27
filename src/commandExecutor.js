import { invoke } from "@tauri-apps/api/tauri";

/**
 * Execute a shell command using Tauri's invoke function
 * @param {string} command - The shell command to execute
 * @returns {Promise<string>} - The command output or error message
 */
export async function executeCommand(command) {
  try {
    const result = await invoke("execute_command", { command });
    return { success: true, output: result };
  } catch (error) {
    console.error("Command execution failed:", error);
    return { success: false, output: error.toString() };
  }
}
