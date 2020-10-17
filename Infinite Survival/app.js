const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.style.backgroundColor = 'rgb(18, 18, 18)';
canvas.width = innerWidth
canvas.height = innerHeight



// const mouse = {
//   x: innerWidth / 2,
//   y: innerHeight / 2
// }
let projectiles = [];

addEventListener('click', (event) => {
  // mouse.x = event.clientX
  // mouse.y = event.clientY
  const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2)
  const velocity = {
    x: Math.cos(angle),
    y: Math.sin(angle)
  }
  const projectile = new Projectile(canvas.width / 2, canvas.height / 2, 10, 'green', velocity)
  projectiles.push(projectile)
  console.log(angle)
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

const x = canvas.width / 2;
const y = canvas.height / 2;
let player = new Player(x, y, 20, 'purple')

function animate() {
  requestAnimationFrame(animate)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  player.update()
  projectiles.forEach(projectile => {
    projectile.update();
  });
}

animate()