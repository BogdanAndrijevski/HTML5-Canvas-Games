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


class Arena {
  constructor(w, h) {
    const matrix = [];
    while (h--) {
      matrix.push(new Array(w).fill(0))
    }
    this.matrix = matrix
  }

  clear() {
    this.matrix.forEach(row => row.fill(0));
  }

  collide(player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; y++) {
      for (let x = 0; x < m[y].length; x++) {
        if (m[y][x] !== 0 && (this.matrix[y + o.y] && this.matrix[y + o.y][x + o.x]) !== 0) {
          return true;
        }
      }
    }
    return false;
  }

  merge(player) {
    player.matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          this.matrix[y + player.pos.y][x + player.pos.x] = value;
        }
      });
    });
  }

  sweep() {
    let rowCount = 1;
    outer: for (let y = this.matrix.length - 1; y > 0; --y) {
      for (let x = 0; x < this.matrix[y].length; ++x) {
        if (this.matrix[y][x] === 0) {
          continue outer;
        }
      }
      const row = this.matrix.splice(y, 1)[0].fill(0);
      this.matrix.unshift(row);
      ++y;

      player.score += rowCount * 10;
      rowCount *= 2;
    }
  }

}



class Player {
  constructor() {

    this.dropCounter = 0;
    this.dropInterval = 1000;



    this.pos = { x: 0, y: 0 };
    this.matrix = null;
    this.score = 0;
  }
  move(dir) {
    this.pos.x += dir;
    if (arena.collide(this)) {
      this.pos.x -= dir;
    }
  }

  drop() {
    this.pos.y++;
    if (arena.collide(this)) {
      this.pos.y--;
      arena.merge(this);
      this.reset();
      arena.sweep();
    }
    this.dropCounter = 0;
  }

  rotateMatrix(matrix, dir) {
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < y; x++) {
        [
          matrix[x][y],
          matrix[y][x],
        ] = [
            matrix[y][x],
            matrix[x][y],
          ]
      }
    }
    if (dir > 0) {
      matrix.forEach(row => row.reverse())
    } else {
      matrix.reverse()
    }
  }


  reset() {
    const pieces = 'ILJOTSZ';
    this.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    this.pos.y = 0;
    this.pos.x = (arena.matrix[0].length / 2 | 0) - (this.matrix[0].length / 2 | 0);

    if (arena.collide(this)) {
      arena.clear()
      this.score = 0;

    }
  }
  rotate(dir) {
    const pos = this.pos.x;
    let offset = 1;
    this.rotateMatrix(this.matrix, dir);
    while (arena.collide(this)) {
      this.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > this.matrix[0].length) {
        this.rotateMatrix(this.matrix, -dir);
        this.pos.x = pos;
        return;
      }
    }
  }

  update(deltaTime) {
    this.dropCounter += deltaTime;
    if (this.dropCounter > this.dropInterval) {
      this.drop();
    }
  }
}





let colors = [
  null,
  '#FF0D72',
  '#0DC2FF',
  '#0DFF72',
  '#F538FF',
  '#FF8E0D',
  '#FFE138',
  '#3877FF',
]
function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        ctx.fillStyle = colors[value];
        ctx.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

const arena = new Arena(12, 20);
const player = new Player;





let [a, b] = [player.matrix, player.pos];





function createPiece(type) {
  if (type === "T") {
    return [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ];
  } else if (type === "O") {
    return [
      [2, 2],
      [2, 2],

    ];
  } else if (type === "L") {
    return [
      [0, 3, 0],
      [0, 3, 0],
      [0, 3, 3],
    ];
  } else if (type === "J") {
    return [
      [0, 4, 0],
      [0, 4, 0],
      [4, 4, 0],
    ];
  } else if (type === "I") {
    return [
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
    ];
  } else if (type === "S") {
    return [
      [0, 6, 6],
      [6, 6, 0],
      [0, 0, 0],
    ];
  } else if (type === "Z") {
    return [
      [7, 7, 0],
      [0, 7, 7],
      [0, 0, 0],
    ];
  }
}


function draw() {
  drawMatrix(arena.matrix, { x: 0, y: 0 });
  drawMatrix(player.matrix, player.pos);
}


let lastTime = 0;
let req;

function animate(time = 0) {
  req = requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const deltaTime = time - lastTime;
  lastTime = time;
  player.update(deltaTime)

  draw();
  ctx.fillStyle = "#01e8a2";
  ctx.font = "italic small-caps bold 0.5px Arial Black";
  ctx.fillText(`Player score: ${player.score}`, 0.5, 0.8);
}

player.reset();

animate();


document.addEventListener('keydown', e => {
  if (e.key === 'a') {
    player.move(-1);
  } else if (e.key === 'd') {
    player.move(1);
  } else if (e.key === 's') {
    player.drop()
  } else if (e.key === 'q') {
    player.rotate(-1);
  } else if (e.key === 'w') {
    player.rotate(1);
  }
});
