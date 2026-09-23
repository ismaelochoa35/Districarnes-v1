import { apiRequest } from './api.js';
import { $, escapeHtml, formatDate, formatDateTime, formatMoney, formatQuantity, showMessage, today } from './ui.js';

const PAGE_SIZE = 24;
const KG_PER_LB = 0.45359237;
let catalogProducts = [];
let cart = [];
let currentPage = 1;
let dailyReport = null;

function categoryImage(category) {
  const fileName = category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return `/images/${fileName}.png`;
}

function visibleProducts() {
  const search = $('#sale-search').value.trim().toLocaleLowerCase('es');
  const categoryId = Number($('#sale-category-filter').value) || null;

  return catalogProducts.filter(product => {
    const searchable = `${product.nombre} ${product.tipo_corte || ''} ${product.categoria}`.toLocaleLowerCase('es');
    return product.activo
      && product.stock > 0
      && (!search || searchable.includes(search))
      && (!categoryId || product.categoria_id === categoryId);
  });
}

function renderCatalog() {
  const products = visibleProducts();
  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  currentPage = Math.min(currentPage, totalPages);

  const start = (currentPage - 1) * PAGE_SIZE;
  const pageProducts = products.slice(start, start + PAGE_SIZE);
  const firstResult = products.length ? start + 1 : 0;
  const lastResult = Math.min(start + PAGE_SIZE, products.length);

  $('#sale-result-count').textContent = `${firstResult}-${lastResult} de ${products.length} productos`;
  $('#sale-page-label').textContent = `Página ${currentPage} de ${totalPages}`;
  $('#sale-previous-page').disabled = currentPage === 1;
  $('#sale-next-page').disabled = currentPage === totalPages;
  $('#catalog').innerHTML = pageProducts.map(product => `
    <article class="product-card">
      <img src="${escapeHtml(product.imagen_url || categoryImage(product.categoria))}" alt="${escapeHtml(product.nombre)}">
      <div>
        <small>${escapeHtml(product.categoria)}</small>
        <h3>${escapeHtml(product.nombre)}</h3>
        <p>${formatMoney(product.precio)} / ${escapeHtml(product.unidad_medida)} · Stock ${formatQuantity(product.stock, product.unidad_medida)}</p>
        <button data-add-product="${product.id}">Agregar</button>
      </div>
    </article>
  `).join('') || '<p class="card empty">No hay productos que coincidan con la búsqueda.</p>';
}

function quantityInBase(item) {
  const quantity = Number(item.cantidad);
  if (item.unidad_medida === 'unidad') {
    return item.unidad_venta === 'unidad' && Number.isInteger(quantity) ? quantity : NaN;
  }
  const kilograms = item.unidad_venta === 'g'
    ? quantity / 1000
    : item.unidad_venta === 'lb'
      ? quantity * KG_PER_LB
      : quantity;
  return item.unidad_medida === 'lb' ? kilograms / KG_PER_LB : kilograms;
}

function cartTotal() {
  return cart.reduce((total, item) => {
    const quantity = quantityInBase(item);
    return total + (Number.isFinite(quantity) ? Number(item.precio) * quantity : 0);
  }, 0);
}

function cartIsValid() {
  return cart.length > 0 && cart.every(item => {
    const quantity = quantityInBase(item);
    return Number.isFinite(quantity) && quantity > 0 && quantity <= Number(item.stock);
  });
}

function convertDisplayedQuantity(quantity, fromUnit, toUnit) {
  if (fromUnit === toUnit) return quantity;
  const kilograms = fromUnit === 'g'
    ? quantity / 1000
    : fromUnit === 'lb'
      ? quantity * KG_PER_LB
      : quantity;
  if (toUnit === 'g') return Math.round(kilograms * 1000);
  if (toUnit === 'lb') return Number((kilograms / KG_PER_LB).toFixed(3));
  return Number(kilograms.toFixed(3));
}

function saleUnitOptions(item) {
  if (item.unidad_medida === 'unidad') {
    return '<option value="unidad">Unidad</option>';
  }
  return [
    ['g', 'Gramos'],
    ['kg', 'Kilogramos'],
    ['lb', 'Libras']
  ].map(([value, label]) => `<option value="${value}" ${item.unidad_venta === value ? 'selected' : ''}>${label}</option>`).join('');
}

