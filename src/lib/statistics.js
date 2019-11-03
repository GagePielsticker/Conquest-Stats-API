/* eslint-disable prefer-promise-reject-errors */

module.exports = client => {
  /* Get dependencies */
  const moment = require('moment')
  const https = require('https')
  const { performance } = require('perf_hooks')

  /** @namespace */
  client.stats = {

    /**
     * Saves current guildCount to database at current time
     * @param {Integer} guildCount
     * @param {Integer} userCount
     * @param {Integer} shardCount
     */
    postBotStats: async (guildCount, userCount, shardCount) => {
      return client.database.collection('statistics').insertOne({
        time: moment().unix(),
        guilds: guildCount,
        users: userCount,
        shards: shardCount
      })
    },

    /**
     * Saves latency statistics to database at current time
     * @param {Integer} webLatency
     * @param {Integer} gameAPILatency
     */
    postLatencyStats: async () => {
      let webLatency = null
      const webStart = performance.now()
      https.get(client.settings.latency.web, res => {
        webLatency = performance.now() - webStart
        // TODO: a different name for this collection maybe?
        return client.database.collection('statistics').insertOne({
          time: moment().unix(),
          latencies: {
            web: webLatency
          }
        })
      })
    },

    /**
     * Fetches Statistics from database
     * @returns {Promise<object>}
     */
    getBotStats: async () => {
      return client.database.collection('statistics').find().sort({ time: -1 })[0]
    }
  }
}
