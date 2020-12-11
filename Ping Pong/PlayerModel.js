
class PlayerPaddle extends Paddle {
    constructor(...args) {
      super(...args)
    }
  
    ballImpactBottomRightCorner(ball) {
      this.ballControlBasedOnWhereItHitsThePaddle(ball, 0.067);
    }
  
    ballImpactTopRightCorner(ball) {
      this.ballControlBasedOnWhereItHitsThePaddle(ball, 0.067);
    }
  
    ballImpactFromRight(ball) {
      this.ballControlBasedOnWhereItHitsThePaddle(ball, 0.08);
    }
  
    playerMovement() {
      this.y = mouse.y - this.height / 2;
    }
  
    update(ball) {
      this.playerMovement()
      this.ballInteraction(ball)
      this.draw()
    }
  }
  