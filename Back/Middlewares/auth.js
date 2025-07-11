const jwt = require("jsonwebtoken");
exports.auth = (req, res, next) => {
  let { authentication } = req.headers;
  if (!authentication) {
    return res.status(401).json({ message: "you must login first" });
  }
  try {
    const decoded = jwt.verify(authentication, process.env.SECRET_KEY);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "you must login first" });
  }
};
