export function getStored(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function saveStored(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}