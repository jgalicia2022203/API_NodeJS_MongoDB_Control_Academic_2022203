const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields } = require("../middlewares/validate-fields");

const {
  studentsPost,
  putStudents,
  studentsDelete,
  studentsGet,
  getStudentById,
} = require("../controllers/student.controller");

const { existsStudentById } = require("../helpers/db-validators");

const router = Router();

router.get("/", studentsGet);

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
  "/:id",
  [check("id", "isn't a valid id").isMongoId(), validateFields],
  putStudents
);

router.post(
  "/",
  [
    check("name", "name cannot be empty").not().isEmpty(),
    check("email", "email cannot be empty").not().isEmpty(),
    check("password", "password cannot be empty").not().isEmpty(),
    check("role", "role cannot be empty").not().isEmpty(),
    check("courses", "courses cannot be empty").not().isEmpty(),
    validateFields,
  ],
  studentsPost
);

router.delete(
  "/:id",
  [
    check("id", "isn't a valid id").isMongoId(),
    check("id").custom(existsStudentById),
    validateFields,
  ],
  studentsDelete
);

module.exports = router;
