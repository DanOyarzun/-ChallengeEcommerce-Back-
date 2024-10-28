const { app } = require("../index");
const { users } = require("../repositories");

app.post("/usuarios", async (req, res) => {
    const { nombre, email, password } = req.body;
    const nuevoUsuario = await users.registrarUsuarios(nombre, email, password);
    res.status(201).json({ message: "Usuario creado con exito", user: nuevoUsuario });
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const { user, token } = await users.login(email, password);
    res.status(200).json({ message: "Inicio de sesión exitoso", user, token });
});