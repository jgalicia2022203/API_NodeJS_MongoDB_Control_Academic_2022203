const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  // Obtener el token del encabezado de autorización
  const token = req.headers.authorization;

  // Verificar si el token está presente
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Establecer el usuario autenticado en el objeto req
    req.user = decoded;

    // Pasar al siguiente middleware
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = { protect };
