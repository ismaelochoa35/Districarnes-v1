import { apiRequest } from './api.js';
import { $, escapeHtml, formatDate, showMessage } from './ui.js';

function renderAdministrators(administrators) {
  $('#administrator-rows').innerHTML = administrators.map(administrator => `
    <tr>
      <td><strong>${escapeHtml(administrator.nombre)}</strong></td>
      <td>${escapeHtml(administrator.email)}</td>
      <td><span class="stock ${administrator.activo ? '' : 'low'}">${administrator.activo ? 'Activo' : 'Inactivo'}</span></td>
      <td>${formatDate(administrator.fecha_creacion)}</td>
      <td>
        <button data-admin-id="${administrator.id}" data-next-active="${administrator.activo ? 'false' : 'true'}" class="link">
          ${administrator.activo ? 'Desactivar' : 'Activar'}
        </button>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="5" class="empty">No hay administradores registrados.</td></tr>';
}

export async function loadAdministrators() {
  renderAdministrators(await apiRequest('/administradores'));
}

export function initializeAdministrators() {
  $('#new-administrator').addEventListener('click', () => $('#administrator-dialog').showModal());
  $('#close-administrator-dialog').addEventListener('click', () => $('#administrator-dialog').close());

  $('#administrator-form').addEventListener('submit', async event => {
    event.preventDefault();

    try {
      await apiRequest('/administradores', {
        method: 'POST',
        body: {
          nombre: $('#administrator-name').value,
          email: $('#administrator-email').value,
          password: $('#administrator-password').value
        }
      });
      event.target.reset();
      $('#administrator-dialog').close();
      showMessage('Administrador creado');
      await loadAdministrators();
    } catch (error) {
      showMessage(error.message, true);
    }
  });

  $('#administrator-rows').addEventListener('click', async event => {
    const id = Number(event.target.dataset.adminId);
    if (!id) return;

    try {
      await apiRequest(`/administradores/${id}/estado`, {
        method: 'PATCH',
        body: { activo: event.target.dataset.nextActive === 'true' }
      });
      await loadAdministrators();
    } catch (error) {
      showMessage(error.message, true);
    }
  });
}
