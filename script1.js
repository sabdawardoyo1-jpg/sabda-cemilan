let keranjang = [];
let produkSementara = null; // buat simpan produk yg lagi dipilih

function tambahKeKeranjang(id, nama, harga) {
    produkSementara = { id, nama, harga, jumlah: 1 };
    bukaModalProduk();
}

function bukaModalProduk() {
    document.getElementById('judul-modal').innerText = produkSementara.nama;
    document.getElementById('isi-keranjang').innerHTML = `
        <div class="item-keranjang">
            <div>
                <b>${produkSementara.nama}</b><br>
                Rp ${produkSementara.harga.toLocaleString('id-ID')}
            </div>
            <div>
                <button class="qty-btn" onclick="kurangQtySementara()">-</button>
                <span style="padding: 0 10px; font-weight: bold;">${produkSementara.jumlah}</span>
                <button class="qty-btn" onclick="tambahQtySementara()">+</button>
            </div>
        </div>
    `;
    document.getElementById('total-harga').style.display = 'none'; // sembunyikan total

    // INI YANG DITAMBAH: TAMPILKAN TOMBOL TAMBAH
    document.getElementById('btn-aksi').style.display = 'block';
    document.getElementById('btn-aksi').innerText = 'Tambah ke Keranjang';
    document.getElementById('btn-aksi').onclick = konfirmasiTambah;

    document.getElementById('modal-keranjang').style.display = 'flex';

}

function tambahQtySementara() {
    produkSementara.jumlah += 1;
    bukaModalProduk();
}
function kurangQtySementara() {
    if (produkSementara.jumlah > 1) {
        produkSementara.jumlah -= 1;
        bukaModalProduk();
    }
}

function konfirmasiTambah() {
    let item = keranjang.find(p => p.id === produkSementara.id);
    if (item) {
        item.jumlah += produkSementara.jumlah;
    } else {
        keranjang.push(produkSementara);
    }
    produkSementara = null;
    tutupKeranjang();
    updateKeranjangIcon();
    alert('Produk ditambahkan ke keranjang!');
}

function updateKeranjangIcon() {
    let jumlahItem = keranjang.reduce((sum, item) => sum + item.jumlah, 0);
    document.getElementById('jumlah-keranjang').innerText = jumlahItem;
}

// Ini buat nampilin keranjang beneran + 3 metode bayar
function bukaKeranjang() {
    document.getElementById('judul-modal').innerText = 'Keranjang Belanja';
    document.getElementById('total-harga').style.display = 'block';
    updateKeranjang(); // tampilkan semua isi keranjang

    // TAMPILKAN 3 TOMBOL METODE BAYAR
    document.getElementById('isi-keranjang').innerHTML += `
        <h3 style="margin-top:20px; text-align:center;">Pilih Metode Pembayaran</h3>
        <div class="metode-bayar">
            <button onclick="bayar('DANA')">💙 Bayar DANA</button>
            <button onclick="bayar('GOPAY')">💚 Bayar GoPay</button>
            <button onclick="bayar('MANDIRI')">💛 Bayar Mandiri</button>
        </div>
    `;
    document.getElementById('btn-aksi').style.display = 'none'; // sembunyikan tombol lama
    document.getElementById('modal-keranjang').style.display = 'flex';
}

function updateKeranjang() {
    let isi = document.getElementById('isi-keranjang');
    let total = 0;
    isi.innerHTML = '';

    keranjang.forEach((item, index) => {
        total += item.harga * item.jumlah;
       isi.innerHTML += `
        <div class="item-keranjang">
            <div>
                <b>${item.nama}</b><br>
                Rp ${item.harga.toLocaleString('id-ID')} x ${item.jumlah}
            </div>
            <div>
                <button class="qty-btn" onclick="kurangQty(${index})">-</button>
                <button class="qty-btn" onclick="tambahQty(${index})">+</button>
                <button class="qty-btn hapus" onclick="hapusItem(${index})">Hapus</button>
            </div>
        </div>
    `;
    });
    document.getElementById('total-harga').innerText = `Total: Rp ${total.toLocaleString('id-ID')}`;
}

function tambahQty(i){keranjang[i].jumlah++;bukaKeranjang();}
function kurangQty(i){keranjang[i].jumlah>1?keranjang[i].jumlah--:keranjang.splice(i,1);bukaKeranjang();}
function hapusItem(i){keranjang.splice(i,1);bukaKeranjang();}
function tutupKeranjang(){document.getElementById('modal-keranjang').style.display='none';}

