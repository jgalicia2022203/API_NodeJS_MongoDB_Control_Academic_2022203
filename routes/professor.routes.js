const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validate-fields");
const { validateJWT } = require("../middlewares/validate-jwt");
const { isAdminRole, isTeacherRole } = require("../middlewares/validate-roles");
const { existsEmail } = require("../helpers/db-validators");
const {
  professorsGet,
  getProfessorById,
  registerProfessor,
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
} = require("../controllers/professor.controller");
const router = Router();

router.get("/", validateJWT, isAdminRole, professorsGet);

router.get("/courses", validateJWT, isTeacherRole, getAllCourses);

router.get("/profile", validateJWT, isTeacherRole, getProfessorById);

router.put("/courses", validateJWT, isTeacherRole, updateCourse);

router.post(
  "/courses",
  validateJWT,
  isTeacherRole,
  [
    check("name", "name cannot be empty").not().isEmpty(),
    check("description", "description cannot be empty").not().isEmpty(),
    validateFields,
  ],
  createCourse
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
  registerProfessor
);

router.delete("/courses", validateJWT, isTeacherRole, deleteCourse);

module.exports = router;
