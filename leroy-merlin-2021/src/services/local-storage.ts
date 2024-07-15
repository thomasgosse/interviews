export function setItem(key: string, item: any): void {
  const value = JSON.stringify(item);
  localStorage.setItem(key, value);
}

export function getItem<T>(key: string): T | null {
  const value = localStorage.getItem(key);
  if (!value) {
    return null;
  }
  const item = JSON.parse(value) as T;
  return item;
}

export function storeAll(items: any[], keys: string[]): void {
  keys.forEach((key, i) => {
    setItem(key, items[i]);
  });
}

export function deleteAll(): void {
  Object.keys(localStorage).forEach(key => localStorage.removeItem(key));
  document.location.reload();
}
