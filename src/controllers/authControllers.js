import { prisma } from '../config/db.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/generatetoken.js';

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

  // generate JWT token (pseudo-code)
  const token = generateToken(user.id);

  res.status(201).json({
    status: 'success',
    data: {
      user: {
        id: newUser.id,
        name: name,
        email: email,
      },
      token,
    },
  });
};

// Login controller can be added similarly
const login = async (req, res) => {
  // Implementation for login
  const { email, password } = req.body;

  // Check if user exists in the database (pseudo-code)
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // verify password (pseudo-code)
  const isPasswordIsValid = await bcrypt.compare(password, user.password);
  if (!isPasswordIsValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // generate JWT token (pseudo-code)
  const token = generateToken(user.id);

  res.status(201).json({
    status: 'success',
    data: {
      user: {
        id: user.id,
        email: email,
      },
      token,
    },
  });
};

export { register, login };
