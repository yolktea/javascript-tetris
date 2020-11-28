document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector(".grid");
    let squares = Array.from(document.querySelectorAll(".grid div"));
    const scoreDisp = document.querySelector("#score");
    const startButton = document.querySelector("#start-button");
    const audioIcon = document.querySelector("#audio-icon");
  
    var xDown = null;
    var yDown = null;
  
    function getTouches(evt) {
      return evt.touches;
    }
    function handleStart(evt) {
      const firstTouch = getTouches(evt)[0];
      xDown = firstTouch.clientX;
      yDown = firstTouch.clientY;
    }
  
    function handleMove(evt) {
      if (!xDown || !yDown) {
        return;
      }
      var xUp = evt.touches[0].clientX;
      var yUp = evt.touches[0].clientY;
  
      var xDiff = xDown - xUp;
      var yDiff = yDown - yUp;
  
      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
          moveLeft();
        } else {
          moveRight();
        }
      } else {
        if (yDiff > 0) {
          rotate();
        } else {
          moveDown();
        }
      }
  
      xDown = null;
      yDown = null;
    }
  
    const bgm = document.getElementById("bgm");
    bgm.loop = true;
    bgm.status = true;
  
    const width = 10;
    let nextRandom = 0;
    let timerID;
    let score = 000;
    const colors = [
      "radial-gradient(circle,#f2aa03 ,#c33806)",
      "radial-gradient(circle,#ffd7ed ,#c80186)",
      "radial-gradient(circle,#eb161b ,#340404)",
      "radial-gradient(circle,#b13cf6 ,#060739)",
      "radial-gradient(circle,#adda12 ,#2d9e22)",
      "radial-gradient(circle,#00d4ff,#090979)",
    ];
  
    let timePeriod = 500;
    let point = 10;
    paused = false;
  
    const lTetromino = [
      [1, width + 1, width * 2 + 1, 2],
      [width, width + 1, width + 2, width * 2 + 2],
      [1, width + 1, width * 2 + 1, width * 2],
      [width, width * 2, width * 2 + 1, width * 2 + 2],
    ];
  
    const lTetrominoR = [
      [0, 1, width + 1, width * 2 + 1],
      [width, width + 1, width + 2, width * 2],
      [1, width + 1, width * 2 + 1, width * 2 + 2],
      [width + 2, width * 2, width * 2 + 1, width * 2 + 2],
    ];
  
    const oTetromino = [
      [0, 1, width, width + 1],
      [0, 1, width, width + 1],
      [0, 1, width, width + 1],
      [0, 1, width, width + 1],
    ];
  
    const tTetromino = [
      [0, 1, 2, width + 1],
      [width, 1, width + 1, width * 2 + 1],
      [1, width, width + 1, width + 2],
      [1, width + 1, width * 2 + 1, width + 2],
    ];
  
    const zTetromino = [
      [0, 1, width + 1, width + 2],
      [2, width + 1, width + 2, width * 2 + 1],
      [0, 1, width + 1, width + 2],
      [2, width + 1, width + 2, width * 2 + 1],
    ];
  
    const iTetromino = [
      [1, width + 1, width * 2 + 1, width * 3 + 1],
      [width, width + 1, width + 2, width + 3],
      [1, width + 1, width * 2 + 1, width * 3 + 1],
      [width, width + 1, width + 2, width + 3],
    ];
  
    const theTetrominos = [
      lTetromino,
      lTetrominoR,
      iTetromino,
      zTetromino,
      oTetromino,
      tTetromino,
    ];
  
    let curPosition = 3;
    let curRotation = 0;
  
    let rand = Math.floor(Math.random() * theTetrominos.length);
    let current = theTetrominos[rand][curRotation];
  
    function addTetromino() {
      current.forEach((index) => {
        squares[curPosition + index].classList.add("tetromino");
        squares[curPosition + index].style.backgroundImage = colors[rand];
      });
    }
    function removeTetromino() {
      current.forEach((index) => {
        squares[curPosition + index].classList.remove("tetromino");
        squares[curPosition + index].style.backgroundColor = "";
        squares[curPosition + index].style.backgroundImage = "";
      });
    }
  
    function control(e) {
      if (e.keyCode === 37) {
        moveLeft();
      } else if (e.keyCode === 39) {
        moveRight();
      } else if (e.keyCode === 40) {
        moveDown();
      } else if (e.keyCode === 38 || e.keyCode === 87) {
        rotate();
      } else if (e.keyCode === 80) {
        if (!paused) {
          pauseGame();
        } else {
          paused = false;
          playGame();
        }
      } else if (e.keyCode === 77) {
        toggleMusic();
      }
    }
    document.addEventListener("keydown", control);
    document.addEventListener("touchstart", handleStart, false);
    document.addEventListener("touchmove", handleMove, false);
  
    function toggleMusic() {
      if (bgm.status) {
        bgm.pause();
        bgm.status = false;
      } else {
        bgm.play();
        bgm.status = true;
      }
    }
  
    function moveDown() {
      if (!paused) {
        removeTetromino();
        curPosition += width;
        addTetromino();
        freeze();
      }
    }
  
    function freeze() {
      if (
        current.some((index) =>
          squares[curPosition + index + width].classList.contains("taken")
        )
      ) {
        current.forEach((index) => {
          squares[curPosition + index].classList.add("taken");
        });
  
        rand = nextRandom;
        nextRandom = Math.floor(Math.random() * theTetrominos.length);
        current = theTetrominos[rand][curRotation];
        curPosition = 4;
        curRotation = 0;
        addTetromino();
        dispShape();
        addScore();
        gameOver();
      }
    }
  
    function moveLeft() {
      if (!paused) {
        removeTetromino();
        const isAtLeftEdge = current.some(
          (index) => (curPosition + index) % width === 0
        );
  
        if (!isAtLeftEdge) curPosition -= 1;
  
        if (
          current.some((index) =>
            squares[curPosition + index].classList.contains("taken")
          )
        ) {
          curPosition += 1;
        }
        addTetromino();
      }
    }
  
    function moveRight() {
      if (!paused) {
        removeTetromino();
        const isAtRightEdge = current.some(
          (index) => (curPosition + index) % width === width - 1
        );
  
        if (!isAtRightEdge) curPosition += 1;
  
        if (
          current.some((index) =>
            squares[curPosition + index].classList.contains("taken")
          )
        ) {
          curPosition -= 1;
        }
        addTetromino();
      }
    }
  
    function rotate() {
      if (!paused) {
        removeTetromino();
        curRotation++;
        if (curRotation === current.length) {
          curRotation = 0;
        }
        current = theTetrominos[rand][curRotation];
        addTetromino();
      }
    }
  
    const dispSquares = document.querySelectorAll(".column .mini-grid div");
    const dispWidth = 4;
    const dispIndex = 1;
    const NextTetrominos = [
      [1, dispWidth + 1, dispWidth * 2 + 1, 2], //l
      [1, dispWidth + 1, dispWidth * 2 + 1, 0], //lR
      [1, dispWidth + 1, dispWidth * 2 + 1, dispWidth * 3 + 1], //i
      [0, 1, dispWidth + 1, dispWidth + 2], //z
      [0, 1, dispWidth, dispWidth + 1], //o
      [0, 1, 2, dispWidth + 1], //t
    ];
  
    function dispShape() {
      dispSquares.forEach((square) => {
        square.classList.remove("tetromino");
        square.style.backgroundColor = "";
        square.style.backgroundImage = "";
      });
  
      NextTetrominos[nextRandom].forEach((index) => {
        dispSquares[dispIndex + index].classList.add("tetromino");
        dispSquares[dispIndex + index].style.backgroundImage = colors[nextRandom];
      });
    }
  
    startButton.addEventListener("click", () => {
      if (timerID) {
        pauseGame();
      } else {
        playGame();
      }
    });
  
    function pauseGame() {
      bgm.pause();
      clearInterval(timerID);
      timerID = null;
      paused = true;
    }
  
    function playGame() {
      if (bgm.status) {
        bgm.play();
      }
      addTetromino();
      timerID = setInterval(moveDown, timePeriod);
      nextRandom = Math.floor(Math.random() * theTetrominos.length);
      dispShape();
      paused = false;
    }
    audioIcon.addEventListener("click", () => toggleMusic());
  
    function addScore() {
      for (let i = 0; i < 199; i += width) {
        const row = [
          i,
          i + 1,
          i + 2,
          i + 3,
          i + 4,
          i + 5,
          i + 6,
          i + 7,
          i + 8,
          i + 9,
        ];
  
        if (row.every((index) => squares[index].classList.contains("taken"))) {
          score += point;
          scoreDisp.innerHTML = score;
          row.forEach((index) => {
            squares[index].classList.remove("taken");
            squares[index].classList.remove("tetromino");
            squares[index].style.backgroundColor = "";
            squares[index].style.backgroundImage = "";
          });
          const squaresRemoved = squares.splice(i, width);
  
          squares = squaresRemoved.concat(squares);
          squares.forEach((cell) => grid.appendChild(cell));
        }
      }
  
      if (score % 50 === 0 && score > 0) {
        timePeriod -= 20;
        console.log("Speed bumped! " + timePeriod);
      }
    }
  
    function gameOver() {
      if (
        current.some((index) =>
          squares[curPosition + index].classList.contains("taken")
        )
      ) {
        scoreDisp.innerHTML = "end";
  
        clearInterval(timerID);
        bgm.pause();
        player = prompt("Please enter name: ", "");
        alert("Game Over!");
        if (player == null || player == "") {
          txt = "Player cancelled prompt!";
        } else {
          txt = player + " scored " + score;
        }
        alert(txt);
        location.reload();
      }
    }
  });
 