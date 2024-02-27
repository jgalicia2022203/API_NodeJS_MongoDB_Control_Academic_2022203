const bcryptjs = require("bcryptjs");
const Student = require("../models/student");
const { response } = require("express");

const studentsGet = async (req, res = response) => {
  const { limit, from } = req.query;
  const query = { status: true };

  const [total, students] = await Promise.all([
    Student.countDocuments(query),
    Student.find(query).skip(Number(from)).limit(Number(limit)),
  ]);

  res.status(200).json({
    total,
    students,
  });
};

const getStudentById = async (req, res) => {
  const id = req.user.id;
  const student = await Student.findOne({ _id: id });

  if (!student) {
    return res.status(400).json({
      msg: "id doesn't exist in database",
    });
  }

  res.status(200).json({
    student,
  });
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const student = new Student({
      name,
      email,
      password: hashedPassword,
    });

    await student.save();

    res.status(201).json({ msg: "Student registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const assignCourses = async (req, res) => {
  const id = req.user.id;
  const { courses: courseIds } = req.body;

  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }

    const uniqueCourseIds = new Set(courseIds);
    if (uniqueCourseIds.size !== courseIds.length) {
      return res.status(400).json({
        msg: "Duplicate course IDs are not allowed",
      });
    }

    for (const courseId of uniqueCourseIds) {
      if (student.courses.includes(courseId)) {
        return res.status(400).json({
          msg: "Student is already assigned to one or more of these courses",
        });
      }
    }

    if (student.courses.length + uniqueCourseIds.size > 3) {
      return res.status(400).json({
        msg: "Student cannot be assigned more than 3 courses",
      });
    }

    student.courses.push(...uniqueCourseIds);
    await student.save();

    res.status(200).json({
      msg: "Courses successfully assigned to student",
      student,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const getStudentCourses = async (req, res) => {
  const id = req.user.id;

  try {
    const student = await Student.findById(id).populate("courses");
    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }

    res.status(200).json({
      courses: student.courses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const updateStudentProfile = async (req, res) => {
  const id = req.user.id;
  const { name, email, password } = req.body;

  try {
    let updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.password = hashedPassword;
    }

    const updatedStudent = await Student.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedStudent) {
      return res.status(404).json({ msg: "Student not found" });
    }

    res.status(200).json({
      msg: "Student profile updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const deleteStudentProfile = async (req, res) => {
  const id = req.user.id;

  try {
    const deletedStudent = await Student.findByIdAndDelete(id);
    if (!deletedStudent) {
      return res.status(404).json({ msg: "Student not found" });
    }
    res.status(200).json({ msg: "Student profile deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  studentsGet,
  getStudentById,
  register,
  assignCourses,
  getStudentCourses,
  updateStudentProfile,
  deleteStudentProfile,
};
