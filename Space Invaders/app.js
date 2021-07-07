let canvas = document.querySelector('canvas');
canvas.width = 500;
canvas.height = 550;
let ctx = canvas.getContext('2d');

// Center Canvas with JavaScript
const borderColor = 'green';
canvas.style.display = "block";
canvas.style.position = "absolute";
canvas.style.margin = "auto";
canvas.style.top = 0;
canvas.style.bottom = 0;
canvas.style.left = 0;
canvas.style.right = 0;
canvas.style.border = `2px solid ${borderColor}`;
// canvas.style.border = "2px solid red";

let bottomBorderPadding = 25;
let bottomBorderHeight = canvas.height - bottomBorderPadding;
let enemiesLength;

let player;
let playerScore = 0;
let hasGameEnded = false;

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
let explosionParticles;
let enemyProjectiles;


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

class ExplosionParticle {
  constructor(x, y, width, color, velocity) {
    this.x = x
    this.y = y
    this.width = width
    this.height = width
    this.color = color
    this.velocity = velocity
    this.alpha = 1;
    this.friction = 0.98
  }

  draw() {
    ctx.save()
    ctx.globalAlpha = this.alpha
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.restore()
  }

  update() {
    this.draw()
    this.velocity.x *= this.friction
    this.velocity.y *= this.friction
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
    this.alpha -= 0.01
  }
}


