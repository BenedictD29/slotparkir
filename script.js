// Menggunakan versi SDK stabil v10.12.0
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// =========================
// FIREBASE CONFIG
// =========================
const firebaseConfig = {
  apiKey: "AIzaSyCnC0ChTe6cZmoNQV0VLM2c4cRbfESFvZE",
  authDomain: "parking-slot-2e3a2.firebaseapp.com",
  databaseURL: "https://parking-slot-2e3a2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "parking-slot-2e3a2",
  storageBucket: "parking-slot-2e3a2.firebasestorage.app",
  messagingSenderId: "365291472545",
  appId: "1:365291472545:web:9f8c35c16d94dd4c2b92e0"
};

// =========================
// INISIALISASI
// =========================
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const slotRef = ref(database, "parking/slot");
const connectedRef = ref(database, ".info/connected");

// =========================
// BACA DATA SLOT (REALTIME)
// =========================
onValue(slotRef, (snapshot) => {
    if (snapshot.exists()) {
        const slot = snapshot.val();

        // Tampilkan angka slot
        document.getElementById("slot").textContent = slot;

        // Tampilkan Waktu WIB saat data diterima
        const now = new Date();
        const time = now.toLocaleTimeString("id-ID", {
            timeZone: "Asia/Jakarta",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        }).replace(/\./g, ':'); // Format HH:MM:SS

        document.getElementById("time").textContent = `Terakhir Update: ${time} WIB`;
    } else {
        document.getElementById("slot").textContent = "0";
        document.getElementById("time").textContent = "Data Kosong";
    }
}, (error) => {
    console.error("Gagal terhubung ke Firebase:", error);
    document.getElementById("time").textContent = "Koneksi Terputus";
    
    // Paksa reconnect otomatis jika terjadi error
    refreshConnection();
});

// =========================
// AUTO RECONNECT & VISIBILITY LOGIC
// =========================

// 1. Cek Status Koneksi Realtime
onValue(connectedRef, (snap) => {
    if (snap.val() === true) {
        console.log("Status: Terhubung ke Firebase");
    } else {
        console.warn("Status: Terputus, mencoba menghubungkan ulang...");
    }
});

// 2. Fungsi Restart Koneksi
function refreshConnection() {
    goOffline(database);
    setTimeout(() => {
        goOnline(database);
    }, 1000);
}

// 3. Reconnect Otomatis Saat Layar HP / Tab Dibuka Kembali
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
        console.log("Tab kembali aktif, memperbarui koneksi...");
        refreshConnection();
    }
});
