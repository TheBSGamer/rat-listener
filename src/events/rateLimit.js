const {Events} = require('discord.js');

module.exports = {
    name: 'rateLimit',
    async execute(client,...args) {
        const rateLimitData = args[0];
        console.log(`ERROR: Rate limit exceeded. Resuming in ${rateLimitData.timeout} ms`);
    },
}