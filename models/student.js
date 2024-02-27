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
  status: {
    type: Boolean,
    default: true,
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

StudentSchema.methods.toJSON = function () {
  const { __v, password, _id, ...student } = this.toObject();
  student.uid = _id;
  return student;
};

module.exports = model("Student", StudentSchema);
