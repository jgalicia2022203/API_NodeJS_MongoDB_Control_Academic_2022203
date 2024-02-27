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
  status: {
    type: Boolean,
    default: true,
  },
  role: {
    type: String,
    enum: ["TEACHER_ROLE"],
    default: "TEACHER_ROLE",
  },
  courses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

ProfessorSchema.methods.toJSON = function () {
  const { __v, password, _id, ...professor } = this.toObject();
  professor.uid = _id;
  return professor;
};

module.exports = model("Professor", ProfessorSchema);
