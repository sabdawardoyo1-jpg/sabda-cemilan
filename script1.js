let keranjang = [];
let produkSementara = null;
const noAdminWA = "628998628025"; // GANTI INI NOMOR WA ADMIN KAMU. Format: 62xxx

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
    document.getElementById('total-harga').style.display = 'none';
    document.getElementById('btn-aksi').style.display = 'block';
    document.getElementById('btn-aksi').innerText = 'Tambah ke Keranjang';
    document.getElementById('btn-aksi').onclick = konfirmasiTambah;
    document.getElementById('modal-keranjang').style.display = 'flex';
}

function tambahQtySementara() { produkSementara.jumlah += 1; bukaModalProduk(); }
function kurangQtySementara() { if (produkSementara.jumlah > 1) { produkSementara.jumlah -= 1; bukaModalProduk(); } }

function konfirmasiTambah() {
    let item = keranjang.find(p => p.id === produkSementara.id);
    if (item) { item.jumlah += produkSementara.jumlah; }
    else { keranjang.push(produkSementara); }
    produkSementara = null;
    tutupKeranjang();
    updateKeranjangIcon();
    alert('Produk ditambahkan ke keranjang!');
}

function updateKeranjangIcon() {
    let jumlahItem = keranjang.reduce((sum, item) => sum + item.jumlah, 0);
    document.getElementById('jumlah-keranjang').innerText = jumlahItem;
}

function bukaKeranjang() {
    if (keranjang.length === 0) { alert('Keranjang masih kosong!'); return; }
    document.getElementById('judul-modal').innerText = 'Keranjang Belanja';
    document.getElementById('total-harga').style.display = 'block';
    updateKeranjang();
    document.getElementById('isi-keranjang').innerHTML += `
        <h3 style="margin-top:20px; text-align:center;">Pilih Metode Pembayaran</h3>
        <div class="metode-bayar">
            <button onclick="bayar('DANA')">💙 Bayar DANA</button>
            <button onclick="bayar('GOPAY')">💚 Bayar GoPay</button>
            <button onclick="bayar('MANDIRI')">💛 Bayar Mandiri</button>
