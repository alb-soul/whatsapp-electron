const { app, BrowserWindow, Tray, Menu, Notification, ipcMain } = require('electron');
const path = require('path');

let win;
let tray;

app.isQuiting = false; // Menambahkan properti ini di awal aplikasi

// Minta kunci untuk memastikan hanya satu instance yang bisa berjalan
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // Jika aplikasi sudah terbuka, fokuskan jendela yang sudah ada
        if (win) {
            if (win.isMinimized()) win.restore();
            win.focus();
        }
    });

    async function createWindow() {
        const isDev = (await import('electron-is-dev')).default;

        win = new BrowserWindow({
            width: 800,
            height: 600,
            icon: path.join(__dirname, 'icon.png'), // Set the window icon
            autoHideMenuBar: true, // Hide the menu bar by default
            webPreferences: {
                contextIsolation: true,
                enableRemoteModule: false,
                preload: path.join(__dirname, 'preload.js') // Use a preload script for IPC
            }
        });

        // Set the user agent to avoid Chrome update prompts
        win.webContents.setUserAgent('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)');

        // Load WhatsApp Web URL
        win.loadURL('https://web.whatsapp.com');

        // Create the tray icon
        createTray();

        // Handle window close events
        win.on('close', (event) => {
            if (!app.isQuiting) {
                event.preventDefault();
                win.hide();
            }
        });
    }

    // Function to create the tray icon
    function createTray() {
        const iconPath = path.join(__dirname, 'icon.png'); // Use your tray icon path
        tray = new Tray(iconPath);

        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Open WhatsApp',
                click: () => {
                    win.show();
                    win.focus();
                }
            },
            {
                label: 'Quit',
                click: () => {
                    app.isQuiting = true; // Set app.isQuiting to true
                    app.quit();
                }
            }
        ]);

        tray.setToolTip('WhatsApp');
        tray.setContextMenu(contextMenu);

        // Show the window when the tray icon is clicked
        tray.on('click', () => {
            win.isVisible() ? win.hide() : win.show();
        });
    }

    // Function to show a notification
    function showNotification(title, body) {
        const notification = new Notification({
            title: title,
            body: body,
            icon: path.join(__dirname, 'icon.png') // Use your icon path
        });

        notification.onclick = () => {
            console.log("Notification clicked!"); // Log when the notification is clicked
            win.show(); // Show the window
            win.focus(); // Bring the window to the front
        };

        notification.show();
    }

    // IPC listener to receive messages from the renderer process
    ipcMain.on('new-message', (event, message) => {
        showNotification('New WhatsApp Message', message);
    });

    app.on('ready', createWindow);

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
}
