const bcryptjs = require("bcryptjs");
const Professor = require("../models/professor");
const { response } = require("express");

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
  const { _id, password, email, ...resto } = req.body;

  if (password) {
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const professor = await Professor.findByIdAndUpdate(id, resto);

  response.status(200).json({
    msg: "Professor successfully updated!!!",
    professor,
  });
};

const professorsDelete = async (req, res) => {
  const { id } = req.params;
  const professor = await Professor.findByIdAndUpdate(id, { status: false });

  res.status(200).json({
    msg: "Professor successfully deleted!!!",
    professor,
  });
};

const professorsPost = async (req, res) => {
  const { name, email, password, role } = req.body;
  const professor = new Professor({ name, email, password, role });

  const salt = bcryptjs.genSaltSync();
  professor.password = bcryptjs.hashSync(password, salt);

  await professor.save();
  res.status(202).json({
    professor,
  });
};

module.exports = {
  professorsPost,
  putProfessors,
  getProfessorById,
  professorsGet,
  professorsDelete,
};
