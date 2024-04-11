document.addEventListener("DOMContentLoaded", function() {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  
  const tileSize = 20;
  const canvasSize = 600; // Adjusted canvas size
  canvas.width = canvasSize;
  canvas.height = canvasSize;

  let snake, apple, gameLoop, isPlaying;

  function initializeGame() {
    snake = {
      x: Math.floor(canvasSize / tileSize / 2),
      y: Math.floor(canvasSize / tileSize / 2),
      dx: 1,
      dy: 0,
      cells: [{x: Math.floor(canvasSize / tileSize / 2), y: Math.floor(canvasSize / tileSize / 2)}],
      maxCells: 4
    };
    apple = {x: 0, y: 0};
    isPlaying = false;
    clearInterval(gameLoop);
    document.getElementById("playButton").style.display = "flex";
    document.getElementById("restartButton").style.display = "none"; // Hide the restart button initially
    document.getElementById("gameOver").style.display = "none";
    draw();
  }

  function startGame() {
    initializeGame();
    isPlaying = true;
    document.getElementById("playButton").style.display = "none"; // Hide the play button
    spawnApple();
    gameLoop = setInterval(update, 100);
  }

  function endGame() {
    isPlaying = false;
    clearInterval(gameLoop);
    document.getElementById("gameOver").style.display = "flex";
    document.getElementById("playButton").style.display = "none"; // Hide the play button when the game ends
    document.getElementById("restartButton").style.display = "flex"; // Display the restart button
  }

  function spawnApple() {
    apple.x = Math.floor(Math.random() * (canvasSize / tileSize));
    apple.y = Math.floor(Math.random() * (canvasSize / tileSize));
  }

  function update() {
    snake.x += snake.dx;
    snake.y += snake.dy;

    if (snake.x < 0 || snake.x >= canvasSize / tileSize || snake.y < 0 || snake.y >= canvasSize / tileSize) {
      endGame();
    }

    snake.cells.unshift({x: snake.x, y: snake.y});
    if (snake.cells.length > snake.maxCells) {
      snake.cells.pop();
    }

    if (snake.cells.some(cell => cell.x === apple.x && cell.y === apple.y)) {
      snake.maxCells++;
      spawnApple();
    }

    if (snake.cells.slice(1).some(cell => cell.x === snake.x && cell.y === snake.y)) {
      endGame();
    }

    draw();
  }

  function draw() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    ctx.fillStyle = "red";
    ctx.fillRect(apple.x * tileSize, apple.y * tileSize, tileSize, tileSize);

    ctx.fillStyle = "green";
    snake.cells.forEach(cell => {
      ctx.fillRect(cell.x * tileSize, cell.y * tileSize, tileSize, tileSize);
    });
  }

  document.getElementById("playButton").addEventListener("click", startGame);
  document.getElementById("restartButton").addEventListener("click", startGame); // Restart the game when the restart button is clicked

  document.addEventListener("keydown", e => {
    if (!isPlaying) return;
    switch (e.key) {
      case "ArrowUp":
        if (snake.dy === 0) {
          snake.dx = 0;
          snake.dy = -1;
        }
        break;
      case "ArrowDown":
        if (snake.dy === 0) {
          snake.dx = 0;
          snake.dy = 1;
        }
        break;
      case "ArrowLeft":
        if (snake.dx === 0) {
          snake.dx = -1;
          snake.dy = 0;
        }
        break;
      case "ArrowRight":
        if (snake.dx === 0) {
          snake.dx = 1;
          snake.dy = 0;
        }
        break;
    }
  });
});
