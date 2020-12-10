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


let ball;

let sizes = {};

sizes.ball = {};
sizes.ball.radius = 10;
sizes.ball.velocity = {};
sizes.ball.velocity.x = 1;
sizes.ball.velocity.y = 1;