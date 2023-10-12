# Rat Listener

A Discord bot built on discord.js v14 that simply monitors join and leave events for voice channels in your server. It logs who was in the channel at the time of leave/join as well as the user's action (leave/join).

# Usage
1. Clone the repostiory
```
git clone https://github.com/TheBSGamer/rat-listener.git
```
2. Install dependencies with npm
```
npm install
```
3. Create .env file and make sure you have the following declarations
```dotenv
DISCORD_SECRET= # secret goes here
LOGS_CHANNEL= # Channel ID to log to goes here
IGNORE_CHANNELS= # List comma-seperated IDs to ignore for logging here (eg: 12109013929122383492,548172339729990129,218641694279413937)
LOG_IGNORED_CHANNELS_ON_MOVE=false # whether or not to log a user move event if they moved from or to an ignored channel defined in IGNORE_CHANNELS
LOG_CHANNEL_MEMBERS_ON_MOVE=true # whether or not to log members of a call during a move event
```
4. Start the bot
```
node index.js
```
