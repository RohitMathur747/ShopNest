const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });
    if (user) {
      // Generate a mock OTP
      const otp = Math.floor(100000 + Math.random() * 900000);

      // Send Welcome / OTP Email
      const message = `
        <h2>Welcome to ShopNest, ${name}!</h2>
        <p>Thank you for registering on our platform.</p>
        <p>Your one-time verification/discount OTP is: <strong>${otp}</strong></p>
      `;

      await sendEmail({
        email: user.email,
        subject: "Welcome to ShopNest - Your OTP",
        message,
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// logout user (stateless JWT)
const logoutUser = async (req, res) => {
  return res.status(200).json({ message: "Logged out" });
};

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || "dev_jwt_secret";
  return jwt.sign({ userId }, secret, { expiresIn: "7d" });
};

// Placeholder email sender to keep API working even if email setup isn't configured yet.
const sendEmail = async ({ email, subject, message }) => {
  // In production, replace with nodemailer + real provider.
  if (!email) return;
  return { email, subject, message };
};

module.exports = { registerUser, loginUser, logoutUser };