function updatePayment() {
  const isCash = $('#payment-method').value === 'efectivo';
  const received = isCash ? Number($('#amount-received').value) || 0 : cartTotal();
  $('#cash-payment-fields').classList.toggle('hidden', !isCash);
  $('#sale-change').textContent = formatMoney(Math.max(0, received - cartTotal()));
}

function renderCart() {
  $('#cart-items').innerHTML = cart.map(item => `
    <div class="cart-item">
      <div>
        <strong>${escapeHtml(item.nombre)}</strong>
        <small>${formatMoney(item.precio)} por ${escapeHtml(item.unidad_medida)} · disponible ${formatQuantity(item.stock, item.unidad_medida)}</small>
      </div>
      <div class="weight-controls">
        <input data-cart-quantity="${item.id}" type="number" min="${item.unidad_medida === 'unidad' ? '1' : '0.001'}"
               step="${item.unidad_venta === 'g' ? '50' : item.unidad_medida === 'unidad' ? '1' : '0.001'}" value="${item.cantidad}"
               aria-label="Cantidad de ${escapeHtml(item.nombre)}">
        <select data-cart-unit="${item.id}" aria-label="Unidad para ${escapeHtml(item.nombre)}">${saleUnitOptions(item)}</select>
        <button data-remove-product="${item.id}" class="link danger" aria-label="Quitar ${escapeHtml(item.nombre)}">Quitar</button>
      </div>
      ${quantityInBase(item) > Number(item.stock) ? '<small class="cart-warning">La cantidad supera la existencia disponible.</small>' : ''}
    </div>
  `).join('') || '<p class="empty">Agrega productos del catálogo.</p>';

  $('#cart-total').textContent = formatMoney(cartTotal());
  $('#save-sale').disabled = !cartIsValid();
  updatePayment();
}

export async function loadSaleCatalog() {
  catalogProducts = await apiRequest('/productos');
  currentPage = 1;
  renderCatalog();
}

export async function loadSalesHistory() {
  const date = $('#history-date-filter').value || today();
  const categoryId = $('#history-category-filter').value;
  $('#history-date-filter').value = date;
  const query = new URLSearchParams({ fecha: date, categoria: categoryId });
  const [sales, dailySummary] = await Promise.all([
    apiRequest(`/ventas?${query}`),
    apiRequest(`/ventas/resumen-categorias?fecha=${date}`)
  ]);
  const selectedSummary = categoryId
    ? dailySummary.find(item => Number(item.id) === Number(categoryId))
    : {
        total_vendido: dailySummary.reduce((total, item) => total + Number(item.total_vendido), 0),
        unidades_vendidas: dailySummary.reduce((total, item) => total + Number(item.unidades_vendidas), 0)
      };
  const categoryName = $('#history-category-filter').selectedOptions[0].textContent;
  dailyReport = {
    date,
    categoryName,
    sales,
    total: Number(selectedSummary?.total_vendido || 0),
    units: Number(selectedSummary?.unidades_vendidas || 0)
  };
  $('#history-category-total').textContent = formatMoney(selectedSummary?.total_vendido || 0);
  $('#history-category-units').textContent = `${Number(selectedSummary?.unidades_vendidas || 0).toLocaleString('es-CO', { maximumFractionDigits: 3 })} en unidades base`;
  $('#history-sale-count').textContent = `${sales.length} ${sales.length === 1 ? 'venta' : 'ventas'}`;
  $('#history-total-column').textContent = categoryId ? 'Subtotal categoría' : 'Total';
  $('#sale-rows').innerHTML = sales.map(sale => `
    <tr>
      <td>#${sale.id}</td>
      <td>${formatDateTime(sale.fecha)}</td>
      <td>${escapeHtml(sale.cliente)}</td>
      <td>${escapeHtml(sale.metodo_pago)}</td>
      <td>${sale.items}</td>
      <td>${formatMoney(sale.total_filtrado)}</td>
      <td>${escapeHtml(sale.estado)}</td>
      <td><button data-receipt="${sale.id}" class="link">Ver recibo</button></td>
    </tr>
  `).join('') || '<tr><td colspan="8" class="empty">Todavía no hay ventas.</td></tr>';
}

