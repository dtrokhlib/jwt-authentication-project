const form = document.getElementById('change-password-form');

const changeUserPassword = async (e) => {
  e.preventDefault();

  const password = document.getElementById('password').value;

  if (!localStorage.getItem('token')) {
    return console.log('No token set');
  }

  const response = await fetch('/api/change-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({
      newPassword: password,
    }),
  });

  const responseParsed = await response.json();

  console.log(responseParsed);
};

form.addEventListener('submit', changeUserPassword);
