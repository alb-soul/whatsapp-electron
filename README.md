# Preview
<img src="https://github.com/user-attachments/assets/a52d64be-0856-44dd-b6ae-b22a9b72ee44" alt="waelec_bordered" width="800" />

![icon](https://github.com/user-attachments/assets/5408334b-e694-4f58-925d-8bfef1b586e0)


# Installation Steps

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
   sudo cp "WhatsApp Electron-1.0.0.AppImage" /opt/WhatsApp-Electron/whatsapp-electron.AppImage
6. Menjalankan aplikasi dari terminal:
   ```bash
   /opt/WhatsApp-Electron/whatsapp-electron.AppImage
8. Buat tersedia di menu:
   ```bash
   nano ~/.local/share/applications/whatsapp-electron.desktop
   ```
   Isi dengan :
   ```bash
   
   

Atau download AppImage di [Release](https://github.com/alb-soul/whatsapp-electron/releases)

--- WhatsApp Web for Linux Desktop build with Electron uses generic user agent ---
