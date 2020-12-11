

class Paddle {
    constructor(x, y, width, height, color) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
    }

    ballInteraction(ball) {
        if (ball.isBouncingAllowed === true) {
            // CORNERS
            // top right corner
            if (distance(ball.x, ball.y, this.x + this.width, this.y) <= ball.radius) {
                ball.canBounce()
                this.ballImpactTopRightCorner(ball)
            }
            // bottom right corner
            else if (distance(ball.x, ball.y, this.x + this.width, this.y + this.height) <= ball.radius) {
                ball.canBounce()
                this.ballImpactBottomRightCorner(ball)
            }
            // bottom left corner
            else if (distance(ball.x, ball.y, this.x, this.y + this.height) <= ball.radius) {
                ball.canBounce()
                this.ballImpactBottomLeftCorner(ball)
            }
            // top left corner
            else if (distance(ball.x, ball.y, this.x, this.y) <= ball.radius) {
                ball.canBounce()
                this.ballImpactTopLeftCorner(ball)
            }
            // SIDES 2
            else if (ball.x > this.x && ball.x < this.x + this.width ||// left
                ball.y > this.y && ball.y < this.y + this.height
            ) {
                // crtez
                // od levo
                if (ball.x < this.x && ball.x + ball.radius > this.x) {
                    ball.canBounce()
                    this.ballImpactFromLeft(ball)
                }
                // od desno
                else if (ball.x > this.x + this.width && ball.x - ball.radius < this.x + this.width) {
                    ball.canBounce()
                    this.ballImpactFromRight(ball)
                }
                // od gore
                else if (ball.y < this.y && ball.y + ball.radius > this.y) {
                    ball.velocity.y = - ball.velocity.y;
                    ball.canBounce()
                }
                // od dole
                else if (ball.y > this.y + this.height && ball.y - ball.radius < this.y + this.height) {
                    ball.velocity.y = - ball.velocity.y;
                    ball.canBounce()
                }
            }
        }
    }

    ballImpactTopLeftCorner(ball) {
        let prevBallX = ball.x - ball.velocity.x
        let prevBallY = ball.y - ball.velocity.y
        // od gore desno odi nakaj dole levo
        if (prevBallX > ball.x && prevBallY < ball.y) {
            ball.velocity.y = - ball.velocity.y;
        }
        // od dole levo odi nakaj gore desno
        else if (prevBallX < ball.x && prevBallY > ball.y) {
            ball.velocity.x = - ball.velocity.x;
        }
        else {
            ball.velocity.x = - ball.velocity.x;
            ball.velocity.y = - ball.velocity.y;
        }
    }
    ballImpactBottomLeftCorner(ball) {
        let prevBallX = ball.x - ball.velocity.x
        let prevBallY = ball.y - ball.velocity.y
        // od gore levo paga nakaj dole desno
        if (prevBallX < ball.x && prevBallY < ball.y) {
            ball.velocity.x = - ball.velocity.x;
        }
        // od dole desno odi nakaj gore levo
        else if (prevBallX > ball.x && prevBallY > ball.y) {
            ball.velocity.y = - ball.velocity.y;
        }
        else {
            ball.velocity.y = - ball.velocity.y;
            ball.velocity.x = - ball.velocity.x;
        }
    }
    ballImpactBottomRightCorner(ball) {
        let prevBallX = ball.x - ball.velocity.x
        let prevBallY = ball.y - ball.velocity.y

        // od gore desno odi nakaj dole levo
        if (prevBallX > ball.x && prevBallY < ball.y) {
            ball.velocity.x = - ball.velocity.x;
        }
        // od dole levo odi nakaj gore desno
        else if (prevBallX < ball.x && prevBallY > ball.y) {
            ball.velocity.y = - ball.velocity.y;
        }
        else {
            ball.velocity.x = - ball.velocity.x;
            ball.velocity.y = - ball.velocity.y;
        }
    }
    ballImpactTopRightCorner(ball) {
        let prevBallX = ball.x - ball.velocity.x
        let prevBallY = ball.y - ball.velocity.y
        // od gore levo paga nakaj dole desno
        if (prevBallX < ball.x && prevBallY < ball.y) {
            ball.velocity.y = - ball.velocity.y;
        }
        // od dole desno odi nakaj gore levo
        else if (prevBallX > ball.x && prevBallY > ball.y) {
            ball.velocity.x = - ball.velocity.x;
        }
        else {
            ball.velocity.y = - ball.velocity.y;
            ball.velocity.x = - ball.velocity.x;
        }
    }

    ballImpactFromLeft(ball) {
        ball.velocity.x = - ball.velocity.x;
    }
    ballImpactFromRight(ball) {
        ball.velocity.x = - ball.velocity.x;
    }

    ballControlBasedOnWhereItHitsThePaddle(ball, num) {
        ball.velocity.x = - ball.velocity.x;
        let distanceFromBallYToPaddleCenter = ball.y - (this.y + this.height / 2)
        ball.velocity.y = distanceFromBallYToPaddleCenter * num
    }

    draw() {
        ctx.beginPath()
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.closePath()
    }

    update(ball) {
        this.ballInteraction(ball)
        this.draw()
    }
}
