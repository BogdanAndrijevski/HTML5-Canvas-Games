const canvas = document.querySelector('canvas');
canvas.width = 240; // 12
canvas.height = 400; // 20
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
  while (h--) {
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
  pos: { x: 1, y: 1 },
  matrix: matrix
}
let [a, b] = [player.matrix, player.pos];

function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

function collide(arena, player) {
  const [m, o] = [player.matrix, player.pos];
  for (let y = 0; y < m.length; y++) {
    for (let x = 0; x < m[y].length; x++) {
      if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
}


function playerDrop() {
  player.pos.y++;
  if (collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    player.pos.y = 0;
  }
  dropCounter = 0;
}

function draw() {

  drawMatrix(arena, { x: 0, y: 0 });
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

function playerMove(dir) {
  player.pos.x += dir;
  if(collide(arena, player)){
    player.pos.x -= dir;
  }

}
document.addEventListener('keydown', e => {
  if (e.key === 'a') {
    playerMove(-1);
  } else if (e.key === 'd') {
    playerMove(1);
  } else if (e.key === 's') {
    playerDrop()
  }
});
