const canvas = document.querySelector('canvas');
canvas.width = 905;
canvas.height = 550;
const ctx = canvas.getContext('2d');

canvas.style.display = "block";
canvas.style.position = "absolute";
canvas.style.margin = "auto";
canvas.style.top = 0;
canvas.style.bottom = 0;
canvas.style.left = 0;
canvas.style.right = 0;
canvas.style.border = "2px solid red";



let playerCarImg = new Image();
playerCarImg.src = 'img/PlayerCar.png';

let trafficCarImg = new Image();
trafficCarImg.src = 'img/TrafficCar.png';

let car = {
  width: 45,
  height: 70,
  speed: 5,
  movement: {
    left: false,
    right: false,

    up: false,
    down: false,
  }
}

let velocityForLinesAndCars = 0.001;
let hasGameEnded = false;

let trafficCars = [];
let playerCar;
let lines = [];


let score = 0;
let scoreCounter = 0;

// restart the game
document.addEventListener('click', () => {
  if (hasGameEnded) {
    hasGameEnded = false;
    lines = [];
    trafficCars = [];
    score = 0;
    init()
    requestAnimationFrame(animate);
  }
});

// load font
const pizzaFont = new FontFace('pizzaFont', 'url(Fonts/pizzabot.ttf)');
pizzaFont.load().then(loadedFont => {
    document.fonts.add(loadedFont)
}).catch((error) => {
    console.log('Failed to load font: ' + error)
})
//===========================================
// keyboard movement

function keysPressed(e) {
  if (e.key == "a") {
    car.movement.left = true
  }
  if (e.key == "d") {
    car.movement.right = true;
  }
  if (e.key == "w") {
    car.movement.up = true;
  }
  if (e.key == "s") {
    car.movement.down = true;
  }
}

function keysReleased(e) {
  if (e.key == "a") {
    car.movement.left = false
  }

  if (e.key == "d") {
    car.movement.right = false
  }

  if (e.key == "w") {
    car.movement.up = false;
  }
  if (e.key == "s") {
    car.movement.down = false;
  }
}

document.addEventListener("keydown", keysPressed);
document.addEventListener("keyup", keysReleased);


class PlayerCar {
  constructor(image, x, y, width, height) {
    this.image = image

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
  update() {
    if (car.movement.left == true && this.x > 0) {
      this.x -= car.speed;
    }
    if (car.movement.right == true && this.x + this.width < canvas.width) {
      this.x += car.speed;
    }

    if (car.movement.up == true && this.y > 0) {
      this.y -= car.speed;
    }
    if (car.movement.down == true && this.y + this.height < canvas.height) {
      this.y += car.speed;
    }

    this.draw()
  }
}

class TrafficCar {
  constructor(image, x, y, width, height) {
    this.image = image
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velocity = {
      y: 2
    }
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
  update() {
    this.velocity.y += velocityForLinesAndCars;
    this.y += this.velocity.y;


    // so othey wont spawn on top of eachother
    if (this.y > canvas.height) {
      let x = (Math.random() * (canvas.width - car.width));
      let y = (Math.random() * 600) - 700;
      for (let i = 0; i < trafficCars.length; i++) {
        const trafficCar = trafficCars[i];
        if (x < trafficCar.x + trafficCar.width && x + car.width > trafficCar.x
          && y < trafficCar.y + trafficCar.height && y + car.height > trafficCar.y) {

          x = (Math.random() * (canvas.width - car.width));
          y = (Math.random() * 600) - 700;
          i = -1;
        }
      }
      this.x = x;
      this.y = y;
    }
    this.draw()
  }
}

class Line {
  constructor(x, y, width, height, velocity_y, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.velocity = {
      y: velocity_y
    }
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  update() {
    this.velocity.y += velocityForLinesAndCars;
    this.y += this.velocity.y
    if (this.y > canvas.height) {
      this.y = -this.height;
    }
    this.draw()
  }
}



function init() {
  playerCar = new PlayerCar(playerCarImg, canvas.width / 2 - car.width / 2, canvas.height - car.height, car.width, car.height)

  // Lines
  for (let i = 0; i < 3; i++) {
    lines.push(new Line(canvas.width / 3, i * 210, 8, 100, 6, '#9c9c9c'))
    lines.push(new Line(canvas.width / 3 * 2, i * 210, 8, 100, 6, '#9c9c9c'))
  }

  // Traffic Cars
  for (let i = 0; i < 10; i++) {
    let x = (Math.random() * (canvas.width - car.width));
    let y = (Math.random() * (600)) - 700;

    for (let j = 0; j < trafficCars.length; j++) {
      if (x < trafficCars[j].x + trafficCars[j].width && x + car.width > trafficCars[j].x
        && y < trafficCars[j].y + trafficCars[j].height && y + car.height > trafficCars[j].y) {
        x = (Math.random() * (canvas.width - car.width));
        y = (Math.random() * (600)) - 700;
        j = -1;
      }

    }
    trafficCars.push(new TrafficCar(trafficCarImg, x, y, car.width, car.height))

  }
}

let req;
function animate() {
  req = requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //----------------------------------------------------------------
  if (hasGameEnded) {
    ctx.fillStyle = "cyan";
    ctx.font = "30px pizzaFont";
    ctx.fillText("Click To Start...", 310, 240);
    cancelAnimationFrame(req);
    return;
  }
  //----------------------------------------------------------------
  // backgorund
  ctx.fillStyle = '#080808';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // lines
  lines.forEach(line => {
    line.update();
  });

  trafficCars.forEach(trafficCar => {
    // collision detection
    if (playerCar.x < trafficCar.x + trafficCar.width && playerCar.x + playerCar.width > trafficCar.x &&
      playerCar.y < trafficCar.y + trafficCar.height && playerCar.y + playerCar.height > trafficCar.y) {
      hasGameEnded = true;
    }
    trafficCar.update();
  });

  playerCar.update();

  scoreCounter++;

  if (scoreCounter % 30 == 0) {
    score = score + 1;
  }

  let array = ["Score: ", score];
  ctx.font = "30px pizzaFont";
  writeText(array, 10, 30);

}


init();
animate();

function writeText(str, x, y) {
  for (let i = 0; i < str.length; ++i) {
    let ch = str[i];
    ctx.fillStyle = "salmon";
    if (isNaN(ch)) {
      ctx.fillStyle = "wheat";
    }
    ctx.fillText(ch, x, y);
    x += ctx.measureText(ch).width;
  }
}

