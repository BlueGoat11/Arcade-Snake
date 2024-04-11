// Wait for the DOM content to be fully loaded before executing the script
document.addEventListener("DOMContentLoaded", function () {
    // Function to retrieve the high score from local storage
    function getHighScore() {
        return localStorage.getItem("highScore") ? parseInt(localStorage.getItem("highScore")) : 0;
    }

    // Function to set the high score in local storage
    function setHighScore(score) {
        localStorage.setItem("highScore", score);
    }

    // Get the canvas element and its context
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    // Define the size of each tile and the overall canvas size
    const tileSize = 20;
    const canvasSize = 600;
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    // Initialize variables for the snake, apple, game loop, and game state
    let snake, apple, gameLoop, isPlaying, score, highScore;

    // Function to initialize the game state
    function initializeGame() {
        // Set initial snake position and direction
        snake = {
            x: Math.floor(canvasSize / tileSize / 2),
            y: Math.floor(canvasSize / tileSize / 2),
            dx: 1,
            dy: 0,
            cells: [{ x: Math.floor(canvasSize / tileSize / 2), y: Math.floor(canvasSize / tileSize / 2) }],
            maxCells: 4
        };
        // Initialize the apple position and score
        apple = { x: 0, y: 0 };
        score = 0;
        // Retrieve the high score from local storage
        highScore = getHighScore();
        // Set game state to not playing and clear any existing game loop
        isPlaying = false;
        clearInterval(gameLoop);
        // Show the play button and hide the restart button and game over message
        document.getElementById("playButton").style.display = "flex";
        document.getElementById("restartButton").style.display = "none";
        document.getElementById("gameOver").style.display = "none";
        // Update the score and high score display
        document.getElementById("scoreValue").textContent = score;
        document.getElementById("highScoreValue").textContent = highScore;
        // Draw the initial game state
        draw();
    }

    // Function to start the game
    function startGame() {
        // Initialize the game
        initializeGame();
        // Set game state to playing
        isPlaying = true;
        // Hide the play button
        document.getElementById("playButton").style.display = "none";
        // Spawn the initial apple and start the game loop
        spawnApple();
        gameLoop = setInterval(update, 100);
    }

    // Function to end the game
    function endGame() {
        // Set game state to not playing and clear the game loop
        isPlaying = false;
        clearInterval(gameLoop);
        // Display the game over message and show the restart button
        document.getElementById("gameOver").style.display = "flex";
        document.getElementById("playButton").style.display = "none";
        document.getElementById("restartButton").style.display = "flex";
        // Update the high score if the current score is higher
        if (score > highScore) {
            highScore = score;
            document.getElementById("highScoreValue").textContent = highScore;
            setHighScore(highScore);
        }
    }

    // Function to spawn a new apple at a random position on the canvas
    function spawnApple() {
        apple.x = Math.floor(Math.random() * (canvasSize / tileSize));
        apple.y = Math.floor(Math.random() * (canvasSize / tileSize));
    }

    // Function to update the game state on each game tick
    function update() {
        // Move the snake
        snake.x += snake.dx;
        snake.y += snake.dy;

        // Check if the snake collides with the walls or itself
        if (snake.x < 0 || snake.x >= canvasSize / tileSize || snake.y < 0 || snake.y >= canvasSize / tileSize) {
            endGame();
        }

        // Update the snake's cells
        snake.cells.unshift({ x: snake.x, y: snake.y });
        if (snake.cells.length > snake.maxCells) {
            snake.cells.pop();
        }

        // Check if the snake eats the apple
        if (snake.cells.some(cell => cell.x === apple.x && cell.y === apple.y)) {
            snake.maxCells++;
            spawnApple();
            score++; // Increment the score
            document.getElementById("scoreValue").textContent = score; // Update the score display
        }

        // Check if the snake collides with itself
        if (snake.cells.slice(1).some(cell => cell.x === snake.x && cell.y === snake.y)) {
            endGame();
        }

        // Draw the updated game state
        draw();
    }

    // Function to draw the game state on the canvas
    function draw() {
        ctx.clearRect(0, 0, canvasSize, canvasSize);

        // Draw the apple
        ctx.fillStyle = "red";
        ctx.fillRect(apple.x * tileSize, apple.y * tileSize, tileSize, tileSize);

        // Draw the snake
        ctx.fillStyle = "green";
        snake.cells.forEach(cell => {
            ctx.fillRect(cell.x * tileSize, cell.y * tileSize, tileSize, tileSize);
        });
    }

    // Event listener for the play button click
    document.getElementById("playButton").addEventListener("click", startGame);

    // Event listener for the restart button click
    document.getElementById("restartButton").addEventListener("click", startGame);

    // Event listener for keyboard input to control the snake
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
