import { prisma } from '../config/db.js';
import bcrypt from 'bcryptjs';

const register = async (req, res) => {
  // const body = req.body;
  // res.json(body);
  const { name, email, password } = req.body;

  // Check if user already exists in the database (pseudo-code)

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Hash the password before storing (pseudo-code)
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log(hashedPassword);

  // Create a new user (pseudo-code)
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  res.status(201).json({
    status: 'success',
    data: {
      user: {
        id: newUser.id,
        name: name,
        email: email,
      },
    },
  });
};

export { register };
