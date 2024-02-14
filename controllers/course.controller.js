const Course = require("../models/course");
const Student = require("../models/student");
const { response } = require("express");

const createCourse = async (req, res) => {
  const { name, description } = req.body;
  const teacher = req.user.id; // El id del maestro se obtiene del token de autenticación

  try {
    const course = new Course({
      name,
      description,
      teacher,
    });

    await course.save();

    res.status(201).json({ msg: "Course created successfully", course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const updateCourse = async (req, res) => {
  const courseId = req.params.id;
  const { name, description, students } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    if (students && students.length > 3) {
      return res
        .status(400)
        .json({ msg: "Maximum 3 students allowed per course" });
    }

    if (students && students.length > 0) {
      const existingStudents = await Student.find({ _id: { $in: students } });
      if (existingStudents.length !== students.length) {
        return res.status(400).json({ msg: "One or more students not found" });
      }
    }

    course.name = name;
    course.description = description;
    if (students) {
      course.students = students;
    }
    await course.save();

    // Si se actualizaron los estudiantes, actualizar también el curso en cada estudiante
    if (students) {
      await Student.updateMany(
        { _id: { $in: students } },
        { $addToSet: { courses: courseId } }
      );
    }
    res.status(200).json({ msg: "Course updated successfully", course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const deleteCourse = async (req, res) => {
  const courseId = req.params.id;

  try {
    // Verificar si el curso existe
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    // Desasignar automáticamente el curso de los alumnos
    const students = await Student.find({ courses: courseId });
    if (students.length > 0) {
      await Student.updateMany(
        { courses: courseId },
        { $pull: { courses: courseId } }
      );
    }

    // Eliminar el curso
    await Course.findByIdAndDelete(courseId);

    res.status(200).json({ msg: "Course deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const getCourseDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    res.status(200).json({ course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ teacher: req.user.id }); // Obtener todos los cursos del maestro
    res.status(200).json({ courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseDetails,
  getAllCourses,
};
