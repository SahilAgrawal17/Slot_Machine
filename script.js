const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    "diamond" : 1,
    "gold" : 1,
    "silver" : 1,
    "bronze" : 9
};

const SYMBOL_VALUES = {
    "diamond" : 7,
    "gold" : 5,
    "silver" : 3,
    "bronze" : 2
};

let balance = 0; // Initialize balance variable

// Function to update balance display
const updateBalanceDisplay = () => {
    const balanceSpan = document.getElementById("balance");
    balanceSpan.textContent = balance.toFixed(2); // Assuming balance is a floating-point number
};
let flag=false;
// Function to handle depositing money
const deposit = () => {
    const depositButton = document.getElementById("deposit-button");
    const depositInput = document.getElementById("deposit-input");
    
    depositButton.addEventListener("click", () => {
        const depositAmount = parseFloat(depositInput.value);
        if(isNaN(depositAmount) || depositAmount <= 0) {
            console.log("Invalid deposit amount, try again.");
        } else {
            flag=1;
            balance += depositAmount;
            updateBalanceDisplay();
            depositInput.value = ""; // Clear input field after deposit
        }
    });
};

const displayMessage = (message) => {
    const messageDiv = document.getElementById("message");
    messageDiv.textContent = message;
};
// Function to handle spinning the slot machine
const spin = () => {
    if(balance >0 && betAmount>0){
        const reels = [];
        for (let i = 0; i < COLS; i++) {
            const reelSymbols = [];
            for (let j = 0; j < ROWS; j++) {
                let symbolKeys = [];
                // Adjust probabilities based on your requirements
                const randomNumber = Math.random();
                if (randomNumber < 0.15) { // 15% probability for Diamond
                    symbolKeys = ['Diamond'];
                } else if (randomNumber < 0.35) { // 20% probability for Gold
                    symbolKeys = ['Gold'];
                } else if (randomNumber < 0.65) { // 30% probability for Silver
                    symbolKeys = ['Silver'];
                } else { // 35% probability for Bronze
                    symbolKeys = ['Bronze'];
                }
                const randomSymbol = symbolKeys[Math.floor(Math.random() * symbolKeys.length)];
                reelSymbols.push(randomSymbol);
            }
            reels.push(reelSymbols);
        }
        if (!flag) {
            const lines = parseInt(document.getElementById("lines-input").value);
            const betAmount = parseFloat(document.getElementById("bet-input").value);
            const totalBetAmount = lines * betAmount;
    
            balance -= totalBetAmount;
            updateBalanceDisplay();
        }
    
        // Reset the betPlaced flag
        flag = false;
        printReels(reels); // Update the display with the new symbols
        for (let i = 0; i < COLS; i++) {
            const reelElements = document.querySelectorAll(`.reel-${i + 1}`);
            reelElements.forEach((reel, index) => {
                reel.classList.remove(`reel-spin-column-${i + 1}`); // Remove the class first to reset the animation
                void reel.offsetWidth; // Trigger reflow to restart the animation
                reel.classList.add(`reel-spin-column-${i + 1}`); // Add the class to start the animation
            });
        }
        let winnings = 0;
        for (let i = 0; i < ROWS; i++) {
            const symbols = reels[i];
            let allSame = true;
            for (let j = 1; j < symbols.length; j++) {
                if (symbols[j] !== symbols[0]) {
                    allSame = false;
                    break;
                }
            }
            if (allSame) {
                const symbol = symbols[0];
                switch (symbol) {
                    case 'Diamond':
                        winnings += betAmount * 7;
                        winType = 'Diamond';
                        break;
                    case 'Gold':
                        winnings += betAmount * 4;
                        winType = 'Gold';
                        break;
                    case 'Silver':
                        winnings += betAmount * 3;
                        winType = 'Silver';
                        break;
                    case 'Bronze':
                        winnings += betAmount * 2;
                        winType = 'Bronze';
                        break;
                }
                if (winType) {
                    console.log(`Congratulations! You won ${winType}!`);
                }
            }
        }
    balance += winnings;
    updateBalanceDisplay();
        }// Update the balance display
};
let betAmount = 0;
const placeBet = () => {
    const betButton = document.getElementById("bet-button");
    const linesInput = document.getElementById("lines-input");
    const betInput = document.getElementById("bet-input");
    
    betButton.addEventListener("click", () => {
        const lines = parseInt(linesInput.value);
        betAmount = parseFloat(betInput.value); // Assign value to betAmount
        // const totalBetAmount = lines * betAmount;
        const totalBetAmount = lines * betAmount;
        
        if (isNaN(lines) || isNaN(betAmount) || lines <= 0 || betAmount <= 0) {
            console.log("Invalid input, try again.");
            return;
        }
        
        if (totalBetAmount > balance) {
            console.log("Insufficient balance.");
            return;
        }
        
        // Check if balance will become negative after deducting the bet amount
        if (balance - totalBetAmount < 0) {
            console.log("Bet amount exceeds balance.");
            return;
        }
        flag=true;
        balance -= totalBetAmount; // Deduct the bet amount from the balance
        updateBalanceDisplay(); // Update the balance display
    });
};

const printReels = (reels) => {
    for(let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            const reelColumn = reels[j][i];
            const slotElement = document.getElementById(`reel${j * ROWS + i + 1}`);
            slotElement.style.backgroundImage = `url('images/${reelColumn}.jpg')`; // Corrected the URL path
        }
    }
};

// Function to initialize the game
const initGame = () => {
    deposit(); // Enable deposit functionality
    placeBet(); // Enable bet placement functionality
    
    const spinButton = document.getElementById("spin-button");
    spinButton.addEventListener("click", spin); // Add event listener for Spin button
};

initGame(); // Start the game