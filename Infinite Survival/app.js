const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.style.backgroundColor = 'rgb(18, 18, 18)';
canvas.width = innerWidth
canvas.height = innerHeight



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

const x = canvas.width / 2;
const y = canvas.height / 2;
let player = new Player(x, y, 20, 'red')

function animate() {
  requestAnimationFrame(animate)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  player.update()
}

animate()