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

StudentSchema.path("courses").validate(function (courses) {
  return courses.length <= 3;
}, "Student can have maximum of 3 courses");

module.exports = model("Student", StudentSchema);
