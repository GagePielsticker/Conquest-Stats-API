const express = require('express')
const router = express.Router()

module.exports = client => {
  /**
   * Takes guilds and user inside request body and saves the data to mongodb
   * @param {Integer} guildCount discord bot guild count
   * @param {Integer} userCount discord bots user count
   * @returns {Boolean || error} success or error
   */
  router.post('/post/bot', (req, res) => {
    // Check to make sure data was entered
    if (!req.body.guildCount) return res.json({ error: 'Missing guild count' })
    if (!req.body.userCount) return res.json({ error: 'Missing user count' })

    // send to library
    client.stats.postBotStats(req.body.guildCount, req.body.userCount)
      .then(() => res.json({ success: true }))
      .catch(e => res.json({ error: e }))
  })

  return router
}
