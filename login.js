if(Auth.isLoggedIn()){
  window.location.href = "dashboard.html";
}

function switchTab(tab){
  document.getElementById("tab-login").classList.toggle("active", tab === "login");
  document.getElementById("tab-register").classList.toggle("active", tab === "register");
  document.getElementById("login-form").style.display = tab === "login" ? "block" : "none";
  document.getElementById("register-form").style.display = tab === "register" ? "block" : "none";
  document.getElementById("msg-box").innerHTML = "";
}

function showMsg(text, type){
  document.getElementById("msg-box").innerHTML = `<div class="msg msg-${type}">${text}</div>`;
}

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;
  try{
    const data = await api("/auth/login", { method:"POST", body: JSON.stringify({ username, password }) });
    Auth.setSession(data.token, data.user);
    window.location.href = "dashboard.html";
  }catch(err){
    showMsg(err.message, "error");
  }
});

document.getElementById("register-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("reg-username").value.trim();
  const password = document.getElementById("reg-password").value;
  try{
    const data = await api("/auth/register", { method:"POST", body: JSON.stringify({ username, password }) });
    Auth.setSession(data.token, data.user);
    window.location.href = "dashboard.html";
  }catch(err){
    showMsg(err.message, "error");
  }
});
