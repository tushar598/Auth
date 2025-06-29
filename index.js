const express = require("express");
const app = express();
const port = 3010;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("./model/user");
const path = require("path");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/create", (req, res) => {
  const { username, email, password, age } = req.body;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      const userData = await userModel.create({
        name: username,
        email,
        password: hash,
        age,
      });
      if (userData) {
        res.render("success");
      } else {
        res.status(401).send("Somthing went wrong");
      }
    });
  });
});

app.get("/login", async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.render("login");
  }
  try {
    const decoded = jwt.verify(token, "tutu");
    const user = await userModel.findOne({ email: decoded.email });
    if (user) {
      res.render("profile", { user });
    } else {
      res.render("login");
    }
  } catch (err) {
    res.render("login");
  }
});

app.post("/login", async (req, res) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    res.send("Something Went Wrong");
  } else {
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (result) {
        const token = jwt.sign({ email: user.email }, "tutu");
        res.cookie("token", token);
        res.render("profile", { user });
      } else {
        res.send("Something Went Wrong");
      }
    });
  }
});

app.get("/edit/:id", async (req, res) => {
  const user = await userModel.findOne({ _id: req.params.id });
  res.render("edit", { user });
});

app.post("/edit/:id", (req, res) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(req.body.password, salt, async (err, hash) => {
      const user = await userModel.findOneAndUpdate(
        { _id: req.params.id },
        {
          name: req.body.name,
          email: req.body.email,
          password: hash,
          age: req.body.age,
        },
        { new: true }
      );
      if (!user) {
        res.status(403).send("Error while edit the user details");
      } else {
        res.render("profile", { user });
      }
    });
  });
});

app.get("/delete/:id", async (req, res) => {
  const userDelete = await userModel.findOneAndDelete({ _id: req.params.id });
  if (userDelete) {
    res.render("index");
  } else {
    res.status(401).send("Error occur during deletion");
  }
});

app.get("/profile/:id", async (req, res) => {
  const user = await userModel.findOne({ _id: req.params.id });

  res.render("profile", { user });
});

app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.render("index");
});

app.listen(port, () => {
  console.log(`server running at : http://localhost:${port}`);
});