function init() {
  enemies = [];
  explosionParticles = []
  enemyProjectiles = [];
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

  shootProjectile() {
    if (Math.random() < 1 / (enemiesLength * 60)) {
      let projectileHeight = 15;
      let projectileWidth = 4;
      enemyProjectiles.push(new Projectile(this.x + this.width / 2 - projectileWidth / 2, this.y + this.height, projectileWidth, projectileHeight, 6, this.color));
    }
  }

  update(hasOneSecondPassed) {
    this.danceAndMove(hasOneSecondPassed);
    this.draw();
    this.shootProjectile();
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


//-----------------------------------------------------------------
//-------------------------------
//  PLAYER PROJECTILES
//-------------------------------
function drawingPlayerProjectiles() {

  for (let i = projectiles.length - 1; i >= 0; i--) {
    const projectile = projectiles[i];
    //------------------------------
    projectile.update();
    //------------------------------
    if (projectile.y + projectile.height < 0) {
      projectiles.splice(i, 1);
      continue;
    }

    for (let j = enemies.length - 1; j >= 0; j--) {
      const enemy = enemies[j];
      // collision 
      if (projectile.x < enemy.x + enemy.width && projectile.x + projectile.width > enemy.x &&
        projectile.y < enemy.y + enemy.height && projectile.y + projectile.height > enemy.y) {
        projectiles.splice(i, 1)
        enemies.splice(j, 1)
        enemiesLength = enemies.length
        if (enemiesLength === 0) hasGameEnded = true;
        playerScore += enemy.constructor.name == 'Octopus' ? 10 : enemy.constructor.name == 'Crab' ? 20 : 30;

        // create explosions
        for (let i = 0; i < 8; i++) {
          let width = (Math.random() * 2) + 3.5;
          explosionParticles.push(new ExplosionParticle(projectile.x - width / 2, projectile.y - width / 2, width, enemy.color, {
            x: (Math.random() - 0.5) * (Math.random() * 5),
            y: (Math.random() - 0.5) * (Math.random() * 5)
          }))
        }
        break;
      }
    }

  }
}

//-------------------------------
//  ENEMY PROJECTILES
//-------------------------------

function drawingEnemyProjectiles() {
  for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
    const projectile = enemyProjectiles[i];
    projectile.update();
    // collision
    if (projectile.x < player.x + player.width && projectile.x + projectile.width > player.x &&
      projectile.y < player.y + player.height && projectile.y + projectile.height > player.y) {
      // console.log('we have been hit');
      enemyProjectiles.splice(i, 1);
      player.lives > 1 ? player.lives -= 1 : hasGameEnded = true;
    }
    if (projectile.y + projectile.height > bottomBorderHeight) {
      enemyProjectiles.splice(i, 1);
    }
  }
}

//-------------------------------
//  EXPLOSIONS
//-------------------------------

function drawingExplosionParticles() {
  explosionParticles.forEach((explosionParticle, index) => {
    if (explosionParticle.alpha <= 0) {
      explosionParticles.splice(index, 1)
    } else {
      explosionParticle.update()
    }
  });
}
//-------------------------------
//  ENEMIES
//-------------------------------
function drawingEnemies() {
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
//---------------------------------------------------
// BOTTOM BORDER
//---------------------------------------------------
function drawingBottomBorder() {
  ctx.strokeStyle = borderColor;
  ctx.beginPath();
  ctx.moveTo(0, bottomBorderHeight);
  ctx.lineTo(canvas.width, bottomBorderHeight);
  ctx.lineWidth = 2;
  ctx.stroke();
}
//---------------------------------------------------
// PLAYER LIVES TEXT
//---------------------------------------------------
function drawingPlayerScoreAndLivesLeftText() {
  ctx.fillStyle = "#01e8a2";
  ctx.font = "italic small-caps bold 15px Arial Black";
  ctx.fillText(`Player score: ${playerScore}`, 15, canvas.height - 8);
  ctx.fillText(`Player lives: ${player.lives}`, 360, canvas.height - 8);
}
//---------------------------------------------------
// END GAME TEXT
//---------------------------------------------------
function drawingEndGameText() {
  let playerScoreText = `Player Score ${playerScore}`
  let clickToStartText = `Click To Start ...`

  ctx.fillStyle = "#01e8a2";
  ctx.font = "italic small-caps bold 25px Arial Black";
  let playerScoreTextWidth = ctx.measureText(playerScoreText).width;
  let clickToStartTextWidth = ctx.measureText(clickToStartText).width;
  let textHeight = ctx.measureText('M').width; // close approximation 
  let textVerticalOffset = 20;
  ctx.fillText(`${playerScoreText}`, (canvas.width / 2) - (playerScoreTextWidth / 2), ((canvas.height / 2) - (textHeight / 2)) + textVerticalOffset);
  ctx.fillText(`${clickToStartText}`, (canvas.width / 2) - (clickToStartTextWidth / 2), ((canvas.height / 2) - (textHeight / 2)) - textVerticalOffset);

}
//------------------------------------------------------------------
//------------------------------------------------------------------
function animate() {
  req = requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //----------------------------------------------------------------
  if (hasGameEnded) {
    drawingEndGameText();
    cancelAnimationFrame(req);
    return;
  }
  //-------------------------------
  //  PLAYER
  //-------------------------------
  player.update();

  //-------------------------------
  //  PLAYER PROJECTILES
  //-------------------------------
  drawingPlayerProjectiles();
  //-------------------------------
  //  ENEMY PROJECTILES
  //-------------------------------
  drawingEnemyProjectiles();
  //-------------------------------
  //  EXPLOSIONS
  //-------------------------------
  drawingExplosionParticles();
  //-------------------------------
  //  ENEMIES
  //-------------------------------
  drawingEnemies();
  //---------------------------------------------------
  // BOTTOM BORDER
  //---------------------------------------------------
  drawingBottomBorder();
  //---------------------------------------------------
  // PLAYER LIVES TEXT
  //---------------------------------------------------
  drawingPlayerScoreAndLivesLeftText();
  //---------------------------------------------------
  frameNumber++;

}

init();
animate();

// restart the game
document.addEventListener('click', () => {
  if (hasGameEnded) {
    // all 3 line below can be in init()
    hasGameEnded = false;
    playerScore = 0;
    readyToFire = false;
    init()
    requestAnimationFrame(animate);
  }
});