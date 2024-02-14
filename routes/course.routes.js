const { Router } = require("express");
const { check } = require("express-validator");
const { protect } = require("../middlewares/authMiddleware");
const { validateFields } = require("../middlewares/validate-fields");
const { existsCourseById } = require("../helpers/db-validators");
const {
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseDetails,
  getAllCourses,
} = require("../controllers/course.controller");
const router = Router();

router.get("/", protect, getAllCourses);

router.get(
  "/:id",
  [
    check("id", "isn't a valid id").isMongoId(),
    check("id").custom(existsCourseById),
    validateFields,
  ],
  protect,
  getCourseDetails
);

router.put(
  "/:id",
  [check("id", "isn't a valid id").isMongoId(), validateFields],
  protect,
  updateCourse
);

router.post(
  "/",
  [
    check("name", "name cannot be empty").not().isEmpty(),
    check("description", "description cannot be empty").not().isEmpty(),
    check("students", "students cannot be empty").not().isEmpty(),
    validateFields,
  ],
  protect,
  createCourse
);

router.delete(
  "/:id",
  [
    check("id", "isn't a valid id").isMongoId(),
    check("id").custom(existsCourseById),
    validateFields,
  ],
  protect,
  deleteCourse
);

module.exports = router;
