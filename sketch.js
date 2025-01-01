let board = null;

let ballPosition = { x: 0, y: 0 };
const ballSize = 10;
let ballSticksToBoard = true;
let ballVelocity = { x: 0, y: 0 };

function setup() {
  createCanvas(400, 400);

  const playerBoardHeight = 10;
  const playerBoardWidth = 80;
  const playerBoardStartPosition = { x: width / 2 - playerBoardWidth / 2, y: height - 10 };
  board = createBoard(playerBoardStartPosition.x, playerBoardStartPosition.y, playerBoardWidth, playerBoardHeight, "grey");

  ballPosition.x = board.position.x + (board.width / 2);
  ballPosition.y = board.position.y - (ballSize / 2) - board.height;
}

function draw() {
  background(220);

  let playerMovement = 0;
  if (keyIsDown(LEFT_ARROW)) {
    playerMovement = -1;
  }
  else if (keyIsDown(RIGHT_ARROW)) {
    playerMovement = 1;
  }

  if (keyIsDown(32)) {
    ballSticksToBoard = false;
    ballVelocity = { x: 2, y: -2 };
  }

  board.move(playerMovement);
  ballPosition = { x: ballPosition.x + ballVelocity.x, y: ballPosition.y + ballVelocity.y };

  if (isBallCollidingWithRightSide() || isBallCollidingWithLeftSide()) {
    ballVelocity.x = ballVelocity.x * -1;
  }

  if (isBallCollidingWithTopSide() || board.collider.isColliding({ x: ballPosition.x - ballSize / 2, y: ballPosition.y - ballSize / 2, width: ballSize, height: ballSize })) {
    ballVelocity.y = ballVelocity.y * -1;
  }

  board.draw();

  if (ballSticksToBoard) ballPosition.x = board.position.x;
  drawBall(ballPosition);
}

function isBallCollidingWithRightSide() {
  return (ballPosition.x + (ballSize / 2)) > width;
}

function isBallCollidingWithLeftSide() {
  return (ballPosition.x - (ballSize / 2)) < 0;
}

function isBallCollidingWithTopSide() {
  return (ballPosition.y - (ballSize / 2)) < 0
}

function drawBoard(x, y) {
  fill(board.color)
  rect(x - board.width / 2, y, board.width, board.height);
}

function drawBall(loc) {
  stroke("black");
  circle(loc.x, loc.y, ballSize);
}

function createBoxCollider(x, y, width, height) {
  return {
    x: x,
    y: y,
    width: width,
    height: height,
    isColliding: function (other) {
      return (this.x < other.x + other.width &&
        this.x + this.width > other.x &&
        this.y < other.y + other.height &&
        this.y + this.height > other.y)
    },
    draw: function () {
      fill(0, 0);
      stroke("green");
      strokeWeight(2);
      rect(this.x, this.y, this.width, this.height);
    }
  }
}

function createBoard(x, y, width, height, color) {
  return {
    position: { x: x, y: y },
    width: width,
    height: height,
    color: color,
    boardSpeed: 8,
    draw: function () {
      fill(this.color);
      rect(this.position.x - this.width / 2, this.position.y - this.height, this.width, this.height);

      this.collider.draw();
      stroke("red");
      circle(this.position.x, this.position.y, 2);
    },
    move: function (direction) {
      this.position.x += direction * this.boardSpeed;
      this.collider.x = this.position.x - this.width / 2;
      this.collider.y = this.position.y - this.height;
    },
    collider: createBoxCollider(x - width / 2, y, width, height)
  }
}