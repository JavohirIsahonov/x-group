const axios = require("axios");

const createOneTimeInviteLink = async () => {
  try {
    if (!process.env.BOT_TOKEN || !process.env.CHAT_ID) {
      throw new Error("BOT_TOKEN yoki CHAT_ID .env faylda topilmadi ❌");
    }

    const res = await axios.post(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/createChatInviteLink`,
      {
        chat_id: process.env.CHAT_ID,
        member_limit: 1,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    if (!res.data.ok) {
      throw new Error("Telegram API error: " + JSON.stringify(res.data));
    }

    return res.data.result.invite_link;
  } catch (err) {
    console.error("❌ Error creating invite link:", err.response?.data || err.message);
    throw err;
  }
};

module.exports = createOneTimeInviteLink;
