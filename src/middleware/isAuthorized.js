import { User } from '../model/User.js';

export const isAuthorized = async (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(401).send({ message: 'Not Authorized' });
  }

  const token = req.headers.authorization.split(' ')[1];

  const verifyToken = await User.tokenVerify(token);
  if (!verifyToken) {
    res.status(401).send({ message: 'Not Authorized' });
  }

  const user = await User.findById(verifyToken.id);
  if (!user) {
    return res.status(401).send({ message: 'Not Authorized' });
  }

  req.user = user;

  next();
};
