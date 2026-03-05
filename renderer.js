const content = document.getElementById("content");

async function loadPage(page, app) {

  const res = await fetch(page);
  content.innerHTML = await res.text();

  if (app === "gym") {

    const { initGymUI } = await import("./apps/Gym/gym.ui.js");
    initGymUI();

  } else if (app === "movies") {
    const movies = await import("./apps/Movies/movies.js");
    movies.initMovies();

  } else if (app === "music") {
    const music = await import("./apps/Music/music.js");
    music.initMusic();
  }
}

document.querySelectorAll(".main-nav button").forEach(btn => {
  btn.addEventListener("click", () => {
    loadPage(btn.dataset.page, btn.dataset.app);
  });
});

loadPage("apps/Home/home.html", "home");
