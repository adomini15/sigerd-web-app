// Get form
const formCreateStudent = document.getElementById("form-create-student");

// manage error
let openedAlerts = [];

// Handle submit of form
formCreateStudent.addEventListener("submit", async function (ev) {
	ev.preventDefault();

	try {
		// To hide posible opened alerts
		openedAlerts.forEach((alert) => alert.classList.add("d-none"));

		// inputs
		const firstname = formCreateStudent.firstname.value;
		const lastname = formCreateStudent.lastname.value;
		const age = +formCreateStudent.age.value;
		const address = formCreateStudent.address.value;
		const gender = formCreateStudent.gender.value;
		const declared = formCreateStudent.declared.checked ? "Y" : "N";
		const nationality = formCreateStudent.nationality.value;

		// Create object with student data properties
		const student = {
			firstname,
			lastname,
			age,
			address,
			gender,
			declared,
			nationality,
		};

		// Handle create student method
		const feedback = await createStudent(student);

		// Fill alerts with posible errors
		if (feedback.errors) {
			for (let err of Object.entries(feedback.errors)) {
				const alert = this.querySelector(`#${err[0]} ~ .alert`);
				alert.classList.remove("d-none");
				alert.textContent = err[1];
				openedAlerts.push(alert);
			}
		}

		if (feedback.student) {
			window.location.href = "/enroll-student";
		}
	} catch (err) {
		console.log(err);
	}
});

// Method to create student
async function createStudent(student) {
	const endpoint = `https://sigerd-api.herokuapp.com/students`;
	try {
		const res = await fetch(endpoint, {
			method: "POST",
			body: JSON.stringify(student),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${document.cookie.split("=")[1]}`,
			},
		});

		const data = await res.json();

		return data;
	} catch (err) {
		throw err;
	}
}
