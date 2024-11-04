# Preview
<img src="https://github.com/user-attachments/assets/a52d64be-0856-44dd-b6ae-b22a9b72ee44" alt="waelec_bordered" width="800" />

![icon](https://github.com/user-attachments/assets/5408334b-e694-4f58-925d-8bfef1b586e0)


# Installation Steps

Download AppImage from [Release](https://github.com/alb-soul/whatsapp-electron/releases) page.
Put the AppImage to /opt/ directory then give executable access.
```bash
sudo mkdir /opt/WhatsApp-Electron
```
Copy downloaded AppImage file to /opt/WhatsApp-Electron directory
```bash
sudo cp WhatsApp.Electron-<your-version>.AppImage /opt/WhatsApp-Electron/whatsapp-electron.AppImage
```
*replace <your-version> with the appropriate value. E.x : WhatsApp.Electron-1.0.0.AppImage (ganti kata <your-version> ke yang sesuai didownload)
```bash
sudo chmod +x /opt/WhatsApp-Electron/whatsapp-electron.AppImage
```
And run from terminal:
```bash
/opt/WhatsApp-Electron/whatsapp-electron.AppImage
```
## Or install it from source :

1. Cloning repository:
   ```bash
   git clone https://github.com/alb-soul/whatsapp-electron.git
   cd whatsapp-electron
1. Instal dependensi:
   ```bash
   npm install
3. Coba dulu
   ```bash
   npm run start
4. Atau build proyek untuk generate AppImage:
   ```bash
   npm run build
5. Pindah program ke directory /opt:
   ```bash
   cd dist
   sudo mkdir /opt/WhatsApp-Electron
   sudo cp "WhatsApp Electron-<your-version>.AppImage" /opt/WhatsApp-Electron/whatsapp-electron.AppImage
6. Menjalankan aplikasi dari terminal:
   ```bash
   /opt/WhatsApp-Electron/whatsapp-electron.AppImage
   ```
## Buat tersedia di menu:
   ```bash
   nano ~/.local/share/applications/whatsapp-electron.desktop
   ```
   Isi dengan :
   ```bash
   [Desktop Entry]
   Name=WhatsApp Electron
   Exec=/opt/WhatsApp-Electron/whatsapp-electron.AppImage
   Icon=whatsapp
   Type=Application
   Categories=Chat;Communication;
   StartupNotify=true
   ```
   Simpan/save (Ctrl+x, lalu y, tekan Enter)
9. Update desktop icon:
    ```bash
    update-desktop-database ~/.local/share/applications
    ```



--- WhatsApp Web for Linux Desktop build with Electron uses generic user agent ---
