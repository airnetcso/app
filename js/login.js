const users = [
  { username: "andi", password: "1234" },
  { username: "budi", password: "5678" },
  { username: "siti", password: "1111" }
];

if (localStorage.getItem("login") === "true") {
  location.href = "index.html";
}

function login() {
  const u = username.value.trim();
  const p = password.value.trim();

  const user = users.find(x => x.username === u && x.password === p);
  if (!user) return alert("Username / password salah");

  localStorage.setItem("login", "true");
  localStorage.setItem("nama", u);
  location.href = "index.html";
}
