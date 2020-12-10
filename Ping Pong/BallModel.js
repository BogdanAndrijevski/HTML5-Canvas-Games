
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
  
    wallInteraction() {
        // right
        if (this.x + this.radius + this.velocity.x > canvas.width) {
            this.velocity.x = - this.velocity.x;
        }
        // left
        if (this.x - this.radius < 0) {
            this.velocity.x = - this.velocity.x;
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