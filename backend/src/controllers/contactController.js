const asyncHandler = require("../utils/asyncHandler");
const Contact = require("../models/Contact");

const createContactMessage = asyncHandler(async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    res.status(400);
    throw new Error("Name, email and message are required");
  }

  const contact = await Contact.create({ name, email, phone, message });
  res.status(201).json({ message: "Message submitted successfully", contact });
});

module.exports = { createContactMessage };
