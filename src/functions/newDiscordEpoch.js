function newDiscordEpoch(formatString = 'd'){
    const currentTimeInMS = Date.now();
    const currentTimeInS = Math.floor(currentTimeInMS / 1000);
    return `<t:${currentTimeInS}:${formatString}>`;
}

module.exports = newDiscordEpoch;