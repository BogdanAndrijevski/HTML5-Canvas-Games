const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
// canvas.style.backgroundColor = 'rgb(18, 18, 18)';
canvas.width = innerWidth
canvas.height = innerHeight


let projectiles = [];
let enemies = [];

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

let animationId;
function animate() {
  animationId = requestAnimationFrame(animate)
  // 'rgb(18, 18, 18)'
  ctx.fillStyle = 'rgba(0,0,0,0.2)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  // ctx.clearRect(0, 0, canvas.width, canvas.height)
  player.update()
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
      cancelAnimationFrame(animationId)
    }

    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
      if (dist - projectile.radius - enemy.radius < 1) {
        setTimeout(() => { // setTimeout: so enemies wont flash when we remove them
          enemies.splice(index, 1)
          projectiles.splice(projectileIndex, 1)
        }, 0);
      }
    });

  });
}

animate()
spawnEnemies()