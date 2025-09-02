const axios = require("axios")

const createOneTimeInviteLink = async (options = {}) => {
  try {
    if (!process.env.BOT_TOKEN || !process.env.CHAT_ID) {
      throw new Error("BOT_TOKEN yoki CHAT_ID .env faylda topilmadi ❌")
    }

    const {
      memberLimit = null, // null = cheksiz, 1 = bir marta
      expireHours = 24, // 24 soat davomida amal qiladi
      createsJoinRequest = false,
    } = options

    const expireDate = Math.floor(Date.now() / 1000) + expireHours * 60 * 60

    const payload = {
      chat_id: process.env.CHAT_ID,
      expire_date: expireDate,
      creates_join_request: createsJoinRequest,
    }

    if (memberLimit !== null) {
      payload.member_limit = memberLimit
    }

    const res = await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/createChatInviteLink`, payload, {
      headers: { "Content-Type": "application/json" },
    })

    if (!res.data.ok) {
      throw new Error("Telegram API error: " + JSON.stringify(res.data))
    }

    return {
      invite_link: res.data.result.invite_link,
      expire_date: res.data.result.expire_date,
      member_limit: res.data.result.member_limit,
      creates_join_request: res.data.result.creates_join_request,
    }
  } catch (err) {
    console.error("❌ Error creating invite link:", err.response?.data || err.message)
    throw err
  }
}

const revokeInviteLink = async (inviteLink) => {
  try {
    if (!process.env.BOT_TOKEN) {
      throw new Error("BOT_TOKEN .env faylda topilmadi ❌")
    }

    const res = await axios.post(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/revokeChatInviteLink`,
      {
        chat_id: process.env.CHAT_ID,
        invite_link: inviteLink,
      },
      { headers: { "Content-Type": "application/json" } },
    )

    if (!res.data.ok) {
      throw new Error("Telegram API error: " + JSON.stringify(res.data))
    }

    return res.data.result
  } catch (err) {
    console.error("❌ Error revoking invite link:", err.response?.data || err.message)
    throw err
  }
}

module.exports = { createOneTimeInviteLink, revokeInviteLink }
