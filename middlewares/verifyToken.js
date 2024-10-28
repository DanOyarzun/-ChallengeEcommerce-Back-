const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    
    if (!token) throw { message: "Token invalido o nulo" };
    
    const decoded = jwt.verify(token, "az_AZ");
    console.log("Token válido:", decoded);  
    req.user = decoded;  
    next(); 
  } catch (error) {
    throw { message: error.message, status: 401 }
  }
};

module.exports = verifyToken;
