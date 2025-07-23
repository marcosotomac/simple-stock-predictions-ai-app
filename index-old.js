import { dates } from './utils/dates.js'

// Configuration
const CONFIG = {
    MAX_TICKERS: 3,
    MIN_TICKER_LENGTH: 1,
    MAX_TICKER_LENGTH: 10,
    API_TIMEOUT: 30000,
    DEBOUNCE_DELAY: 300
}

// Application state
const state = {
    tickers: [],
    isLoading: false,
    currentStep: 1
}

// DOM elements
const elements = {
    tickerForm: document.getElementById('ticker-input-form'),
    tickerInput: document.getElementById('ticker-input'),
    tickerList: document.getElementById('ticker-list'),
    generateBtn: document.getElementById('generate-btn'),
    inputSection: document.getElementById('input-section'),
    loadingSection: document.getElementById('loading-section'),
    resultsSection: document.getElementById('results-section'),
    apiMessage: document.getElementById('api-message'),
    reportContent: document.getElementById('report-content'),
    helpText: document.getElementById('ticker-help')
}

// Utility functions
const debounce = (func, delay) => {
    let timeoutId
    return (...args) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => func.apply(null, args), delay)
    }
}

const validateTicker = (ticker) => {
    const trimmed = ticker.trim().toUpperCase()
    
    if (!trimmed) {
        return { valid: false, error: 'Ticker cannot be empty' }
    }
    
    if (trimmed.length < CONFIG.MIN_TICKER_LENGTH) {
        return { valid: false, error: `Ticker must be at least ${CONFIG.MIN_TICKER_LENGTH} character(s)` }
    }
    
    if (trimmed.length > CONFIG.MAX_TICKER_LENGTH) {
        return { valid: false, error: `Ticker must be no more than ${CONFIG.MAX_TICKER_LENGTH} characters` }
    }
    
    if (!/^[A-Z]+$/.test(trimmed)) {
        return { valid: false, error: 'Ticker must contain only letters' }
    }
    
    if (state.tickers.includes(trimmed)) {
        return { valid: false, error: 'This ticker is already added' }
    }
    
    if (state.tickers.length >= CONFIG.MAX_TICKERS) {
        return { valid: false, error: `Maximum ${CONFIG.MAX_TICKERS} tickers allowed` }
    }
    
    return { valid: true, ticker: trimmed }
}

const showError = (message) => {
    elements.helpText.textContent = message
    elements.helpText.classList.add('error')
    elements.tickerInput.style.borderColor = 'var(--danger-color)'
}

const clearError = () => {
    elements.helpText.textContent = 'Enter a valid stock ticker symbol (3+ characters)'
    elements.helpText.classList.remove('error')
    elements.tickerInput.style.borderColor = ''
}

const updateUI = () => {
    // Update generate button state
    elements.generateBtn.disabled = state.tickers.length === 0 || state.isLoading
    
    // Update button text based on ticker count
    const btnText = elements.generateBtn.querySelector('.btn-text')
    if (state.tickers.length === 0) {
        btnText.textContent = 'Add tickers to generate report'
    } else if (state.tickers.length === 1) {
        btnText.textContent = 'Analyze 1 stock'
    } else {
        btnText.textContent = `Analyze ${state.tickers.length} stocks`
    }
}

const addTicker = (ticker) => {
    const validation = validateTicker(ticker)
    
    if (!validation.valid) {
        showError(validation.error)
        return false
    }
    
    state.tickers.push(validation.ticker)
    elements.tickerInput.value = ''
    clearError()
    renderTickers()
    updateUI()
    
    // Focus back to input for better UX
    elements.tickerInput.focus()
    
    return true
}

const removeTicker = (ticker) => {
    state.tickers = state.tickers.filter(t => t !== ticker)
    renderTickers()
    updateUI()
}

