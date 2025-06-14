exports.validation = (schema) => { 
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) { 
      res.status(422).json({ 
        status: "fail", 
        message: error.details
      });
    } else {
      next();
    }
  };
};

