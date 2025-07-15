
# Ethos Network Telegram Bot

you can use our bot : https://t.me/Ehtosrankbot

A simple Telegram bot that fetches and displays Ethos Network profile information for any Ethereum wallet address. Ethos Network is a decentralized reputation platform in the Web3 ecosystem, and this bot makes it easy to view profiles, scores, reviews, vouches, and more.

## Features
- **Fetch Profile Data**: Enter an Ethereum address to get detailed info from the Ethos API.
- **User-Friendly Interface**: Custom keyboard with commands like /start, Get Profile, Help, and Support.
- **Formatted Output**: Displays data with emojis, Markdown, and optional avatar photos.
- **Error Handling**: Validates addresses, shows loading indicators, and handles API errors gracefully.
- **Open-Source**: Built with Node.js, easy to customize and deploy.

## Prerequisites
- Node.js (v14+ recommended)
- A Telegram Bot Token (create one via [BotFather](https://t.me/botfather))

## Installation
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ethos-ranking.git
   cd ethos-ranking
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example` and add your bot token:
   ```
   BOT_TOKEN=your_telegram_bot_token_here
   ```

4. Run the bot:
   ```
   node bot.js
   ```

The bot will start polling and log "🤖 Ethos bot started successfully!".

## Usage
1. Search for your bot on Telegram (e.g., @YourBotNameBot).
2. Send `/start` to see the welcome message and menu.
3. Click "🔍 Get Ethos Profile" and enter a valid Ethereum address (e.g., `0x6e78b133945b3c1862E7C61a7c984E2c06350388`).
4. The bot will fetch and display the profile data.
5. Use "📖 Help" for a usage guide or "💬 Support" for contact info.

## How It Works
- The bot uses the `node-telegram-bot-api` library for Telegram integration.
- It fetches data from Ethos Network's public APIs (activities and stats endpoints).
- User states are managed in memory to handle input flows.
- Data is formatted with Markdown for a clean, readable output.

## Contributing
Contributions are welcome! Fork the repo, make changes, and submit a pull request. Please follow standard coding practices.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support
If you encounter issues or have questions:
- Open an issue on GitHub.
- Contact me on Telegram: @malinius
- Twitter: @sefiyed

Built with ❤️ by @sefiyed. If you like this project, star the repo!
