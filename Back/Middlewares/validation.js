exports.validation = (schema) => {
  return (req, res, next) => {
    // console.log("DOB", req.body.dob);
    const {error} = schema.validate(req.body, { abortEarly: false });
    if (!error) {
      next();
    } else {
     const messages = error.details.map((err) => err.message);
      res.status(422).json({ status: "fail", message: messages });
    }
// } else {
//   res.status(422).json({ status: "fail", message: error.error.details });
// }
  };
};
 

 

