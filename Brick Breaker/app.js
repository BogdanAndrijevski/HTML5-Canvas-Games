const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
canvas.style.border = '2px solid wheat';
canvas.style.backgroundColor = 'rgb(11, 11, 11)';
canvas.width = 700
canvas.height = 500

//------------------------------------------------
// Center Canvas with JavaScriptws
canvas.style.display = "block";
canvas.style.position = "absolute";
canvas.style.margin = "auto";
canvas.style.top = 0;
canvas.style.bottom = 0;
canvas.style.left = 0;
canvas.style.right = 0;

// canvas.style.border = "2px solid red"
//------------------------------------------------

// Implementation
let player;
let bricks = [];
let ball;

let playerScore = 0;
let computerScore = 0;
let hasGameEnded = false;
let sizes = {};

sizes.ball = {};
sizes.ball.radius = 10;
sizes.ball.velocity = {};
sizes.ball.velocity.x = 1;
sizes.ball.velocity.y = 1;

sizes.paddle = {};
sizes.paddle.height = 20;
sizes.paddle.width = 100;
sizes.paddle.padding = 20;


// https://color.adobe.com/explore
let lifeColors = [
  { lives: 1, color: '#3E8C84' },
  { lives: 2, color: '#296B73' },
  { lives: 3, color: '#194759' },
]

const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2
}


class Square {
  constructor(x, y, width, height, color) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.color = color
  }


  ballInteraction(ball) {
    // if (this.brick || this.isBouncingAllowed === true) {
    //   if (this.brick && ball.isTouchingAllowed !== true) { return }
    if (this.brick && ball.isTouchingAllowed === true ||
      this.isBouncingAllowed === true) {
      // CORNERS
      // top right corner
      if (distance(ball.x, ball.y, this.x + this.width, this.y) <= ball.radius) {
        this.brick ? this.deleteBrick() : this.canBounce();
        this.ballImpactTopRightCorner(ball)
        ball.isTouchingAllowed = false;
      }
      // bottom right corner
      else if (distance(ball.x, ball.y, this.x + this.width, this.y + this.height) <= ball.radius) {
        this.brick ? this.deleteBrick() : this.canBounce();
        this.ballImpactBottomRightCorner(ball)
        ball.isTouchingAllowed = false;
      }
      // bottom left corner
      else if (distance(ball.x, ball.y, this.x, this.y + this.height) <= ball.radius) {
        this.brick ? this.deleteBrick() : this.canBounce();
        this.ballImpactBottomLeftCorner(ball)
        ball.isTouchingAllowed = false;
      }
      // top left corner
      else if (distance(ball.x, ball.y, this.x, this.y) <= ball.radius) {
        this.brick ? this.deleteBrick() : this.canBounce();
        this.ballImpactTopLeftCorner(ball)
        ball.isTouchingAllowed = false;
      }
      // SIDES 2
      else if (ball.x > this.x && ball.x < this.x + this.width ||// left
        ball.y > this.y && ball.y < this.y + this.height
      ) {
        // crtez
        // od levo
        if (ball.x < this.x && ball.x + ball.radius > this.x) {
          this.brick ? this.deleteBrick() : this.canBounce();
          this.ballImpactFromLeft(ball)
          ball.isTouchingAllowed = false;
        }
        // od desno
        else if (ball.x > this.x + this.width && ball.x - ball.radius < this.x + this.width) {
          this.brick ? this.deleteBrick() : this.canBounce();
          this.ballImpactFromRight(ball)
          ball.isTouchingAllowed = false;
        }
        // od gore
        else if (ball.y < this.y && ball.y + ball.radius > this.y) {
          this.brick ? this.deleteBrick() : this.canBounce();
          this.ballImpactFromTop(ball)
          ball.isTouchingAllowed = false;
        }
        // od dole
        else if (ball.y > this.y + this.height && ball.y - ball.radius < this.y + this.height) {
          this.brick ? this.deleteBrick() : this.canBounce();
          this.ballImpactFromBottom(ball)
          ball.isTouchingAllowed = false;
        }
      }
    }
  }


  ballImpactTopLeftCorner(ball) {
    let prevBallX = ball.x - ball.velocity.x
    let prevBallY = ball.y - ball.velocity.y
    // od gore desno odi nakaj dole levo
    if (prevBallX > ball.x && prevBallY < ball.y) {
      ball.velocity.y = - ball.velocity.y;
    }
    // od dole levo odi nakaj gore desno
    else if (prevBallX < ball.x && prevBallY > ball.y) {
      ball.velocity.x = - ball.velocity.x;
    }
    else {
      ball.velocity.x = - ball.velocity.x;
      ball.velocity.y = - ball.velocity.y;
    }
  }
  ballImpactBottomLeftCorner(ball) {
    let prevBallX = ball.x - ball.velocity.x
    let prevBallY = ball.y - ball.velocity.y
    // od gore levo paga nakaj dole desno
    if (prevBallX < ball.x && prevBallY < ball.y) {
      ball.velocity.x = - ball.velocity.x;
    }
    // od dole desno odi nakaj gore levo
    else if (prevBallX > ball.x && prevBallY > ball.y) {
      ball.velocity.y = - ball.velocity.y;
    }
    else {
      ball.velocity.y = - ball.velocity.y;
      ball.velocity.x = - ball.velocity.x;
    }
  }
  ballImpactBottomRightCorner(ball) {
    let prevBallX = ball.x - ball.velocity.x
    let prevBallY = ball.y - ball.velocity.y

    // od gore desno odi nakaj dole levo
    if (prevBallX > ball.x && prevBallY < ball.y) {
      ball.velocity.x = - ball.velocity.x;
    }
    // od dole levo odi nakaj gore desno
    else if (prevBallX < ball.x && prevBallY > ball.y) {
      ball.velocity.y = - ball.velocity.y;
    }
    else {
      ball.velocity.x = - ball.velocity.x;
      ball.velocity.y = - ball.velocity.y;
    }
  }
  ballImpactTopRightCorner(ball) {
    let prevBallX = ball.x - ball.velocity.x
    let prevBallY = ball.y - ball.velocity.y
    // od gore levo paga nakaj dole desno
    if (prevBallX < ball.x && prevBallY < ball.y) {
      ball.velocity.y = - ball.velocity.y;
    }
    // od dole desno odi nakaj gore levo
    else if (prevBallX > ball.x && prevBallY > ball.y) {
      ball.velocity.x = - ball.velocity.x;
    }
    else {
      ball.velocity.y = - ball.velocity.y;
      ball.velocity.x = - ball.velocity.x;
    }
  }

  ballImpactFromTop(ball) {
    ball.velocity.y = - ball.velocity.y;
  }
  ballImpactFromBottom(ball) {
    ball.velocity.y = - ball.velocity.y;
  }
  ballImpactFromLeft(ball) {
    ball.velocity.x = - ball.velocity.x;
  }
  ballImpactFromRight(ball) {
    ball.velocity.x = - ball.velocity.x;
  }
  draw() {
    ctx.beginPath()
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.closePath()
  }

  update(ball) {
    this.ballInteraction(ball)
    this.draw()
  }
}

