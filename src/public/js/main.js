const logoutLink = document.getElementById("logout-link");

// Logout

logoutLink.addEventListener("click", async function (ev) {
	ev.preventDefault();
	ev.stopPropagation();

	// const endpoint = "https://sigerd-api.herokuapp.com/logout";

	try {
		// const res = await fetch(endpoint, {
		// 	method: "GET",
		// 	credentials: "include",
		// });

		// const data = await res.json();

		document.cookie = `jwt = ; expires=${new Date()}`

		// if (data.ok) {
		window.location.href = "/login";
		// }
	} catch (err) {
		console.log(err);
	}
});
