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
let enemiesLength;


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
  enemies = [];

  projectiles = [];

  player = new Player(canvas.width / 2 - plane.width / 2, canvas.height - plane.height - bottomBorderPadding, plane.width, plane.height)

  for (let j = 0; j < enemy.rows; j++) {
    for (let i = 0; i < enemy.columns; i++) {
      let color = j < 2 ? '#0195ff' : j < 4 ? '#ff1353' : '#01e8a2';
      if (j < 2) {
        enemies.push(new Squid(enemy.width * i + enemy.gap + enemy.sideGap / 2, ((enemy.height + enemy.additionalVerticalGap) * j) + enemy.gapTop, enemy.width - enemy.gap, enemy.height - (enemy.gap / 3), color));
      } else if (j < 4) {
        enemies.push(new Crab(enemy.width * i + enemy.gap + enemy.sideGap / 2, ((enemy.height + enemy.additionalVerticalGap) * j) + enemy.gapTop, enemy.width - enemy.gap, enemy.height - (enemy.gap / 3), color));
      } else {
        enemies.push(new Octopus(enemy.width * i + enemy.gap + enemy.sideGap / 2, ((enemy.height + enemy.additionalVerticalGap) * j) + enemy.gapTop, enemy.width - enemy.gap, enemy.height - (enemy.gap / 3), color));
      }
    }
  }
  enemiesLength = enemies.length;
}


class Enemy {
  constructor(x, y, width, height, color) {

    this.x = x;
    this.y = y;
    this.color = color || 'white'
    this.width = width;
    this.height = height;
    this.velocity = {
      y: 0,
      x: 6
    }
    this.readyToDance = false;

  }

  danceAndMove(timeToDanceAndMove) {
    if (timeToDanceAndMove) {
      this.readyToDance = this.readyToDance === false ? true : false
      this.x += this.velocity.x

    }
  }

  update(haveTwoSecondsPassed) {
    this.danceAndMove(haveTwoSecondsPassed)
    this.draw(haveTwoSecondsPassed)

  }
}


class Octopus extends Enemy {
  constructor(...args) {
    super(...args)

    this.grid = [

      { x: 6, y: 0 },
      { x: 6, y: 1 },
      { x: 8, y: 1 },
      { x: 8, y: 2 },
      { x: 9, y: 2 },
      { x: 9, y: 5 },
      { x: 7, y: 5 },
      { x: 7, y: 6 },
      { x: 8, y: 6 },
      { x: 8, y: 7 },
      { x: 9, y: 7, x2: 7, y2: 7 },
      { x: 9, y: 8, x2: 7, y2: 8 },
      { x: 7.5, y: 8, x2: 5.5, y2: 8 },
      { x: 7.5, y: 7, x2: 5.5, y2: 7 },
      { x: 6.5, y: 7 },
      { x: 6.5, y: 6 },
      { x: 5.5, y: 6 },
      { x: 5.5, y: 5 },
      { x: 3.5, y: 5 },
      { x: 3.5, y: 6 },
      { x: 2.5, y: 6 },
      { x: 2.5, y: 7 },
      { x: 1.5, y: 7, x2: 3.5, y2: 7 },
      { x: 1.5, y: 8, x2: 3.5, y2: 8 },
      { x: 0, y: 8, x2: 2, y2: 8 },
      { x: 0, y: 7, x2: 2, y2: 7 },
      { x: 1, y: 7 },
      { x: 1, y: 6 },
      { x: 2, y: 6 },
      { x: 2, y: 5 },
      { x: 0, y: 5 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 1, y: 1 },
      { x: 3, y: 1 },


    ]

    this.eyesGrid = [
      { x: 2.5, y: 2, width: 1, height: 1 },
      { x: 5.5, y: 2, width: 1, height: 1 },

    ]
  }



