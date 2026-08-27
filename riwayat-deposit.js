requireAuth();
renderNav("deposit");

const statusLabel = { pending: "Menunggu", approved: "Berhasil", rejected: "Ditolak" };

(async function(){
  const tbody = document.getElementById("deposits-body");
  try{
    const { deposits } = await api("/deposits");
    if(deposits.length === 0){
      tbody.innerHTML = `<tr class="empty-row"><td colspan="4">Belum ada riwayat top up.</td></tr>`;
      return;
    }
    tbody.innerHTML = deposits.map(d => `
      <tr>
        <td>${formatTanggal(d.createdAt)}</td>
        <td>${formatRupiah(d.nominal)}</td>
        <td>${d.namaPengirim}</td>
        <td><span class="badge badge-${d.status}">${statusLabel[d.status]}</span></td>
      </tr>
    `).join("");
  }catch(e){
    tbody.innerHTML = `<tr class="empty-row"><td colspan="4">Gagal memuat data.</td></tr>`;
  }
})();
