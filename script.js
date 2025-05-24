
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
        return true; 
      }
      if (board[0][i] !== '' && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
        return true; 
      }
    }
    
    if (board[0][0] !== '' && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
      return true;
    }
    if (board[0][2] !== '' && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
      return true;
    }

    return false; 
  };

  
  const checkTie = () => {
    return board.every(row => row.every(cell => cell !== ''));
  };

  return {
    getBoard,
    markSpot,
    checkWinner,
    checkTie
  };
})();


const Player = (name, symbol) => {
  return {
    name,
    symbol
  };
};


const Game = (function () {
  let currentPlayer;
  let gameOver = false;

  
  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  
  const playMove = (row, col) => {
    if (gameOver) return;

    const success = Gameboard.markSpot(row, col, currentPlayer.symbol);
    if (!success) {
      console.log('Spot already taken!');
      return;
    }

    if (Gameboard.checkWinner()) {
      console.log(`${currentPlayer.name} wins!`);
      gameOver = true;
      displayController.displayWinner(currentPlayer.name);
      return;
    }

    if (Gameboard.checkTie()) {
      console.log('It\'s a tie!');
      gameOver = true;
      displayController.displayTie();
      return;
    }

    switchPlayer(); 
  };

  
  const resetGame = () => {
    Gameboard.getBoard().forEach(row => row.fill(''));
    gameOver = false;
    currentPlayer = player1;
  };

  const isGameOver = () => gameOver;

  return {
    playMove,
    resetGame,
    isGameOver 
  };
})();


const displayController = (function () {
  const boardElement = document.querySelector('.board');
  const messageElement = document.querySelector('.message');
  
  
  const renderBoard = () => {
    const board = Gameboard.getBoard();
    boardElement.innerHTML = ''; 

    board.forEach((row, rowIndex) => {
      const rowElement = document.createElement('div');
      rowElement.classList.add('row');
      row.forEach((cell, colIndex) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.textContent = cell;
        cellElement.addEventListener('click', () => handleCellClick(rowIndex, colIndex));
        rowElement.appendChild(cellElement);
      });
      boardElement.appendChild(rowElement);
    });
  };

  
  const handleCellClick = (row, col) => {
    if (Game.isGameOver()) return; 

    Game.playMove(row, col);
    renderBoard();
  };

  
  const displayWinner = (winner) => {
    messageElement.textContent = `${winner} wins!`;
  };

    const displayTie = () => {
    messageElement.textContent = 'It\'s a tie!';
  };

  return {
    renderBoard,
    displayWinner,
    displayTie
  };
})();


const player1 = Player('Player 1', 'X');
const player2 = Player('Player 2', 'O');

Game.resetGame(); 


displayController.renderBoard();


document.querySelector('.restart').addEventListener('click', () => {
  Game.resetGame();
  displayController.renderBoard();
});
