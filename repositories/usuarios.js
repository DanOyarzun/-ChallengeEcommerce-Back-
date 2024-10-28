const { db } = require("../index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const registrarUsuarios = async (nombre, email, password) => {
    if (!nombre || !email || !password) {
        throw { message: "Todos los campos son obligatorios", status: 400 };
    }
    const passwordEncriptado = bcrypt.hashSync(password, 10);
    const consulta = "INSERT INTO usuarios (nombre, correo, password) VALUES ($1, $2, $3) RETURNING *";
    const values = [nombre, email, passwordEncriptado];
    const result = await db.query(consulta, values);

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.correo }, "az_AZ", {
        expiresIn: "2h",
    });

    return { user, token };
};

const login = async (email, password) => {
    try {
        const values = [email];
        const consulta = "SELECT * FROM usuarios WHERE correo = $1"; // Corregido

        const {
            rows: [usuario],
            rowCount,
        } = await db.query(consulta, values);

        // Verifica si el usuario fue encontrado
        if (!usuario) {
            throw {
                code: 401,
                message: "No se encuentra el usuario con esas credenciales",
            };
        }

        const { password: passwordEncriptado } = usuario;
        const passwordEsCorrecto = await bcrypt.compare(
            password,
            passwordEncriptado
        );

        if (!passwordEsCorrecto) {
            throw {
                code: 401,
                message: "No se encuentra el usuario con esas credenciales",
            };
        }

        // Si la contraseña es correcta, retorna el usuario y el token
        const token = jwt.sign({ id: usuario.id, email: usuario.correo }, "az_AZ", {
            expiresIn: "2h",
        });
        return { user: usuario, token };
    } catch (error) {
        console.error("Error al verificar el usuario:", error);
        throw error;
    }
};

module.exports = { registrarUsuarios, login };