/* 
  This is a SAMPLE FILE to get you started.
  Please, follow the project instructions to complete the tasks.
*/


document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  form.addEventListener('submit', function(event) {
      let valid = true;
      clearErrors();

      if (!validateEmail(emailInput.value)) {
          showError(emailInput, 'Please enter a valid email address.');
          valid = false;
      }

      if (passwordInput.value.length < 6) {
          showError(passwordInput, 'Password must be at least 6 characters long.');
          valid = false;
      }

      if (!valid) {
          event.preventDefault();
      }
  });

  function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
  }

  function showError(input, message) {
      const error = document.createElement('div');
      error.className = 'error-message';
      error.textContent = message;
      input.parentElement.appendChild(error);
      input.classList.add('input-error');
  }

  function clearErrors() {
      const errors = document.querySelectorAll('.error-message');
      errors.forEach(error => error.remove());

      const inputs = document.querySelectorAll('.input-error');
      inputs.forEach(input => input.classList.remove('input-error'));
  }
});
