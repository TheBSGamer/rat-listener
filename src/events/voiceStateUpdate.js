const {Events, EmbedBuilder} = require('discord.js');
const moveEmbed = require('../functions/moveEmbed');
const joinEmbed = require('../functions/joinEmbed');
const leaveEmbed = require('../functions/leaveEmbed');
require('dotenv').config();

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(client,...args){
        const oldState = args[0];
        const newState = args[1];
        const ignoredChannels = process.env.IGNORE_CHANNELS.split(',');
    
        if (newState.channel == null){
            // user has left voice channel
            if (!ignoredChannels.includes(oldState.channel.id)){
                leaveEmbed(client,oldState,newState);
            }
        }
        else {
            // If the old state and new state match, this is an event for deafen, mute, etc. and can be ignored
            if (oldState.channel?.id === newState.channel.id){
                return;
            }

            // Check if a user left a channel and went to another channel
            if (oldState.channel != null){
                let ignoredOldState = false;
                let ignoredNewState = false;
                let logIgnoredChannelsOnMove = false;
                let logChannelMembersOnMove;

                // string to boolean conversion
                if (process.env.LOG_IGNORED_CHANNELS_ON_MOVE.toLowerCase() === 'true'){
                    logIgnoredChannelsOnMove = true;
                }
                if (process.env.LOG_CHANNEL_MEMBERS_ON_MOVE.toLowerCase() === 'true'){
                    logChannelMembersOnMove = true;
                }

                if (ignoredChannels.includes(oldState.channel.id)){
                    ignoredOldState = true;
                }
                if (ignoredChannels.includes(newState.channel.id)){
                    ignoredNewState = true;
                }

                // each conditional has a return at the bottom to ignore join block during move event
                // The user went from ignored > ignored Ignoring output regardless of ignore switch
                if (ignoredOldState && ignoredNewState){
                    return
                }
                // The user went from monitored > ignored. Logging output if log output switch is enabled
                else if (!ignoredOldState && ignoredNewState && logIgnoredChannelsOnMove){
                    moveEmbed(client,oldState,newState,logChannelMembersOnMove);
                    return
                }
                // The user went from ignored > monitored. Logging output if log output switch is enabled
                else if (ignoredOldState && !ignoredNewState && logIgnoredChannelsOnMove){
                    moveEmbed(client,oldState,newState,logChannelMembersOnMove);
                    return
                }
                // The user went from one channel to another. All other conditions have been met from above so we know the log
                // output switch is false. Regardless of what the value is, as long as the old or the new is true, it will not proceed
                else if (ignoredOldState || ignoredNewState) {
                    return
                }
                // The user went from monitored > monitored. Logging output regardless of ignore switch
                else {
                    moveEmbed(client,oldState,newState,logChannelMembersOnMove);
                    return
                }
            }
            // user joined a channel
            if (!ignoredChannels.includes(newState.channel.id)){
                joinEmbed(client,newState);
            }
        }
    }
}