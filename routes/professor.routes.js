const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields } = require("../middlewares/validate-fields");

const {
  professorsPost,
  putProfessors,
  professorsDelete,
  professorsGet,
  getProfessorById,
} = require("../controllers/professor.controller");

const { existsProfessorById } = require("../helpers/db-validators");

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
  [check("id", "isn't a valid id").isMongoId(), validateFields],
  putProfessors
);

router.post(
  "/",
  [
    check("name", "name cannot be empty").not().isEmpty(),
    check("email", "email cannot be empty").not().isEmpty(),
    check("password", "password cannot be empty").not().isEmpty(),
    check("role", "role cannot be empty").not().isEmpty(),
    validateFields,
  ],
  professorsPost
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
