const express = require("express");
const blogController = require("../controllers/blogController");

const router = express.Router();

router.get("/", blogController.getAllPosts);
router.get("/:id", blogController.getPostById);
router.delete("/:id", blogController.deletePostById);
router.patch("/:id", blogController.updatePostById);

module.exports = router;
