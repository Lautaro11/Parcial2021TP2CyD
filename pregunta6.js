const express = require("express");
const fs = require("fs");

const database = require("./data/users.json");
const app = express();
app.use(express.json({ extended: false }));

const router = express.Router();
app.use("/users", router);

router.get("/", async (req, res) => {
  res.json(database);
});

router.get("/:id", async (req, res) => {
  const { id: userId } = req.params;
  const user = database.find((a) => a.id == userId);
  if (!user) res.status(400).json({ error: `User with id: ${userId} not exist` });
  res.json(user);
});

router.post("/", async (req, res) => {
  const { body } = req;
  if (database.find( u => u.id === body.id)){
      res.status(500).json("Error al agregar el usuario, el usuario ya existe");
  }
  database.push(body);
  const json = JSON.stringify(database);
  fs.writeFile("./data/users.json", json, "utf8", (err) => {
    if (err) res.status(500).json({ err: "Error al agregar un usuario" });
    res.json("Usuario agregado correctamente");
  });
});

const PORT = 3000;

app.get("/", (req, res) => res.send("Hello world!"));
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
