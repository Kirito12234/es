const asyncHandler = require("../utils/asyncHandler");
const generateToken = require("../utils/generateToken");
const User = require("../models/User");

const userResponse = (user) => ({
  _id: user._id,
  id: user._id,
  name: user.name,
  firstName: user.name?.split(" ")?.[0] || "",
  lastName: user.name?.split(" ")?.slice(1).join(" ") || "",
  email: user.email,
  phone: user.phone,
  avatar: user.avatar,
  role: user.role === "customer" ? "buyer" : user.role,
  address: user.address,
  streetAddress: user.address?.street || "",
  city: user.address?.city || "",
  state: user.address?.state || "",
  postalCode: user.address?.postalCode || "",
  country: user.address?.country || ""
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role = "buyer" } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email and password are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  if (!["buyer", "seller"].includes(role)) {
    res.status(400);
    throw new Error("Role must be buyer or seller");
  }

  const user = await User.create({ name, email, password, phone, role });

  res.status(201).json({
    user: userResponse(user),
    token: generateToken(user._id)
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({
    user: userResponse(user),
    token: generateToken(user._id)
  });
});

const getProfile = asyncHandler(async (req, res) => {
  res.json(userResponse(req.user));
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { name, email, phone, avatar, address, becomeSeller, password } = req.body;

  if (name !== undefined) user.name = name;
  if (email !== undefined) {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail, _id: { $ne: user._id } });
    if (existingUser) {
      res.status(400);
      throw new Error("An account with this email already exists");
    }
    user.email = normalizedEmail;
  }
  if (phone !== undefined) user.phone = phone;
  if (avatar !== undefined) user.avatar = avatar;
  if (address !== undefined) user.address = { ...user.address.toObject(), ...address };
  if (password) user.password = password;
  if (becomeSeller === true || becomeSeller === "true") user.role = "seller";

  const updatedUser = await user.save();

  res.json({
    user: userResponse(updatedUser),
    token: generateToken(updatedUser._id)
  });
});

module.exports = { registerUser, loginUser, getProfile, updateProfile };
