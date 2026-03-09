// ERROR BANNER
export function initErrorBanner() {
  document
    .getElementById("remove-error-banner")
    .addEventListener("click", clearError);
}

export function showError(message) {
  const banner = document.getElementById("error-banner");
  banner.querySelector("p").textContent = message;
  banner.style.display = "flex";
}

export function clearError() {
  const banner = document.getElementById("error-banner");
  banner.querySelector("p").textContent = "";
  banner.style.display = "none";
}
