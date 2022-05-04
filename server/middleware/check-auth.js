const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.userId = decoded.userId;
      req.businessId = decoded.businessId;

      if (req.query.type === "business" && req.businessId === undefined) {
        return res.status(401).send({ message: "You are not authorized" });
      }

      next();
    } catch (error) {
      return res.status(401).send({ message: "You are not authorized" });
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
};

module.exports = { protect };
