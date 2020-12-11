
class ComputerPaddle extends Paddle {
    constructor(...args) {
      super(...args)
      this.velocity = {
        y: 4
      }
    }
  
    ballImpactTopLeftCorner(ball) {
      this.ballControlBasedOnWhereItHitsThePaddle(ball, 0.067);
    }
    ballImpactBottomLeftCorner(ball) {
      this.ballControlBasedOnWhereItHitsThePaddle(ball, 0.067);
    }
    ballImpactFromLeft(ball) {
      this.ballControlBasedOnWhereItHitsThePaddle(ball, 0.08);
    }
  
    computerPaddleMovement(ball) {
      let centerOfPaddle = this.y + this.height / 2;
  
      for (let i = 80, j = 4; i >= 20; i -= 5, j -= 0.2) { // seems like good numbers
        if (centerOfPaddle < ball.y - i) {
          this.y += j;
          break;
        } else if (centerOfPaddle > ball.y + i) {
          this.y -= j;
          break;
        }
      }
  
    }
  
    update(ball) {
      this.computerPaddleMovement(ball)
      this.ballInteraction(ball)
      this.draw()
    }
  }