const renderTickers = () => {
    if (state.tickers.length === 0) {
        elements.tickerList.innerHTML = '<p class="placeholder-text">Your selected tickers will appear here...</p>'
        return
    }
    
    elements.tickerList.innerHTML = state.tickers.map(ticker => `
        <div class="ticker">
            <span>${ticker}</span>
            <button 
                class="ticker-remove" 
                onclick="removeTicker('${ticker}')"
                aria-label="Remove ${ticker}"
                type="button"
            >×</button>
        </div>
    `).join('')
}

const setLoadingStep = (step) => {
    state.currentStep = step
    
    // Update step indicators
    for (let i = 1; i <= 3; i++) {
        const stepEl = document.getElementById(`step-${i}`)
        if (stepEl) {
            stepEl.classList.toggle('active', i <= step)
        }
    }
    
    // Update loading message based on step
    const messages = {
        1: 'Fetching real-time market data...',
        2: 'Processing data with AI algorithms...',
        3: 'Generating comprehensive analysis...'
    }
    
    elements.apiMessage.textContent = messages[step] || 'Processing...'
}

const showSection = (section) => {
    // Hide all sections
    elements.inputSection.style.display = 'none'
    elements.loadingSection.style.display = 'none'
    elements.resultsSection.style.display = 'none'
    
    // Show requested section
    section.style.display = 'block'
}

const fetchWithTimeout = async (url, options = {}, timeout = CONFIG.API_TIMEOUT) => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        })
        clearTimeout(timeoutId)
        return response
    } catch (error) {
        clearTimeout(timeoutId)
        if (error.name === 'AbortError') {
            throw new Error('Request timed out. Please try again.')
        }
        throw error
    }
}

const fetchStockData = async () => {
    if (state.isLoading || state.tickers.length === 0) return
    
    state.isLoading = true
    updateUI()
    showSection(elements.loadingSection)
    setLoadingStep(1)
    
    try {
        const stockData = await Promise.all(
            state.tickers.map(async (ticker, index) => {
                // Add slight delay between requests to avoid rate limiting
                if (index > 0) {
                    await new Promise(resolve => setTimeout(resolve, 200))
                }
                
                const url = `https://polygon-api-worker.guil-9d2.workers.dev/?ticker=${ticker}&startDate=${dates.startDate}&endDate=${dates.endDate}`
                
                const response = await fetchWithTimeout(url)
                
                if (!response.ok) {
                    const errorText = await response.text()
                    throw new Error(`Failed to fetch data for ${ticker}: ${errorText}`)
                }
                
                return await response.text()
            })
        )
        
        setLoadingStep(2)
        await new Promise(resolve => setTimeout(resolve, 800)) // Simulate processing time
        
        setLoadingStep(3)
        await fetchReport(stockData.join('\n\n'))
        
    } catch (error) {
        console.error('Stock data fetch error:', error)
        showError('Failed to fetch stock data. Please try again.')
        showSection(elements.inputSection)
        state.isLoading = false
        updateUI()
    }
}

const fetchReport = async (data) => {
    try {
        const messages = [
            {
                role: 'system',
                content: `You are a professional financial analyst. Given stock price data over the past few days, write a comprehensive analysis report of no more than 200 words. Include:
                
                1. Performance summary for each stock
                2. Key price movements and trends
                3. Professional recommendation (Buy/Hold/Sell) with reasoning
                4. Risk assessment
                
                Use professional, objective language. Avoid overly casual expressions. Focus on data-driven insights.`
            },
            {
                role: 'user',
                content: `Please analyze the following stock data and provide professional recommendations:
                
                ${data}
                
                Provide a structured analysis with clear recommendations for each stock mentioned.`
            }
        ]
        
        const response = await fetchWithTimeout(
            'https://openai-api-worker.guil-9d2.workers.dev',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messages)
            }
        )
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
            throw new Error(`AI Analysis Error: ${errorData.error || response.statusText}`)
        }
        
        const reportData = await response.json()
        renderReport(reportData.content)
        
    } catch (error) {
        console.error('Report generation error:', error)
        
        // Show fallback error message in results section
        elements.reportContent.innerHTML = `
            <div style="text-align: center; color: var(--danger-color); padding: var(--space-xl);">
                <h4>Unable to Generate AI Analysis</h4>
                <p>We encountered an issue while generating your analysis report. This might be due to:</p>
                <ul style="text-align: left; max-width: 400px; margin: var(--space-md) auto;">
                    <li>Temporary service unavailability</li>
                    <li>Network connectivity issues</li>
                    <li>High demand on AI services</li>
                </ul>
                <p>Please try again in a few moments, or contact support if the issue persists.</p>
            </div>
        `
        showSection(elements.resultsSection)
        state.isLoading = false
        updateUI()
    }
}

