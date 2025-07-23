# Smart Stock Analyzer

A professional AI-powered stock analysis tool that provides intelligent insights and predictions for stock portfolio management using advanced artificial intelligence.

![Smart Stock Analyzer](https://img.shields.io/badge/version-1.0.0-blue) ![License](https://img.shields.io/badge/license-MIT-green) ![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)

## 🚀 Features

- **AI-Powered Analysis**: Advanced AI algorithms provide comprehensive stock performance analysis
- **Real-time Data**: Fetches current market data from reliable financial APIs
- **Professional Interface**: Clean, responsive design with modern UI/UX principles
- **Multiple Stock Support**: Analyze up to 3 stocks simultaneously
- **Smart Validation**: Real-time input validation and error handling
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Build Tool**: Vite
- **Styling**: Modern CSS with CSS Grid and Flexbox
- **APIs**: Polygon.io for stock data, OpenAI for analysis
- **Architecture**: Modular JavaScript with ES6 modules

## 📋 Prerequisites

- Node.js 16.0.0 or higher
- npm or yarn package manager
- Modern web browser with ES6+ support

## 🚀 Quick Start

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd smart-stock-analyzer
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the URL shown in terminal)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 🎯 Usage

### Adding Stock Tickers

1. Enter a valid stock ticker symbol (e.g., AAPL, TSLA, MSFT)
2. Click the "+" button or press Enter
3. Add up to 3 different stocks
4. Remove stocks by clicking the "×" button on any ticker

### Generating Analysis

1. Once you have added at least one stock ticker
2. Click "Generate Analysis Report"
3. Wait for the AI to process market data
4. Review your comprehensive analysis report

### Understanding the Report

The AI-generated report includes:

- **Performance Summary**: Overview of each stock's recent performance
- **Price Movement Analysis**: Detailed breakdown of price changes
- **Professional Recommendations**: Buy/Hold/Sell recommendations with reasoning
- **Risk Assessment**: Evaluation of potential risks and opportunities

## 🔧 Configuration

### API Configuration

The application uses external APIs for data fetching. The current configuration includes:

- **Stock Data API**: Polygon.io (via Cloudflare Worker)
- **AI Analysis API**: OpenAI (via Cloudflare Worker)

### Customization Options

You can customize various aspects by modifying the configuration in `index.js`:

```javascript
const CONFIG = {
  MAX_TICKERS: 3, // Maximum number of stocks
  MIN_TICKER_LENGTH: 1, // Minimum ticker length
  MAX_TICKER_LENGTH: 10, // Maximum ticker length
  API_TIMEOUT: 30000, // API timeout in milliseconds
  DEBOUNCE_DELAY: 300, // Input debounce delay
};
```

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🎨 Design System

### Color Palette

- **Primary**: Blue (#2563eb)
- **Secondary**: Green (#059669)
- **Accent**: Purple (#7c3aed)
- **Neutral**: Gray scale (50-900)

### Typography

- **Primary Font**: Inter
- **Monospace Font**: JetBrains Mono
- **Font Weights**: 300, 400, 500, 600, 700

## 🔒 Security & Privacy

- No personal data is stored locally or transmitted
- All API communications use HTTPS
- Input validation prevents malicious code injection
- CSP headers recommended for production deployment

## ⚡ Performance

- Optimized bundle size with Vite
- Lazy loading for improved initial load time
- Debounced input validation
- Efficient DOM updates with modern JavaScript

## 🧪 Testing

Currently, the project doesn't have automated tests configured. To add testing:

```bash
# Install testing dependencies
npm install --save-dev vitest @testing-library/dom

# Add test script to package.json
"test": "vitest"
```

## 🚀 Deployment

### Static Hosting (Recommended)

The app can be deployed to any static hosting service:

- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Push the `dist` folder to `gh-pages` branch

### Docker Deployment

```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🛠️ Development

### Project Structure

```
smart-stock-analyzer/
├── index.html          # Main HTML file
├── index.js            # Main JavaScript application
├── index.css           # Styling and design system
├── package.json        # Project configuration
├── vite.config.js      # Vite configuration
├── utils/
│   └── dates.js        # Date utilities
└── images/             # Static assets
```

### Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run linting (when configured)
```

### Code Style

- Use ES6+ features
- Follow semantic HTML principles
- Implement CSS custom properties for theming
- Write self-documenting code with clear variable names
- Use JSDoc comments for functions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add JSDoc comments for new functions
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

**Important**: This tool provides AI-generated analysis for educational and informational purposes only. The analysis should not be considered as financial advice. Always consult with qualified financial advisors before making investment decisions. Past performance does not guarantee future results.

## 🙏 Acknowledgments

- **Polygon.io** for providing reliable stock market data
- **OpenAI** for powering the intelligent analysis
- **Vite** for the excellent development experience
- **Inter & JetBrains Mono** fonts for typography

## 📞 Support

For support, feature requests, or bug reports:

1. Check existing [GitHub Issues](issues)
2. Create a new issue with detailed description
3. Include browser version and steps to reproduce

---

**Built with ❤️ for smart investors**
