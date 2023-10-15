require('dotenv').config();

async function checkForExternalMove(client,newChannelIdToCheck){
    let channel = client.channels.cache.get(process.env.LOGS_CHANNEL);
    const usersToIgnore = process.env.IGNORE_USERS_ON_MOD_MOVE?.split(',').map(user => user.trim());
    let movedByThisId = null;
    
    if (channel != null){
        const auditLogs = await channel.guild.fetchAuditLogs({type: 26,limit: 3});
        

        if (auditLogs != null){
            for (let [auditId, GuildAuditLogsEntry] of auditLogs.entries){
                if (usersToIgnore?.includes(GuildAuditLogsEntry.executorId)){
                    return;
                }

                if (GuildAuditLogsEntry.extra.channel.id === newChannelIdToCheck){
                    if (GuildAuditLogsEntry?.createdAt){
                        eventDate = new Date(GuildAuditLogsEntry.createdAt);
                        currentTime = new Date();
    
                        const difference = currentTime - eventDate;
                        let moveThreshold = 300000;
    
                        if (difference >= moveThreshold){
                            if (global.globalChannelIdLog[newChannelIdToCheck]){
                                delete global.globalChannelIdLog[newChannelIdToCheck];
                            }
                            return;
                        }
                        else {
                            if (global.globalChannelIdLog[newChannelIdToCheck]){
                                if (GuildAuditLogsEntry.extra.count > global.globalChannelIdLog[newChannelIdToCheck].count){
                                    global.globalChannelIdLog[newChannelIdToCheck].count = GuildAuditLogsEntry.extra.count
                                    movedByThisId = GuildAuditLogsEntry.executorId;
                                    break;
                                }
                            }
                            else {
                                global.globalChannelIdLog[newChannelIdToCheck] = {
                                    count: GuildAuditLogsEntry.extra.count
                                };
                                movedByThisId = GuildAuditLogsEntry.executorId;
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
    return movedByThisId;
}

module.exports = checkForExternalMove;