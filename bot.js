require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');

// Bot token from .env file
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// User states storage
const userStates = {};

// Function to fetch Ethos profile data
async function fetchEthosProfile(address) {
  const url = `https://api.ethos.network/api/v1/activities/actor/address:${address}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
        'Origin': 'https://app.ethos.network',
        'Referer': 'https://app.ethos.network/',
        'X-Ethos-Client': 'web'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    const userData = json.data;
    
    // Fetch stats data
    const profileId = userData['profileId'];
    const secondApi = `https://api.ethos.network/api/v1/users/profileId:${profileId}/stats`;

    const statsResponse = await fetch(secondApi, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
        'Origin': 'https://app.ethos.network',
        'Referer': 'https://app.ethos.network/',
        'X-Ethos-Client': 'web'
      }
    });

    if (!statsResponse.ok) {
      throw new Error(`Stats API error! status: ${statsResponse.status}`);
    }

    const statsJson = await statsResponse.json();
    
    return {
      profile: userData,
      stats: statsJson.data
    };
  } catch (err) {
    console.error('Fetch error:', err);
    throw err;
  }
}

// Function to format Ethos data beautifully
function formatEthosData(data) {
  const { profile, stats } = data;
  
  let message = `🎯 *Ethos Network Profile*\n\n`;
  message += `👤 *Name:* ${profile.name || 'Not set'}\n`;
  message += `🆔 *Username:* ${profile.username || 'Not set'}\n`;
  message += `📝 *Description:* ${profile.description || 'Not set'}\n`;
  message += `⭐ *Score:* ${profile.score}\n`;
  message += `🎖 *XP Multiplier:* ${profile.scoreXpMultiplier}x\n`;
  message += `🔢 *Profile ID:* ${profile.profileId}\n`;
  message += `💳 *Wallet Address:* \`${profile.primaryAddress}\`\n\n`;
  
  message += `📊 *Statistics*\n\n`;
  
  // Reviews
  message += `📋 *Reviews:*\n`;
  message += `   • Received: ${stats.reviews.received}\n`;
  message += `   • Positive: ${stats.reviews.positiveReviewCount}\n`;
  message += `   • Negative: ${stats.reviews.negativeReviewCount}\n`;
  message += `   • Neutral: ${stats.reviews.neutralReviewCount}\n`;
  message += `   • Positive Rate: ${stats.reviews.positiveReviewPercentage}%\n\n`;
  
  // Vouches
  message += `🤝 *Vouches:*\n`;
  message += `   • Balance Received: ${stats.vouches.balance.received}\n`;
  message += `   • Balance Deposited: ${stats.vouches.balance.deposited}\n`;
  message += `   • Count Received: ${stats.vouches.count.received}\n`;
  message += `   • Count Deposited: ${stats.vouches.count.deposited}\n\n`;
  
  // Slashes
  message += `⚡ *Slashes:* ${stats.slashes.count}\n`;
  
  return message;
}

// /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name || 'there';
  
  const welcomeMessage = `
Hello ${firstName}! 👋

Welcome to *Ethos Network Bot*! 🎉

This bot helps you easily view Ethos profile information for any Ethereum address.

📌 *How to use:*
1️⃣ Click the "Get Profile Info" button
2️⃣ Send the wallet address you want to check
3️⃣ Receive complete profile information!

Click the button below to get started 👇
`;

  const keyboard = {
    reply_markup: {
      keyboard: [
        ['🔍 Get Ethos Profile'],
        ['📖 Help', '💬 Support']
      ],
      resize_keyboard: true,
      one_time_keyboard: false
    }
  };

  bot.sendMessage(chatId, welcomeMessage, { 
    parse_mode: 'Markdown',
    ...keyboard 
  });
});

