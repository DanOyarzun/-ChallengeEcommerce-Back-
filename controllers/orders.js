const { app } = require("../index");
const verifyToken = require("../middlewares/verifyToken");

const stripe = require("stripe")("tu_clave_privada_de_stripe");

app.post("/api/create-payment-intent", verifyToken, async (req, res) => {
  const { amount } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "usd",
  });
  res.json({ clientSecret: paymentIntent.client_secret });
});

// Ruta para gestionar pedidos
app.post("/api/orders", verifyToken, (req, res) => {
  const { cart, userDetails } = req.body;
  // Lógica para guardar el pedido en la base de datos
  res.status(201).send("Pedido creado con éxito");
});