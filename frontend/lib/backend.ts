export function getBackendUrl(): string {
  if (typeof window === "undefined") return "http://localhost:8000";

  const host = window.location.hostname;
  // GitHub Codespaces: xxx-3000.preview.app.github.dev → xxx-8000.preview.app.github.dev
  if (host.includes(".preview.app.github.dev")) {
    return `https://${host.replace(/-\d+\.preview\.app\.github\.dev$/, "-8000.preview.app.github.dev")}`;
  }
  return "http://localhost:8000";
}
