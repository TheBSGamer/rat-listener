const { channel } = require('diagnostics_channel');
const {time ,Events, EmbedBuilder, NewsChannel, GuildMember} = require('discord.js');
const { join } = require('node:path/win32');
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
                let leaveEmbed = new EmbedBuilder()
                    .setColor('#9E0000')
                    .setTimestamp()
                    .setDescription(`<@${newState.member.user.id}> left <#${oldState.channel.id}>\nID: ${newState.member.user.id}`);
                
                if (newState.member.user.globalName != null){
                    leaveEmbed.setAuthor({name: `${newState.member.user.globalName} (${newState.member.user.username})`, iconURL: `${newState.member.user.displayAvatarURL()}`});
                }
                else {
                    leaveEmbed.setAuthor({name: `${newState.member.user.username}#${newState.member.user.discriminator}`, iconURL: `${newState.member.user.displayAvatarURL()}`})
                }

                if (oldState.channel.members){
                    if (oldState.channel.members.size > 0){
                        leaveEmbed.setDescription(`<@${newState.member.user.id}> left <#${oldState.channel.id}>\nID: ${newState.member.user.id}\n\nThe following users were members of the call:`);
                    }
                    for (let [memberId,guildMember] of oldState.channel.members){
                        if (guildMember.user.globalName){
                            leaveEmbed.addFields({
                                name: `${guildMember.user.globalName} (${guildMember.user.username})`,
                                value: `ID: ${guildMember.user.id}`,
                                inline: false
                            });
                        }
                        else {
                            leaveEmbed.addFields({
                                name: `${guildMember.user.username}#${guildMember.user.discriminator}`,
                                value: `ID: ${guildMember.user.id}`,
                                inline: false
                            });
                        }
                    }
                }
                let channel = client.channels.cache.get(process.env.LOGS_CHANNEL);
                channel.send({embeds: [leaveEmbed]});
                console.log(`${newState.member.user.username} left ${oldState.channel.name}`);
            }
        }
        else {
            // If the old state and new state match, this is an event for deafen, mute, etc. and can be ignored
            if (oldState.channel?.id === newState.channel.id){
                return;
            }

            // Check if a user left a channel and went to another channel
            if (oldState.channel != null){
                if (!ignoredChannels.includes(oldState.channel.id)){
                    let moveEmbed = new EmbedBuilder()
                    .setColor('#9E0000')
                    .setTimestamp()
                    .setDescription(`<@${newState.member.user.id}> left <#${oldState.channel.id}>\nID: ${newState.member.user.id}`);
                
                    if (newState.member.user.globalName != null){
                        moveEmbed.setAuthor({name: `${newState.member.user.globalName} (${newState.member.user.username})`, iconURL: `${newState.member.user.displayAvatarURL()}`});
                    }
                    else {
                        moveEmbed.setAuthor({name: `${newState.member.user.username}#${newState.member.user.discriminator}`, iconURL: `${newState.member.user.displayAvatarURL()}`})
                    }

                    if (oldState.channel.members){
                        if (oldState.channel.members.size > 0){
                            moveEmbed.setDescription(`<@${newState.member.user.id}> left <#${oldState.channel.id}>\nID: ${newState.member.user.id}\n\nThe following users were members of the call:`);
                        }
                        for (let [memberId,guildMember] of oldState.channel.members){
                            if (guildMember.user.globalName){
                                moveEmbed.addFields({
                                    name: `${guildMember.user.globalName} (${guildMember.user.username})`,
                                    value: `ID: ${guildMember.user.id}`,
                                    inline: false
                                });
                            }
                            else {
                                moveEmbed.addFields({
                                    name: `${guildMember.user.username}#${guildMember.user.discriminator}`,
                                    value: `ID: ${guildMember.user.id}`,
                                    inline: false
                                });
                            }
                        }
                    }
                    let channel = client.channels.cache.get(process.env.LOGS_CHANNEL);
                    channel.send({embeds: [moveEmbed]});
                    console.log(`${newState.member.user.username} left ${oldState.channel.name}`);
                }
            }
            // user joined a channel
            if (!ignoredChannels.includes(newState.channel.id)){
                let joinEmbed = new EmbedBuilder()
                    .setColor('#168700')
                    .setTimestamp()
                    .setDescription(`<@${newState.member.user.id}> joined <#${newState.channel.id}>\nID: ${newState.member.user.id}`);
                
                if (newState.member.user.globalName != null){
                    joinEmbed.setAuthor({name: `${newState.member.user.globalName} (${newState.member.user.username})`, iconURL: `${newState.member.user.displayAvatarURL()}`});
                }
                else {
                    joinEmbed.setAuthor({name: `${newState.member.user.username}#${newState.member.user.discriminator}`, iconURL: `${newState.member.user.displayAvatarURL()}`})
                }

                if (newState.channel.members){
                    if (newState.channel.members?.size > 1){
                        joinEmbed.setDescription(`<@${newState.member.user.id}> joined <#${newState.channel.id}>\nID: ${newState.member.user.id}\n\nThe following users were members of the call:`);
                    }
                    for (let [memberId,guildMember] of newState.channel.members){
                        if (guildMember.user.id !== newState.member.user.id){
                            if (guildMember.user.globalName){
                                joinEmbed.addFields({
                                    name: `${guildMember.user.globalName} (${guildMember.user.username})`,
                                    value: `ID: ${guildMember.user.id}`,
                                    inline: false
                                });
                            }
                            else {
                                joinEmbed.addFields({
                                    name: `${guildMember.user.username}#${guildMember.user.discriminator}`,
                                    value: `ID: ${guildMember.user.id}`,
                                    inline: false
                                });
                            }
                        }
                    }
                }
                let channel = client.channels.cache.get(process.env.LOGS_CHANNEL);
                channel.send({embeds: [joinEmbed]});
                console.log(`${newState.member.user.username} joined ${newState.channel.name}`);
            }
        }
    }
}