import express from "express";
import * as fs from "fs";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";

const auth = express.Router();

auth.get("/", (req, res) => {
  return res.send(JSON.parse(fs.readFileSync("./users.json", "utf-8")));
});

auth.post("/Signup", (req, res) => {
  const { name, email, password } = req.body;
  const users = JSON.parse(fs.readFileSync("./users.json", "utf-8"));
  const existingUser = users.find((user) => user.email === email);
  if (existingUser)
    return res.status(400).send({ message: "user already registered" });

  bcrypt.hash(password, 10, function (err, hash) {
    const newUser = { email, password: hash };
    fs.writeFileSync(
      "./users.json",
      JSON.stringify([...users, newUser]),
      "utf-8"
    );
    return res.status(200).send(newUser);
  });
});

auth.post("/Signin", (req, res) => {
  const { name, email, password } = req.body;
  const users = JSON.parse(fs.readFileSync("./users.json", "utf-8"));
  const existingUser = users.find((user) => user.email === email);
  if (!existingUser)
    return res.status(400).send({ message: "Email or password not correct!" });
  bcrypt.compare(password, existingUser.password, function (err, result) {
    if (!result) {
      return res
        .status(400)
        .send({ message: "Email or password not correct!" });
    } else {
      return res.status(200).send({ message: "welcome" });
    }
  });
  const newUsers = {
    id: nanoid(),
    email: email,
    password: password,
  };

  fs.writeFileSync(
    "./users.json",
    JSON.stringify([...users, newUsers]),
    "utf-8"
  );
});

export default auth;

// //
// import express from "express";
// import * as fs from "fs";
// import bcrypt from "bcrypt";
// import { nanoid } from "nanoid";

// const auth = express.Router();

// // Read users from file
// const readUsers = () => {
//   try {
//     return JSON.parse(fs.readFileSync("./users.json", "utf-8"));
//   } catch (err) {
//     console.error("Error reading users.json:", err);
//     return [];
//   }
// };

// // Sign up route (POST /api/auth/signup)
// auth.post("/signup", (req, res) => {
//   const { name, email, password } = req.body;
//   const users = readUsers();

//   // Check if the user already exists
//   const existingUser = users.find((user) => user.email === email);
//   if (existingUser) {
//     return res.status(400).send({ message: "User already registered" });
//   }

//   // Hash the password and save the new user
//   bcrypt.hash(password, 10, (err, hash) => {
//     if (err) {
//       return res.status(500).send({ message: "Error hashing password" });
//     }

//     const newUser = { id: nanoid(), name, email, password: hash };
//     users.push(newUser);

//     try {
//       fs.writeFileSync("./users.json", JSON.stringify(users, null, 2), "utf-8");
//       res.status(201).send({ message: "User created successfully", user: newUser });
//     } catch (err) {
//       res.status(500).send({ message: "Error saving user data" });
//     }
//   });
// });

// // Login route (POST /api/auth/login)
// auth.post("/login", (req, res) => {
//   const { email, password } = req.body;
//   const users = readUsers();

//   // Check if the user exists
//   const existingUser = users.find((user) => user.email === email);
//   if (!existingUser) {
//     return res.status(400).send({ message: "Email or password not correct" });
//   }

//   // Compare the password with the stored hash
//   bcrypt.compare(password, existingUser.password, (err, result) => {
//     if (err) {
//       return res.status(500).send({ message: "Error comparing passwords" });
//     }

//     if (!result) {
//       return res.status(400).send({ message: "Email or password not correct" });
//     }

//     // Successful login
//     res.status(200).send({ message: "Welcome", user: { id: existingUser.id, email: existingUser.email } });
//   });
// });

// export default auth;
