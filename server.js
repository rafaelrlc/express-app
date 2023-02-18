const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger, logEvents } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const PORT = process.env.PORT || 3500;

app.use(logger);

// Middleware

app.use(cors(corsOptions)); // Cross Origin Resource Sharing

app.use(express.urlencoded({ extended: false })); // built-in middleware to handle urlencoded data
app.use(express.json()); // built-in middleware for json

app.use("/", express.static(path.join(__dirname, "/public"))); // set public

app.use(errorHandler); // handle errors

// Routes

app.use("/", require("./routes/root")); // set root("/") route
app.use("/employees", require("./routes/api/employees"));
app.use("/register", require("./routes/api/register"));

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
