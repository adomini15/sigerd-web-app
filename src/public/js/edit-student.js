// Get form
const formEditStudent = document.getElementById('form-edit-student');

 // manage error 
let openedAlertsStudent = [];

// Handle submit of form
formEditStudent.addEventListener('submit', async function (ev) {
  ev.preventDefault();

  try {
    // To hide posible opened alerts
    openedAlertsStudent.forEach((alert) => alert.classList.add('d-none'))

    // inputs
    const firstname = formEditStudent.firstname.value;
    const lastname = formEditStudent.lastname.value;
    const age = +formEditStudent.age.value;
    const address = formEditStudent.address.value;
    const gender = formEditStudent.gender.value;
    const declared = formEditStudent.declared.checked ? 'Y' : 'N';
    const nationality = formEditStudent.nationality.value;


    // Create object with student data properties
    const student = {
      firstname,
      lastname,
      age,
      address,
      gender,
      declared,
      nationality
    }

    // Handle update student method

    const feedback = await updateStudent(student, this.dataset.studentId)
    
    // Fill alerts with posible errors
    if(feedback.errors) {
      for(let err of Object.entries(feedback.errors)) {
        const alert = this.querySelector(`#${err[0]} ~ .alert`)
        alert.classList.remove('d-none')
        alert.textContent = err[1]
        openedAlertsStudent.push(alert)
      }
    }

    if(feedback.student) {
      window.location.href = 'http://localhost:3001/enroll-student'
    }
    

  } catch (err) {
    console.log(err)
  }
})

// Method to update student
async function updateStudent(student, id) {
  const endpoint = `http://localhost:3000/students/${id}`
  try {
    const res = await fetch(endpoint, {
      method: 'PUT',
      body: JSON.stringify(student),
      headers: {
        'Content-Type' : 'application/json'
      }
    })

    const data = await res.json();

    return data;

  } catch(err) {
    throw err;
  }
}

// ------------------
// HANDLE PARENTS INFO

const parentControls = document.getElementById('parent-controls')
const parentModal = document.getElementById('parentModal')
const parentForm = parentModal.querySelector('#parent-modal-form');

// manage error 
let openedAlertsParent = [];

const traduction = {
  padre: 'father',
  madre: 'mother',
  tutor: 'tutor'
}

parentControls.addEventListener('click', async function(ev) {
  try {
    if(ev.target.dataset?.parentTitle) {
      const btn = ev.target;
      
      // inputs

      const parentInputs = {
        firstname:  parentForm.firstname,
        lastname: parentForm.lastname,
        age: parentForm.age,
        dni: parentForm.dni,
        gender: parentForm.gender,
        address: parentForm.address,
        declared: parentForm.declared,
        nationality: parentForm.nationality,
        tel: parentForm.tel,
        grade: parentForm.grade,
        job: parentForm.job,
        tel_job: parentForm.jobtel
      }
  
      const modalTitle = document.getElementById('parentModalLabel')
      modalTitle.textContent = `Editar ${capitalize(btn.dataset.parentTitle)}`;

      parentForm.dataset.parent = btn.dataset.parentTitle;
      const parents = await getParent(formEditStudent.dataset.studentId, traduction[btn.dataset.parentTitle])


      if(parents) {
        parentInputs.firstname.value = parents.firstname ?? '';
        parentInputs.lastname.value = parents.lastname ?? '';
        parentInputs.age.value = parents.age ?? '';
        parentInputs.dni.value = parents.dni ?? '';

        if(parents.gender == 'M') {  
          parentInputs.gender[0].checked = true; 
        } else if (parents.gender == 'F') {
          parentInputs.gender[1].checked = true; 
        }

        if(parents.declared == 'Y') {  
          parentInputs.declared.checked = true; 
        } else if (parents.declared == 'N') {
          parentInputs.declared.checked = false; 
        }


        parentInputs.address.value = parents.address ?? '';
        parentInputs.nationality.value = parents.nationality ?? '';
        parentInputs.tel.value = parents.tel ?? '';
        parentInputs.grade.value = parents.grade ?? '';
        parentInputs.job.value = parents.job ?? '';
        parentInputs.tel_job.value = parents.job_tel ?? '';
  
      }
      

    } 
  } catch (err) {
    console.log(err)
  }
})


parentForm.addEventListener('submit', async function(ev) {
  ev.preventDefault()

  try {

      // To hide posible opened alerts
      openedAlertsParent.forEach((alert) => alert.classList.add('d-none'))

      // Create object with parent data properties
      const parent = {
        firstname:  this.firstname.value,
        lastname: this.lastname.value,
        age: +this.age.value,
        dni: this.dni.value,
        gender: this.gender.value,
        address: this.address.value,
        declared: this.declared.checked ? 'Y' : 'N',
        nationality: this.nationality.value,
        tel: this.tel.value,
        grade: this.grade.value,
        job: this.job.value,
        tel_job: this.jobtel.value
      }

      const feedback = await updateParent(formEditStudent.dataset.studentId, parent, traduction[this.dataset.parent])

      // Fill alerts with posible errors
      if(feedback.errors) {
        for(let err of Object.entries(feedback.errors)) {
          const alert = this.querySelector(`#${err[0]} ~ .alert`)
          alert.classList.remove('d-none')
          alert.textContent = err[1]
          openedAlertsStudent.push(alert)
        }
      }

      if(feedback._id) {
        // window.location.href = 'http://localhost:3001/enroll-student'
      }

      console.log(feedback)
  } catch(err) {  
    console.log(err)
  }
})

// Utils

async function getParent(studentId, parentPath) {
  const endpoint = `http://localhost:3000/students/${studentId}/${parentPath}`
  try {
    const res = await fetch(endpoint, {
      method: 'GET'
    })

    const data = await res.json();

    return data;

  } catch(err) {
    throw err;
  } 
}

async function updateParent(studentId, parentInfo, parentPath) {
  const endpoint = `http://localhost:3000/students/${studentId}/${parentPath}`
  try {
    const res = await fetch(endpoint, {
      method: 'PUT',
      body: JSON.stringify(parentInfo),
      headers: {
        'Content-Type' : 'application/json'
      }
    })

    const data = await res.json();

    return data;

  } catch(err) {
    throw err;
  } 
}

function capitalize(str) {
  return str[0].toUpperCase() +
  str.substr(1);
}
