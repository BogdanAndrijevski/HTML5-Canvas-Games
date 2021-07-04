let canvas = document.querySelector('canvas');
canvas.width = 500;
canvas.height = 550;
let ctx = canvas.getContext('2d');

// Center Canvas with JavaScript
canvas.style.display = "block";
canvas.style.position = "absolute";
canvas.style.margin = "auto";
canvas.style.top = 0;
canvas.style.bottom = 0;
canvas.style.left = 0;
canvas.style.right = 0;
canvas.style.border = "2px solid red";

let bottomBorderPadding = 25;

let plane = {
  height: 50,
  width: 50,
  speed: 5
}

//===========================================
//  keyboard movement
let left = false;
let right = false;
let readyToFire = false
let weaponsLocked = false;

let projectiles;

function keysPressed(e) {
  if (e.keyCode === 87) {
    if (weaponsLocked === false) {
      readyToFire = true;
      weaponsLocked = true;
      setTimeout(() => {
        weaponsLocked = false;
      }, 150);
    }
  }

  if (e.keyCode === 65) {
    left = true
  }
  if (e.keyCode === 68) {
    right = true;
  }

}

function keysReleased(e) {
  if (e.keyCode === 65) {
    left = false
  }
  if (e.keyCode === 68) {
    right = false
  }

}

document.addEventListener("keydown", keysPressed);
document.addEventListener("keyup", keysReleased);

class Player {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color || "red"
    this.lives = 9;

    this.grid = [
      { x: 7, y: 0 },
      { x: 7, y: 1 },
      { x: 5, y: 1 },
      { x: 5, y: 3 },
      { x: 6, y: 3 },
      { x: 6, y: 2 },
      { x: 8, y: 2 },
      { x: 8, y: 1 },
      { x: 9, y: 1 },
      { x: 9, y: 5 },
      { x: 8, y: 5 },
      { x: 8, y: 6 },
      { x: 6, y: 6 },
      { x: 6, y: 5 },
      { x: 5, y: 5 },
      { x: 5, y: 7 },
      { x: 6, y: 7 },
      { x: 6, y: 8 },
      { x: 5, y: 8 },
      { x: 5, y: 9 },
      { x: 4, y: 9 },
      { x: 4, y: 8 },
      { x: 3, y: 8 },
      { x: 3, y: 7 },
      { x: 4, y: 7 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
      { x: 3, y: 6 },
      { x: 1, y: 6 },
      { x: 1, y: 5 },
      { x: 0, y: 5 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 3, y: 2 },
      { x: 3, y: 3 },
      { x: 4, y: 3 },
      { x: 4, y: 1 },
      { x: 2, y: 1 },

    ]
    this.blueParts = [
      { x: 2, y: 0, width: 2, height: 1 },
      { x: 5, y: 0, width: 2, height: 1 },
      { x: 3, y: 7, width: 3, height: 1 },
      { x: 0, y: 2, width: 3, height: 3 },
      { x: 3, y: 4, width: 1, height: 1 },
      { x: 6, y: 2, width: 3, height: 3 },
      { x: 5, y: 4, width: 1, height: 1 },
    ]

    this.yellowParts = [
      { x: 1, y: 3, width: 1, height: 1 },
      { x: 7, y: 3, width: 1, height: 1 },

    ]
  }

  draw() {

    let x_pixel = this.width / 9
    let y_pixel = this.height / 9


    ctx.beginPath();
    ctx.moveTo(this.x + x_pixel * 2, this.y + y_pixel * 0);
    for (const e of this.grid) {
      ctx.lineTo(this.x + x_pixel * e.x, this.y + y_pixel * e.y);
    }
    ctx.closePath();

    ctx.fillStyle = "#ff1353"; // redish
    ctx.fill()

    //----------------------------------

    ctx.fillStyle = '#0396ff'; // blue
    this.blueParts.forEach(e => {
      ctx.fillRect(this.x + x_pixel * e.x, this.y + y_pixel * e.y, x_pixel * e.width, y_pixel * e.height)
    });

    ctx.fillStyle = '#feef00'; // yellow
    this.yellowParts.forEach(e => {
      ctx.fillRect(this.x + x_pixel * e.x, this.y + y_pixel * e.y, x_pixel * e.width, y_pixel * e.height)
    });
    //----------------------------------
  }
  update() {
    if (readyToFire == true) {
      readyToFire = false
      let projectileHeight = 15;
      let projectileWidth = 4;
      projectiles.push(new Projectile(this.x + this.width / 2 - projectileWidth / 2, this.y, projectileWidth, projectileHeight));
    }
    if (left == true && this.x > 0) {
      this.x -= plane.speed;
    }
    if (right == true && this.x + this.width < canvas.width) {
      this.x += plane.speed;
    }

    this.draw()
  }
}

// Projectile 

class Projectile {
  constructor(x, y, width, height, velocity_y, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color || '#f2245c';
    this.velocity = {
      y: velocity_y || -6
    }
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  update() {
    this.y += this.velocity.y
    this.draw()
  }
}

function init() {
  projectiles = [];
  player = new Player(canvas.width / 2 - plane.width / 2, canvas.height - plane.height - bottomBorderPadding, plane.width, plane.height)

}


let req;

function animate() {
  req = requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //-------------------------------
  //  PLAYER
  //-------------------------------
  player.update();
  //-------------------------------
  //  PLAYER PROJECTILES
  //-------------------------------
  projectiles.forEach(projectile => {
    projectile.update();

  });

}

init();
animate();