const renderReport = (content) => {
    // Format the report content for better readability
    const formattedContent = content
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
    
    elements.reportContent.innerHTML = `
        <div class="report-header">
            <h4>Analysis for: ${state.tickers.join(', ')}</h4>
            <p class="report-date">Generated on ${new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}</p>
        </div>
        <div class="report-body">
            <p>${formattedContent}</p>
        </div>
        <div class="report-footer">
            <p><strong>Disclaimer:</strong> This analysis is generated by AI for educational purposes only. Always consult with qualified financial advisors before making investment decisions.</p>
        </div>
    `
    
    showSection(elements.resultsSection)
    state.isLoading = false
    updateUI()
}

// Global function for remove button (called from HTML)
window.removeTicker = removeTicker

// Global function for new analysis button
window.resetAnalysis = () => {
    state.tickers = []
    state.isLoading = false
    state.currentStep = 1
    elements.tickerInput.value = ''
    clearError()
    renderTickers()
    updateUI()
    showSection(elements.inputSection)
    elements.tickerInput.focus()
}

// Event listeners
elements.tickerForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const ticker = elements.tickerInput.value.trim()
    if (ticker) {
        addTicker(ticker)
    }
})

// Real-time validation as user types
elements.tickerInput.addEventListener('input', debounce((e) => {
    const value = e.target.value.trim()
    if (value && value.length >= CONFIG.MIN_TICKER_LENGTH) {
        const validation = validateTicker(value)
        if (!validation.valid) {
            showError(validation.error)
        } else {
            clearError()
        }
    } else if (value.length > 0) {
        showError(`Ticker must be at least ${CONFIG.MIN_TICKER_LENGTH} character(s)`)
    } else {
        clearError()
    }
}, CONFIG.DEBOUNCE_DELAY))

// Clear error when user focuses input
elements.tickerInput.addEventListener('focus', () => {
    if (elements.helpText.classList.contains('error')) {
        clearError()
    }
})

// Generate report button
elements.generateBtn.addEventListener('click', fetchStockData)

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape key to go back to input
    if (e.key === 'Escape' && !state.isLoading) {
        window.resetAnalysis()
    }
    
    // Enter key to generate report when button is focused
    if (e.key === 'Enter' && document.activeElement === elements.generateBtn && !elements.generateBtn.disabled) {
        fetchStockData()
    }
})

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    renderTickers()
    updateUI()
    elements.tickerInput.focus()
    
    // Add some CSS for the report formatting
    const style = document.createElement('style')
    style.textContent = `
        .report-header {
            border-bottom: 2px solid var(--gray-200);
            padding-bottom: var(--space-md);
            margin-bottom: var(--space-lg);
        }
        
        .report-header h4 {
            margin: 0 0 var(--space-xs) 0;
            color: var(--gray-900);
            font-size: 1.25rem;
        }
        
        .report-date {
            color: var(--gray-600);
            font-size: 0.875rem;
            margin: 0;
        }
        
        .report-body {
            margin-bottom: var(--space-lg);
        }
        
        .report-body p {
            margin-bottom: var(--space-md);
            text-align: justify;
        }
        
        .report-footer {
            border-top: 1px solid var(--gray-200);
            padding-top: var(--space-md);
            font-size: 0.875rem;
            color: var(--gray-600);
        }
        
        .report-footer p {
            margin: 0;
        }
    `
    document.head.appendChild(style)
})

