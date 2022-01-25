// Setup @/ aliases for modules
import 'module-alias/register'
// Config dotenv
import * as dotenv from 'dotenv'
dotenv.config({ path: `${__dirname}/../.env` })
// Dependencies
import { bot } from '@/helpers/bot'
import { checkTime } from '@/middlewares/checkTime'
import { checkAdmin } from '@/middlewares/checkAdmin'
import { checkReply } from '@/middlewares/checkReply'
import { chats } from '@/helpers/chats'
import { checkLegitimateChat } from '@/middlewares/checkLegitimateChat'

// Check time
bot.use(checkTime)
// Check if private messages
bot.use((ctx, next) => {
  if (ctx.message?.text === '/id' || ctx.channelPost?.text === '/id') {
    return ctx.reply(`${ctx.chat.id}`, {
      disable_notification: true,
    })
  }
  if (ctx.chat?.type === 'private') {
    return ctx.reply(
      'Nu are rost să-mi scrii, nu vei fi interzis aici, iar mesajele tale nu merg nicăieri. Într-un vid, nimeni nu te va auzi țipând.'
    )
  }
  return next()
})
// Ban command
bot.command(
  'banEverywhere',
  checkLegitimateChat,
  checkReply,
  checkAdmin,
  async (ctx) => {
    for (const chat of chats) {
      console.log(`Banning ${ctx.message.reply_to_message.from.id} in ${chat}`)
      try {
        await ctx.telegram.kickChatMember(
          chat,
          ctx.message.reply_to_message.from.id
        )
      } catch (err) {
        ctx.reply(`Ошибка: ${err.message || err}`)
      }
    }
    await ctx.replyWithHTML(
      `<a href="tg://user?id=${ctx.message.reply_to_message.from.id}">Utilizator</a> interzis pe toate comunitățile`
    )
    await ctx.deleteMessage()
  }
)
// Catch errors
bot.catch(console.error)
// Start bot
bot.launch().then(() => {
  console.info('Bot is up and running')
})
