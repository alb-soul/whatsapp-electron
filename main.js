const { app, BrowserWindow, Tray, Menu, Notification, ipcMain, shell, clipboard } = require('electron');
const path = require('path');

let win;
let tray;

app.isQuiting = false;

// Minta kunci untuk memastikan hanya satu instance yang bisa berjalan
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        if (win) {
            if (win.isMinimized()) win.restore();
            win.show();
            win.focus();
        }
    });

    async function createWindow() {
        if (win) {
            win.show();
            win.focus();
            return;
        }

        win = new BrowserWindow({
            width: 800,
            height: 600,
            icon: path.join(__dirname, 'icon.png'),
            autoHideMenuBar: true,
            webPreferences: {
                contextIsolation: true,
                enableRemoteModule: false,
                preload: path.join(__dirname, 'preload.js')
            }
        });

        win.webContents.setUserAgent('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)');
        win.loadURL('https://web.whatsapp.com');

        createTray();

        win.on('close', (event) => {
            if (!app.isQuiting) {
                event.preventDefault();
                win.hide();
            }
        });

        // Handle external links opening
        win.webContents.setWindowOpenHandler(({ url }) => {
            handleExternalLinks(url);
            return { action: 'deny' };
        });

        win.webContents.on('will-navigate', (event, url) => {
            if (!url.startsWith('https://web.whatsapp.com')) {
                event.preventDefault();
                handleExternalLinks(url);
            }
        });

        // Add context menu for right-click
        win.webContents.on('context-menu', (event, params) => {
            let menuItems = [];
        
            // Menambahkan opsi "Copy Text" hanya jika ada teks yang dipilih, link, email, atau nomor telepon
            if (params.selectionText || params.linkURL || isEmail(params.selectionText)) {
                menuItems.push({
                    label: 'Copy Text',
                    visible: true,
                    click: () => {
                        const textToCopy = params.selectionText || params.linkURL || params.selectionText; // Prioritize selected text > link > email > phone
                        if (textToCopy) clipboard.writeText(textToCopy);
                    }
                });
            }
        
            // Menambahkan separator jika ada item menu
            if (menuItems.length > 0) {
                menuItems.push({ type: 'separator' });
            }
        
            // Menambahkan opsi "Open in Browser" jika URL ditemukan
            if (isURL(params.linkURL)) {
                menuItems.push({
                    label: 'Open in Browser',
                    visible: true,
                    click: () => {
                        shell.openExternal(params.linkURL);
                    }
                });
            }
        
            // Menambahkan opsi "Open in Email Client" jika link adalah mailto
            if (isMailto(params.linkURL)) {
                menuItems.push({
                    label: 'Open in Email Client',
                    visible: true,
                    click: () => {
                        shell.openExternal(params.linkURL);
                    }
                });
            }
        
            // Membangun dan menampilkan menu hanya jika ada item menu
            if (menuItems.length > 0) {
                const menu = Menu.buildFromTemplate(menuItems);
                menu.popup();
            }
        });
    }

    // Function to handle external links
    function handleExternalLinks(url) {
        if (url.startsWith('mailto:')) {
            shell.openExternal(url);
        } else {
            shell.openExternal(url);
        }
    }

    // Check if the link is a URL
    function isURL(link) {
        return /^https?:\/\//.test(link);
    }

    // Check if the link is a mailto link
    function isMailto(link) {
        return /^mailto:/.test(link);
    }

    // Check if text looks like an email
    function isEmail(text) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
    }

    // Function to create the tray icon
    function createTray() {
        const iconPath = path.join(__dirname, 'icon.png');
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
                    app.isQuiting = true;
                    app.quit();
                }
            }
        ]);

        tray.setToolTip('WhatsApp');
        tray.setContextMenu(contextMenu);

        tray.on('click', () => {
            win.isVisible() ? win.hide() : win.show();
        });
    }

    // Function to show a notification
    function showNotification(title, body) {
        const notification = new Notification({
            title: title,
            body: body,
            icon: path.join(__dirname, 'icon.png')
        });

        notification.onclick = () => {
            win.show();
            win.focus();
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
