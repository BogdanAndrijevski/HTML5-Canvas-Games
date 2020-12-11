function init() {
    player = new PlayerPaddle(sizes.paddle.padding, canvas.height / 2 - sizes.paddle.height / 2, sizes.paddle.width, sizes.paddle.height, 'red')
    computer = new ComputerPaddle(canvas.width - (sizes.paddle.padding + sizes.paddle.width), canvas.height / 2 - sizes.paddle.height / 2, sizes.paddle.width, sizes.paddle.height, 'cyan')
    ball = new Ball(450, 200, 5, 2, sizes.ball.radius, 'salmon');
}

let req;
function animate() {
    req = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (hasGameEnded) {
        ctx.fillStyle = "cyan";
        ctx.font = "20px Consolas";
        let whoWon = playerScore > computerScore ? { text: 'You Won', x: 310 } : { text: 'Computer Won', x: 280 };
        ctx.fillText(whoWon.text, whoWon.x, 150);
        ctx.fillText(`Player Score: ${playerScore} - Computer Score: ${computerScore}`, 170, 210);
        ctx.fillText("Click To Start...", 275, 270);
        cancelAnimationFrame(req);
        return;
    }
    ball.update();
    player.update(ball)
    computer.update(ball)
    ctx.font = "15px Consolas";
    ctx.fillText(`player:${playerScore} computer:${computerScore}`, 15, 20)
}

init()
animate()