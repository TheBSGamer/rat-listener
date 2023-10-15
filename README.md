# Rat Listener

![Audit trail banner](/assets/audit_trail.png)

A Discord bot built on discord.js v14 that simply monitors join, leave, move, and move events initiated by another user (someone with the 'MOVE_MEMBERS' permission) for voice channels in your server. It is customizable and will log members of the voice call and a Discord timestamp that shows the time of the event down to the second.

> **Important**
> This bot is intentionally made to *not* be used in multiple guilds due to the volume of messages that may come through in some guilds. If you want to use it in multiple guilds, you will need to make an instance of the bot for each guild you plan to use it in.

# Getting Started
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
IGNORE_CHANNELS=12109013929122383492 # List comma-seperated channel IDs to ignore for move events here (eg: 12109013929122383492,548172339729990129,218641694279413937)
IGNORE_USERS_ON_MOD_MOVE=153168313352978432 # List comma-seperated user IDs to ignore for mod move events here (eg: 12109013929122383492,548172339729990129,218641694279413937)
LOG_IGNORED_CHANNELS_ON_MOVE=false # whether or not to log a user move event if they moved from or to an ignored channel defined in IGNORE_CHANNELS
LOG_CHANNEL_MEMBERS_ON_MOVE=true # whether or not to log members of a call during a move event
LOG_CHANNEL_MEMBERS_ON_LEAVE=true # whether or not to log members of a call during a leave event
LOG_CHANNEL_MEMBERS_ON_JOIN=true # whether or not to log members of a call during a join event
PLACEHOLDER_TIMESTAMP_MESSAGE=*Generating embed...* # string for placeholder message that is generated while the embed is created
```
4. Generate an invite link. Ensure your bot permissions have the following permissions at a minimum:
    * View Audit Log
    * Read Messages/View Channels
    * Send Messages
    * Embed Links
    * Read Message History

The calculated field is `85120`.
```
https://discord.com/oauth2/authorize?client_id=YOURAPPLICATIONIDGOESHERE&scope=bot&permissions=85120
```
5. Start the bot
```
node index.js
```
