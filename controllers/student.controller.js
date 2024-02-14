const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
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
  const { id } = req.params;
  const student = await Student.findOne({ _id: id });

  res.status(200).json({
    student,
  });
};

const putStudents = async (req, res) => {
  const { id } = req.params;
  const { courses: courseIds } = req.body;

  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }

    if (student.courses.length + courseIds.length > 3) {
      return res
        .status(400)
        .json({ msg: "Student cannot be assigned more than 3 courses" });
    }

    const alreadyAssignedCourses = student.courses.filter((course) =>
      courseIds.includes(course)
    );
    if (alreadyAssignedCourses.length > 0) {
      return res.status(400).json({
        msg: "Student is already assigned to one or more of these courses",
      });
    }

    student.courses.push(...courseIds);
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

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
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

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET);

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const getStudentCourses = async (req, res) => {
  const { id } = req.params;

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
  const { id } = req.params;
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
  const { id } = req.params;

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
  putStudents,
  getStudentById,
  studentsGet,
  getStudentCourses,
  register,
  login,
  updateStudentProfile,
  deleteStudentProfile,
};
