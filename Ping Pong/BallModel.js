
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
    }
    canBounce() {
      this.isBouncingAllowed = false;  
      setTimeout(() => {     
        this.isBouncingAllowed = true;
      }, 500);
    }
    
    ballReset() {
      this.velocity.x = - this.velocity.x;
      this.velocity.y = 0;
  
      this.x = canvas.width / 2;
      this.y = canvas.height / 2;
  
    }
    wallInteraction() {
      // right
      if (this.x + this.radius + this.velocity.x > canvas.width) {
        playerScore++
        if (playerScore == winningScore) { hasGameEnded = true }
        this.ballReset()
      }
      // left
      if (this.x - this.radius < 0) {
        computerScore++
        if (computerScore == winningScore) { hasGameEnded = true }
        this.ballReset()
      }
      // top and bottom
      if (this.y + this.radius + this.velocity.y > canvas.height ||
        this.y - this.radius < 0) {
        this.velocity.y = - this.velocity.y;
      }
    }
    update() {
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