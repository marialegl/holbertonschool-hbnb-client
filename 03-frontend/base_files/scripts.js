document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

  if (loginForm) {
      loginForm.addEventListener('submit', async (event) => {
          event.preventDefault();
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;
          await loginUser(email, password);
      });
  }
});

async function loginUser(email, password) {
  try {
      const response = await fetch('http://127.0.0.1:5000/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
      });
      
      if (response.ok) {
        const data = await response.json();
        document.cookie = `token=${data.access_token}; path=/`;
        window.location.href = 'index.html';
    } else {
        const errorData = await response.json();
        alert('Login failed: ' + (errorData.message || response.statusText));
    }

      console.log('Response status:', response.status); // Depuración
      console.log('Response body:', await response.clone().json()); // Depuración
      return response; // Retorna la respuesta para ser manejada en el listener del formulario
  } catch (error) {
    console.error('Error during fetch:', error);
    alert('An unexpected error occurred. Please try again later.');
    throw error; // Lanza el error para ser manejado en el listener del formulario
  }
}
