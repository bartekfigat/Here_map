require("dotenv").config({ path: ".env" });
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const fetch = require("node-fetch");
const app = express();

app.use(morgan("tiny"));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// Staic file
app.use(express.static("public"));

// Body parser middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const appId = process.env.app_id;
const appCode = process.env.app_code;

app.get("/", (req, res) => {
  const url = `https://weather.api.here.com/weather/1.0/report.json?app_id=${appId}&app_code=${appCode}&product=observation&name=Berlin`;

  fetch(url)
    .then(res => {
      return res.json();
    })
    .then(data => {
      const displayWeatherData = {
        temperature: Math.round(
          data.observations.location[0].observation[0].temperature
        ),
        city: data.observations.location[0].city,
        description: data.observations.location[0].observation[0].description,
        iconLink: data.observations.location[0].observation[0].iconLink
      };
      res.render("index", { weather: displayWeatherData });
    })
    .catch(err => {
      console.log("Error", err.message);
    });
});

app.post("/", (req, res) => {
  let city = req.body.city;

  displayWeatherData
    .create(city)
    .then(newCity => {
      if (newCity) {
        res.redirect("index");
      } else {
        console.error("Error", err);
      }
    })
    .catch(err => {
      console.error("Error", err);
    });
});

//liveReload
const livereload = require("livereload").createServer({
  exts: ["js", "css", "ejs"]
});

livereload.watch(path.join(__dirname, "views"));
livereload.watch(path.join(__dirname, "public"));

//Set port connection
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Port: ${port}`);
});
