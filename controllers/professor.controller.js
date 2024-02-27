const Professor = require("../models/professor");
const Student = require("../models/student");
const Course = require("../models/course");
const { response } = require("express");
const bcrypt = require("bcryptjs");

const professorsGet = async (req, res = response) => {
  const { limit, from } = req.query;
  const query = { status: true };

  const [total, professors] = await Promise.all([
    Professor.countDocuments(query),
    Professor.find(query).skip(Number(from)).limit(Number(limit)),
  ]);

  res.status(200).json({
    total,
    professors,
  });
};

const getProfessorById = async (req, res) => {
  const id = req.user.id;
  const professor = await Professor.findOne({ _id: id });

  if (!professor) {
    return res.status(400).json({
      msg: "id doesn't exist in database",
    });
  }

  res.status(200).json({
    professor,
  });
};

const registerProfessor = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingProfessor = await Professor.findOne({ email });
    if (existingProfessor) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const professor = new Professor({
      name,
      email,
      password: hashedPassword,
    });

    await professor.save();

    res.status(201).json({ msg: "Professor registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ teacher: req.user.id }); // Obtaining all teacher courses
    res.status(200).json({ courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const createCourse = async (req, res) => {
  const { name, description } = req.body;
  const teacher = req.user.id; // teacher id from auth token

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
  const professorId = req.user.id;
  const courseId = req.body.courseId;
  const { name, description, students } = req.body;

  try {
    const professor = await Professor.findById(professorId);
    if (!professor) {
      return res.status(404).json({ msg: "Teacher not found" });
    }
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }
    if (course.teacher.toString() !== professorId) {
      return res
        .status(403)
        .json({ msg: "You are not authorized to edit this course" });
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

    // if students were updated, update each student too
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
  const professorId = req.user.id;
  const courseId = req.body.courseId;

  try {
    // Verificar si el maestro existe
    const professor = await Professor.findById(professorId);
    if (!professor) {
      return res.status(404).json({ msg: "Teacher not found" });
    }

    // Verificar si el curso existe
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    // Verificar si el maestro es el propietario del curso
    if (course.teacher.toString() !== professorId) {
      return res
        .status(403)
        .json({ msg: "You are not authorized to delete this course" });
    }

    // Eliminar automáticamente los estudiantes del curso
    await Student.updateMany(
      { courses: courseId },
      { $pull: { courses: courseId } }
    );

    // Eliminar el curso
    await Course.findByIdAndDelete(courseId);

    res.status(200).json({ msg: "Course deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  professorsGet,
  getProfessorById,
  registerProfessor,
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
};
