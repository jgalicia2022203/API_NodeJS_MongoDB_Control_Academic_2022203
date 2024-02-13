const Role = require("../models/role");
const Student = require("../models/student");
const Professor = require("../models/professor");
const Course = require("../models/course");

const validRole = async (role = "") => {
  const existsRole = await Role.findOne({ role });
  if (!existsRole) {
    throw new Error(`role ${role} doesn't exist in database`);
  }
};

const existsEmail = async (email = "") => {
  const existsEmailStudent = await Student.findOne({ email });
  const existsEmailProfessor = await Professor.findOne({ email });
  if (existsEmailStudent) {
    throw new Error(`the email ${email} is already registered`);
  } else if (existsEmailProfessor) {
    throw new Error(`the email ${email} is already registered`);
  }
};

const existsStudentById = async (id = "") => {
  const existsStudent = await Student.findOne({ id });
  if (existsStudent) {
    throw new Error(`the student with the id ${id} doesn't exist`);
  }
};

const existsProfessorById = async (id = "") => {
  const existsProfessor = await Professor.findOne({ id });
  if (existsProfessor) {
    throw new Error(`the professor with the id ${id} doesn't exist`);
  }
};

const existsCourseById = async (id = "") => {
  const existsCourse = await Course.findOne({ id });
  if (existsCourse) {
    throw new Error(`the course with the id ${id} doesn't exist`);
  }
};

module.exports = {
  validRole,
  existsEmail,
  existsStudentById,
  existsProfessorById,
  existsCourseById,
};
