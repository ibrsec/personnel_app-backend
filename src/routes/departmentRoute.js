"use strict";

const { department } = require("../controllers/departmentController");
const {
  isLogin,
  isAdmin,
  isAdminOrLead,
} = require("../middlewares/permissions");

const router = require("express").Router();

router
  .route("/")
  .get(isLogin, department.list)
  .post(isAdmin, department.create);

router
  .route("/:id")
  .get(isLogin, department.read)
  .put(isAdmin, department.update)
  .delete(isAdmin, department.delete);

router
  .route("/:id/personnels")
  .get(isAdminOrLead, department.getPersonnelsOfDepartment);

module.exports = router;
