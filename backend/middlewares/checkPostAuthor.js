// middlewares/checkPostAuthor.js
const Post = require("../models/Post");

async function checkPostAuthor(req, res, next) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post no encontrado" });

    const userId = req.user?._id || req.body.userId;

    if (!userId || post.author.toString() !== userId.toString()) {
      return res.status(403).json({ message: "No tienes permiso para modificar este post" });
    }

    next();
  } catch (err) {
    console.error("Error en checkPostAuthor:", err);
    res.status(500).json({ message: "Error interno" });
  }
}

module.exports = checkPostAuthor;