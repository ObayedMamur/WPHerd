import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("basic");

  // Generate random placeholder values
  const generateRandomValues = () => {
    const projectNames = ["myapp", "webapp", "project", "site", "blog", "shop", "portal", "demo"];
    const siteTitles = ["My Awesome Site", "Cool Project", "New Website", "Amazing App", "Creative Blog", "Online Store"];
    const usernames = ["admin", "user", "developer", "owner", "manager"];
    const emails = ["admin@example.com", "user@site.com", "dev@project.com", "owner@domain.com"];

    const randomProject = projectNames[Math.floor(Math.random() * projectNames.length)];
    const randomTitle = siteTitles[Math.floor(Math.random() * siteTitles.length)];
    const randomUser = usernames[Math.floor(Math.random() * usernames.length)];
    const randomEmail = emails[Math.floor(Math.random() * emails.length)];

    return {
      folderName: randomProject,
      siteUrl: `${randomProject}.test`,
      dbName: randomProject,
      siteTitle: randomTitle,
      adminUser: randomUser,
      adminEmail: randomEmail
    };
  };

  // Detect operating system and set default path
  const getDefaultPath = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('mac')) {
      return '~/Herd';
    } else if (userAgent.includes('win')) {
      return 'C:\\Herd';
    } else {
      return '~/Herd'; // Default for Linux and others
    }
  };

  const [randomPlaceholders] = useState(generateRandomValues());

  // Form state management
  const [formData, setFormData] = useState({
    siteTitle: "",
    adminUser: "",
    adminEmail: "",
    adminPassword: "",
    path: getDefaultPath(),
    // Advanced fields
    dbHost: "localhost",
    dbName: "",
    dbUser: "root",
    dbPassword: "",
    wpVersion: "latest",
    debug: false,
    debugLog: false,
    debugDisplay: false,
    theme: "",
    activateTheme: false
  });

  // Auto-generated fields based on site title
  const folderName = formData.siteTitle ? formData.siteTitle.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') : randomPlaceholders.folderName;
  const siteUrl = formData.siteTitle ? `${folderName}.test` : randomPlaceholders.siteUrl;
  const dbName = formData.siteTitle ? formData.siteTitle.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '') : randomPlaceholders.dbName;

  // Dynamic plugins state
  const [plugins, setPlugins] = useState([]);

  // Generated commands
  const [installCommand, setInstallCommand] = useState("");
  const [uninstallCommand, setUninstallCommand] = useState("");

  // Command execution state
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [executingCommand, setExecutingCommand] = useState(null); // Track which command is executing
  const [executionProgress, setExecutionProgress] = useState(0);
  const [executionOutput, setExecutionOutput] = useState('');
  const [tauriReady, setTauriReady] = useState(false);

  // Check for Tauri API availability
  useEffect(() => {
    const checkTauri = () => {
      if (typeof window !== 'undefined' && window.__TAURI__) {
        console.log("Tauri detected!");
        console.log("__TAURI__ keys:", Object.keys(window.__TAURI__));
        setTauriReady(true);
        return true;
      }
      return false;
    };

    // Check immediately
    if (!checkTauri()) {
      // If not available immediately, check periodically
      const interval = setInterval(() => {
        if (checkTauri()) {
          clearInterval(interval);
        }
      }, 100);

      // Clear interval after 5 seconds
      setTimeout(() => clearInterval(interval), 5000);
    }
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Plugin management functions
  const addPlugin = () => {
    setPlugins(prev => [...prev, { slug: '', active: false }]);
  };

  const removePlugin = (index) => {
    setPlugins(prev => prev.filter((_, i) => i !== index));
  };

  const updatePlugin = (index, field, value) => {
    setPlugins(prev => prev.map((plugin, i) =>
      i === index ? { ...plugin, [field]: value } : plugin
    ));
  };

  // Execute command function
  const handleExecuteCommand = async (command, commandType) => {
    setIsExecuting(true);
    setExecutionResult(null);
    setExecutingCommand(commandType);
    setExecutionProgress(0);
    setExecutionOutput('');

    // Split command into individual steps for progress tracking
    const steps = command.split(' && ');
    const totalSteps = steps.length;

    try {
      // Simulate progress and show each step
      let output = `$ ${command}\n\n`;
      setExecutionOutput(output);

      for (let i = 0; i < steps.length; i++) {
        const step = steps[i].trim();
        const progress = ((i + 1) / totalSteps) * 100;

        // Update progress
        setExecutionProgress(progress);

        // Add step to output
        output += `Executing: ${step}\n`;
        setExecutionOutput(output);

        // Simulate step execution time
        await new Promise(resolve => setTimeout(resolve, 500));

        // Add completion message
        output += `✓ Step ${i + 1}/${totalSteps} completed\n\n`;
        setExecutionOutput(output);
      }

      // Import the invoke function from the correct Tauri v2 path
      const { invoke } = await import("@tauri-apps/api/core");

      // Execute the actual command
      const result = await invoke("execute_command", { command });

      // Final output
      output += `\n✅ Command execution completed successfully!\n`;
      if (result) {
        output += `\nOutput:\n${result}`;
      }

      setExecutionResult({ success: true, output: result, commandType });
      setExecutionOutput(output);
      setExecutionProgress(100);

      // If install command was successful, open the site URL
      if (commandType === 'install' && result) {
        const currentSiteUrl = siteUrl;
        setTimeout(() => {
          window.open(`http://${currentSiteUrl}`, '_blank');
        }, 2000); // Wait 2 seconds for installation to complete
      }

    } catch (error) {
      console.error("Command execution failed:", error);
      const errorOutput = `\n❌ Command execution failed!\nError: ${error.toString()}`;
      setExecutionOutput(prev => prev + errorOutput);
      setExecutionResult({ success: false, output: error.toString(), commandType });
    } finally {
      setIsExecuting(false);
      setExecutingCommand(null);
    }
  };

  // Generate commands whenever form data changes
  useEffect(() => {
    // Use auto-generated or random placeholder values
    const currentFolderName = folderName;
    const currentSiteUrl = siteUrl;
    const currentDbName = formData.dbName || dbName;
    const dbUser = formData.dbUser;
    const dbPassword = formData.dbPassword;
    const dbHost = formData.dbHost;
    const siteTitle = formData.siteTitle || randomPlaceholders.siteTitle;
    const adminUser = formData.adminUser || randomPlaceholders.adminUser;
    const adminEmail = formData.adminEmail || randomPlaceholders.adminEmail;
    const adminPassword = formData.adminPassword || "admin";
    const wpVersion = formData.wpVersion;
    const path = formData.path;

    // Build install command following WP-CLI documentation
    let installSteps = [
      `cd ${path}`,
      `mkdir ${currentFolderName}`,
      `cd ${currentFolderName}`,
      `wp core download --version=${wpVersion}`,
      `mysql -u${dbUser}${dbPassword ? ` -p${dbPassword}` : ''} -h${dbHost} -e "CREATE DATABASE IF NOT EXISTS ${currentDbName};"`,
      `wp config create --dbname=${currentDbName} --dbuser=${dbUser}${dbPassword ? ` --dbpass=${dbPassword}` : ''} --dbhost=${dbHost}`,
      `wp core install --url=${currentSiteUrl} --title="${siteTitle}" --admin_user=${adminUser} --admin_password=${adminPassword} --admin_email=${adminEmail}`
    ];

    // Add debug settings if enabled
    if (formData.debug) {
      installSteps.push(`wp config set WP_DEBUG true --raw`);
    }
    if (formData.debugLog) {
      installSteps.push(`wp config set WP_DEBUG_LOG true --raw`);
    }
    if (formData.debugDisplay) {
      installSteps.push(`wp config set WP_DEBUG_DISPLAY true --raw`);
    }

    // Add theme installation if specified
    if (formData.theme && formData.theme.trim()) {
      installSteps.push(`wp theme install ${formData.theme}${formData.activateTheme ? ' --activate' : ''}`);
    }

    // Add plugin installations from dynamic plugins array
    plugins.forEach(plugin => {
      if (plugin.slug && plugin.slug.trim()) {
        installSteps.push(`wp plugin install ${plugin.slug}${plugin.active ? ' --activate' : ''}`);
      }
    });

    const install = installSteps.join(' && ');

    // Build uninstall command following WP-CLI documentation
    const uninstallSteps = [
      `cd ${path}/${currentFolderName}`,
      `mysql -u${dbUser}${dbPassword ? ` -p${dbPassword}` : ''} -h${dbHost} -e "DROP DATABASE IF EXISTS ${currentDbName};"`,
      `cd ${path}`,
      `rm -rf ${currentFolderName}`
    ];

    const uninstall = uninstallSteps.join(' && ');

    setInstallCommand(install);
    setUninstallCommand(uninstall);
  }, [formData, randomPlaceholders, plugins, folderName, siteUrl, dbName]);
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>WordPress Setup in Single Command</h1>
        <p>Generate and execute WP-CLI commands for Laravel Herd with ease</p>
      </header>

      <div className="content-wrapper">
        <div className="form-section">
          <div className="tab-group">
            <div className="tab-item">
              <input
                type="radio"
                name="mode"
                value="basic"
                checked={activeTab === "basic"}
                onChange={() => setActiveTab("basic")}
                id="basic-tab"
              />
              <label htmlFor="basic-tab">Basic</label>
            </div>
            <div className="tab-item">
              <input
                type="radio"
                name="mode"
                value="advance"
                checked={activeTab === "advance"}
                onChange={() => setActiveTab("advance")}
                id="advance-tab"
              />
              <label htmlFor="advance-tab">Advanced</label>
            </div>
          </div>

          {activeTab === "basic" && (
            <form className="wp-form">
            <div className="form-grid">




              <div className="form-group">
                <label htmlFor="siteTitle">Site Title</label>
                <input
                  type="text"
                  id="siteTitle"
                  name="siteTitle"
                  placeholder={randomPlaceholders.siteTitle}
                  value={formData.siteTitle}
                  onChange={handleInputChange}
                  autoCapitalize="none"
                  autoCorrect="off"
                />
                {formData.siteTitle && (
                  <small className="field-hint">
                    Folder: {folderName} | URL: {siteUrl} | DB: {dbName}
                  </small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="adminUser">Admin Username</label>
                <input
                  type="text"
                  id="adminUser"
                  name="adminUser"
                  placeholder={randomPlaceholders.adminUser}
                  value={formData.adminUser}
                  onChange={handleInputChange}
                  autoCapitalize="none"
                  autoCorrect="off"
                />
              </div>

              <div className="form-group">
                <label htmlFor="adminPassword">Admin Password</label>
                <input
                  type="password"
                  id="adminPassword"
                  name="adminPassword"
                  placeholder="admin"
                  value={formData.adminPassword}
                  onChange={handleInputChange}
                  autoCapitalize="none"
                  autoCorrect="off"
                />
              </div>

              <div className="form-group">
                <label htmlFor="adminEmail">Admin Email</label>
                <input
                  type="email"
                  id="adminEmail"
                  name="adminEmail"
                  placeholder={randomPlaceholders.adminEmail}
                  value={formData.adminEmail}
                  onChange={handleInputChange}
                  autoCapitalize="none"
                  autoCorrect="off"
                />
              </div>

            </div>
          </form>
          )}

          {activeTab === "advance" && (
            <form className="wp-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="path">Path</label>
                  <input
                    type="text"
                    id="path"
                    name="path"
                    placeholder="~/Herd"
                    value={formData.path}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="wpVersion">WordPress Version</label>
                  <select
                    id="wpVersion"
                    name="wpVersion"
                    value={formData.wpVersion}
                    onChange={handleInputChange}
                  >
                    <option value="latest">Latest</option>
                    <option value="6.4">6.4</option>
                    <option value="6.3">6.3</option>
                    <option value="6.2">6.2</option>
                    <option value="6.1">6.1</option>
                    <option value="6.0">6.0</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="dbHost">Database Host</label>
                  <input
                    type="text"
                    id="dbHost"
                    name="dbHost"
                    placeholder="localhost"
                    value={formData.dbHost}
                    onChange={handleInputChange}
                    autoCapitalize="none"
                    autoCorrect="off"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="dbName">Database Name</label>
                  <input
                    type="text"
                    id="dbName"
                    name="dbName"
                    placeholder={dbName}
                    value={formData.dbName}
                    onChange={handleInputChange}
                    autoCapitalize="none"
                    autoCorrect="off"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="dbUser">Database User</label>
                  <input
                    type="text"
                    id="dbUser"
                    name="dbUser"
                    placeholder="root"
                    value={formData.dbUser}
                    onChange={handleInputChange}
                    autoCapitalize="none"
                    autoCorrect="off"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="dbPassword">Database Password</label>
                  <input
                    type="password"
                    id="dbPassword"
                    name="dbPassword"
                    placeholder="Leave blank if no password"
                    value={formData.dbPassword}
                    onChange={handleInputChange}
                    autoCapitalize="none"
                    autoCorrect="off"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="siteTitle">Site Title</label>
                  <input
                    type="text"
                    id="siteTitle"
                    name="siteTitle"
                    placeholder={randomPlaceholders.siteTitle}
                    value={formData.siteTitle}
                    onChange={handleInputChange}
                    autoCapitalize="none"
                    autoCorrect="off"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="adminUser">Admin Username</label>
                  <input
                    type="text"
                    id="adminUser"
                    name="adminUser"
                    placeholder={randomPlaceholders.adminUser}
                    value={formData.adminUser}
                    onChange={handleInputChange}
                    autoCapitalize="none"
                    autoCorrect="off"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="adminPassword">Admin Password</label>
                  <input
                    type="password"
                    id="adminPassword"
                    name="adminPassword"
                    placeholder="admin"
                    value={formData.adminPassword}
                    onChange={handleInputChange}
                    autoCapitalize="none"
                    autoCorrect="off"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="adminEmail">Admin Email</label>
                  <input
                    type="email"
                    id="adminEmail"
                    name="adminEmail"
                    placeholder={randomPlaceholders.adminEmail}
                    value={formData.adminEmail}
                    onChange={handleInputChange}
                    autoCapitalize="none"
                    autoCorrect="off"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="wpVersion">WordPress Version</label>
                  <select
                    id="wpVersion"
                    name="wpVersion"
                    value={formData.wpVersion}
                    onChange={handleInputChange}
                  >
                    <option value="latest">Latest</option>
                    <option value="6.4">6.4</option>
                    <option value="6.3">6.3</option>
                    <option value="6.2">6.2</option>
                    <option value="6.1">6.1</option>
                    <option value="6.0">6.0</option>
                  </select>
                </div>
              </div>

              <div className="debug-options">
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="debug"
                      checked={formData.debug}
                      onChange={(e) => setFormData(prev => ({ ...prev, debug: e.target.checked }))}
                    />
                    Debug
                    {formData.debug && (
                      <small className="debug-code">define('WP_DEBUG', true);</small>
                    )}
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="debugLog"
                      checked={formData.debugLog}
                      onChange={(e) => setFormData(prev => ({ ...prev, debugLog: e.target.checked }))}
                    />
                    Debug Log
                    {formData.debugLog && (
                      <small className="debug-code">define('WP_DEBUG_LOG', true);</small>
                    )}
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="debugDisplay"
                      checked={formData.debugDisplay}
                      onChange={(e) => setFormData(prev => ({ ...prev, debugDisplay: e.target.checked }))}
                    />
                    Debug Display
                    {formData.debugDisplay && (
                      <small className="debug-code">define('WP_DEBUG_DISPLAY', true);</small>
                    )}
                  </label>
                </div>
              </div>

              <div className="themes-plugins-section">
                <div className="section-title">Theme</div>
                <div className="theme-plugin-item">
                  <input
                    type="text"
                    name="theme"
                    placeholder="hello-elementor"
                    value={formData.theme}
                    onChange={handleInputChange}
                    autoCapitalize="none"
                    autoCorrect="off"
                  />
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="activateTheme"
                      checked={formData.activateTheme}
                      onChange={(e) => setFormData(prev => ({ ...prev, activateTheme: e.target.checked }))}
                    />
                    Activate
                  </label>
                </div>

                <div className="section-title">Plugins</div>
                {plugins.map((plugin, index) => (
                  <div key={index} className="theme-plugin-item">
                    <input
                      type="text"
                      placeholder="elementor"
                      value={plugin.slug}
                      onChange={(e) => updatePlugin(index, 'slug', e.target.value)}
                      autoCapitalize="none"
                      autoCorrect="off"
                    />
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={plugin.active}
                        onChange={(e) => updatePlugin(index, 'active', e.target.checked)}
                      />
                      Activate
                    </label>
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removePlugin(index)}
                      disabled={plugins.length === 1}
                    >
                      ×
                    </button>
                    {index === plugins.length - 1 && (
                      <button
                        type="button"
                        className="add-more-btn"
                        onClick={addPlugin}
                      >
                        Add
                      </button>
                    )}
                  </div>
                ))}
              </div>


            </form>
          )}
        </div>

        <div className="output-section">
          <div className="command-section">
            <h2>Install Command</h2>
            <div className="command-output">
              <code>
                {installCommand.split(' && ').map((part, index) => (
                  <span key={index}>
                    {part}
                    {index < installCommand.split(' && ').length - 1 && (
                      <>
                        {' && '}
                        <br />
                      </>
                    )}
                  </span>
                ))}
              </code>
            </div>
            <button
              className="execute-button"
              onClick={() => handleExecuteCommand(installCommand, 'install')}
              disabled={isExecuting || !installCommand.trim()}
            >
              {isExecuting && executingCommand === 'install' ? "Executing..." : "Execute Install Command"}
            </button>

            {/* Progress bar for install command */}
            {isExecuting && executingCommand === 'install' && (
              <div className="progress-container">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${executionProgress}%` }}
                  ></div>
                </div>
                <span className="progress-text">{Math.round(executionProgress)}%</span>
              </div>
            )}

            {/* Terminal output for install command */}
            {(isExecuting && executingCommand === 'install' && executionOutput) ||
             (executionResult && executionResult.commandType === 'install') ? (
              <div className="terminal-output">
                <div className="terminal-header">
                  <span className="terminal-title">Terminal Output</span>
                </div>
                <div className="terminal-content">
                  <pre>{executionOutput || executionResult?.output}</pre>
                </div>
              </div>
            ) : null}
          </div>

          <div className="command-section">
            <h2>Uninstall Command</h2>
            <div className="command-output">
              <code>
                {uninstallCommand.split(' && ').map((part, index) => (
                  <span key={index}>
                    {part}
                    {index < uninstallCommand.split(' && ').length - 1 && (
                      <>
                        {' && '}
                        <br />
                      </>
                    )}
                  </span>
                ))}
              </code>
            </div>
            <button
              className="execute-button uninstall"
              onClick={() => handleExecuteCommand(uninstallCommand, 'uninstall')}
              disabled={isExecuting || !uninstallCommand.trim()}
            >
              {isExecuting && executingCommand === 'uninstall' ? "Executing..." : "Execute Uninstall Command"}
            </button>

            {/* Progress bar for uninstall command */}
            {isExecuting && executingCommand === 'uninstall' && (
              <div className="progress-container">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${executionProgress}%` }}
                  ></div>
                </div>
                <span className="progress-text">{Math.round(executionProgress)}%</span>
              </div>
            )}

            {/* Terminal output for uninstall command */}
            {(isExecuting && executingCommand === 'uninstall' && executionOutput) ||
             (executionResult && executionResult.commandType === 'uninstall') ? (
              <div className="terminal-output">
                <div className="terminal-header">
                  <span className="terminal-title">Terminal Output</span>
                </div>
                <div className="terminal-content">
                  <pre>{executionOutput || executionResult?.output}</pre>
                </div>
              </div>
            ) : null}
          </div>

          <div className="dashboard-section">
            <h2>Dashboard Info</h2>
            <div className="dashboard-info">
              <p>
                <strong>Dashboard URL:</strong>
                <a href={`http://${siteUrl}/wp-admin`} target="_blank" rel="noopener noreferrer">
                  http://{siteUrl}/wp-admin
                </a>
              </p>
              <p>
                <strong>Admin Username:</strong>
                <span className="dashboard-credential">{formData.adminUser || randomPlaceholders.adminUser}</span>
              </p>
              <p>
                <strong>Admin Password:</strong>
                <span className="dashboard-credential">{formData.adminPassword || "admin"}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="app-footer">
        <p>Created by <a href="https://obayedmamur.com" target="_blank" rel="noopener noreferrer">Obayed Mamur</a></p>
      </footer>
    </div>
  );
}

export default App;
