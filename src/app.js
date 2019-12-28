const path = require('path');
const express = require('express');
const app = express();
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');



//define path
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partial')


//set handlebars
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);
app.use(express.static(publicDirectoryPath));


//routes
app.get('/', (req, res) => {
	res.render("index", {
		title: "Weather App",
		name: "Developed By Robo Admin"
	})
})


app.get("/about", (req, res) => {
	res.render("about", {
		title: "About me",
		name: "Developed By Robo Admin"
	})
})


app.get("/help", (req, res) => {
	res.render("help", {
		title: "Need Help?",
		name: "Robo Admin"
	})
})

app.get("/weather", (req, res) => {
	if(!req.query.address) {
		return res.send({
			error: "You must provide an address!"
		})
	}

	geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
		if(error) {
			return res.send({ error })
		}

		forecast(latitude, longitude, (error, forecastData) => {
			if(error) {
				return res.send({ error })
			}

			res.send({
				forecast: forecastData,
				location,
				address: req.query.address
			})
		})		
	})
})

app.get("/help/*", (req, res) => {
	res.render("404", {
		title: "404",
		name: "Developed By Robo Admin",
		errorMessage: "Page not found."
	})
})

app.get("*", (req, res) => {
	res.render("404", {
		title: "404",
		name: " Developed By Robo Admin",
		errorMessage: "Page not found."
	})
})




const port = process.env.PORT || 3000

//server port
app.listen(port, () => {
	console.log("Server Has Started")
})