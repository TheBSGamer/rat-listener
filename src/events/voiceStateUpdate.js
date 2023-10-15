const {Events, EmbedBuilder} = require('discord.js');
const modMoveEmbed = require('../functions/modMoveEmbed');
const moveEmbed = require('../functions/moveEmbed');
const joinEmbed = require('../functions/joinEmbed');
const leaveEmbed = require('../functions/leaveEmbed');
const newDiscordEpoch = require('../functions/newDiscordEpoch');
const checkForExternalMove = require('../functions/checkForExternalMove');
require('dotenv').config();

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(client,...args){
        const oldState = args[0];
        const newState = args[1];
        const oldChannelId = args[0]?.channelId;
        const newChannelId = args[1]?.channelId;
        const ignoredChannels = process.env.IGNORE_CHANNELS?.split(',').map(channel => channel.trim());

        let logIgnoredChannelsOnMove = false;
        let logChannelMembersOnMove;
        let logChannelMembersOnLeave;
        let logChannelMembersOnJoin;
        let discordEpoch = '';

        // string to boolean conversion
        if (process.env.LOG_IGNORED_CHANNELS_ON_MOVE?.toLowerCase() === 'true'){
            logIgnoredChannelsOnMove = true;
        }
        if (process.env.LOG_CHANNEL_MEMBERS_ON_MOVE?.toLowerCase() === 'true'){
            logChannelMembersOnMove = true;
        }
        if (process.env.LOG_CHANNEL_MEMBERS_ON_LEAVE?.toLowerCase() === 'true'){
            logChannelMembersOnLeave = true;
        }
        if (process.env.LOG_CHANNEL_MEMBERS_ON_JOIN?.toLowerCase() === 'true'){
            logChannelMembersOnJoin = true;
        }

        // If the old state and new state match, this is an event for deafen, mute, etc. and can be ignored
        if (oldState.channel?.id === newState.channel?.id){
            return;
        }

        // Lookup log channel
        let channel = client.channels.cache.get(process.env?.LOGS_CHANNEL);

        if (channel === null || channel === undefined){
            console.error(`Unable to find log channel specified in dotenv file! Verify that you have 'LOGS_CHANNEL' defined and that a text channel ID is defined.`);
            return;
        }

        if (oldState?.guild.id != channel.guildId){
            console.error(`voice update happened in guild that is not in log channel guild!`);
            return;
        }
    
        if (newState.channel == null){
            // user has left voice channel
            if (!ignoredChannels?.includes(oldState.channel?.id)){
                let message = await channel.send(`${process.env.PLACEHOLDER_TIMESTAMP_MESSAGE}`);
                discordEpoch = newDiscordEpoch('D');
                leaveEmbed(client,oldState,newState,oldChannelId,logChannelMembersOnLeave,message,discordEpoch);
            }
        }
        else {
            // Check if a user left a channel and went to another channel
            if (oldState.channel != null){
                discordEpoch = newDiscordEpoch('D');
                let ignoredOldState = false;
                let ignoredNewState = false;

                if (ignoredChannels?.includes(oldState.channel?.id)){
                    ignoredOldState = true;
                }
                if (ignoredChannels?.includes(newState.channel?.id)){
                    ignoredNewState = true;
                }

                // each conditional has a return at the bottom to ignore join block during move event
                // The user went from ignored > ignored. Ignoring output regardless of ignore switch
                if (ignoredOldState && ignoredNewState){
                    return
                }
                // The user went from monitored > ignored. Logging output if log output switch is enabled
                else if (!ignoredOldState && ignoredNewState && logIgnoredChannelsOnMove){
                    let message = await channel.send(`${process.env.PLACEHOLDER_TIMESTAMP_MESSAGE}`);
                    let checkLogs = await checkForExternalMove(client,newChannelId);
                    if (checkLogs != null){
                        if (checkLogs === newState.member.user.id){
                            moveEmbed(client,oldState,newState,oldChannelId,newChannelId,logChannelMembersOnMove,message,discordEpoch);
                        }
                        else {
                            modMoveEmbed(client,oldState,newState,oldChannelId,newChannelId,checkLogs,logChannelMembersOnMove,message,discordEpoch);
                        }
                    }
                    else {
                        moveEmbed(client,oldState,newState,oldChannelId,newChannelId,logChannelMembersOnMove,message,discordEpoch);
                    }
                    // moveEmbed(client,oldState,newState,oldChannelId,newChannelId,logChannelMembersOnMove,message,discordEpoch);
                    return
                }
                // The user went from ignored > monitored. Logging output if log output switch is enabled
                else if (ignoredOldState && !ignoredNewState && logIgnoredChannelsOnMove){
                    let message = await channel.send(`${process.env.PLACEHOLDER_TIMESTAMP_MESSAGE}`);
                    let checkLogs = await checkForExternalMove(client,newChannelId);
                    if (checkLogs != null){
                        if (checkLogs === newState.member.user.id){
                            moveEmbed(client,oldState,newState,oldChannelId,newChannelId,logChannelMembersOnMove,message,discordEpoch);
                        }
                        else {
                            modMoveEmbed(client,oldState,newState,oldChannelId,newChannelId,checkLogs,logChannelMembersOnMove,message,discordEpoch);
                        }
                    }
                    else {
                        moveEmbed(client,oldState,newState,oldChannelId,newChannelId,logChannelMembersOnMove,message,discordEpoch);
                    }
                    // moveEmbed(client,oldState,newState,oldChannelId,newChannelId,logChannelMembersOnMove,message,discordEpoch);
                    return
                }
                // The user went from one channel to another. All other conditions have been met from above so we know the log
                // output switch is false. Regardless of what the value is, as long as the old or the new is true, it will not proceed
                else if (ignoredOldState || ignoredNewState) {
                    return
                }
                // The user went from monitored > monitored. Logging output regardless of ignore switch
                else {
                    let message = await channel.send(`${process.env.PLACEHOLDER_TIMESTAMP_MESSAGE}`);
                    let checkLogs = await checkForExternalMove(client,newChannelId);
                    if (checkLogs != null){
                        if (checkLogs === newState.member.user.id){
                            moveEmbed(client,oldState,newState,oldChannelId,newChannelId,logChannelMembersOnMove,message,discordEpoch);
                        }
                        else {
                            modMoveEmbed(client,oldState,newState,oldChannelId,newChannelId,checkLogs,logChannelMembersOnMove,message,discordEpoch);
                        }
                    }
                    else {
                        moveEmbed(client,oldState,newState,oldChannelId,newChannelId,logChannelMembersOnMove,message,discordEpoch);
                    }
                    // moveEmbed(client,oldState,newState,oldChannelId,newChannelId,logChannelMembersOnMove,message,discordEpoch);
                    return
                }
            }
            // user joined a channel
            if (!ignoredChannels?.includes(newState.channel?.id)){
                let message = await channel.send(`${process.env.PLACEHOLDER_TIMESTAMP_MESSAGE}`);
                discordEpoch = newDiscordEpoch('D');
                joinEmbed(client,newState,newChannelId,logChannelMembersOnJoin,message,discordEpoch);
            }
        }
    }
}