requireAdmin();
renderNav("admin");

const statusLabel = { pending: "Menunggu", approved: "Berhasil", rejected: "Ditolak" };

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, (c) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
}

async function loadSummary(){
  const s = await api("/admin/summary");
  document.getElementById("s-users").textContent = s.totalUser;
  document.getElementById("s-orders").textContent = s.totalPesanan;
  document.getElementById("s-omzet").textContent = formatRupiah(s.totalOmzet);
  document.getElementById("s-pending").textContent = s.depositPending;
  document.getElementById("s-stock").textContent = s.sisaStok;
}

async function loadDeposits(){
  const { deposits } = await api("/admin/deposits");
  const tbody = document.getElementById("deposits-body");
  if(deposits.length === 0){
    tbody.innerHTML = `<tr class="empty-row"><td colspan="6">Belum ada deposit.</td></tr>`;
    return;
  }
  // pending duluan
  deposits.sort((a,b) => (a.status === "pending" ? -1 : 1) - (b.status === "pending" ? -1 : 1));

  tbody.innerHTML = deposits.map(d => `
    <tr>
      <td>${formatTanggal(d.createdAt)}</td>
      <td>${escapeHtml(d.username)}</td>
      <td>${formatRupiah(d.nominal)}</td>
      <td>${escapeHtml(d.namaPengirim)}</td>
      <td><span class="badge badge-${d.status}">${statusLabel[d.status]}</span></td>
      <td>
        ${d.status === "pending" ? `
          <button class="btn btn-success btn-sm" onclick="approveDeposit('${d.id}')">Konfirmasi</button>
          <button class="btn btn-danger btn-sm" onclick="rejectDeposit('${d.id}')">Tolak</button>
        ` : ""}
      </td>
    </tr>
  `).join("");
}

async function approveDeposit(id){
  if(!confirm("Konfirmasi deposit ini? Saldo user akan otomatis ditambah.")) return;
  try{
    await api(`/admin/deposits/${id}/approve`, { method:"POST" });
    await Promise.all([loadDeposits(), loadSummary(), loadUsers()]);
  }catch(e){ alert(e.message); }
}
async function rejectDeposit(id){
  if(!confirm("Tolak deposit ini?")) return;
  try{
    await api(`/admin/deposits/${id}/reject`, { method:"POST" });
    await Promise.all([loadDeposits(), loadSummary()]);
  }catch(e){ alert(e.message); }
}

async function loadUsers(){
  const { users } = await api("/admin/users");
  const tbody = document.getElementById("users-body");
  if(users.length === 0){
    tbody.innerHTML = `<tr class="empty-row"><td colspan="3">Belum ada user.</td></tr>`;
    return;
  }
  tbody.innerHTML = users.map(u => `
    <tr>
      <td>${escapeHtml(u.username)}</td>
      <td>${formatRupiah(u.saldo)}</td>
      <td>${formatTanggal(u.createdAt)}</td>
    </tr>
  `).join("");
}

async function loadOrders(){
  const { orders } = await api("/admin/orders");
  const tbody = document.getElementById("orders-body");
  if(orders.length === 0){
    tbody.innerHTML = `<tr class="empty-row"><td colspan="4">Belum ada pesanan.</td></tr>`;
    return;
  }
  tbody.innerHTML = orders.map(o => `
    <tr>
      <td>${formatTanggal(o.createdAt)}</td>
      <td>${escapeHtml(o.username)}</td>
      <td>${o.jumlah} unit</td>
      <td>${formatRupiah(o.totalHarga)}</td>
    </tr>
  `).join("");
}

async function loadStock(){
  const { stock } = await api("/admin/stock");
  const tbody = document.getElementById("stock-body");
  if(stock.length === 0){
    tbody.innerHTML = `<tr class="empty-row"><td colspan="3">Stok kosong.</td></tr>`;
    return;
  }
  tbody.innerHTML = stock.map((item, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td>${escapeHtml(item)}</td>
      <td><button class="btn btn-danger btn-sm" onclick="removeStock(${idx})">Hapus</button></td>
    </tr>
  `).join("");
}

function showStockMsg(text, type){
  document.getElementById("stock-msg").innerHTML = `<div class="msg msg-${type}">${text}</div>`;
}

document.getElementById("btn-add-stock").addEventListener("click", async () => {
  const text = document.getElementById("stock-text").value;
  if(!text.trim()){
    showStockMsg("Isi dulu minimal satu item.", "error");
    return;
  }
  try{
    const res = await api("/admin/stock/add", { method:"POST", body: JSON.stringify({ text }) });
    showStockMsg(`${res.ditambahkan} item berhasil ditambahkan ke stok.`, "success");
    document.getElementById("stock-text").value = "";
    await Promise.all([loadStock(), loadSummary()]);
  }catch(e){
    showStockMsg(e.message, "error");
  }
});

async function removeStock(idx){
  if(!confirm("Hapus item stok ini?")) return;
  try{
    await api(`/admin/stock/${idx}`, { method:"DELETE" });
    await Promise.all([loadStock(), loadSummary()]);
  }catch(e){ alert(e.message); }
}

(async function init(){
  await Promise.all([loadSummary(), loadDeposits(), loadUsers(), loadOrders(), loadStock()]);
})();