// Export for testing (if needed)
export { addTicker, removeTicker, validateTicker, state }

function renderTickers() {
    const tickersDiv = document.querySelector('.ticker-choice-display')
    tickersDiv.innerHTML = ''
    tickersArr.forEach((ticker) => {
        const newTickerSpan = document.createElement('span')
        newTickerSpan.textContent = ticker
        newTickerSpan.classList.add('ticker')
        tickersDiv.appendChild(newTickerSpan)
    })
}

const loadingArea = document.querySelector('.loading-panel')
const apiMessage = document.getElementById('api-message')


async function fetchStockData() {
    document.querySelector('.action-panel').style.display = 'none'
    loadingArea.style.display = 'flex'
    try {
        const stockData = await Promise.all(tickersArr.map(async (ticker) => {
            const url = `https://polygon-api-worker.guil-9d2.workers.dev/?ticker=${ticker}&startDate=${dates.startDate}&endDate=${dates.endDate}`
            const response = await fetch(url)
            if (!response.ok) {
                const errMsg = await response.text()
                throw new Error('Worker error: ' + errMsg)
            }
            apiMessage.innerText = 'Creating report...'
            return response.text()
        }))
        fetchReport(stockData.join(''))
    } catch (err) {
        loadingArea.innerText = 'There was an error fetching stock data.'
        console.error(err.message)
    }
}

async function fetchReport(data) {
    const messages = [
        {
            role: 'system',
            content: 'You are a trading guru. Given data on share prices over the past 3 days, write a report of no more than 150 words describing the stocks performance and recommending whether to buy, hold or sell. Use the examples provided between ### to set the style your response.'
        },
        {
            role: 'user',
            content: `${data}
            ###
            OK baby, hold on tight! You are going to haate this! Over the past three days, Tesla (TSLA) shares have plummetted. The stock opened at $223.98 and closed at $202.11 on the third day, with some jumping around in the meantime. This is a great time to buy, baby! But not a great time to sell! But I'm not done! Apple (AAPL) stocks have gone stratospheric! This is a seriously hot stock right now. They opened at $166.38 and closed at $182.89 on day three. So all in all, I would hold on to Tesla shares tight if you already have them - they might bounce right back up and head to the stars! They are volatile stock, so expect the unexpected. For APPL stock, how much do you need the money? Sell now and take the profits or hang on and wait for more! If it were me, I would hang on because this stock is on fire right now!!! Apple are throwing a Wall Street party and y'all invited!
            ###
            Apple (AAPL) is the supernova in the stock sky – it shot up from $150.22 to a jaw-dropping $175.36 by the close of day three. We’re talking about a stock that’s hotter than a pepper sprout in a chilli cook-off, and it’s showing no signs of cooling down! If you’re sitting on AAPL stock, you might as well be sitting on the throne of Midas. Hold on to it, ride that rocket, and watch the fireworks, because this baby is just getting warmed up! Then there’s Meta (META), the heartthrob with a penchant for drama. It winked at us with an opening of $142.50, but by the end of the thrill ride, it was at $135.90, leaving us a little lovesick. It’s the wild horse of the stock corral, bucking and kicking, ready for a comeback. META is not for the weak-kneed So, sugar, what’s it going to be? For AAPL, my advice is to stay on that gravy train. As for META, keep your spurs on and be ready for the rally.
            ###
            `
        }
    ]
    
    try {
        const url = 'https://openai-api-worker.guil-9d2.workers.dev'
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(messages)
        })
        const data = await response.json()
        
        if (!response.ok) {
            throw new Error(`Worker Error: ${data.error}`)
        }
        renderReport(data.content)
    } catch (err) {
        console.error(err.message)
        loadingArea.innerText = 'Unable to access AI. Please refresh and try again'
    }
}

function renderReport(output) {
    loadingArea.style.display = 'none'
    const outputArea = document.querySelector('.output-panel')
    const report = document.createElement('p')
    outputArea.appendChild(report)
    report.textContent = output
    outputArea.style.display = 'flex'
}