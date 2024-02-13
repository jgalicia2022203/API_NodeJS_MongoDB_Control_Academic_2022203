const Course = require("../models/course");
const { response } = require("express");

const courseGet = async (req, res = response) => {
  const { limit, from } = req.query;
  const query = { status: true };

  const [total, courses] = await Promise.all([
    Course.countDocuments(query),
    Course.find(query).skip(Number(from)).limit(Number(limit)),
  ]);

  res.status(200).json({
    total,
    courses,
  });
};

const getCoursesById = async (req, res) => {
  const { id } = req.params;
  const courses = await Courses.findOne({ _id: id });

  res.status(200).json({
    courses,
  });
};

const putCourses = async (req, res = response) => {
  const { id } = req.params;
  const { _id, ...resto } = req.body;

  const course = await Courses.findByIdAndUpdate(id, resto);

  response.status(200).json({
    msg: "Course successfully updated!!!",
    course,
  });
};

const coursesDelete = async (req, res) => {
  const { id } = req.params;
  const course = await Courses.findByIdAndUpdate(id, { status: false });

  res.status(200).json({
    msg: "Course successfully deleted!!!",
    course,
  });
};

const coursesPost = async (req, res) => {
  const { name, description, teacher, students } = req.body;
  const courses = new Courses({ name, description, teacher, students });

  await courses.save();
  res.status(202).json({
    courses,
  });
};

module.exports = {
  coursesPost,
  putCourses,
  getCoursesById,
  courseGet,
  coursesDelete,
};
