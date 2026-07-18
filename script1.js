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
        </div>
    `;
    document.getElementById('btn-aksi').style.display = 'none';
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
            <div><b>${item.nama}</b><br>Rp ${item.harga.toLocaleString('id-ID')} x ${item.jumlah}</div>
            <div>
                <button class="qty-btn" onclick="kurangQty(${index})">-</button>
                <button class="qty-btn" onclick="tambahQty(${index})">+</button>
                <button class="qty-btn hapus" onclick="hapusItem(${index})">Hapus</button>
            </div>
        </div>`;
    });
    document.getElementById('total-harga').innerText = `Total: Rp ${total.toLocaleString('id-ID')}`;
}

function tambahQty(i){keranjang[i].jumlah++;bukaKeranjang();}
function kurangQty(i){keranjang[i].jumlah>1?keranjang[i].jumlah--:keranjang.splice(i,1);bukaKeranjang();}
function hapusItem(i){keranjang.splice(i,1);bukaKeranjang();}
function tutupKeranjang(){document.getElementById('modal-keranjang').style.display='none';}

function bayar(metode) {
    let total = keranjang.reduce((sum, item) => sum + item.harga * item.jumlah, 0);
    let infoPembayaran = "";

    if(metode === 'DANA'){
        infoPembayaran = `Transfer ke DANA: 08998628025 a/n Sabda Gusti Nang Wardoyo<br><img src="dana.jpg" style="width:200px; margin:auto; display:block;"><p>Scan QR DANA di atas</p>`;
    }
    if(metode === 'GOPAY'){
        infoPembayaran = `Transfer ke GoPay: 08998628025 a/n Sabda Gusti Nang Wardoyo<br><img src="gopay.jpg" style="width:200px; margin:auto; display:block;"><p>Scan QR GoPay di atas</p>`;
    }
    if(metode === 'MANDIRI'){
        infoPembayaran = `Transfer ke Mandiri: 1270011397252 a/n Sabda Gusti Nang Wardoyo`;
    }

    document.getElementById('judul-modal').innerText = `Bayar via ${metode}`;
    document.getElementById('isi-keranjang').innerHTML = `
        <div style="text-align:center;">
            <h2 style="color:#ff6b6b;">Rp ${total.toLocaleString('id-ID')}</h2>
            <p>${infoPembayaran}</p>
            <p style="font-size:14px; color:gray;">Setelah transfer, klik tombol di bawah untuk konfirmasi ke WA</p>
        </div>`;

    document.getElementById('btn-aksi').style.display = 'block';
    document.getElementById('btn-aksi').innerText = 'Konfirmasi via WhatsApp';
    document.getElementById('btn-aksi').onclick = () => kirimWA(metode, total); // LANGSUNG KE WA
    document.getElementById('total-harga').style.display = 'none';
}

function kirimWA(metode, total) {
    let pesan = `Halo Admin Sabda Cemilan 👋\n`;
    pesan += `Saya mau konfirmasi pembayaran ya 😊\n\n`;
    pesan += `Metode: ${metode}\n`;
    pesan += `Total Bayar: Rp ${total.toLocaleString('id-ID')}\n\n`;
    pesan += `Detail Pesanan:\n`;
    keranjang.forEach(item => { pesan += `- ${item.nama} x ${item.jumlah}\n`; });
    pesan += `\nTerima kasih 🙏`;

    let url = `https://wa.me/${noAdminWA}?text=${encodeURIComponent(pesan)}`;
    window.open(url, '_blank');

    keranjang = [];
    updateKeranjangIcon();
    tutupKeranjang();
}

window.onclick = function(event) {
    let modal = document.getElementById('modal-keranjang');
    if (event.target == modal) { modal.style.display = 'none'; }
}
