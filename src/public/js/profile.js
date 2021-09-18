const formProfile = document.getElementById('form-profile')

// User id
const userId = formProfile.dataset.user;

// inputs

const firstname = formProfile.firstname;
const lastname = formProfile.lastname;
const birth = formProfile.birth;
const dni =  formProfile.dni;

// Load data in form
 getProfileByUserId(userId).then((data) => {
  firstname.value = data.firstname || '';
  lastname.value = data.lastname || '';
  birth.value = data.birth || '';
  dni.value = data.dni || '';

 }).catch((err) => {
  console.log(err)
 })

 // error manage
 let currentOpenedAlert;

 // Handle Form Event
formProfile.addEventListener('submit', async function (ev) {
  ev.preventDefault()
  
  // Hide currentOpenedAlert
  if(currentOpenedAlert && !currentOpenedAlert.classList.contains('hidden')) {
    currentOpenedAlert.classList.remove('hidden')
  }

  try {
    const data = await updateProfileByUserId(userId)

    if(data.errors) {
      console.log(data)
    }
  } catch(err) {
    console.log(err)
  }
})  


async function getProfileByUserId(userId) {
  const endpoint = `http://localhost:3000/users/${userId}/profile`;

  try {
    const res = await fetch(endpoint, {
      method: 'GET'
    })

    return res.json();

  } catch(err) {
    throw err;
  }
}

async function updateProfileByUserId(userId) {
  const endpoint = `http://localhost:3000/users/${userId}/profile`;

  try {
    const res = await fetch(endpoint, {
      method: 'PUT',
      body: JSON.stringify({
        firstname: firstname.value,
        lastname: lastname.value,
        birth: birth.value,
        dni: dni.value
      }),
      headers: {
        'Content-Type' : 'application/json'
      }
    })

    return res.json();

  } catch(err) {
    throw err;
  }
}