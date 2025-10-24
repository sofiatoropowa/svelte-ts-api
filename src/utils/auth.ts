export function isTokenValid(): boolean {
  const token = localStorage.getItem("authToken");
  const expiresAtStr = localStorage.getItem("authExpiresAt");

  if (!token || !expiresAtStr) return false;

  const expiresAt = Number(expiresAtStr);
  return Date.now() < expiresAt;
}

export function clearAuth() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("authExpiresAt");
}
