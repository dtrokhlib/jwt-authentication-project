import express from 'express';
import { stat } from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { User } from './model/User.js';
import { isAuthorized } from './middleware/isAuthorized.js';

const __dirname = path.resolve();
const app = express();

mongoose.connect('mongodb://localhost:27017/jwt-auth-project');

app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

app.post('/api/change-password', isAuthorized, async (req, res) => {
  try {
    const user = req.user;
    const { newPassword } = req.body;

    if (!newPassword || typeof newPassword != 'string') {
      throw { status: 404, message: 'Password was not provided' };
    }

    user.password = newPassword;
    await user.save();

    res.send(user);
  } catch (err) {
    res.status(err.status || 500).send({ message: err.message || err });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (
      !username ||
      typeof username != 'string' ||
      !password ||
      typeof password != 'string'
    ) {
      throw { status: 404, message: 'Password or Username was not provided' };
    }

    const user = await User.findOne({ username });

    if (user) {
      throw { status: 404, message: 'User with this usename is already taken' };
    }

    const newUser = new User({ username, password });
    await newUser.save();

    res.send(newUser);
  } catch (err) {
    res.status(err.status || 500).send({ message: err.message || err });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (
      !username ||
      typeof username != 'string' ||
      !password ||
      typeof password != 'string'
    ) {
      throw {
        status: 404,
        message: 'Password or Username was not provided',
      };
    }

    const user = await User.findOne({ username });

    if (!user) {
      throw {
        status: 404,
        message: 'Invalid credentials',
      };
    }

    const passwordValid = await user.passwordCompare(password);

    if (!passwordValid) {
      throw {
        status: 404,
        message: 'Invalid credentials',
      };
    }

    const token = await user.tokenGenerate();

    res.send({ token });
  } catch (err) {
    res.status(err.status || 500).send({ message: err.message || err });
  }
});

app.listen(3000, () => console.log('Server is up'));
