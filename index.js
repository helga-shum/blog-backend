import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import { registerValidator, loginValidator, postCreateValidation } from './validation.js';
import cors from 'cors';
import checkAuth from './utils/checkAuth.js';
import { register, login, getMe } from './controllers/UserController.js';
import {
  create,
  getAll,
  getOne,
  remove,
  update,
  getLastTags,
  getNewPosts,
  getPopularPosts,
  getTagPosts,
  createComment,
  getAllComments,
  getPostComments,
} from './controllers/PostController.js';
import handleValidationErrors from './utils/handleValidationErrors.js';
mongoose
  .connect(
    'mongodb+srv://helga_shum:wwwww@cluster0.jyvcw.mongodb.net/blog?retryWrites=true&w=majority',
  )
  .then(() => console.log('server OK'))
  .catch((err) => console.log('error', err));
const app = express();
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.post('/auth/login', loginValidator, handleValidationErrors, login);
app.post('/auth/register', registerValidator, handleValidationErrors, register);
app.get('/auth/me', checkAuth, getMe);
app.post('/posts', checkAuth, postCreateValidation, create);
app.post('/comment', checkAuth, createComment);
app.get('/posts/tags', getLastTags);
app.get('/posts/new', getNewPosts);
app.get('/posts/popular', getPopularPosts);
app.get('/tags', getLastTags);
app.get('/tag/:name', getTagPosts);
app.get('/posts', getAll);
app.get('/comments', getAllComments);
app.get('/posts/:id', getOne);
app.get('/posts/:id', getPostComments);
app.delete('/posts/:id', checkAuth, remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, update);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('serverok');
});
