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
  const { id } = req.params;
  const student = await Student.findOne({ _id: id });

  res.status(200).json({
    student,
  });
};

const putStudents = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, email, ...resto } = req.body;

  if (password) {
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const student = await Student.findByIdAndUpdate(id, resto);

  response.status(200).json({
    msg: "Student successfully updated!!!",
    student,
  });
};

const studentsDelete = async (req, res) => {
  const { id } = req.params;
  const student = await Student.findByIdAndUpdate(id, { status: false });

  res.status(200).json({
    msg: "Student successfully deleted!!!",
    student,
  });
};

const studentsPost = async (req, res) => {
  const { name, email, password, role, courses } = req.body;
  const student = new Student({ name, email, password, role, courses });

  const salt = bcryptjs.genSaltSync();
  student.password = bcryptjs.hashSync(password, salt);

  await student.save();
  res.status(202).json({
    student,
  });
};

module.exports = {
  studentsPost,
  putStudents,
  getStudentById,
  studentsGet,
  studentsDelete,
};
