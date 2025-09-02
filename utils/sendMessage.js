const axios = require("axios")

/**
 * chatId: qaysi chatga yuborish
 * text: matn (HTML bo'lishi mumkin)
 * useHtml: true bo'lsa parse_mode=HTML; false bo'lsa parse_mode umuman berilmaydi
 */
const sendMessage = async (chatId, text, useHtml = true) => {
  try {
    if (!process.env.BOT_TOKEN) {
      throw new Error("BOT_TOKEN .env faylda topilmadi ❌")
    }

    const payload = {
      chat_id: chatId,
      text,
      disable_web_page_preview: true, // keraksiz preview'ni o'chiradi
    }

    if (useHtml) payload.parse_mode = "HTML"

    const res = await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, payload, {
      headers: { "Content-Type": "application/json" },
    })

    return res.data
  } catch (err) {
    console.error("❌ Error sending message:", err.response?.data || err.message)
    throw err
  }
}

const sendInviteMessage = async (chatId, inviteLink, customMessage = null) => {
  try {
    const defaultMessage = `
🎉 <b>Maxsus taklifnoma!</b>

Quyidagi link orqali guruhga qo'shiling:
${inviteLink}

⚠️ <i>Diqqat: Bu link 24 soat davomida amal qiladi.</i>
    `.trim()

    const message = customMessage || defaultMessage

    return await sendMessage(chatId, message, true)
  } catch (err) {
    console.error("❌ Error sending invite message:", err.response?.data || err.message)
    throw err
  }
}

module.exports = { sendMessage, sendInviteMessage }
