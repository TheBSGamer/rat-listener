# Rat Listener

A Discord bot built on discord.js v14 that simply monitors join and leave events for voice channels in your server.

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
```
4. Start the bot
```
node index.js
```