function openDailyReport() {
  if (!dailyReport) return;
  $('#daily-report-content').innerHTML = `
    <header class="daily-report-head">
      <div class="logo small">D</div>
      <div><h2>Districarnes</h2><p>Resumen diario de ventas</p></div>
    </header>
    <dl class="daily-report-meta">
      <div><dt>Fecha consultada</dt><dd>${formatDate(dailyReport.date)}</dd></div>
      <div><dt>Categoría</dt><dd>${escapeHtml(dailyReport.categoryName)}</dd></div>
      <div><dt>Ventas encontradas</dt><dd>${dailyReport.sales.length}</dd></div>
      <div><dt>Cantidad vendida</dt><dd>${dailyReport.units.toLocaleString('es-CO', { maximumFractionDigits: 3 })} unidades base</dd></div>
    </dl>
    <table>
      <thead><tr><th>Venta</th><th>Hora</th><th>Cliente</th><th>Pago</th><th>Total</th></tr></thead>
      <tbody>${dailyReport.sales.map(sale => `
        <tr>
          <td>#${sale.id}</td>
          <td>${formatDateTime(sale.fecha)}</td>
          <td>${escapeHtml(sale.cliente)}</td>
          <td>${escapeHtml(sale.metodo_pago)}</td>
          <td>${formatMoney(sale.total_filtrado)}</td>
        </tr>
      `).join('') || '<tr><td colspan="5" class="empty">No hubo ventas para este filtro.</td></tr>'}</tbody>
    </table>
    <p class="daily-report-total"><span>Total del día</span><strong>${formatMoney(dailyReport.total)}</strong></p>
  `;
  $('#daily-report-dialog').showModal();
}

async function showReceipt(id) {
  const sale = await apiRequest(`/ventas/${id}`);
  const receiptCategories = [...new Map(
    sale.items.map(item => [Number(item.categoria_id), item.categoria])
  ).entries()];

  $('#receipt-content').innerHTML = `
    <div class="receipt-head">
      <div class="logo small">D</div>
      <h2>Districarnes</h2>
      <p>Comprobante de venta #${sale.id}</p>
    </div>
    <dl>
      <div><dt>Fecha</dt><dd>${formatDateTime(sale.fecha)}</dd></div>
      <div><dt>Cliente</dt><dd>${escapeHtml(sale.cliente)}</dd></div>
      <div><dt>Atendido por</dt><dd>${escapeHtml(sale.atendido_por || '—')}</dd></div>
      <div><dt>Pago</dt><dd>${escapeHtml(sale.metodo_pago)}</dd></div>
    </dl>
    <label class="receipt-filter">Filtrar detalle por categoría
      <select id="receipt-category-filter">
        <option value="">Todas las categorías</option>
        ${receiptCategories.map(([categoryId, category]) => `<option value="${categoryId}">${escapeHtml(category)}</option>`).join('')}
      </select>
    </label>
    <table>
      <thead><tr><th>Producto</th><th>Categoría</th><th>Cant.</th><th>Subtotal</th></tr></thead>
      <tbody id="receipt-item-rows"></tbody>
    </table>
    <p class="receipt-filter-total"><span>Subtotal visible</span><strong id="receipt-visible-total">${formatMoney(sale.total)}</strong></p>
    <div class="receipt-totals">
      <p><span>Total</span><strong>${formatMoney(sale.total)}</strong></p>
      <p><span>Recibido</span><strong>${formatMoney(sale.monto_recibido)}</strong></p>
      <p><span>Cambio</span><strong>${formatMoney(sale.cambio)}</strong></p>
    </div>
    <p class="receipt-thanks">Gracias por su compra</p>
  `;

  function renderReceiptItems() {
    const categoryId = Number($('#receipt-category-filter').value) || null;
    const visibleItems = sale.items.filter(item => !categoryId || Number(item.categoria_id) === categoryId);
    $('#receipt-item-rows').innerHTML = visibleItems.map(item => `
      <tr>
        <td>${escapeHtml(item.nombre)}</td>
        <td>${escapeHtml(item.categoria)}</td>
        <td>${formatQuantity(item.cantidad, item.unidad_medida)}</td>
        <td>${formatMoney(item.subtotal)}</td>
      </tr>
    `).join('') || '<tr><td colspan="4" class="empty">No hay productos de esta categoría.</td></tr>';
    const visibleTotal = visibleItems.reduce((total, item) => total + Number(item.subtotal), 0);
    $('#receipt-visible-total').textContent = formatMoney(visibleTotal);
  }

  $('#receipt-category-filter').addEventListener('change', renderReceiptItems);
  renderReceiptItems();
  $('#receipt-dialog').showModal();
}

