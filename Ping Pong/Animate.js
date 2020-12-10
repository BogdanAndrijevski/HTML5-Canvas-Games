function init() {
    ball = new Ball(450, 200, 5, 2, sizes.ball.radius, 'salmon');    
}

let req;
function animate() {
    req = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height)   
    ball.update()
}

init()
animate()