// imports
import dotenv from "dotenv";
import fetch from "node-fetch";
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();

dotenv.config();

// middlewares personalizados
import login from "./middlewares/Auth/Auth";

// Configurando la utilidad CookieParser
app.use(cookieParser());

// Gestión de los archivos públicos
app.use(express.static(path.join(path.resolve(), "src", "public")));

// Configurando el motor de vista
app.set("view engine", "ejs");

// Estableciendo la ruta a los archivos de vista
app.set("views", path.join(path.resolve(), "src", "views"));

// Utilizando morgan
app.use(morgan("dev"));

// routes

app.get("/", login, (req, res) => {
	res.render("index", { title: "Home" });
});

app.get("/signup", (req, res) => {
	res.render("signup", { title: "Signup" });
});

app.get("/login", (req, res) => {
	res.render("login", { title: "Login" });
});

app.get("/profile", login, (req, res) => {
	res.render("profile", { title: "profile" });
});

app.get("/enroll-student", login, (req, res) => {
	res.render("enroll-student", { title: "Enroll Student" });
});

app.get("/student/create", login, (req, res) => {
	res.render("create-student", { title: "New Student", student: null });
});

app.get("/student/:id/edit", login, async (req, res) => {
	const endpoint = `https://sigerd-api.herokuapp.com/students/${req.params.id}`;

	try {
		const response = await fetch(endpoint, {
			headers: {
				Authorization: `Bearer ${req.cookies.jwt}`,
			},
		});
		const student = await response.json();

		if (student._id) {
			res.render("edit-student", { title: "Edit Student", student });
		} else {
			res.redirect("/");
		}
	} catch (error) {
		console.log(error);
	}
});

app.get("/roll", login, async (req, res) => {
	const endpoint = `https://sigerd-api.herokuapp.com/courses`;

	try {
		const response = await fetch(endpoint, {
			headers: {
				Authorization: `Bearer ${req.cookies.jwt}`,
			},
		});
		const courses = await response.json();

		if (courses) {
			res.render("roll", { title: "Student Relationship", courses });
		}
	} catch (error) {
		console.log(error);
	}
});

app.get("/courses", login, async (req, res) => {
	const endpoint = `https://sigerd-api.herokuapp.com/courses`;

	try {
		const response = await fetch(endpoint, {
			headers: {
				Authorization: `Bearer ${req.cookies.jwt}`,
			},
		});
		const courses = await response.json();

		if (courses) {
			res.render("courses", { title: "Courses", courses });
		}
	} catch (error) {
		console.log(error);
	}
});

app.listen(process.env.PORT || 3001);
