const User = require("../models/user.model");
const createOneTimeInviteLink = require("../utils/createOneTimeInviteLink");
const sendMessage = require("../utils/sendMessage");

// ✅ Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get user by ID
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Create new user
const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Update user.checked (and send invite link)
const updateUserChecked = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.checked) {
      user.checked = true;
      await user.save();

      // Create one-time invite link
      const inviteLink = await createOneTimeInviteLink();

      // Message by language
      const messages = {
        uz: `✅ Siz tasdiqlandingiz!\nMana guruh uchun *bir martalik link*: ${inviteLink}`,
        ru: `✅ Вы подтверждены!\nВот *одноразовая ссылка* для группы: ${inviteLink}`,
      };

      // Send Telegram message
      await sendMessage(user.telegram_id, messages[user.language] || messages["uz"]);

      return res.json({
        message: "User verified and link sent to Telegram",
        user,
      });
    } else {
      return res.json({ message: "User already verified", user });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUserChecked,
  deleteUser,
};
