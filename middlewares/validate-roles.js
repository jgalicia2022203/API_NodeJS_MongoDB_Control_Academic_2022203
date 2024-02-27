const { response, request } = require("express");

const isTeacherRole = (req, res, next) => {
  if (!req.user) {
    return res.status(500).json({
      msg: "Attempting to validate a user without validating token first",
    });
  }

  const { role, name } = req.user;

  if (role !== "TEACHER_ROLE") {
    return res.status(401).json({
      msg: `${name} is not a teacher and cannot use this endpoint`,
    });
  }
  next();
};

const isAdminRole = (req, res, next) => {
  if (!req.user) {
    return res.status(500).json({
      msg: "Attempting to validate a user without validating token first",
    });
  }

  const { role, name } = req.user;

  if (role !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `${name} is not admin and cannot use this endpoint`,
    });
  }
  next();
};

module.exports = {
  isTeacherRole,
  isAdminRole,
};
