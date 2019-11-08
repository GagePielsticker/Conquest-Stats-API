/* eslint-disable prefer-promise-reject-errors */

module.exports = client => {
  /* Get dependencies */
  const moment = require('moment')
  const https = require('https')
  const { performance } = require('perf_hooks')

  /** @namespace */
  client.stats = {

    /**
     * Saves bot statistics to database at current time
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
     */
    postLatencyStats: async () => {
      let webLatency = null
      const webStart = performance.now()
      https.get(client.settings.latency.web, res => {
        webLatency = performance.now() - webStart
        return client.database.collection('latencyStatistics').insertOne({
          time: moment().unix(),
          latencies: {
            web: webLatency
          }
        })
      })
    },

    /**
     * Fetches bot statistics from database
     * @returns {Promise<object>}
     */
    getBotStats: async () => {
      return client.database.collection('botStatistics').find().sort({ time: -1 })[0]
    },

    /**
     * Fetches latency statistics from database
     * @returns {Promise<object>}
     */
    getLatencyStats: async () => {
      return client.database.collection('latencyStatistics').find().sort({ time: -1 })[0]
    }
  }
}
