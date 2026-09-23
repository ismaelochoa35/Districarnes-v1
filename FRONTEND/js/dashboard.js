import { apiRequest } from './api.js';
import { $, today } from './ui.js';

export async function loadDashboard(categories) {
  const date = today();
  const [products, sales] = await Promise.all([
    apiRequest('/productos'),
    apiRequest(`/ventas?fecha=${date}`)
  ]);

  $('#stat-products').textContent = products.length;
  $('#stat-categories').textContent = categories.length;
  $('#stat-low-stock').textContent = products.filter(product => product.stock <= 10).length;
  $('#stat-sales').textContent = sales.length;
}
