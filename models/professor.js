const { Schema, model } = require("mongoose");

const ProfessorSchema = Schema({
  name: {
    type: String,
    required: [true, "name is obligatory"],
  },

  email: {
    type: String,
    required: [true, "email is obligatory"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "password is obligatory"],
  },
  role: {
    type: String,
    enum: ["TEACHER_ROLE"],
    default: "TEACHER_ROLE",
  },
});

module.exports = model("Professor", ProfessorSchema);
