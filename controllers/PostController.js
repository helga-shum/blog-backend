import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
export const getAll = async (req, res) => {
  try {
    const posts = await Post.find().populate('user').exec();
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Can not get posts',
    });
  }
};
export const create = async (req, res) => {
  try {
    const doc = new Post({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(','),
      user: req.userId,
    });
    const post = await doc.save();
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Post is nit created',
    });
  }
};
export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    Post.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Post is not returned',
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Post is not found',
          });
        }
        res.json(doc);
      },
    ).populate('user');
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Post is nit created',
    });
  }
};
export const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    Post.findOneAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Post is not removed',
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Post is not found',
          });
        }
        res.json({
          success: true,
        });
      },
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Post is not created',
    });
  }
};
export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    await Post.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags.split(','),
        user: req.userId,
      },
    );
    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Post is not updated',
    });
  }
};
export const getLastTags = async (req, res) => {
  try {
    const posts = await Post.find().limit(5).exec();
    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);
    res.json(tags);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Can not get posts',
    });
  }
};
export const getNewPosts = async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Can not get new posts',
    });
  }
};
export const getPopularPosts = async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ viewsCount: -1 });
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Can not get popular posts',
    });
  }
};
export const getTagPosts = async (req, res) => {
  try {
    const postTag = req.params.name;
    const posts = await Post.find({ tags: postTag });
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Can not get tag posts',
    });
  }
};
export const createComment = async (req, res) => {
  try {
    const com = new Comment({
      text: req.body.text,
      postId: req.body.postId,
      user: req.userId,
    });
    const comment = await com.save();
    res.json(comment);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Comment is not created',
    });
  }
};
export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find().populate('user').exec();
    res.json(comments);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Can not get comments',
    });
  }
};
export const getPostComments = async (req, res) => {
  try {
    const IdPost = req.params.postId;
    const comments = await Comment.find({ postId: IdPost });
    res.json(comments);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Can not get post comments',
    });
  }
};
