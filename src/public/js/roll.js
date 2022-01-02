let courseName;
let students;
const formFilterCourses = document.getElementById("form-filter-courses");
const studentsContainer = document.getElementById("studentsContainer");
const studentsTable = studentsContainer.querySelector("#studentsTable");
const controls = document.querySelector(".controls");
const selectedIds = new Set();
const printStudentForm = document.getElementById("print-student-form");

formFilterCourses.addEventListener("submit", async function (ev) {
	ev.preventDefault();

	courseName = this.courses.value;

	this.courses.addEventListener("click", function () {
		this.classList.remove("btn-outline-danger");
	});

	if (courseName.trim()) {
		try {
			const loadingIcon = document.getElementById("loading-icon");
			loadingIcon.classList.remove("d-none");

			students = await getStudentsByCourse(courseName);

			console.log();
			if (students?.length > 0) {
				studentsContainer.hidden = false;
				const tbody = studentsTable.querySelector("tbody");
				tbody.innerHTML = "";

				for (let student of students) {
					const row = tbody.insertRow();
					row.innerHTML = `
                <th class="text-center"><input data-student-id="${
									student._id
								}" type="checkbox"></th>
                <th scope="row">${student._id}</th>
                <td>${student.firstname}</td>
                <td>${student.lastname}</td>
                <td class="text-center">${student.age}</td>
                <td class="text-center"><span style="color: ${
									student.gender == "M" ? "#10559A" : "#DB4C77"
								}" class="fas fa-child"></span></td>
                <td class="text-center fw-bold">${student.declared}</td>
                <td class="text-center d-flex justify-content-evenly">
                  <button data-student-id="${
										student._id
									}" class="fas fa-print btn btn-outline-secondary" data-bs-toggle="modal"
                  data-bs-target="#printStudentModal"></button>
                  <a href="/student/${
										student._id
									}/edit" class="btn btn-outline-secondary">
                    <span class="fas fa-file-alt"></span>
                  </a>
                </td>
                `;
				}

				loadingIcon.classList.add("d-none");
			}
		} catch (error) {
			console.log(error);
		}

		this.courses.classList.remove("btn-outline-danger");
	} else {
		this.courses.classList.add("btn-outline-danger");
	}
});

studentsTable.addEventListener("click", function (ev) {
	const target = ev.target;

	if (target.dataset.studentId) {
		if (target.closest('input[type="checkbox"]')) {
			const studentId = target.dataset.studentId;

			if (target.checked) {
				selectedIds.add(studentId);
			} else {
				selectedIds.delete(studentId);
			}

			// populate badge of delete option
			controls.querySelector('[data-option="delete"] .badge').textContent =
				selectedIds.size;

			if (selectedIds.size) {
				controls
					.querySelector('[data-option="delete"]')
					.classList.remove("disabled");
			} else {
				controls
					.querySelector('[data-option="delete"]')
					.classList.add("disabled");
			}
		} else if (target.closest("button")) {
			const printStudentModal = document.querySelector(target.dataset.bsTarget);

			if (printStudentModal) {
				const studentCard = printStudentModal.querySelector("#student-card");
				const student = students.filter((student) => {
					return student._id == target.dataset.studentId;
				})[0];

				Object.entries(student).forEach(([prop, value]) => {
					const field = studentCard.querySelector(`#${prop}`);

					if (field) {
						field.textContent = value;
					}
				});
			}
		}
	}
});

printStudentForm.addEventListener("submit", async function (ev) {
	ev.preventDefault();
	const studentCard = this.querySelector("#student-card");

	try {
		this.printAction.disabled = true;
		this.printAction.textContent = "Descargando...";
		const feedback = await generatePDF(studentCard);
	} catch (error) {
		console.log(error);
	} finally {
		this.printAction.textContent = "Descargar";
		this.printAction.disabled = false;
	}
});

controls.addEventListener("click", async function (ev) {
	const target = ev.target;

	if (target.closest(".actions")) {
		switch (target.dataset.option) {
			case "delete":
				for (let selectedId of selectedIds) {
					try {
						const feedback = await deEnrollStudentByCourse(
							courseName,
							selectedId
						);
						if (feedback._id) {
							window.location.href = "/roll";
						}
					} catch (error) {
						console.log(error);
					}
				}
				break;

			default:
				break;
		}
	}
});

async function deEnrollStudentByCourse(courseName, studentId) {
	const endpoint = `https://sigerd-api.herokuapp.com/courses/${courseName}/students/${studentId}`;
	try {
		const res = await fetch(endpoint, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${document.cookie.split("=")[1]}`,
			},
		});

		const data = await res.json();

		return data;
	} catch (error) {
		throw error;
	}
}

async function getStudentsByCourse(courseName) {
	const endpoint = `https://sigerd-api.herokuapp.com/courses/${courseName}/students`;
	try {
		const res = await fetch(endpoint, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${document.cookie.split("=")[1]}`,
			},
		});

		const data = await res.json();

		return data.students;
	} catch (error) {
		throw error;
	}
}

// utils

async function generatePDF(container) {
	const studentCard = container;

	return html2pdf()
		.set({
			margin: 0,
			filename: "student-card.pdf",
			image: {
				type: "jpg",
				quality: 0.88,
			},
			html2canvas: {
				scale: 2,
				letterRendering: true,
			},
			jsPDF: {
				unit: "in",
				format: "a3",
				orientation: "landscape",
			},
		})
		.from(studentCard)
		.save()
		.catch((err) => {
			throw err;
		})
		.finally();
}
