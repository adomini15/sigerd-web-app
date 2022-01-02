// Get form
const formProfile = document.getElementById("form-profile");

// handle Course catalog
const coursesSelect = formProfile.courses;

// Student badge
const currentSelection = document.querySelector("#current-selection");
const fullnameSelection = currentSelection.querySelector(".fullname");
const identitySelection = currentSelection.querySelector(".identity");

// populate Course select
getCourses()
	.then((courses) => {
		for (let course of courses) {
			// create option
			const opt = document.createElement("option");
			opt.value = course["name"];
			opt.textContent = course["name"];

			// aggregate to Course select
			coursesSelect.appendChild(opt);
		}
	})
	.catch((err) => console.log(err));

// Handle Regex
var substringMatcher = function (strs) {
	return function findMatches(query, callback) {
		var matches, substrRegex;

		// an array that will be populated with substring matches
		matches = [];

		// regex used to determine if a string contains the substring `query`
		substrRegex = new RegExp(query, "i");

		// iterate through the pool of strings and for any string that
		// contains the substring `q`, add it to the `matches` array
		$.each(strs, function (i, str) {
			if (substrRegex.test(str.value)) {
				matches.push(str);
			}
		});

		callback(matches);
	};
};

// populate autocompleted

getStudents()
	.then((students) => {
		students = students
			.filter((student) => !student.course)
			.map((student) => {
				const value = `${student.firstname} ${student.lastname}`;
				return { ...student, value };
			});

		$("#custom-templates .typeahead").typeahead(null, {
			name: "students",
			display: "value",
			source: substringMatcher(students),
			templates: {
				empty: `<div class="empty-message text-muted pt-3">
          No se ha encontrado ninguna coincidencia.
        </div>`,
				suggestion: function (student) {
					const currentSelectedId = document.querySelector(
						"#current-selection .identity"
					);
					const match = currentSelectedId?.textContent.includes(student._id);

					return `<a href="#" class="list-group-item list-group-item-action flex-column align-items-start ${
						match && "active"
					}">
        <div class="d-flex w-100 justify-content-between">
          <h6 class="fullname mb-1">${student.value}</h6>
          <small>Agregado en fecha ${student.createdAt
						.split("T")[0]
						.replaceAll("-", "/")}</small>
        </div>
        <p class="mb-1">${student.address}.</p>
        <small class="identity badge rounded-pill bg-dark">${
					student._id
				}</small>
      </a>`;
				},
			},
		});

		$(".tt-dataset-students").addClass("list-group");

		$(".tt-dataset-students").on("click", function (e) {
			e.preventDefault();
			const listItem = e.target.closest("a");

			if (listItem) {
				currentSelection.dataset.id =
					listItem.querySelector(".identity")?.textContent;
				fullnameSelection.innerHTML =
					listItem.querySelector(".fullname")?.textContent;
				identitySelection.innerHTML =
					listItem.querySelector(".identity")?.textContent;

				currentSelection.classList.remove("d-none");
			}
		});
	})
	.catch((err) => console.log(err));

formProfile.addEventListener("submit", async function (ev) {
	ev.preventDefault();

	// button - submit
	const btnSubmit = this.querySelector("#submit");
	try {
		if (coursesSelect.value.trim() && currentSelection.dataset.id.trim()) {
			btnSubmit.classList.remove("btn-outline-danger");

			// Enroll student
			const feedback = await enrollStudent(
				coursesSelect.value,
				currentSelection.dataset.id.trim()
			);

			if (feedback.students) {
				window.location.href = "/";
			}
		} else {
			btnSubmit.classList.add("btn-outline-danger");
		}
	} catch (err) {
		console.log(err);
	}
});

// Get Courses
async function getCourses() {
	const endpoint = `https://sigerd-api.herokuapp.com/courses`;
	try {
		const res = await fetch(endpoint, {
			method: "GET",
		});

		const data = await res.json();

		return data;
	} catch (err) {
		throw err;
	}
}

// Get Students
async function getStudents() {
	const endpoint = `https://sigerd-api.herokuapp.com/students`;
	try {
		const res = await fetch(endpoint, {
			method: "GET",
		});

		const data = await res.json();

		return data;
	} catch (err) {
		throw err;
	}
}

// Enroll student
async function enrollStudent(courseId, studentId) {
	const endpoint = `https://sigerd-api.herokuapp.com/courses/${courseId}/students/${studentId}`;
	try {
		const res = await fetch(endpoint, {
			method: "POST",
		});

		const data = await res.json();

		return data;
	} catch (err) {
		throw err;
	}
}
