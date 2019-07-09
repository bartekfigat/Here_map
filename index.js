require("dotenv").config({ path: ".env" });
const express = require("express");
(bodyParser = require("body-parser")),
  (morgan = require("morgan")),
  (path = require("path")),
  (cors = require("cors")),
  (fetch = require("node-fetch")),
  (app = express()),
  // view engine setup
  app.use(morgan("tiny"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// Staic file
app.use(express.static("public"));

// Body parser middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const appId = process.env.appId;
const appCode = process.env.appCode;

const displayWeatherData = (req, res, city) => {
  const url = `https://weather.api.here.com/weather/1.0/report.json?app_id=${appId}&app_code=${appCode}&product=observation&name=${city ||
    ""}`;

  fetch(url)
    .then(response => {
      return response.json();
    })
    .then(data => {
      const { observations } = data;

      if (!observations || observations === null) {
        res.render("index", { weather: null });
      } else {
        const location = observations.location[0];
        const weather = {
          temperature: Math.round(location.observation[0].temperature),
          city: location.city,
          description: location.observation[0].description,
          iconLink: location.observation[0].iconLink
        };
        res.render("index", { weather });
      }
    })
    .catch(err => {
      console.log("Error", err);
      res.redirect("/");
    });
};

app.get("/", (req, res) => {
  displayWeatherData(req, res, null);
});

app.post("/", (req, res) => {
  const city = req.body.city;

  displayWeatherData(req, res, city);
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
