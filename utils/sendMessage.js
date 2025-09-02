const axios = require("axios");

const sendMessage = async (chatId, text, parseMode = "Markdown") => {
  try {
    if (!process.env.BOT_TOKEN) {
      throw new Error("BOT_TOKEN .env faylda topilmadi ❌");
    }

    const res = await axios.post(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        chat_id: chatId,
        text,
        parse_mode: parseMode,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    return res.data;
  } catch (err) {
    console.error("❌ Error sending message:", err.message);
    throw err;
  }
};

module.exports = sendMessage;
