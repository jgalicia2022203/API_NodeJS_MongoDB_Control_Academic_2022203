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

// Método para verificar si un estudiante está asignado a este curso
CourseSchema.methods.isStudentAssigned = function (studentId) {
  return this.students.some(
    (student) => student.toString() === studentId.toString()
  );
};

module.exports = model("Course", CourseSchema);
