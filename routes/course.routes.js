const { Router } = require("express");
const { check } = require("express-validator");
const { validateJWT } = require("../middlewares/validate-jwt");
const { validateFields } = require("../middlewares/validate-fields");
const { isTeacherRole } = require("../middlewares/validate-roles");
const { existsCourseById } = require("../helpers/db-validators");
const {
  getCourseDetails,
} = require("../controllers/course.controller");
const router = Router();

router.get(
  "/:id",
  [
    check("id", "isn't a valid id").isMongoId(),
    check("id").custom(existsCourseById),
    validateFields,
  ],
  validateJWT,
  isTeacherRole,
  getCourseDetails
);

module.exports = router;
