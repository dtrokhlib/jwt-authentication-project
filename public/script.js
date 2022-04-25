const form = document.getElementById('reg-form');

const registerUser = async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const response = await fetch('/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const responseParsed = await response.json();

  console.log(responseParsed.body);
};

form.addEventListener('submit', registerUser);
