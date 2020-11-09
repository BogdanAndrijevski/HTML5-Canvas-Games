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

let car = {
  width: 45,
  height: 70,
  speed: 5,
  movement: {
    left : false,
    right : false,

    up : false,
    down : false,
  }
}

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

init();
animate();

function init() {
  playerCar = new PlayerCar(playerCarImg, canvas.width / 2 - car.width / 2, canvas.height - car.height, car.width, car.height)
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  playerCar.update();

}