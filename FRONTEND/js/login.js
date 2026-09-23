import { hasSession, startSession } from './api.js';

if (hasSession()) {
  window.location.replace('/app');
}

const form = document.querySelector('#login-form');
const errorMessage = document.querySelector('#login-error');
const submitButton = form.querySelector('button[type="submit"]');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const passwordConfirmationInput = document.querySelector('#password-confirmation');
const passwordEyes = document.querySelectorAll('[data-password-target]');

function clearLoginFields() {
  form.reset();
  emailInput.value = '';
  passwordInput.value = '';
  passwordConfirmationInput.value = '';
  passwordEyes.forEach(button => {
    const input = document.querySelector(`#${button.dataset.passwordTarget}`);
    input.type = 'password';
    button.classList.remove('active');
    button.setAttribute('aria-label', 'Mostrar contraseña');
    button.title = 'Mostrar contraseña';
  });
  errorMessage.textContent = '';
}

clearLoginFields();
window.addEventListener('pageshow', clearLoginFields);
requestAnimationFrame(clearLoginFields);

passwordEyes.forEach(button => {
  button.addEventListener('click', () => {
    const input = document.querySelector(`#${button.dataset.passwordTarget}`);
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    button.classList.toggle('active', show);
    button.setAttribute('aria-label', show ? 'Ocultar contraseña' : 'Mostrar contraseña');
    button.title = show ? 'Ocultar contraseña' : 'Mostrar contraseña';
  });
});

form.addEventListener('submit', async event => {
  event.preventDefault();
  errorMessage.textContent = '';

  if (passwordInput.value !== passwordConfirmationInput.value) {
    errorMessage.textContent = 'Las contraseñas no coinciden';
    passwordConfirmationInput.focus();
    return;
  }

  submitButton.disabled = true;

  try {
    await startSession(
      emailInput.value.trim(),
      passwordInput.value
    );
    window.location.replace('/app');
  } catch (error) {
    errorMessage.textContent = error.message;
    submitButton.disabled = false;
  }
});
