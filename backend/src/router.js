const express = require("express");

const { ItemController } = require("./controllers");

const router = express.Router();

router.get("/items", ItemController.browse);
router.get("/items/:id", ItemController.read);
router.put("/items/:id", ItemController.edit);
router.post("/items", ItemController.add);
router.delete("/items/:id", ItemController.delete);

// In the router.js file, we need to add a route for sending our email :
router.post("/sendEmail", ItemController.sendMail);

module.exports = router;