export function initializeSales(categories) {
  const options = categories
    .map(category => `<option value="${category.id}">${escapeHtml(category.nombre)}</option>`)
    .join('');
  $('#sale-category-filter').insertAdjacentHTML('beforeend', options);
  $('#history-category-filter').insertAdjacentHTML('beforeend', options);
  $('#history-date-filter').value = today();

  $('#sale-search').addEventListener('input', () => {
    currentPage = 1;
    renderCatalog();
  });
  $('#sale-category-filter').addEventListener('change', () => {
    currentPage = 1;
    renderCatalog();
  });
  $('#sale-previous-page').addEventListener('click', () => {
    if (currentPage > 1) currentPage--;
    renderCatalog();
  });
  $('#sale-next-page').addEventListener('click', () => {
    currentPage++;
    renderCatalog();
  });

  $('#catalog').addEventListener('click', event => {
    const productId = Number(event.target.dataset.addProduct);
    if (!productId) return;

    const product = catalogProducts.find(item => item.id === productId);
    const cartItem = cart.find(item => item.id === productId);
    if (!cartItem) {
      cart.push({
        ...product,
        cantidad: product.unidad_medida === 'unidad' ? 1 : 400,
        unidad_venta: product.unidad_medida === 'unidad' ? 'unidad' : 'g'
      });
    }
    renderCart();
  });

  $('#cart-items').addEventListener('input', event => {
    const productId = Number(event.target.dataset.cartQuantity);
    const cartItem = cart.find(item => item.id === productId);
    if (!cartItem) return;
    cartItem.cantidad = Number(event.target.value);
    $('#cart-total').textContent = formatMoney(cartTotal());
    $('#save-sale').disabled = !cartIsValid();
    updatePayment();
  });
  $('#cart-items').addEventListener('change', event => {
    const productId = Number(event.target.dataset.cartUnit);
    const cartItem = cart.find(item => item.id === productId);
    if (!cartItem) return;
    cartItem.cantidad = convertDisplayedQuantity(
      Number(cartItem.cantidad),
      cartItem.unidad_venta,
      event.target.value
    );
    cartItem.unidad_venta = event.target.value;
    renderCart();
  });
  $('#cart-items').addEventListener('click', event => {
    const productId = Number(event.target.dataset.removeProduct);
    if (!productId) return;
    cart = cart.filter(item => item.id !== productId);
    renderCart();
  });

  $('#payment-method').addEventListener('change', updatePayment);
  $('#amount-received').addEventListener('input', updatePayment);
  $('#history-date-filter').addEventListener('change', loadSalesHistory);
  $('#history-category-filter').addEventListener('change', loadSalesHistory);
  $('#open-daily-report').addEventListener('click', openDailyReport);
  $('#close-daily-report').addEventListener('click', () => $('#daily-report-dialog').close());
  $('#print-daily-report').addEventListener('click', () => window.print());

  $('#save-sale').addEventListener('click', async () => {
    const paymentMethod = $('#payment-method').value;

    try {
      const sale = await apiRequest('/ventas', {
        method: 'POST',
        body: {
          items: cart.map(item => ({
            producto_id: item.id,
            cantidad: item.cantidad,
            unidad_venta: item.unidad_venta
          })),
          cliente_nombre: $('#sale-customer').value.trim() || 'Consumidor final',
          metodo_pago: paymentMethod,
          monto_recibido: paymentMethod === 'efectivo'
            ? Number($('#amount-received').value)
            : cartTotal()
        }
      });

      cart = [];
      $('#sale-customer').value = '';
      $('#amount-received').value = '';
      renderCart();
      showMessage(`Venta #${sale.id} registrada por ${formatMoney(sale.total)}`);
      await loadSaleCatalog();
      await showReceipt(sale.id);
    } catch (error) {
      showMessage(error.message, true);
    }
  });

  $('#sale-rows').addEventListener('click', async event => {
    const saleId = Number(event.target.dataset.receipt);
    if (!saleId) return;

    try {
      await showReceipt(saleId);
    } catch (error) {
      showMessage(error.message, true);
    }
  });

  $('#close-receipt').addEventListener('click', () => $('#receipt-dialog').close());
  $('#print-receipt').addEventListener('click', () => window.print());
  renderCart();
}
