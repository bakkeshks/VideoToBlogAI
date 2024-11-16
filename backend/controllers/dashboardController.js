const User = require("../models/User");
const BlogPost = require("../models/blogPost");

const getDashboardData = async (req, res) => {
  const userId = req.user.id;

  try {
    // Find user details
    const user = await User.findById(userId, "username secondsRemaining");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find generated blog posts for the user
    const generatedBlogPosts = await BlogPost.find(
      { userId },
      "_id text status createdAt"
    );

    // Map the blog posts to the desired format
    const formattedBlogPosts = generatedBlogPosts.map((blogPost) => ({
      id: blogPost._id,
      text: blogPost.text,
      status: blogPost.status,
      createdAt: blogPost.createdAt,
    }));

    res.json({
      userName: user.username,
      secondsRemaining: user.secondsRemaining,
      generatedBlogPosts: formattedBlogPosts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getDashboardData };
