const {Events} = require('discord.js');
const queryAuditLogs = require('../functions/queryAuditLogs');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        await queryAuditLogs(client);
        console.log(`Rat Listener is listening...`);
    },
}