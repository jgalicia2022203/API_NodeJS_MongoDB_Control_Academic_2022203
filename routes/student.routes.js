const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validate-fields");
const { validateJWT } = require("../middlewares/validate-jwt");
const { isAdminRole } = require("../middlewares/validate-roles");
const { existsEmail, existsCourseById } = require("../helpers/db-validators");
const {
  studentsGet,
  getStudentById,
  register,
  assignCourses,
  getStudentCourses,
  updateStudentProfile,
  deleteStudentProfile,
} = require("../controllers/student.controller");
const router = Router();

router.get("/", validateJWT, isAdminRole, studentsGet);

router.get("/profile", validateJWT, getStudentById);

router.get("/courses", validateJWT, getStudentCourses);

router.put(
  "/courses",
  validateJWT,
  [
    check("courses", "courses cannot be empty").not().isEmpty(),
    check("courses").custom(existsCourseById),
    validateFields,
  ],
  assignCourses
);

router.put(
  "/profile",
  validateJWT,
  [check("name"), check("email"), check("password"), validateFields],
  updateStudentProfile
);

router.post(
  "/register",
  [
    check("name", "name cannot be empty").not().isEmpty(),
    check("email", "email cannot be empty").not().isEmpty(),
    check("email").custom(existsEmail),
    check("password", "password cannot be empty").not().isEmpty(),
    validateFields,
  ],
  register
);

router.delete("/profile", validateJWT, deleteStudentProfile);

module.exports = router;
