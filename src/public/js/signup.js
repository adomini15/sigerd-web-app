const form = document.getElementById('form-signup')

form.addEventListener('submit', async function (ev) {
  ev.preventDefault()

  const emailErr = document.querySelector('.email-err')
  const passwordErr = document.querySelector('.password-err')

  emailErr.style.display = 'none'
  passwordErr.style.display = 'none'

  const email = this.email.value;
  const password = this.password.value;

  const endpoint = 'http://localhost:3000/signup';

  try {

    const res = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({
        email,
        password
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: "include"
    })

    const data = await res.json();

    // Handle Errors
    if (data.errors) {
      if (data.errors.email) {
        emailErr.style.display = "block"
        emailErr.textContent = data.errors.email
      }

      if (data.errors.password) {
        passwordErr.style.display = "block"
        passwordErr.textContent = data.errors.password
      }
    } else {
      // Redirect to Home
      window.location.href = '/login';
    }

  } catch (error) {
    console.log(error)
  }
})