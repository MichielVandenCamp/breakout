let board = null;
let ball = null;
let level = null;

function setup() {
  createCanvas(400, 400);

  const playerBoardHeight = 10;
  const playerBoardWidth = 80;
  const playerBoardStartPosition = { x: width / 2, y: height - 10 };
  board = createBoard(playerBoardStartPosition, playerBoardWidth, playerBoardHeight, "grey");

  const ballSize = 10;
  const ballStartPosition = { x: board.position.x + (board.width / 2), y: board.position.y - (ballSize / 2) - board.height };
  ball = createBall(ballStartPosition, ballSize);

  level = createLevel([
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
    [1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ])
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
    ball.sticksToBoard = false;
    ball.velocity = { x: 2, y: -2 };
  }

  board.move(playerMovement);
  ball.update();

  for (let i = 0; i < level.blocks.length; i++) {
    if (level.blocks[i].collider.isColliding(ball.collider)) {
      ball.velocity.y *= -1;
      level.blocks.splice(i, 1);
      break;
    }
  }

  if (isBallCollidingWithRightSide() || isBallCollidingWithLeftSide()) {
    ball.velocity.x *= -1;
  }

  if (isBallCollidingWithTopSide() || board.collider.isColliding(ball.collider)) {
    ball.velocity.y *= -1;
  }

  board.draw();

  if (ball.sticksToBoard) ball.position.x = board.position.x;
  ball.draw();
  level.draw();
}

function isBallCollidingWithRightSide() {
  return (ball.position.x + (ball.size / 2)) > width;
}

function isBallCollidingWithLeftSide() {
  return (ball.position.x - (ball.size / 2)) < 0;
}

function isBallCollidingWithTopSide() {
  return (ball.position.y - (ball.size / 2)) < 0
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
      strokeWeight(1);
      fill(0, 0);
      stroke("green");
      strokeWeight(2);
      rect(this.x, this.y, this.width, this.height);

      stroke("pink");
      strokeWeight(1);
      circle(this.x, this.y, 2);
    }
  }
}

function createBoard(position, boardWidth, height, color) {
  return {
    position: position,
    width: boardWidth,
    height: height,
    color: color,
    boardSpeed: 8,
    draw: function () {
      fill(this.color);
      rect(this.position.x - this.width / 2, this.position.y - this.height, this.width, this.height);

      //this.collider.draw();
      //stroke("red");
      //strokeWeight(1);
      //circle(this.position.x, this.position.y, 2);
    },
    move: function (direction) {
      let newPosition = { x: this.position.x + direction * this.boardSpeed, y: this.position.y };
      if (newPosition.x - this.width / 2 < 0) newPosition.x = 0 + this.width / 2;
      if (newPosition.x + this.width / 2 > width) newPosition.x = width - this.width / 2;

      this.position = newPosition;
      this.collider.x = this.position.x - this.width / 2;
      this.collider.y = this.position.y - this.height;
    },
    collider: createBoxCollider(position.x - boardWidth / 2, position.y, boardWidth, height)
  }
}

function createBall(position, size) {
  return {
    position: position,
    size: size,
    velocity: { x: 0, y: 0 },
    sticksToBoard: true,
    draw: function () {
      stroke("black");
      circle(this.position.x, this.position.y, this.size);

      //this.collider.draw();
    },
    update: function () {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;

      this.collider.x = this.position.x - this.size / 2;
      this.collider.y = this.position.y - this.size / 2;
    },
    collider: createBoxCollider(position.x - size / 2, position.y - size / 2, size, size)
  }
}

function createBlock(position, color) {
  const width = 40;
  const height = 20;

  return {
    position: position,
    width: width,
    height: height,
    color: color,
    draw: function () {
      fill(this.color);
      rect(this.position.x, this.position.y, this.width, this.height);
    },
    collider: createBoxCollider(position.x, position.y, width, height)
  }
}

function createLevel(level) {
  const blocks = [];
  const blockWidth = 40;
  const blockHeight = 20;

  for (let i = 0; i < level.length; i++) {
    for (let j = 0; j < level[i].length; j++) {
      if (level[i][j] > 0) {
        blocks.push(createBlock({ x: j * blockWidth, y: i * blockHeight }, getBlockColor(i)));
      }
    }
  }

  return {
    blocks: blocks,
    draw: function () {
      this.blocks.forEach(block => block.draw());
    }
  };
}

function getBlockColor(y) {
  if (y == 0) {
    return color(0, 0, 255);
  }
  else if (y == 1) {
    return color(0, 80, 180);
  }
  else if (y == 2) {
    return color(0, 120, 120);
  }
  return "green";
}