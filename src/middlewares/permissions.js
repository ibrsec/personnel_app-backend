"use strict";

//Permission control middleware
module.exports = {
  isLogin: (req, res, next) => {
    if (req.user && req.user?.isActive) {
      next();
    } else {
      res.errorStatusCode = 403;
      throw new Error("Forbidden - Do not permission - you must login!");
    }
  },
  isAdmin: (req, res, next) => {
    if (req.user && req.user?.isActive && req?.user?.isAdmin) {
      next();
    } else {
      res.errorStatusCode = 403;
      throw new Error("Forbidden - You must login and to be admin!");
    }
  },
  isAdminOrLead: (req, res, next) => {
    const departmentId = req.params?.id;
    console.log("req.user.isLead", req.user.isLead);
    console.log("req.user?.departmentId", req.user?.departmentId);
    console.log("departmentId", departmentId);
    if (
      req.user &&
      req.user.isActive &&
      (req.user?.isAdmin ||
        (req.user.isLead && req.user?.departmentId == departmentId))
    ) {
      next();
    } else {
      res.errorStatusCode = 403;
      throw new Error(
        "NoPermission: You must login and to be Admin or Department Lead (Own)."
      );
    }
  },
};
