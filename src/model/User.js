import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 't1klaIT25Dca';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre('save', async function () {
  const user = this;

  if (user.isModified('password')) {
    let password = await bcryptjs.hash(user.password, 10);
    user.password = password;
  }
});

userSchema.methods.passwordCompare = async function (password) {
  const user = this;
  const valid = await bcryptjs.compare(password, user.password);
  return valid;
};

userSchema.methods.tokenGenerate = async function () {
  const user = this;

  const token = await jwt.sign(
    { id: user._id, username: user.username },
    JWT_SECRET
  );

  return token;
};

userSchema.statics.tokenVerify = async (token) => {
  try {
    const valid = await jwt.verify(token, JWT_SECRET);
    return valid;
  } catch (err) {
    return false;
  }
};

export const User = mongoose.model('User', userSchema);
