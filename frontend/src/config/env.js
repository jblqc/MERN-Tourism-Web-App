const trimTrailingSlash = (value = "") => value.replace(/\/+$/, "");

const apiUrl = trimTrailingSlash(import.meta.env.VITE_API_URL || "/api/v1");
const backendUrl = trimTrailingSlash(
  import.meta.env.VITE_BACKEND_URL || apiUrl.replace(/\/api\/v1$/i, "")
);

export const appConfig = {
  apiUrl,
  backendUrl,
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
  mapboxToken: import.meta.env.VITE_MAPBOX_TOKEN || "",
};

export const buildAssetUrl = (path = "") => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${backendUrl}${normalizedPath}`;
};
