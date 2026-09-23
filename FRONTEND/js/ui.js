export const $ = selector => document.querySelector(selector);

export const formatMoney = value => new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0
}).format(Number(value));

export const formatDateTime = value => new Date(value).toLocaleString('es-CO');
export const formatDate = value => {
  const normalizedValue = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value;
  return new Date(normalizedValue).toLocaleDateString('es-CO');
};

export function today() {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
}

export const formatQuantity = (value, unit) => {
  const amount = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 3 }).format(Number(value));
  return `${amount} ${unit === 'unidad' ? 'und.' : unit}`;
};

export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

let messageTimer;

export function showMessage(text, isError = false) {
  const message = $('#message');
  clearTimeout(messageTimer);
  message.textContent = text;
  message.className = `message ${isError ? 'error' : 'success'}`;
  messageTimer = setTimeout(() => {
    message.textContent = '';
    message.className = 'message';
  }, 3500);
}
