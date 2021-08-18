require('dotenv').config();

const wcc = require("./extract_cases.js");
const Discord = require('discord.js');

const bot = new Discord.Client();
bot.login(process.env.TOKEN);

const URL = "https://www.wechu.org/cv/local-updates";

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', message => {
    if (message.content === 'w/check') {
        let dateOutput = ":";

        wcc.getCaseCount(URL).then(data => {
            if (data.updated_today) dateOutput = " (Today) :";
            message.channel.send(`New cases from last update: **\`${data.new_cases}\`**
Total active cases: **\`${data.total_active_cases}\`**

Last updated${dateOutput} \`${data.last_update}\`
Data provided by WECHU \`https://www.wechu.org/cv/local-updates\``).then().catch(console.error);
        });  
    }
});