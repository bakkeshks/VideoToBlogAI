const BlogPost = require("../models/blogPost");

// get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const blogPosts = await BlogPost.find({ userId });
    res.json(blogPosts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blog posts" });
  }
};

// get a single post by id
exports.getPostById = async (req, res) => {
  try {
    const userId = req.user.id;
    const blogPost = await BlogPost.findOne({ _id: req.params.id, userId });
    if (!blogPost) {
      return res.status(404).json({ error: "Blog post not found" });
    }
    res.json(blogPost);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blog post" });
  }
};

// delete a single post by id
exports.deletePostById = async (req, res) => {
  try {
    const userId = req.user.id;
    const blogPost = await BlogPost.findOneAndDelete({
      _id: req.params.id,
      userId,
    });
    if (!blogPost) {
      return res.status(404).json({ error: "Blog post not found" });
    }
    res.json({ message: "Blog post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete blog post" });
  }
};

// update a single post by id
exports.updatePostById = async (req, res) => {
  try {
    const userId = req.user.id;
    const blogPost = await BlogPost.findOneAndUpdate(
      { _id: req.params.id, userId },
      req.body,
      { new: true }
    );
    if (!blogPost) {
      return res.status(404).json({ error: "Blog post not found" });
    }
    res.json({ message: "Blog post updated" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update blog post" });
  }
};