class Brick extends Square {
  constructor(lives, ...args) {
    super(...args)
    this.brick = true;
    this.isRemovable = false;
    this.lives = lives || 3;
    this.fallbackColor = 'gray'
    this.color = lifeColors.find(x => x.lives === this.lives)?.color || this.fallbackColor;
    // this.color = (lifeColors.find(x => x.lives === this.lives) || { color: this.fallbackColor }).color;
  }

  deleteBrick() {
    this.lives === 1 ? this.isRemovable = true : (this.lives -= 1, this.color = lifeColors.find(x => x.lives === this.lives)?.color || this.fallbackColor);
    // this.lives === 1 ? this.isRemovable = true : (this.lives -= 1, this.color = (lifeColors.find(x => x.lives === this.lives) || { color: this.fallbackColor }).color);
  }
}

class PlayerPaddle extends Square {

  constructor(...args) {
    super(...args)
    this.isBouncingAllowed = true;
  }

  canBounce() {
    this.isBouncingAllowed = false;
    setTimeout(() => {
      this.isBouncingAllowed = true;
    }, 500);
  }

  ballControlBasedOnWhereItHitsThePaddle(ball, num) {
    ball.velocity.y = - ball.velocity.y;
    let distanceFromBallYToPaddleCenter = ball.x - (this.x + this.width / 2)
    ball.velocity.x = distanceFromBallYToPaddleCenter * num
  }

  ballImpactTopLeftCorner(ball) {
    this.ballControlBasedOnWhereItHitsThePaddle(ball, 0.067);
  }
  ballImpactTopRightCorner(ball) {
    this.ballControlBasedOnWhereItHitsThePaddle(ball, 0.067);
  }
  ballImpactFromTop(ball) {
    this.ballControlBasedOnWhereItHitsThePaddle(ball, 0.08);
  }
  movement() {
    this.x = mouse.x - this.width / 2;
  }
  update(ball) {
    this.movement();
    this.ballInteraction(ball);
    this.draw();
  }
}