// FUNGSI BARU: PILIH METODE BAYAR
function bayar(metode) {
    if (keranjang.length === 0) { alert('Keranjang masih kosong!'); return; }

    let total = keranjang.reduce((sum, item) => sum + item.harga * item.jumlah, 0);
    let noAdmin = "62998628025"; // GANTI NOMOR WA KAMU

    let infoPembayaran = "";
    if(metode === 'DANA'){
        infoPembayaran = `
            Transfer ke DANA: 08998628025 a/n Sabda gusti nang wardoyo<br><br>
            <img src="dana.jpg" style="width:200px; margin:auto; display:block;">
            <p style="font-size:14px;">Scan QR DANA di atas</p>
        `;
    }
    if(metode === 'GOPAY'){
        infoPembayaran = `
            Transfer ke GoPay:  08998628025 a/n Sabda gusti nang wardoyo<br><br>
            <img src="gopay.jpg" style="width:200px; margin:auto; display:block;">
            <p style="font-size:14px;">Scan QR GoPay di atas</p>
        `;
    }
    if(metode === 'MANDIRI'){
        infoPembayaran = `
            Transfer ke Mandiri: 1270011397252 a/n Sabda gusti nang wardoyo<br><br>
            <p style="font-size:14px;">a.n Sabda gusti nang wardoyo</p>
        `;
    }

    document.getElementById('judul-modal').innerText = `Bayar via ${metode}`;
    document.getElementById('isi-keranjang').innerHTML = `
        <div style="text-align:center;">
            <h2 style="color:#ff6b6b;">Rp ${total.toLocaleString('id-ID')}</h2>
            <p>${infoPembayaran}</p>
            <p style="font-size:14px; color:gray;">Setelah transfer, klik tombol di bawah</p>
        </div>
    `;
    document.getElementById('btn-aksi').style.display = 'block';
    document.getElementById('btn-aksi').innerText = 'Saya Sudah Bayar';
    document.getElementById('btn-aksi').onclick = () => {
    window.location.href = `bukti-pembayaran.html?metode=${metode}&total=${total}`;
};
    document.getElementById('total-harga').style.display = 'none';
}

// function konfirmasiBayar(metode, total) {
//     let noAdmin = "62998628025"; // GANTI NOMOR WA KAMU

//     let pesan = `Halo Admin, saya sudah bayar via ${metode} ✅\n\n`;
//     pesan += `Total Bayar: Rp ${total.toLocaleString('id-ID')}\n\n`;
//     pesan += `Detail Pesanan:\n`;
//     keranjang.forEach(item => {
//         pesan += `- ${item.nama} x ${item.jumlah}\n`;
//     });
//     pesan += `\nMohon konfirmasi. Terima kasih`;

//     let url = `https://wa.me/${62998628025}?text=${encodeURIComponent(pesan)}`;
//     window.open(url, '_blank');

//     alert('Terima kasih! Silakan kirim bukti transfer jika diperlukan.');
//     keranjang = [];
//     updateKeranjangIcon();
//     tutupKeranjang();
// }
function konfirmasiBayar(metode, total) {
    let noAdmin = "62998628025"; // GANTI NOMOR WA KAMU

    let pesan = `Halo Admin Sabda Cemilan 👋\n`;
    pesan += `Selamat datang, saya mau konfirmasi pembayaran ya 😊\n\n`; // INI SALAMNYA
    pesan += `Metode: ${metode}\n`;
    pesan += `Total Bayar: Rp ${total.toLocaleString('id-ID')}\n\n`;
    pesan += `Detail Pesanan:\n`;
    keranjang.forEach(item => {
        pesan += `- ${item.nama} x ${item.jumlah}\n`;
    });
    pesan += `\nTerima kasih sudah belanja di Sabda Cemilan 🙏`;

    let url = `https://wa.me/${noAdmin}?text=${encodeURIComponent(pesan)}`;
    window.open(url, '_blank');

    alert('Terima kasih! Silakan kirim bukti transfer jika diperlukan.');
    keranjang = [];
    updateKeranjangIcon();
    tutupKeranjang();
}

// Biar bisa klik di luar modal juga ketutup
window.onclick = function(event) {
    let modal = document.getElementById('modal-keranjang');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}
