const { Router } = require("express");
const authMiddleware = require('../middleware/authMiddleware');


module.exports = function (Controller, options = {}) {
  const router = new Router();

  router.get("/", authMiddleware,Controller.getAll);
  router.post("/", authMiddleware,Controller.create);

  router.get("/:id",authMiddleware, Controller.getOne);
  router.put("/:id",authMiddleware, Controller.replace);
  router.patch("/:id",authMiddleware, Controller.update);
  router.delete("/:id",authMiddleware, Controller.delete);

  return router;
};