  draw() {

    let x_pixel = this.width / 9;
    let y_pixel = this.height / 8;


    ctx.beginPath();
    ctx.moveTo(this.x + x_pixel * 3, this.y + y_pixel * 0);
    for (const e of this.grid) {
      let o = this.readyToDance !== false && e.y2 !== undefined ? { x: e.x2, y: e.y2 } : { x: e.x, y: e.y }
      ctx.lineTo(this.x + x_pixel * o.x, this.y + y_pixel * o.y);
    }
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill()
    // mouth
    ctx.fillRect(this.x + x_pixel * 3.5, this.y + y_pixel * 6, x_pixel * 2, y_pixel)

    ctx.fillStyle = 'black';
    this.eyesGrid.forEach(e => {
      ctx.fillRect(this.x + x_pixel * e.x, this.y + y_pixel * e.y, x_pixel * e.width, y_pixel * e.height)
    });



  }


}




class Squid extends Enemy {
  constructor(...args) {
    super(...args)

    this.grid = [

      { x: 5, y: 0 },
      { x: 5, y: 1 },
      { x: 6, y: 1 },
      { x: 6, y: 2 },
      { x: 7, y: 2 },
      { x: 7, y: 3 },
      { x: 8, y: 3 },
      { x: 8, y: 5 },


      { x: 7, y: 5, x2: 6, y2: 5 },
      { x: 7, y: 6, x2: 6, y2: 6 },
      { x: 8, y: 6, x2: 7, y2: 6 },
      { x: 8, y: 7, x2: 7, y2: 7 },
      { x: 7, y: 7, x2: 8, y2: 7 },


      { x: 7, y: 8, x2: 8, y2: 8 },
      { x: 6, y: 8, x2: 7, y2: 8 },
      { x: 6, y: 7, x2: 7, y2: 7 },

      { x: 7, y: 7, x2: 6, y2: 7 },
      { x: 7, y: 6, x2: 6, y2: 6 },
      { x: 6, y: 6, x2: 5, y2: 6 },
      { x: 6, y: 5, x2: 5, y2: 5 },
      { x: 5, y: 5 },
      { x: 5, y: 6, x2: 5, y2: 5 },
      { x: 3, y: 6, x2: 3, y2: 5 },
      { x: 3, y: 5 },

      { x: 2, y: 5, x2: 3, y2: 5 },
      { x: 2, y: 6, x2: 3, y2: 6 },
      { x: 1, y: 6, x2: 2, y2: 6 },
      { x: 1, y: 7, x2: 2, y2: 7 },
      { x: 2, y: 7, x2: 1, y2: 7 },
      { x: 2, y: 8, x2: 1, y2: 8 },
      { x: 1, y: 8, x2: 0, y2: 8 },
      { x: 1, y: 7, x2: 0, y2: 7 },

      { x: 0, y: 7, x2: 1, y2: 7 },
      { x: 0, y: 6, x2: 1, y2: 6 },
      { x: 1, y: 6, x2: 2, y2: 6 },
      { x: 1, y: 5, x2: 2, y2: 5 },
      { x: 0, y: 5 },
      { x: 0, y: 3 },
      { x: 1, y: 3 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },

    ]

    this.eyesGrid = [
      { x: 2, y: 3, width: 1, height: 1 },
      { x: 5, y: 3, width: 1, height: 1 },

    ]

    this.legs = [
      { x: 3, y: 6, width: 2, height: 1 },
      { x: 2, y: 7, width: 1, height: 1 },
      { x: 5, y: 7, width: 1, height: 1 },

    ]
  }


  draw() {

    let x_pixel = this.width / 8;
    let y_pixel = this.height / 8;


    ctx.beginPath();
    ctx.moveTo(this.x + x_pixel * 3, this.y + y_pixel * 0);
    for (const e of this.grid) {
      let o = this.readyToDance !== false && e.y2 !== undefined ? { x: e.x2, y: e.y2 } : { x: e.x, y: e.y }
      ctx.lineTo(this.x + x_pixel * o.x, this.y + y_pixel * o.y);
    }
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill()

    if (this.readyToDance) {
      this.legs.forEach(e => {
        ctx.fillRect(this.x + x_pixel * e.x, this.y + y_pixel * e.y, x_pixel * e.width, y_pixel * e.height)

      });
    }

    ctx.fillStyle = 'black';
    this.eyesGrid.forEach(e => {
      ctx.fillRect(this.x + x_pixel * e.x, this.y + y_pixel * e.y, x_pixel * e.width, y_pixel * e.height)
    });



  }


}


