require('dotenv').config();

async function queryAuditLogs(client){
    let channel = client.channels.cache.get(process.env.LOGS_CHANNEL);
    const usersToIgnore = process.env.IGNORE_USERS_ON_MOD_MOVE?.split(',').map(user => user.trim());
    
    if (channel != null){
        const auditLogs = await channel.guild.fetchAuditLogs({type: 26,limit: 10});
        
        if (auditLogs != null){
            for (let [auditId, GuildAuditLogsEntry] of auditLogs.entries){
                if (usersToIgnore?.includes(GuildAuditLogsEntry.executorId)){
                    return;
                }

                if (GuildAuditLogsEntry?.createdAt){
                    eventDate = new Date(GuildAuditLogsEntry.createdAt);
                    currentTime = new Date();

                    const difference = currentTime - eventDate;
                    let moveThreshold = 300000;

                    if (difference >= moveThreshold){
                        return;
                    }
                    else {
                        if (global.globalChannelIdLog[GuildAuditLogsEntry.extra.channel.id]){
                            if (GuildAuditLogsEntry.extra.count > global.globalChannelIdLog[GuildAuditLogsEntry.extra.channel.id].count){
                                global.globalChannelIdLog[GuildAuditLogsEntry.extra.channel.id].count = GuildAuditLogsEntry.extra.count
                            }
                        }
                        else {
                            global.globalChannelIdLog[GuildAuditLogsEntry.extra.channel.id] = {
                                count: GuildAuditLogsEntry.extra.count
                            };
                        }
                        console.log(global.globalChannelIdLog);
                    }
                }
            }
        }
    }
}

module.exports = queryAuditLogs;