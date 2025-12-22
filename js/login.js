const users = [
  { username: "andi", password: "1234" },
  { username: "budi", password: "5678" },
  { username: "siti", password: "1111" }
];

// kalau sudah login, langsung ke soal
if (localStorage.getItem("login") === "true") {
  location.href = "index.html";
}

function login() {
  const u = document.getElementById("username").value.trim();
  const p = document.getElementById("password").value.trim();

  if (!u || !p) {
    alert("Username dan password wajib diisi");
    return;
  }

  const user = users.find(x => x.username === u && x.password === p);
  if (!user) {
    alert("Username atau password salah");
    return;
  }

  localStorage.setItem("login", "true");
  localStorage.setItem("nama", u);
  location.href = "index.html";
}
