const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validate-fields");
const { existsProfessorById } = require("../helpers/db-validators");
const {
  putProfessors,
  professorsGet,
  getProfessorById,
  professorsDelete,
  registerProfessor,
  loginProfessor,
} = require("../controllers/professor.controller");
const router = Router();

router.get("/", professorsGet);

router.get(
  "/:id",
  [
    check("id", "isn't a valid id").isMongoId(),
    check("id").custom(existsProfessorById),
    validateFields,
  ],
  getProfessorById
);

router.put(
  "/:id",
  [
    check("id", "isn't a valid id").isMongoId(),
    check("courses.*", "course id must be a valid MongoDB ID").isMongoId(),
    validateFields,
  ],
  putProfessors
);

router.post(
  "/register",
  [
    check("name", "name cannot be empty").not().isEmpty(),
    check("email", "email cannot be empty").not().isEmpty(),
    check("password", "password cannot be empty").not().isEmpty(),
    validateFields,
  ],
  registerProfessor
);
router.post(
  "/login",
  [
    check("email", "email cannot be empty").not().isEmpty(),
    check("password", "password cannot be empty").not().isEmpty(),
  ],
  loginProfessor
);

router.delete(
  "/:id",
  [
    check("id", "isn't a valid id").isMongoId(),
    check("id").custom(existsProfessorById),
    validateFields,
  ],
  professorsDelete
);

module.exports = router;
