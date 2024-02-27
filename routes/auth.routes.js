const { Router } = require("express");
const { check } = require("express-validator");

const { login } = require("../controllers/auth.controller");

const { validateFields } = require("../middlewares/validate-fields");

const router = Router();

router.post(
  "/login",
  [
    check("email", "this isn't a valid email").isEmail(),
    check("password", "the password is obligatory").not().isEmpty(),
    validateFields,
  ],
  login
);

module.exports = router;
