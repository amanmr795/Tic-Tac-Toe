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
let turnO = true; // true for O's turn, false for X's turn
let moveCount = 0; // To track moves for draw condition
let players = {
    x: "Player 1",
    o: "Player 2"
};
let scores = {
    x: 0,
    o: 0
};

const winPatterns = [
    [0, 1, 2], [0, 3, 6], [0, 4, 8],
    [1, 4, 7], [2, 5, 8], [2, 4, 6],
    [3, 4, 5], [6, 7, 8],
];

// --- Core Functions ---

const enableBoxes = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = "";
        box.classList.remove("x-text", "o-text");
    }
};

const disableBoxes = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
};

const updateTurnIndicator = () => {
    const currentPlayerName = turnO ? players.o : players.x;
    const currentPlayerSymbol = turnO ? "O" : "X";
    turnIndicator.innerText = `${currentPlayerName}'s Turn (${currentPlayerSymbol})`;
};

const handleBoxClick = (box) => {
    if (box.innerText !== "") {
        return; // Do nothing if the box is already filled
    }

    const currentPlayer = turnO ? "O" : "X";
    box.innerText = currentPlayer;
    box.classList.add(turnO ? "o-text" : "x-text");
    
    moveCount++;
    box.disabled = true; // Disable the clicked box

    const winnerFound = checkWinner();

    if (!winnerFound) {
        turnO = !turnO; // Switch turns only if there's no winner yet
        updateTurnIndicator();
    }
};

const checkWinner = () => {
    for (let pattern of winPatterns) {
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;

        if (pos1Val !== "" && pos1Val === pos2Val && pos2Val === pos3Val) {
            showWinner(pos1Val);
            return true; // Winner found
        }
    }

    if (moveCount === 9) {
        showDraw();
        return true; // It's a draw, game over
    }
    return false; // No winner yet
};

const showWinner = (winnerSymbol) => {
    const winnerName = winnerSymbol === "O" ? players.o : players.x;
    msg.innerText = `Congratulations, Winner is ${winnerName}!`;
    msgContainer.classList.remove("hide");
    disableBoxes();

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

const resetGame = () => {
    turnO = true;
    moveCount = 0;
    msgContainer.classList.add("hide");
    enableBoxes();
    updateTurnIndicator();
};

// --- Local Storage Functions ---

const saveScores = () => {
    localStorage.setItem("ticTacToeScores", JSON.stringify(scores));
};

const loadScores = () => {
    const savedScores = localStorage.getItem("ticTacToeScores");
    if (savedScores) {
        scores = JSON.parse(savedScores);
    }
    updateScoreDisplay();
};

const updateScoreDisplay = () => {
    scoreXDisplay.innerText = scores.x;
    scoreODisplay.innerText = scores.o;
};

// --- Initial Game Setup ---

// Attach the click event listener to each box
boxes.forEach((box) => {
    box.addEventListener("click", () => handleBoxClick(box));
});

// Event listeners for buttons
newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);
startGameBtn.addEventListener("click", () => {
    const p1Name = player1Input.value || "Player X";
    const p2Name = player2Input.value || "Player O";
    players.x = p1Name;
    players.o = p2Name;

    p1NameDisplay.innerText = `${p1Name} (X)`;
    p2NameDisplay.innerText = `${p2Name} (O)`;
    
    startupModal.classList.add("hide");
    mainContent.classList.remove("hide");

    loadScores();
    resetGame(); // Call resetGame to ensure the board is ready for the first play
});