const form = document.getElementById('log-form');

const loginUser = async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const response = await fetch('/api/login', {
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

  if(responseParsed.token) {
    localStorage.setItem('token', responseParsed.token)
  }
};

form.addEventListener('submit', loginUser);
