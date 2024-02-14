const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validate-fields");
const { existsStudentById } = require("../helpers/db-validators");
const {
  putStudents,
  studentsGet,
  getStudentById,
  getStudentCourses,
  register,
  login,
  deleteStudentProfile,
} = require("../controllers/student.controller");
const router = Router();

router.get("/", studentsGet);

router.get(
  "/:id/courses",
  [
    check("id", "isn't a valid id").isMongoId(),
    check("id").custom(existsStudentById),
    validateFields,
  ],
  getStudentCourses
);

router.get(
  "/:id",
  [
    check("id", "isn't a valid id").isMongoId(),
    check("id").custom(existsStudentById),
    validateFields,
  ],
  getStudentById
);

router.put(
  "/:id/courses",
  [
    check("id", "isn't a valid id").isMongoId(),
    check("courses.*", "course id must be a valid MongoDB ID").isMongoId(),
    validateFields,
  ],
  putStudents
);

router.post(
  "/register",
  [
    check("name", "name cannot be empty").not().isEmpty(),
    check("email", "email cannot be empty").not().isEmpty(),
    check("password", "password cannot be empty").not().isEmpty(),
    validateFields,
  ],
  register
);
router.post(
  "/login",
  [
    check("email", "email cannot be empty").not().isEmpty(),
    check("password", "password cannot be empty").not().isEmpty(),
    validateFields,
  ],
  login
);

router.delete(
  "/:id",
  [
    check("id", "isn't a valid id").isMongoId(),
    check("id").custom(existsStudentById),
    validateFields,
  ],
  deleteStudentProfile
);

module.exports = router;
