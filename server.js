const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger, logEvents } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 3500;

app.use(logger);

// Middleware

app.use(cors(corsOptions)); // Cross Origin Resource Sharing

app.use(express.urlencoded({ extended: false })); // built-in middleware to handle urlencoded data
app.use(express.json()); // built-in middleware for json

// Middleware for cookies
app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "/public"))); // set public

// Routes

app.use("/", require("./routes/root")); // set root("/") route
app.use("/register", require("./routes/api/register"));
app.use("/auth", require("./routes/api/auth"));

app.use(verifyJWT); // tudo abaixo vai precisar passar pelo verifyJWT middleware

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

app.use(errorHandler); // handle errors

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
