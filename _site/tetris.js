const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 20;

let board = [];

for (let row = 0; row < ROWS; row++) {
    board[row] = [];
    for (let col = 0; col < COLS; col++) {
      board[row][col] = 0;
    }
  }

  function drawBoard() {
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        drawBlock(col, row, board[row][col]);
      }
    }
  }

  function drawBlock(x, y, color) {
    context.fillStyle = getColor(color);
    context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    context.strokeStyle = '#000';
    context.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
  }

  function getColor(color) {
    switch (color) {
      case 1:
        return 'cyan';
      case 2:
        return 'blue';
      case 3:
        return 'orange';
      case 4:
        return 'yellow';
      case 5:
        return 'green';
      case 6:
        return 'purple';
      case 7:
        return 'red';
      default:
        return 'white';
    }
  }

  let currentPiece = {
    x: 0,
    y: 0,
    shape: [
      [1, 1],
      [1, 1]
    ]
  };

  function drawPiece(piece) {
    piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          drawBlock(piece.x + x, piece.y + y, piece.shape);
        }
      });
    });
  }

  function clearPiece(piece) {
    piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          drawBlock(piece.x + x, piece.y + y, 0);
        }
      });
    });
  }

  function movePieceDown() {
    if (!collides(currentPiece.x, currentPiece.y + 1, currentPiece.shape)) {
      clearPiece(currentPiece);
      currentPiece.y++;
      drawPiece(currentPiece);
    } else {
      mergePiece();
      checkLines();
      if (currentPiece.y === 0) {
        // Game over condition
        alert('Game Over!');
        location.reload(); // Reload the page
      }
      spawnPiece();
    }
  }

  function rotatePiece() {
    clearPiece(currentPiece);
    currentPiece.shape = rotate(currentPiece.shape);
    drawPiece(currentPiece);
  }

  function rotate(shape) {
    let rotatedShape = [];
    for (let y = 0; y < shape.length; y++) {
      rotatedShape[y] = [];
      for (let x = 0; x < shape.length; x++) {
        rotatedShape[y][x] = shape[x][shape.length - 1 - y];
      }
    }
    return rotatedShape;
  }

  function mergePiece() {
    currentPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          board[currentPiece.y + y][currentPiece.x + x] = value;
        }
      });
    });
  }

  function spawnPiece() {
    currentPiece.x = Math.floor(COLS / 2) - 1;
    currentPiece.y = 0;
    currentPiece.shape = getRandomShape();
  }

  function getRandomShape() {
    const shapes = [
      [[1, 1], [1, 1]],
      [[1, 1, 1, 1]],
      [[1, 1, 0], [0, 1, 1]],
      [[0, 1, 1], [1, 1, 0]],
      [[1, 1, 1], [0, 1, 0]],
      [[1, 1, 1], [1, 0, 0]],
      [[1, 1, 1], [0, 0, 1]]
    ];
    return shapes[Math.floor(Math.random() * shapes.length)];
  }

  function collides(x, y, shape) {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (
          shape[row][col] &&
          (board[y + row] && board[y + row][x + col]) !== 0
        ) {
          return true;
        }
      }
    }
    return false;
  }

  function checkLines() {
    for (let y = ROWS - 1; y >= 0; y--) {
      if (board[y].every(block => block !== 0)) {
        // Clear the line
        board.splice(y, 1);
        // Add a new empty line at the top
        board.unshift(new Array(COLS).fill(0));
      }
    }
  }

  function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawPiece(currentPiece);
    requestAnimationFrame(draw);
  }

  // Game loop
  setInterval(movePieceDown, 1000);

  document.addEventListener('keydown', (event) => {
    if (event.keyCode === 37) {
      // Left arrow key
      if (!collides(currentPiece.x - 1, currentPiece.y, currentPiece.shape)) {
        clearPiece(currentPiece);
        currentPiece.x--;
        drawPiece(currentPiece);
      }
    } else if (event.keyCode === 39) {
      // Right arrow key
      if (!collides(currentPiece.x + 1, currentPiece.y, currentPiece.shape)) {
        clearPiece(currentPiece);
        currentPiece.x++;
        drawPiece(currentPiece);
      }
    } else if (event.keyCode === 40) {
      // Down arrow key
      movePieceDown();
    } else if (event.keyCode === 38) {
      // Up arrow key
      rotatePiece();
    }
  });

  draw();