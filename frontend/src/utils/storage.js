const KEY = 'inkwire_resources';

export function getResourcesFromSession() {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveResourcesToSession(resources) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(resources));
  } catch (e) {
    // ignore
  }
}