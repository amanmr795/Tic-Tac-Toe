// DOM Element Selection
const boxes = document.querySelectorAll(".box");
const resetBtn = document.querySelector("#reset-btn");
const newGameBtn = document.querySelector("#new-btn");
const msgContainer = document.querySelector(".msg-container");
const msg = document.querySelector("#msg");
const turnIndicator = document.querySelector("#turn-indicator");

// Startup Modal Elements
const startupModal = document.querySelector("#startup-modal");
const startGameBtn = document.querySelector("#start-game-btn");
const mainContent = document.querySelector(".main-content");
const player1Input = document.querySelector("#player1-name");
const player2Input = document.querySelector("#player2-name");
const p1NameDisplay = document.querySelector("#p1-name");
const p2NameDisplay = document.querySelector("#p2-name");
const scoreXDisplay = document.querySelector("#score-x");
const scoreODisplay = document.querySelector("#score-o");


// Game State Variables
let turnO = true;
let moveCount = 0;
let players = { x: "Player 1", o: "Player 2" };
let scores = { x: 0, o: 0 };

const winPatterns = [
    [0, 1, 2], [0, 3, 6], [0, 4, 8],
    [1, 4, 7], [2, 5, 8], [2, 4, 6],
    [3, 4, 5], [6, 7, 8],
];

// --- Core Game Functions ---

const resetBoard = () => {
    turnO = true;
    moveCount = 0;
    enableBoxes();
    msgContainer.classList.add("hide");
    updateTurnIndicator();
};

const startNewSession = () => {
    // Clear session storage and reset scores to 0
    sessionStorage.removeItem("ticTacToeScores");
    scores = { x: 0, o: 0 };
    updateScoreDisplay();
    resetBoard();
};

const checkWinner = () => {
    let isWinner = false;
    for (let pattern of winPatterns) {
        const [pos1, pos2, pos3] = [boxes[pattern[0]].innerText, boxes[pattern[1]].innerText, boxes[pattern[2]].innerText];
        if (pos1 !== "" && pos1 === pos2 && pos2 === pos3) {
            showWinner(pos1);
            isWinner = true;
            break;
        }
    }

    if (!isWinner && moveCount === 9) {
        showDraw();
    }
};

const showWinner = (winnerSymbol) => {
    const winnerName = winnerSymbol === "O" ? players.o : players.x;
    msg.innerText = `Congratulations, Winner is ${winnerName}!`;
    msgContainer.classList.remove("hide");
    disableBoxes();
    
    // Update score for the current session
    if (winnerSymbol === "O") scores.o++;
    else scores.x++;
    
    saveScores();
    updateScoreDisplay();
};

const showDraw = () => {
    msg.innerText = `It's a Draw!`;
    msgContainer.classList.remove("hide");
    disableBoxes();
};

const disableBoxes = () => {
    boxes.forEach(box => box.disabled = true);
};

const enableBoxes = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = "";
        box.classList.remove("x-text", "o-text");
    }
};

const updateTurnIndicator = () => {
    const currentPlayerName = turnO ? players.o : players.x;
    const currentPlayerSymbol = turnO ? "O" : "X";
    turnIndicator.innerText = `${currentPlayerName}'s Turn (${currentPlayerSymbol})`;
};

// --- Session Storage for Score Persistence ---

const saveScores = () => {
    sessionStorage.setItem("ticTacToeScores", JSON.stringify(scores));
};

const loadScores = () => {
    const savedScores = sessionStorage.getItem("ticTacToeScores");
    if (savedScores) {
        scores = JSON.parse(savedScores);
    }
    updateScoreDisplay();
};

const updateScoreDisplay = () => {
    scoreXDisplay.innerText = scores.x;
    scoreODisplay.innerText = scores.o;
};

// --- Event Listeners Setup ---

// Start a brand new session with fresh scores
startGameBtn.addEventListener("click", () => {
    const p1Name = player1Input.value || "Player X";
    const p2Name = player2Input.value || "Player O";
    players.x = p1Name;
    players.o = p2Name;

    p1NameDisplay.innerText = `${p1Name} (X)`;
    p2NameDisplay.innerText = `${p2Name} (O)`;
    
    startupModal.classList.add("hide");
    mainContent.classList.remove("hide");

    startNewSession(); // This function resets scores to zero
});

// "Play Again" button just resets the board, keeping the session score
newGameBtn.addEventListener("click", resetBoard);

// "Reset Score & New Game" button starts a fresh session
resetBtn.addEventListener("click", startNewSession);

// Add click listeners to each game box
boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (box.innerText === "") {
            const currentPlayer = turnO ? "O" : "X";
            box.innerText = currentPlayer;
            box.classList.add(turnO ? "o-text" : "x-text");
            
            moveCount++;
            turnO = !turnO;
            box.disabled = true;

            updateTurnIndicator();
            checkWinner();
        }
    });
});

// Load scores when the page loads. If it's a new session, this will be empty.
loadScores();