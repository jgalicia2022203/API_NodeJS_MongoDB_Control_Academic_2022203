const { request, response } = require("express");
const Student = require("../models/student");
const Professor = require("../models/professor");
const bcryptjs = require("bcryptjs");
const { generateJWT } = require("../helpers/generate-jwt");

const login = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    const student = await Student.findOne({ email });
    const professor = await Professor.findOne({ email });

    if (!student && !professor) {
      return res.status(400).json({
        msg: "Incorrect credentials, mail does not exist in the database.",
      });
    }

    let validPassword = false;
    if (student) {
      validPassword = bcryptjs.compareSync(password, student.password);
    } else if (professor) {
      validPassword = bcryptjs.compareSync(password, professor.password);
    }

    if (!validPassword) {
      return res.status(400).json({
        msg: "La contraseña es incorrecta",
      });
    }

    const token = await generateJWT(student ? student.id : professor.id);

    res.status(200).json({
      msg: "Welcome",
      token,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      msg: "Contact the manager",
    });
  }
};

module.exports = {
  login,
};
