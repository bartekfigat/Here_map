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

const displayWeatherData = (req, res, city) => {
  const url = `https://weather.api.here.com/weather/1.0/report.json?app_id=NEKfgdnivkFddPStIUXC&app_code=0gi7i6DsTcMLCn_rxdQu1w&product=observation&name=${city ||
    " "}`;

  fetch(url)
    .then(data => {
      return data.json();
    })
    .then(data => {
      const { observations } = data;

      if (observations) {
        const location = observations.location[0];
        const weather = {
          temperature: Math.round(location.observation[0].temperature),
          city: location.city,
          description: location.observation[0].description,
          iconLink: location.observation[0].iconLink
        };
        res.render("index", { weather });
      } else {
        res.render("index", { weather: null });
      }
    })
    .catch(err => {
      console.log("Error", err.message);
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
