const { Schema, model } = require("mongoose");

const StudentSchema = Schema({
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
    required: true,
    enum: ["STUDENT_ROLE"],
    default: "STUDENT_ROLE",
  },
  courses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

module.exports = model("Student", StudentSchema);
