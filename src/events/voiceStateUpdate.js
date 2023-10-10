const { channel } = require('diagnostics_channel');
const {time ,Events, EmbedBuilder} = require('discord.js');
const { join } = require('node:path/win32');
require('dotenv').config();

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(client,...args){
        const oldState = args[0];
        const newState = args[1];

        if (newState.selfDeaf || oldState.selfDeaf){
            return
        }
        if (newState.selfMute || oldState.selfMute){
            return
        }
        if (newState.selfVideo || oldState.selfVideo){
            return
        }
        if (newState.streaming || oldState.streaming){
            return
        }
        if (newState.serverDeaf || oldState.serverDeaf){
            return
        }
        if (newState.serverMute || oldState.serverMute){
            return
        }
        const ignoredChannels = process.env.IGNORE_CHANNELS.split(',');
    
        if (newState.channel == null){
            if (ignoredChannels.includes(oldState.channel.id)){
                return
            }
            let leaveEmbed = new EmbedBuilder()
                .setColor('#9E0000')
                .setTimestamp()
                .setFooter({text: `ID: ${newState.member.user.id}`})
                .setAuthor({name: `${newState.member.user.globalName} (${newState.member.user.username})`, iconURL: `${newState.member.user.displayAvatarURL()}`})
                .setDescription(`<@${newState.member.user.id}> left <#${oldState.channel.id}>`);
            
            let channel = client.channels.cache.get(process.env.LOGS_CHANNEL);
            channel.send({embeds: [leaveEmbed]});
        }
        else {
            if (oldState.channel != null){
                if (ignoredChannels.includes(oldState.channel.id)){
                    return
                }
                let moveEmbed = new EmbedBuilder()
                    .setColor('#9E0000')
                    .setTimestamp()
                    .setFooter({text: `ID: ${newState.member.user.id}`})
                    .setAuthor({name: `${newState.member.user.globalName} (${newState.member.user.username})`, iconURL: `${newState.member.user.displayAvatarURL()}`})
                    .setDescription(`<@${newState.member.user.id}> left <#${oldState.channel.id}>`);
                let channel = client.channels.cache.get(process.env.LOGS_CHANNEL);
                channel.send({embeds: [moveEmbed]});
            }
            if (ignoredChannels.includes(newState.channel.id)){
                return
            }
            let joinEmbed = new EmbedBuilder()
                .setColor('#168700')
                .setTimestamp()
                .setFooter({text: `ID: ${newState.member.user.id}`})
                .setAuthor({name: `${newState.member.user.globalName} (${newState.member.user.username})`, iconURL: `${newState.member.user.displayAvatarURL()}`})
                .setDescription(`<@${newState.member.user.id}> joined <#${newState.channel.id}>`);
            let channel = client.channels.cache.get(process.env.LOGS_CHANNEL);
            channel.send({embeds: [joinEmbed]});
        }
    }
}