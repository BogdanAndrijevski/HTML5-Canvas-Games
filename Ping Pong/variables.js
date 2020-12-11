const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
canvas.style.border = '2px solid wheat';
canvas.style.backgroundColor = 'rgb(11, 11, 11)';
canvas.width = 700;
canvas.height = 500;


// Style and Position Canvas with JavaScripts
canvas.style.display = "block";
canvas.style.position = "absolute";
canvas.style.margin = "auto";
canvas.style.top = 0;
canvas.style.bottom = 0;
canvas.style.left = 0;
canvas.style.right = 0;

let player;
let computer;
let ball;


let playerScore = 0;
let computerScore = 0;
let hasGameEnded = false
let winningScore = 2;
let netLines = [];


let sizes = {};

sizes.ball = {};
sizes.ball.radius = 10;
sizes.ball.velocity = {};
sizes.ball.velocity.x = 1;
sizes.ball.velocity.y = 1;

sizes.paddle = {};
sizes.paddle.height = 100;
sizes.paddle.width = 20;
sizes.paddle.padding = 20;


const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2
}

addEventListener('mousemove', e => {
    let m = calculateMousePosition(e)
    mouse.x = m.x;
    mouse.y = m.y;
})

// restart the game
document.addEventListener('click', () => {
    if (hasGameEnded) {
        // all 3 line below can be in init()
        hasGameEnded = false;
        playerScore = 0
        computerScore = 0
        //-------------------
        init()
        requestAnimationFrame(animate);
    }
});

function calculateMousePosition(event) {
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;
    let mouseX = event.clientX - rect.left - root.scrollLeft;
    let mouseY = event.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY,
    }
}

function distance(x1, y1, x2, y2) {
    const xDist = x2 - x1
    const yDist = y2 - y1
    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}