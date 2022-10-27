const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, gameOptionsAgain} = require("./options");

const token = '5410758066:AAHJ7j4ix9ECyQBW-IiiIKHw6gi9EPmgCh4'

const bot = new TelegramApi(token, {polling: true})

bot.setMyCommands([
    {command: '/start', description: 'start'},
    {command: '/info', description: 'info'},
    {command: '/game', description: 'game'},
    {command: '/again', description: 'again'}
]);


const chats = [];

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Select number from 1 to 9');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Try', gameOptions);
}

const start = () => {
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        console.log('text = ', text)
        switch (text) {
            case '/start':
                await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/06d/991/06d991f7-564f-47cd-8180-585cd0056a42/5.webp')
                await bot.sendMessage(chatId, 'Start bot');
                break;
            case '/info':
                await bot.sendMessage(chatId, 'info');
                break;
            case '/game':
                await startGame(chatId);

                break;
            default:
                // await bot.sendMessage(chatId, text);
                console.log(text);
        }

    })

    bot.on('callback_query', async msg => {

        const data = msg.data;
        const chatId = msg.message.chat.id;
        await bot.sendMessage(chatId, data);
        if (data == '/again') {
            return startGame(chatId);
        }
        if (data == chats[chatId]) {
            return await bot.sendMessage(chatId, 'You win', gameOptionsAgain);
        }
        return await bot.sendMessage(chatId, 'You loose', gameOptionsAgain);
    })

}

start()