import { apiRequest } from './api.js';
import { $, escapeHtml, formatDate, formatMoney, formatQuantity, showMessage, today } from './ui.js';

let products = [];
let inventoryCategories = [];

function renderCategoryTabs() {
  const selectedId = Number($('#category-filter').value);
  $('#inventory-category-tabs').innerHTML = inventoryCategories.map(category => `
    <button type="button" class="category-tab ${category.id === selectedId ? 'active' : ''}"
            data-inventory-category="${category.id}">
      ${escapeHtml(category.nombre)}
    </button>
  `).join('');
}

function renderCategorySummary(summary) {
  const selectedCategory = inventoryCategories.find(
    category => category.id === Number($('#category-filter').value)
  );
  const categorySummary = summary.find(item => Number(item.id) === selectedCategory?.id);
  $('#inventory-summary-category').textContent = selectedCategory?.nombre || 'Categoría';
  $('#inventory-summary-date').textContent = `Ventas del ${formatDate(today())}`;
  $('#inventory-summary-total').textContent = formatMoney(categorySummary?.total_vendido || 0);
  $('#inventory-summary-units').textContent = `${Number(categorySummary?.unidades_vendidas || 0).toLocaleString('es-CO', { maximumFractionDigits: 3 })} unidades base`;
}

export async function selectInventoryCategory(categoryId, load = true) {
  const category = inventoryCategories.find(item => item.id === Number(categoryId));
  if (!category) return;
  $('#category-filter').value = String(category.id);
  renderCategoryTabs();
  if (load) await loadInventory();
}

export async function selectLowStock(enabled, load = true) {
  $('#low-stock').checked = Boolean(enabled);
  if (load) await loadInventory();
}

function productPayload() {
  return {
    nombre: $('#product-name').value,
    tipo_corte: $('#product-cut').value,
    categoria_id: Number($('#product-category').value),
    unidad_medida: $('#product-unit').value,
    precio: Number($('#product-price').value),
    stock: Number($('#product-stock').value),
    activo: $('#product-active').checked
  };
}

function renderProducts() {
  $('#product-rows').innerHTML = products.map(product => `
    <tr>
      <td><strong>${escapeHtml(product.nombre)}</strong></td>
      <td>${escapeHtml(product.categoria)}</td>
      <td>${escapeHtml(product.tipo_corte || '—')}</td>
      <td>${formatMoney(product.precio)} / ${escapeHtml(product.unidad_medida)}</td>
      <td><span class="stock ${product.stock <= 10 ? 'low' : ''}">${formatQuantity(product.stock, product.unidad_medida)}</span></td>
      <td>${product.activo ? 'Activo' : 'Inactivo'}</td>
      <td class="actions">
        <button data-edit="${product.id}" class="link">Editar</button>
        <button data-delete="${product.id}" class="link danger">Eliminar</button>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="7" class="empty">No se encontraron productos.</td></tr>';
}

export async function loadInventory({ refreshSummary = true } = {}) {
  const query = new URLSearchParams({
    buscar: $('#search').value.trim(),
    categoria: $('#category-filter').value,
    stockBajo: $('#low-stock').checked
  });
  const requests = [apiRequest(`/productos?${query}`)];
  if (refreshSummary) requests.push(apiRequest(`/ventas/resumen-categorias?fecha=${today()}`));
  const [loadedProducts, summary] = await Promise.all(requests);
  products = loadedProducts;
  renderProducts();
  if (summary) renderCategorySummary(summary);
}

function openProductForm(product) {
  $('#product-form').reset();
  $('#form-title').textContent = product ? 'Editar producto' : 'Nuevo producto';
  $('#product-id').value = product?.id || '';
  $('#product-name').value = product?.nombre || '';
  $('#product-cut').value = product?.tipo_corte || '';
  $('#product-category').value = product?.categoria_id || '';
  $('#product-unit').value = product?.unidad_medida || 'kg';
  $('#product-price').value = product?.precio || '';
  $('#product-stock').value = product?.stock ?? '';
  $('#product-active').checked = product?.activo ?? true;
  $('#product-dialog').showModal();
}

export function initializeInventory(categories) {
  inventoryCategories = categories;
  const options = categories
    .map(category => `<option value="${category.id}">${escapeHtml(category.nombre)}</option>`)
    .join('');
  $('#category-filter').insertAdjacentHTML('beforeend', options);
  $('#product-category').innerHTML = `<option value="">Selecciona una categoría</option>${options}`;
  $('#category-filter').value = String(categories[0]?.id || '');
  renderCategoryTabs();

  $('#new-product').addEventListener('click', () => openProductForm());
  $('#close-dialog').addEventListener('click', () => $('#product-dialog').close());
  $('#search').addEventListener('input', () => loadInventory({ refreshSummary: false }));
  $('#category-filter').addEventListener('change', () => {
    renderCategoryTabs();
    loadInventory();
  });
  $('#inventory-category-tabs').addEventListener('click', event => {
    const categoryId = Number(event.target.dataset.inventoryCategory);
    if (categoryId) selectInventoryCategory(categoryId);
  });
  $('#low-stock').addEventListener('change', () => loadInventory({ refreshSummary: false }));

  $('#product-form').addEventListener('submit', async event => {
    event.preventDefault();
    const id = $('#product-id').value;

    try {
      await apiRequest(`/productos${id ? `/${id}` : ''}`, {
        method: id ? 'PUT' : 'POST',
        body: productPayload()
      });
      $('#product-dialog').close();
      showMessage(id ? 'Producto actualizado' : 'Producto creado');
      await loadInventory({ refreshSummary: false });
    } catch (error) {
      showMessage(error.message, true);
    }
  });

  $('#product-rows').addEventListener('click', async event => {
    const editId = Number(event.target.dataset.edit);
    const deleteId = Number(event.target.dataset.delete);

    if (editId) openProductForm(products.find(product => product.id === editId));
    if (!deleteId || !confirm('¿Deseas eliminar este producto?')) return;

    try {
      await apiRequest(`/productos/${deleteId}`, { method: 'DELETE' });
      showMessage('Producto eliminado');
      await loadInventory({ refreshSummary: false });
    } catch (error) {
      showMessage(error.message, true);
    }
  });
}
