
// --- Modernized Tic-Tac-Toe: Player vs Computer ---

const Gameboard = (function () {
  let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];

  const getBoard = () => board;

  const markSpot = (row, col, symbol) => {
    if (board[row][col] === '') {
      board[row][col] = symbol;
      return true;
    }
    return false;
  };

  const checkWinner = () => {
    for (let i = 0; i < 3; i++) {
      if (board[i][0] !== '' && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
        return board[i][0];
      }
      if (board[0][i] !== '' && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
        return board[0][i];
      }
    }
    if (board[0][0] !== '' && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
      return board[0][0];
    }
    if (board[0][2] !== '' && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
      return board[0][2];
    }
    return null;
  };

  const checkTie = () => {
    return board.every(row => row.every(cell => cell !== '')) && !checkWinner();
  };

  const reset = () => {
    board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];
  };

  return {
    getBoard,
    markSpot,
    checkWinner,
    checkTie,
    reset
  };
})();

const Player = (name, symbol) => ({ name, symbol });

let player, computer;
let playerScore = 0, computerScore = 0;
let currentPlayer;
let gameOver = false;

const boardElement = document.querySelector('.board');
const messageElement = document.querySelector('.message');
const restartBtn = document.querySelector('.restart');
const playerForm = document.getElementById('playerForm');
const playerNameInput = document.getElementById('playerNameInput');
const playerNameDisplay = document.getElementById('playerNameDisplay');
const playerScoreDisplay = document.getElementById('playerScore');
const computerScoreDisplay = document.getElementById('computerScore');
const scoreBoard = document.getElementById('scoreBoard');
const darkModeToggle = document.getElementById('darkModeToggle');

function renderBoard() {
  const board = Gameboard.getBoard();
  boardElement.innerHTML = '';
  boardElement.classList.add('d-flex', 'flex-column', 'align-items-center');
  board.forEach((row, rowIndex) => {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('d-flex');
    row.forEach((cell, colIndex) => {
      const cellDiv = document.createElement('div');
      cellDiv.classList.add('cell');
      cellDiv.textContent = cell;
      cellDiv.addEventListener('click', () => handleCellClick(rowIndex, colIndex));
      rowDiv.appendChild(cellDiv);
    });
    boardElement.appendChild(rowDiv);
  });
}

function handleCellClick(row, col) {
  if (gameOver || currentPlayer !== player) return;
  if (!Gameboard.markSpot(row, col, player.symbol)) return;
  renderBoard();
  checkGameState();
  if (!gameOver) {
    setTimeout(computerMove, 400);
  }
}

function computerMove() {
  if (gameOver) return;
  // Simple AI: pick a random empty cell
  const board = Gameboard.getBoard();
  const emptyCells = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === '') emptyCells.push([i, j]);
    }
  }
  if (emptyCells.length === 0) return;
  const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  Gameboard.markSpot(row, col, computer.symbol);
  renderBoard();
  checkGameState();
}

function checkGameState() {
  const winner = Gameboard.checkWinner();
  if (winner) {
    gameOver = true;
    if (winner === player.symbol) {
      messageElement.textContent = `${player.name} wins! 🎉`;
      playerScore++;
      playerScoreDisplay.textContent = playerScore;
    } else {
      messageElement.textContent = `Computer wins! 🤖`;
      computerScore++;
      computerScoreDisplay.textContent = computerScore;
    }
    restartBtn.classList.remove('d-none');
    return;
  }
  if (Gameboard.checkTie()) {
    gameOver = true;
    messageElement.textContent = `It's a tie!`;
    restartBtn.classList.remove('d-none');
    return;
  }
  currentPlayer = currentPlayer === player ? computer : player;
  messageElement.textContent = `${currentPlayer === player ? player.name : 'Computer'}'s turn`;
}

function startGame(name) {
  player = Player(name, 'X');
  computer = Player('Computer', 'O');
  playerNameDisplay.textContent = player.name;
  playerScore = 0;
  computerScore = 0;
  playerScoreDisplay.textContent = playerScore;
  computerScoreDisplay.textContent = computerScore;
  scoreBoard.classList.remove('d-none');
  restartBtn.classList.add('d-none');
  messageElement.textContent = `${player.name}'s turn`;
  Gameboard.reset();
  gameOver = false;
  currentPlayer = player;
  renderBoard();
}

restartBtn.addEventListener('click', () => {
  Gameboard.reset();
  gameOver = false;
  currentPlayer = player;
  messageElement.textContent = `${player.name}'s turn`;
  restartBtn.classList.add('d-none');
  renderBoard();
});

playerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = playerNameInput.value.trim() || 'Player';
  playerForm.classList.add('d-none');
  startGame(name);
});

// Dark mode toggle
let darkMode = false;
darkModeToggle.addEventListener('click', () => {
  darkMode = !darkMode;
  document.body.classList.toggle('dark-mode', darkMode);
  darkModeToggle.textContent = darkMode ? '☀️' : '🌙';
  // Update Bootstrap classes for dark mode
  const formControl = document.querySelectorAll('.form-control');
  formControl.forEach(input => {
    if (darkMode) {
      input.classList.add('bg-dark', 'text-light', 'border-0');
    } else {
      input.classList.remove('bg-dark', 'text-light', 'border-0');
    }
  });
  const btns = document.querySelectorAll('.btn');
  btns.forEach(btn => {
    if (darkMode) {
      btn.classList.add('btn-dark');
      btn.classList.remove('btn-light');
    } else {
      btn.classList.remove('btn-dark');
      btn.classList.add('btn-light');
    }
  });
});

// If player refreshes, show form again
window.onload = () => {
  playerForm.classList.remove('d-none');
  scoreBoard.classList.add('d-none');
  restartBtn.classList.add('d-none');
  messageElement.textContent = '';
  boardElement.innerHTML = '';
};
