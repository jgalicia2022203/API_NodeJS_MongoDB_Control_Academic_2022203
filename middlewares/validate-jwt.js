const jwt = require("jsonwebtoken");
const Student = require("../models/student");
const Professor = require("../models/professor");
const { request, response } = require("express");

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "No token provided",
    });
  }

  try {
    // Token verification
    const { uid } = jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY);
    // Read user corresponding to uid
    const student = await Student.findById(uid);
    const professor = await Professor.findById(uid);
    // Verify user exists
    if (!student && !professor) {
      return res.status(401).json({
        msg: "User does not exist in the database",
      });
    }

    let validStatus = false;
    if (student) {
      validStatus = student.status;
    } else if (professor) {
      validStatus = professor.status;
    }

    if (!validStatus) {
      return res.status(401).json({
        msg: "Invalid token, user is inactive",
      });
    }

    req.user = student || professor;
    next();
  } catch (e) {
    console.log(e);
    res.status(401).json({
      msg: "Invalid token",
    });
  }
};

module.exports = {
  validateJWT,
};
