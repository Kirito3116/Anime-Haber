// script.js

let newsList = [
  {
    title: "Attack on Titan Finali Geliyor",
    content: "Final bölümü Kasım 2025'te yayınlanacak.",
    category: "Aksiyon",
    image: "https://upload.wikimedia.org/wikipedia/en/7/79/Attack_on_Titan_S4_Part_3_Poster.png"
  },
  {
    title: "Romantik Yeni Seri: Kalp Atışı",
    content: "2025 ilkbaharında yayınlanacak olan romantik dizi heyecanla bekleniyor.",
    category: "Romantik",
    image: "https://cdn.wallpapersafari.com/87/33/OCaMoL.jpg"
  }
];

let savedNews = JSON.parse(localStorage.getItem("savedNews")) || [];
let requests = JSON.parse(localStorage.getItem("requests")) || [];
let currentUser = localStorage.getItem("username") || null;
let isAdmin = false;

document.addEventListener("DOMContentLoaded", () => {
  renderNews();

  document.getElementById("searchInput").addEventListener("input", renderNews);
  document.getElementById("categoryFilter").addEventListener("change", renderNews);
  document.getElementById("darkToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });

  document.addEventListener("click", e => {
    const menu = document.getElementById("sideMenu");
    const hamburger = document.querySelector(".hamburger");
    if (!menu.contains(e.target) && !hamburger.contains(e.target)) {
      menu.classList.remove("show");
    }
  });
});

function renderNews() {
  const list = document.getElementById("newsList");
  if (!list) return;

  const search = document.getElementById("searchInput").value.toLowerCase();
  const filter = document.getElementById("categoryFilter").value;
  list.innerHTML = "";

  newsList.forEach((news, index) => {
    const matchSearch = news.title.toLowerCase().includes(search);
    const matchCategory = filter === "Tümü" || news.category === filter;
    if (matchSearch && matchCategory) {
      const card = document.createElement("div");
      card.className = "news-card";
      card.innerHTML = `
        <img src="${news.image}" alt="">
        <h3>${news.title}</h3>
        <p>${news.content}</p>
        <p><b>Kategori:</b> ${news.category}</p>
        ${isAdmin ? `<button onclick="deleteNews(${index})">Sil</button>` : ``}
        ${currentUser && !isAdmin ? `<button onclick="saveNews(${index})">Kaydet</button>` : ``}
      `;
      list.appendChild(card);
    }
  });
}

function deleteNews(index) {
  if (!isAdmin) return;
  newsList.splice(index, 1);
  renderNews();
}

function addNews() {
  const title = document.getElementById("newsTitle").value;
  const content = document.getElementById("newsContent").value;
  const image = document.getElementById("newsImage").value;
  const category = document.getElementById("newsCategory").value;

  if (title && content && image) {
    newsList.unshift({ title, content, category, image });
    renderNews();
  }
}

function checkAdminLogin() {
  const user = document.getElementById("adminUser").value;
  const pass = document.getElementById("adminPass").value;

  if (user === "Kirito" && pass === "SAO3116") {
    isAdmin = true;
    document.getElementById("adminLogin").classList.add("hidden");
    document.getElementById("adminPanel").classList.remove("hidden");
    renderRequests();
    renderNews();
  } else {
    alert("Hatalı bilgi!");
  }
}

function loginUser() {
  const user = document.getElementById("username").value;
  if (user) {
    currentUser = user;
    localStorage.setItem("username", user);
    alert("Giriş yapıldı: " + user);
    document.getElementById("userLogin").classList.add("hidden");
  }
}

function saveNews(index) {
  const news = newsList[index];
  savedNews.push({ ...news, savedBy: currentUser });
  localStorage.setItem("savedNews", JSON.stringify(savedNews));
  alert("Haber kaydedildi!");
}

function showSaved() {
  window.location.href = "kaydettiklerim.html";
}

function sendRequest() {
  const title = document.getElementById("reqTitle").value;
  const content = document.getElementById("reqContent").value;
  if (title && content) {
    requests.push({ title, content });
    localStorage.setItem("requests", JSON.stringify(requests));
    alert("İstek gönderildi!");
    document.getElementById("reqTitle").value = "";
    document.getElementById("reqContent").value = "";
  }
}

function renderRequests() {
  const list = document.getElementById("requestList");
  list.innerHTML = "";
  requests.forEach(req => {
    const li = document.createElement("li");
    li.textContent = req.title + ": " + req.content;
    list.appendChild(li);
  });
}

function toggleMenu() {
  document.getElementById("sideMenu").classList.toggle("show");
}

function showAdminLogin() {
  hideAll();
  document.getElementById("adminLogin").classList.remove("hidden");
}

function showUserLogin() {
  hideAll();
  document.getElementById("userLogin").classList.remove("hidden");
}

function showRequestForm() {
  hideAll();
  if (currentUser && !isAdmin) {
    document.getElementById("requestForm").classList.remove("hidden");
  } else {
    alert("Lütfen giriş yapınız.");
  }
}

function showAbout() {
  alert("Anime haberlerini güncel ve doğru şekilde sizlerle buluşturuyoruz! Güncel sezonlar, yeni çıkacak animeler ve daha fazlası burada.");
}

function hideAll() {
  document.querySelectorAll(".admin").forEach(el => el.classList.add("hidden"));
}
