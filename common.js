// ---------- Auth storage ----------
const Auth = {
  getToken(){ return localStorage.getItem("token"); },
  getUser(){
    try { return JSON.parse(localStorage.getItem("user")); } catch(e){ return null; }
  },
  setSession(token, user){
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  },
  setUser(user){ localStorage.setItem("user", JSON.stringify(user)); },
  clear(){ localStorage.removeItem("token"); localStorage.removeItem("user"); },
  isLoggedIn(){ return !!this.getToken(); }
};

// Lempar ke halaman login kalau belum login
function requireAuth(){
  if(!Auth.isLoggedIn()){
    window.location.href = "index.html";
  }
}
function requireAdmin(){
  requireAuth();
  const u = Auth.getUser();
  if(!u || u.role !== "admin"){
    window.location.href = "dashboard.html";
  }
}

// ---------- API helper ----------
async function api(path, options = {}){
  const headers = Object.assign(
    { "Content-Type": "application/json" },
    options.headers || {}
  );
  const token = Auth.getToken();
  if(token) headers["Authorization"] = "Bearer " + token;

  const res = await fetch("/api" + path, Object.assign({}, options, { headers }));
  let data = {};
  try { data = await res.json(); } catch(e){ /* no body */ }

  if(res.status === 401){
    Auth.clear();
    window.location.href = "index.html";
    throw new Error("Sesi berakhir");
  }
  if(!res.ok){
    throw new Error(data.error || "Terjadi kesalahan.");
  }
  return data;
}

function formatRupiah(n){
  return "Rp" + Number(n || 0).toLocaleString("id-ID");
}

function formatTanggal(iso){
  const d = new Date(iso);
  return d.toLocaleString("id-ID", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" });
}

// ---------- Shared top navigation ----------
function renderNav(activePage){
  const user = Auth.getUser();
  if(!user) return;

  const links = [
    { href:"dashboard.html", label:"Dashboard", key:"dashboard" },
    { href:"order.html", label:"Beli AM Premium", key:"order" },
    { href:"topup.html", label:"Top Up", key:"topup" },
    { href:"riwayat-pesanan.html", label:"Riwayat Pesanan", key:"pesanan" },
    { href:"riwayat-deposit.html", label:"Riwayat Deposit", key:"deposit" }
  ];
  if(user.role === "admin"){
    links.push({ href:"admin.html", label:"Panel Admin", key:"admin" });
  }

  const nav = document.getElementById("app-nav");
  if(!nav) return;

  nav.innerHTML = `
    <div class="topbar">
      <div class="brand"><span class="dot"></span> AM Premium Store</div>
      <nav class="nav-links">
        ${links.map(l => `<a href="${l.href}" class="${l.key===activePage ? 'active':''}">${l.label}</a>`).join("")}
      </nav>
      <div class="user-chip">
        <span class="saldo-pill" id="nav-saldo">${formatRupiah(user.saldo)}</span>
        <span>${user.username}</span>
        <button class="btn-logout" onclick="doLogout()">Keluar</button>
      </div>
    </div>
  `;
}

function doLogout(){
  Auth.clear();
  window.location.href = "index.html";
}

// Sinkronkan saldo di pill nav (dipanggil setelah aksi yang mengubah saldo)
async function refreshSaldo(){
  try{
    const data = await api("/me");
    Auth.setUser(data.user);
    const pill = document.getElementById("nav-saldo");
    if(pill) pill.textContent = formatRupiah(data.user.saldo);
    return data;
  }catch(e){ /* diamkan */ }
}

// ---------- WhatsApp channel popup ----------
async function maybeShowWaPopup(){
  if(sessionStorage.getItem("wa-popup-shown")) return;
  try{
    const cfg = await api("/config");
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = `
      <div class="modal-box">
        <div class="icon">💬</div>
        <h3>Gabung Saluran WhatsApp</h3>
        <p>Pantau info stok, promo, dan status server lewat saluran WhatsApp resmi kami.</p>
        <a class="btn btn-primary btn-block" target="_blank" rel="noopener" href="${cfg.whatsappChannel}">Buka Saluran WhatsApp</a>
        <button class="btn btn-outline btn-block" style="margin-top:10px" id="wa-close">Nanti Saja</button>
      </div>
    `;
    document.body.appendChild(overlay);
    document.getElementById("wa-close").onclick = () => overlay.remove();
    overlay.addEventListener("click", (e) => { if(e.target === overlay) overlay.remove(); });
    sessionStorage.setItem("wa-popup-shown", "1");
  }catch(e){ /* diamkan */ }
}
