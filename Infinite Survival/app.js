const canvas = document.querySelector('canvas');
const scoreEl = document.querySelector('#scoreEl');
const startGameBtn = document.querySelector('#startGameBtn');
const startGameDiv = document.querySelector('#startGameDiv');
const bigScore = document.querySelector('#bigScore');

const ctx = canvas.getContext('2d');
// canvas.style.backgroundColor = 'rgb(18, 18, 18)';
canvas.width = innerWidth
canvas.height = innerHeight




startGameBtn.addEventListener('click', () => {
  startGameDiv.style.display = 'none';
  init()
  animate()
  spawnEnemies()
})

addEventListener('click', event => {

  const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2)
  const velocity = {
    // x: Math.cos(angle),
    // y: Math.sin(angle)
    x: Math.cos(angle) * 4, // more speed
    y: Math.sin(angle) * 4 // more speed
  }
  const projectile = new Projectile(canvas.width / 2, canvas.height / 2, 5, 'white', velocity)
  projectiles.push(projectile)
  // console.log(angle)
})

// Player
class Player {
  constructor(x, y, radius, color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
  }

  draw() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    ctx.fillStyle = this.color
    ctx.fill()
    ctx.closePath()
  }

  update() {
    this.draw()
  }
}

// Projectile
class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity
  }

  draw() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    ctx.fillStyle = this.color
    ctx.fill()
    ctx.closePath()
  }

  update() {
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
    this.draw()
  }
}

// Enemy
class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity
  }

  draw() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    ctx.fillStyle = this.color
    ctx.fill()
    ctx.closePath()
  }

  update() {
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
    this.draw()
  }
}

// Particles
class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity
    this.alpha = 1;
    this.friction = 0.98
  }

  draw() {
    ctx.save()
    ctx.globalAlpha = this.alpha
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    ctx.fillStyle = this.color
    ctx.fill()
    ctx.closePath()
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

function spawnEnemies() {
  setInterval(() => {
    const radius = Math.random() * (30 - 4) + 4 // from 4 to 30
    let x
    let y
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
      y = Math.random() * canvas.height

    } else {
      x = Math.random() * canvas.width
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
    }


    // const color = 'yellow'
    const color = `hsl(${Math.random() * 360},50%, 50%)`
    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x)
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle)
    }

    enemies.push(new Enemy(x, y, radius, color, velocity))
  }, 1000)
}

const x = canvas.width / 2;
const y = canvas.height / 2;
let player = new Player(x, y, 10, 'white')
let particles = []
let projectiles = [];
let enemies = [];

function init() {
  score = 0;
  scoreEl.innerHTML = score;
  player = new Player(x, y, 10, 'white')
  particles = []
  projectiles = [];
  enemies = [];
}
let animationId;
let score = 0;
function animate() {
  animationId = requestAnimationFrame(animate)
  // 'rgb(18, 18, 18)'
  ctx.fillStyle = 'rgba(0,0,0,0.2)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  // ctx.clearRect(0, 0, canvas.width, canvas.height)
  player.update()
  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1)
    } else {
      particle.update()
    }
  });
  projectiles.forEach((projectile, index) => {
    projectile.update();
    if (projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height) {
      projectiles.splice(index, 1)

    }
  });
  enemies.forEach((enemy, index) => {
    enemy.update();
    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
    if (dist - player.radius - enemy.radius < 1) {
      console.log('end game')
      startGameDiv.style.display = 'flex';
      bigScore.innerHTML = score;
      cancelAnimationFrame(animationId)
    }

    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
      // enemy / projectile hit
      if (dist - projectile.radius - enemy.radius < 1) {

        // create explosions
        for (let i = 0; i < enemy.radius * 1.5; i++) {

          // for (let i = 0; i < 8; i++) {
          particles.push(new Particle(projectile.x, projectile.y, (Math.random() * 2) + 0.5, enemy.color, {
            x: (Math.random() - 0.5) * (Math.random() * 5),
            y: (Math.random() - 0.5) * (Math.random() * 5)
            // x: Math.random() - 0.5,
            // y: Math.random() - 0.5
          }))
        }
        if (enemy.radius - 10 > 5) {
          // score
          score += 5;
          scoreEl.innerHTML = score
          //--------------------------
          // no gsap
          // enemy.radius -= 5 
          //--------------------------
          // using GSAP
          gsap.to(enemy, {
            radius: enemy.radius - 10
          })
          setTimeout(() => { // setTimeout: so enemies wont flash when we remove them
            projectiles.splice(projectileIndex, 1)
          }, 0);
        } else {
          score += 15;
          scoreEl.innerHTML = score
          setTimeout(() => { // setTimeout: so enemies wont flash when we remove them
            enemies.splice(index, 1)
            projectiles.splice(projectileIndex, 1)
          }, 0);
        }
      }
    });

  });
}