addEventListener('mousemove', e => {
  let m = calculateMousePosition(e)
  mouse.x = m.x;
  mouse.y = m.y;
})


function calculateMousePosition(event) {
  let rect = canvas.getBoundingClientRect();
  let root = document.documentElement;
  let mouseX = event.clientX - rect.left - root.scrollLeft;
  let mouseY = event.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY,
  }
}

class Ball {
  constructor(x, y, x_velocity, y_velocity, radius, color) {
    this.x = x;
    this.y = y;
    this.velocity = {
      x: x_velocity,
      y: y_velocity
    }
    this.radius = radius;
    this.color = color;
    this.isBouncingAllowed = true;
    this.isTouchingAllowed = true;
  }

  wallInteraction() {
    // left and right
    if (this.x + this.radius + this.velocity.x > canvas.width ||
      this.x - this.radius < 0) {
      this.velocity.x = - this.velocity.x;
    }
    // top and bottom
    // if (this.y + this.radius + this.velocity.y > canvas.height ||
    //   this.y - this.radius < 0) {
    //   this.velocity.y = - this.velocity.y;
    // }
    //  top
    if (this.y - this.radius < 0) {
      this.velocity.y = - this.velocity.y;
    }
    // bottom
    if (this.y + this.radius + this.velocity.y > canvas.height) {
      hasGameEnded = true
      // this.velocity.y = - this.velocity.y; // just for test
    }
  }
  update() {
    this.isTouchingAllowed = true;
    this.wallInteraction()
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.draw();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill()
    ctx.closePath()
  }
}


let brick = {}
brick.columns = 10
brick.rows = 9;
brick.gap = 3;
brick.gapTopWall = 50


// brick.width = 100
brick.height = 20

function init() {
  player = new PlayerPaddle(canvas.width / 2 - sizes.paddle.width / 2, canvas.height - (sizes.paddle.height + 20), sizes.paddle.width, sizes.paddle.height, '#F24738');
  ball = new Ball(350, 300, 0, -4, sizes.ball.radius, '#F2C777');

  // drawing the bricks
  for (let j = 0; j < brick.rows; j++) {
    let columns = j % 2 === 0 ? brick.columns : brick.columns / 2;
    let lives = j % 2 === 0 ? 2 : 3;
    brick.width = (canvas.width - brick.gap) / columns
    for (let i = 0; i < columns; i++) {
      let x = brick.width * i + brick.gap
      let y = (brick.height * j) + brick.gapTopWall
      let width = brick.width - brick.gap;
      let height = brick.height - brick.gap
      bricks.push(new Brick(lives, x, y, width, height));
    }
  }

  //===================
  // for (let j = 0; j < brick.rows; j++) {
  //   for (let i = 0; i < brick.columns; i++) {
  //     brick.width = (canvas.width - brick.gap) / brick.columns // we can put this outside where the other variables are
  //     bricks.push(new Brick(3, brick.width * i + brick.gap, (brick.height * j) + brick.gapTopWall, brick.width - brick.gap, brick.height - brick.gap));
  //   }
  // }
}


// Animation Loop
let req;
function animate() {
  // debugger
  req = requestAnimationFrame(animate)
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //----------------------------------------------------------------
  if (hasGameEnded) {
    ctx.fillStyle = "orange";
    // ctx.font = "30px arial";
    ctx.font = "italic small-caps bold 25px Arial Black";
    ctx.fillText("Click To Start ...", 240, 240);
    cancelAnimationFrame(req);
    return;
  }
  //----------------------------------------------------------------
  player.update(ball);
  ball.update();
  // ---------------------------
  for (let i = bricks.length - 1; i >= 0; i--) {
    bricks[i].update(ball);
    if (bricks[i].isRemovable) {
      bricks.splice(i, 1)
      if (bricks.length < 1) {
        hasGameEnded = true;
      }
    }
  }

  // ---------------------------
  // alternative solution
  // ---------------------------
  // bricks.forEach((brick, index) => {
  //   brick.update(ball);
  //   if (brick.isRemovable) {
  //     setTimeout(() => {
  //       bricks.splice(index, 1)
  //     }, 0);
  //   }
  // });
  // ---------------------------
}

init();
animate();


function distance(x1, y1, x2, y2) {
  const xDist = x2 - x1;
  const yDist = y2 - y1;
  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}

// restart the game
document.addEventListener('click', () => {
  if (hasGameEnded) {
    hasGameEnded = false;
    bricks = [];
    init()
    requestAnimationFrame(animate);
  }
});