// Get profile info command
bot.onText(/🔍 Get Ethos Profile/, (msg) => {
  const chatId = msg.chat.id;
  
  userStates[chatId] = 'waiting_for_address';
  
  const message = `
💳 *Please send an Ethereum wallet address*

Example:
\`0x6e78b133945b3c1862E7C61a7c984E2c06350388\`

⚠️ The address must start with 0x and be 42 characters long.
`;

  bot.sendMessage(chatId, message, { 
    parse_mode: 'Markdown',
    reply_markup: {
      keyboard: [['❌ Cancel']],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  });
});

// Help command
bot.onText(/📖 Help/, (msg) => {
  const chatId = msg.chat.id;
  
  const helpMessage = `
📚 *Bot Usage Guide*

🔸 *What is Ethos Network?*
Ethos is a decentralized reputation platform that allows users to build and manage their reputation in the Web3 space.

🔸 *Information displayed:*
- Profile information (name, score, avatar)
- Review statistics and ratings
- Vouches status
- Number of Slashes

🔸 *How to use:*
1. Click the "Get Ethos Profile" button
2. Send the wallet address you want to check
3. Wait for the information to be retrieved

💡 *Note:* The wallet address must be valid and on the Ethereum network.
`;

  bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
});

// Support command
bot.onText(/💬 Support/, (msg) => {
  const chatId = msg.chat.id;
  
  const supportMessage = `
🆘 *Support*

If you need help or have a question, please send a message on Telegram to:
👉 @malinius
`;

  bot.sendMessage(chatId, supportMessage, { parse_mode: 'Markdown' });
});

// Cancel command
bot.onText(/❌ Cancel/, (msg) => {
  const chatId = msg.chat.id;
  
  delete userStates[chatId];
  
  const keyboard = {
    reply_markup: {
      keyboard: [
        ['🔍 Get Ethos Profile'],
        ['📖 Help', '💬 Support']
      ],
      resize_keyboard: true
    }
  };
  
  bot.sendMessage(chatId, '❌ Operation cancelled.', keyboard);
});

// Process regular messages (wallet addresses)
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  
  // Check if message is a command
  if (text && (text.startsWith('/') || text.includes('🔍') || text.includes('📖') || text.includes('💬') || text.includes('❌'))) {
    return;
  }
  
  // Check user state
  if (userStates[chatId] === 'waiting_for_address') {
    // Validate address format
    const addressRegex = /^0x[a-fA-F0-9]{40}$/;
    
    if (!addressRegex.test(text)) {
      bot.sendMessage(chatId, '❌ Invalid address format!\n\nPlease enter a valid Ethereum address.');
      return;
    }
    
    // Show loading message
    const loadingMsg = await bot.sendMessage(chatId, '⏳ Fetching profile data...');
    
    try {
      // Fetch data from API
      const ethosData = await fetchEthosProfile(text);
      
      // Delete loading message
      bot.deleteMessage(chatId, loadingMsg.message_id);
      
      // Send formatted data with or without avatar
      const formattedMessage = formatEthosData(ethosData);
      
      if (ethosData.profile.avatar) {
        bot.sendPhoto(chatId, ethosData.profile.avatar, {
          caption: formattedMessage,
          parse_mode: 'Markdown'
        });
      } else {
        bot.sendMessage(chatId, formattedMessage, { 
          parse_mode: 'Markdown',
          disable_web_page_preview: true 
        });
      }
      
      // Return to main menu
      delete userStates[chatId];
      
      setTimeout(() => {
        const keyboard = {
          reply_markup: {
            keyboard: [
              ['🔍 Get Ethos Profile'],
              ['📖 Help', '💬 Support']
            ],
            resize_keyboard: true
          }
        };
        
        bot.sendMessage(chatId, '✅ Operation completed successfully!\n\nYou can use the menu for another search.', keyboard);
      }, 1000);
      
    } catch (error) {
      // Delete loading message
      bot.deleteMessage(chatId, loadingMsg.message_id);
      
      // Show error message
      bot.sendMessage(chatId, `❌ Error fetching data!\n\nThis address might not be registered on Ethos Network or there might be a connection issue.\n\nPlease try again.`);
      
      delete userStates[chatId];
    }
  }
});

// Error handling
bot.on('polling_error', (error) => {
  console.log('Polling error:', error);
});

console.log('🤖 Ethos bot started successfully!');
