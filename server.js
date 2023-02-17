const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const { logger, logEvents } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const PORT = process.env.PORT || 3500;

app.use(logger);

const whitelist = ["http://127.0.0.1:5500", "http://localhost:3500"];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("NOT ALLOWED BY CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

// Middleware

app.use(cors(corsOptions)); // Cross Origin Resource Sharing

app.use(express.urlencoded({ extended: false })); // built-in middleware to handle urlencoded data
app.use(express.json()); // built-in middleware for json

app.use("/", express.static(path.join(__dirname, "/public"))); // set public
app.use("/subdir", express.static(path.join(__dirname, "/public"))); // set public

app.use(errorHandler);

// Routes

app.use("/", require("./routes/root")); // set root("/") route
app.use("/subdir", require("./routes/subdir")); // set subdir route
app.use("/employees", require("./routes/api/employees"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 not found" });
  } else {
    res.type("txt").send("404 not found");
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
