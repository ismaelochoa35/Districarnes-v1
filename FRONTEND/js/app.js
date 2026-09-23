import { apiRequest, closeSession, hasSession } from './api.js';
import { initializeAdministrators, loadAdministrators } from './administrators.js';
import { loadDashboard } from './dashboard.js';
import { initializeInventory, loadInventory, selectInventoryCategory, selectLowStock } from './inventory.js';
import { initializeSales, loadSaleCatalog, loadSalesHistory } from './sales.js';
import { $, showMessage } from './ui.js';

const sectionLoaders = {};

async function openSection(name) {
  document.querySelectorAll('.side-nav [data-section]').forEach(button => {
    button.classList.toggle('active', button.dataset.section === name);
  });

  Object.keys(sectionLoaders).forEach(section => {
    $(`#${section}-section`).classList.toggle('hidden', section !== name);
  });

  try {
    await sectionLoaders[name]();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    showMessage(error.message, true);
  }
}

async function initializeApplication() {
  try {
    const categories = await apiRequest('/categorias');
    initializeInventory(categories);
    initializeSales(categories);
    initializeAdministrators();

    Object.assign(sectionLoaders, {
      home: () => loadDashboard(categories),
      inventory: loadInventory,
      sales: loadSaleCatalog,
      history: loadSalesHistory,
      administrators: loadAdministrators
    });

    document.addEventListener('click', async event => {
      const button = event.target.closest('[data-section]');
      if (!button) return;
      const categoryId = Number(button.dataset.inventoryCategory);
      if (categoryId) await selectInventoryCategory(categoryId, false);
      if (button.hasAttribute('data-low-stock')) {
        await selectLowStock(button.dataset.lowStock === 'true', false);
      }
      await openSection(button.dataset.section);
    });
    $('#logout').addEventListener('click', closeSession);

    await openSection('home');
  } catch (error) {
    showMessage(error.message, true);
  }
}

if (hasSession()) {
  initializeApplication();
} else {
  window.location.replace('/');
}
