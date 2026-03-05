export function initMusic() {

  const musicContent = document.getElementById("music-content");

  async function loadMusicPage(page) {
    const res = await fetch(page);
    musicContent.innerHTML = await res.text();
  }

  document
    .querySelectorAll(".music-menu button")
    .forEach(btn => {
    btn.addEventListener("click", () => {
      loadMusicPage(btn.dataset.subpage);
    });
  });

  loadMusicPage("./apps/Music/pages/stats.html");
}
