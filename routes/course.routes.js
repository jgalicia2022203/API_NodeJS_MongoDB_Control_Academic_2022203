const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields } = require("../middlewares/validate-fields");

const {
  coursesPost,
  putCourses,
  courseGet,
  coursesDelete,
  getCoursesById,
} = require("../controllers/course.controller");

const { existsCourseById } = require("../helpers/db-validators");

const router = Router();

router.get("/", courseGet);

router.get(
  "/:id",
  [
    check("id", "isn't a valid id").isMongoId(),
    check("id").custom(existsCourseById),
    validateFields,
  ],
  getCoursesById
);

router.put(
  "/:id",
  [check("id", "isn't a valid id").isMongoId(), validateFields],
  putCourses
);

router.post(
  "/",
  [
    check("name", "name cannot be empty").not().isEmpty(),
    check("description", "description cannot be empty").not().isEmpty(),
    check("teacher", "teacher cannot be empty").not().isEmpty(),
    check("students", "students cannot be empty").not().isEmpty(),
    validateFields,
  ],
  coursesPost
);

router.delete(
  "/:id",
  [
    check("id", "isn't a valid id").isMongoId(),
    check("id").custom(existsCourseById),
    validateFields,
  ],
  coursesDelete
);

module.exports = router;
