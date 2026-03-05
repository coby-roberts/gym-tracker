export function initMovies() {

  const moviesContent = document.getElementById("movie-content");

  async function loadMoviePage(page) {
    const res = await fetch(page);
    moviesContent.innerHTML = await res.text();
  }

  document
    .querySelectorAll(".movies-menu button")
    .forEach(btn => {
      btn.addEventListener("click", () => {
        loadMoviePage(btn.dataset.subpage);
      });
    });

  loadMoviePage("./apps/Movies/pages/stats.html");
}
