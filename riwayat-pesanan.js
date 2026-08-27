requireAuth();
renderNav("pesanan");

(async function(){
  const tbody = document.getElementById("orders-body");
  try{
    const { orders } = await api("/orders");
    if(orders.length === 0){
      tbody.innerHTML = `<tr class="empty-row"><td colspan="4">Belum ada pesanan.</td></tr>`;
      return;
    }
    tbody.innerHTML = orders.map(o => `
      <tr>
        <td>${formatTanggal(o.createdAt)}</td>
        <td>${o.jumlah} unit</td>
        <td>${formatRupiah(o.totalHarga)}</td>
        <td><span class="badge badge-selesai">Terkirim</span><br>
          <span class="hint">${o.items.map(i => escapeHtml(i)).join(", ")}</span>
        </td>
      </tr>
    `).join("");
  }catch(e){
    tbody.innerHTML = `<tr class="empty-row"><td colspan="4">Gagal memuat data.</td></tr>`;
  }
})();

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, (c) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
}
