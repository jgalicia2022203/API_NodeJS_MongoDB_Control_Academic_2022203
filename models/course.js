const { Schema, model } = require("mongoose");

const CourseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: "Professor",
  },
  students: [
    {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
});

module.exports = model("Course", CourseSchema);
