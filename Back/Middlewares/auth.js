const jwt = require('jsonwebtoken');

exports.auth = (req, res, next) => {
  const { authentication } = req.headers;
  console.log('Received authentication header:', authentication);
  console.log('SECRET_KEY:', process.env.SECRET_KEY);
  if (!authentication) {
    console.log('No authentication header provided');
    return res.status(401).json({ message: 'No authentication header provided' });
  }
  try {
    const decoded = jwt.verify(authentication, process.env.SECRET_KEY);
    console.log('Decoded token:', decoded);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.log('Token verification error:', err.message);
    return res.status(401).json({ message: `Token verification failed: ${err.message}` });
  }
};