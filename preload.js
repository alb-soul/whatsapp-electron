const { contextBridge, ipcRenderer } = require('electron');

// Mengekspos fungsi ke dunia renderer
contextBridge.exposeInMainWorld('electron', {
    sendMessage: (message) => ipcRenderer.send('new-message', message)
});

// Fungsi untuk menghapus class 'app-wrapper-web'
function removeAppWrapperClass() {
    const appWrapper = document.querySelector('.app-wrapper-web');
    if (appWrapper) {
        appWrapper.classList.remove('app-wrapper-web');
        console.log('Class app-wrapper-web berhasil dihapus.');
    }
}

// Mengawasi perubahan pada DOM
function observeDOMChanges() {
    const observer = new MutationObserver(() => {
        removeAppWrapperClass();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    console.log('DOM observer aktif.');
}

// Jalankan setelah halaman selesai dimuat
window.addEventListener('DOMContentLoaded', () => {
    removeAppWrapperClass();
    observeDOMChanges();
});
