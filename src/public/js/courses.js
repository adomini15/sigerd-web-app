const controls = document.querySelector(".controls");
const courses = document.querySelector("#courses");
const selectedCourses = new Set();

courses.addEventListener("click", function (ev) {
	if (ev.target.dataset.delete) {
		if (ev.target.checked) {
			selectedCourses.add(ev.target.dataset.delete);
		} else {
			selectedCourses.delete(ev.target.dataset.delete);
		}

		// populate badge of delete option
		controls.querySelector('[data-option="delete"] .badge').textContent =
			selectedCourses.size;

		if (selectedCourses.size) {
			controls
				.querySelector('[data-option="delete"]')
				.classList.remove("disabled");
		} else {
			controls
				.querySelector('[data-option="delete"]')
				.classList.add("disabled");
		}
	}
});

controls.addEventListener("click", async function (ev) {
	const target = ev.target;

	if (target.closest(".actions")) {
		switch (target.dataset.option) {
			case "delete":
				for (let selectedCourse of selectedCourses) {
					try {
						const feedback = await deleteCourseByName(selectedCourse);
					} catch (error) {
						console.log(error);
					}
				}

				window.location.href = "/courses";

				break;

			default:
				break;
		}
	}
});

async function deleteCourseByName(name) {
	const endpoint = `https://sigerd-api.herokuapp.com/courses/${name}`;

	try {
		const res = await fetch(endpoint, {
			method: "DELETE",
		});

		const data = await res.json();

		return data;
	} catch (error) {
		throw error;
	}
}