class Crab extends Enemy {
  constructor(...args) {
    super(...args)

    this.grid = [

      { x: 3, y: 0 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 4, y: 2 },
      { x: 7, y: 2 },
      { x: 7, y: 1 },
      { x: 8, y: 1 },
      { x: 8, y: 0 },
      { x: 9, y: 0 },
      { x: 9, y: 1 },
      { x: 8, y: 1 },
      { x: 8, y: 2 },
      { x: 9, y: 2 },
      { x: 9, y: 3 },
      { x: 10, y: 3 },
      { x: 10, y: 4, x2: 10, y2: 1 },
      { x: 11, y: 4, x2: 11, y2: 1 },
      { x: 11, y: 7, x2: 11, y2: 4 },
      { x: 10, y: 7, x2: 10, y2: 4 },
      { x: 10, y: 5 },
      { x: 9, y: 5 },
      { x: 9, y: 7 },
      { x: 8, y: 7, x2: 10, y2: 7 },
      { x: 8, y: 8, x2: 10, y2: 8 },
      { x: 6, y: 8, x2: 9, y2: 8 },
      { x: 6, y: 7, x2: 9, y2: 7 },
      { x: 8, y: 7 },
      { x: 8, y: 6 },
      { x: 3, y: 6 },
      { x: 3, y: 7 },
      { x: 5, y: 7, x2: 2, y2: 7 },
      { x: 5, y: 8, x2: 2, y2: 8 },
      { x: 3, y: 8, x2: 1, y2: 8 },
      { x: 3, y: 7, x2: 1, y2: 7 },
      { x: 2, y: 7 },
      { x: 2, y: 5 },
      { x: 1, y: 5 },
      { x: 1, y: 7, x2: 1, y2: 4 },
      { x: 0, y: 7, x2: 0, y2: 4 },
      { x: 0, y: 4, x2: 0, y2: 1 },
      { x: 1, y: 4, x2: 1, y2: 1 },
      { x: 1, y: 3 },
      { x: 2, y: 3 },
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 3, y: 1 },
      { x: 2, y: 1 },
    ]
  }



  draw() {

    let x_pixel = this.width / 11
    let y_pixel = this.height / 8


    ctx.beginPath();
    ctx.moveTo(this.x + x_pixel * 2, this.y + y_pixel * 0);
    for (const e of this.grid) {
      let o = this.readyToDance !== false && e.y2 !== undefined ? { x: e.x2, y: e.y2 } : { x: e.x, y: e.y }
      ctx.lineTo(this.x + x_pixel * o.x, this.y + y_pixel * o.y);
    }
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill()

    // left eye
    ctx.fillStyle = 'black';
    ctx.fillRect(this.x + x_pixel * 3, this.y + y_pixel * 3, x_pixel, y_pixel)
    // right eye
    ctx.fillRect(this.x + x_pixel * 7, this.y + y_pixel * 3, x_pixel, y_pixel)
  }


}

let enemy = {}
enemy.columns = 8
enemy.rows = 6;
enemy.gap = 15;
enemy.gapTop = 30
enemy.sideGap = 30;
enemy.additionalVerticalGap = 6;


enemy.width = ((canvas.width - enemy.sideGap) - enemy.gap) / enemy.columns;
enemy.height = enemy.width * 0.5// * 0.8 // * 0.55646 cube

let enemies;

let req;
let frameNumber = 0;
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
  //-------------------------------
  //  ENEMIES
  //-------------------------------

  const hasOneSecondPassed = frameNumber % 60 === 0 && frameNumber !== 0; // what I need
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].update(hasOneSecondPassed);
    if (enemies[i].x + enemies[i].width + enemies[i].velocity.x > canvas.width || enemies[i].x + enemies[i].velocity.x < 0) {
      for (let j = i + 1; j < enemies.length; j++) {
        enemies[j].update(hasOneSecondPassed);
      }
      enemies.forEach((enemy, i) => {
        enemy.velocity.x = -enemy.velocity.x;
        setTimeout(() => {
          enemy.y += 6;
          if (enemy.y + enemy.height > bottomBorderHeight) {
            hasGameEnded = true;
          }
        }, (i * 60) + 1000);
      });
      break;
    }
  }
}

init();
animate();