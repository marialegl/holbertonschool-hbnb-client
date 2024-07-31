/* 
  This is a SAMPLE FILE to get you started.
  Please, follow the project instructions to complete the tasks.
*/

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');

  if (loginForm) {
      loginForm.addEventListener('submit', async (event) => {
          event.preventDefault();
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;
          
          try {
              const response = await loginUser(email, password);
              // Manejo de la respuesta aquí
              if (response.ok) {
                  const data = await response.json();
                  document.cookie = `token=${data.access_token}; path=/; secure; SameSite=Strict;`;
                  window.location.href = 'index.html';
              } else {
                  const errorData = await response.json();
                  alert('Login failed: ' + errorData.message);
              }
          } catch (error) {
              console.error('Error during login:', error);
              alert('An unexpected error occurred. Please try again later.');
          }
      });
  }
});

async function loginUser(email, password) {
  try {
      const response = await fetch('https://127.0.0.1:5000/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
      });
      return response; // Retorna la respuesta para ser manejada en el listener del formulario
  } catch (error) {
      console.error('Error during fetch:', error);
      throw error; // Lanza el error para ser manejado en el listener del formulario
  }
}
