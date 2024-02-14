const Professor = require("../models/professor");
const Course = require("../models/course");
const { response } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
  const { id } = req.params;
  const professor = await Professor.findOne({ _id: id });

  res.status(200).json({
    professor,
  });
};

const putProfessors = async (req, res = response) => {
  const { id } = req.params;
  const { courses: courseIds } = req.body;

  try {
    const professor = await Professor.findById(id);
    if (!professor) {
      return res.status(404).json({ msg: "Professor not found" });
    }

    // Asignar cursos al profesor
    professor.courses = courseIds;
    await professor.save();

    res.status(200).json({
      msg: "Professor successfully updated!!!",
      professor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const professorsDelete = async (req, res) => {
  const { id } = req.params;
  const professor = await Professor.findByIdAndUpdate(id, { status: false });

  res.status(200).json({
    msg: "Professor successfully deleted!!!",
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

const loginProfessor = async (req, res) => {
  const { email, password } = req.body;

  try {
    const professor = await Professor.findOne({ email });
    if (!professor) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, professor.password);
    if (!isPasswordValid) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ id: professor._id }, process.env.JWT_SECRET);

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  putProfessors,
  getProfessorById,
  professorsGet,
  professorsDelete,
  registerProfessor,
  loginProfessor,
};
