const canvas = document.querySelector('canvas');
canvas.width = 240;
canvas.height = 400;
const ctx = canvas.getContext('2d');

canvas.style.display = "block";
canvas.style.position = "absolute";
canvas.style.margin = "auto";
canvas.style.top = 0;
canvas.style.bottom = 0;
canvas.style.left = 0;
canvas.style.right = 0;
canvas.style.border = "2px solid red";


ctx.fillStyle = 'black'
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.scale(20, 20);

const matrix = [
  [0, 0, 0],
  [1, 1, 1],
  [0, 1, 0],
];

function createMatrix(w, h) {
  const matrix = [];
  while(h--){
    matrix.push(new Array(w).fill(0))
  }
  return matrix;
}

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        ctx.fillStyle = 'red';
        ctx.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

const arena = createMatrix(12, 20);

const player = {
  pos: { x: 5, y: 5 },
  matrix: matrix
}
let [a, b] = [player.matrix, player.pos];


function playerDrop() {
  player.pos.y++;
  dropCounter = 0;
}

function draw() {
  drawMatrix(player.matrix, player.pos);
}


let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
let req;
function animate(time = 0) {
  req = requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const deltaTime = time - lastTime;
  lastTime = time;

  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    // playerDrop()
  }


  draw();
}

animate();


document.addEventListener('keydown', e => {
  if (e.key === 'a') {
    player.pos.x--;
  } else if (e.key === 'd') {
    player.pos.x++;
  } else if (e.key === 's') {
    playerDrop()
  }
});

