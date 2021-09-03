const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");

const gameOverScreen = document.getElementById("winning-message")
context.scale(20, 20);


//arenasweep function ni hamgiin door bga mur ni neg buten bolhdn arilgj onoo bolgdg function bga.
function arenaSweep() {
  let rowCount = 1;
  outer: for (let y = arena.length - 1; y > 0; --y) {
      for (let x = 0; x < arena[y].length; ++x) {
          if (arena[y][x] === 0) {
              continue outer;
            }
        }
        
        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;
        
        player.score += rowCount * 10;
        rowCount *= 2;
    }
}

// collide function ni matrix dotor bga durs deer hoosn zai baigaag shalgaj deern davharldg function bga. 

function collide(arena, player) {
  const m = player.matrix;  // m ni dursee hyanah gej shine matrix uusgej bga.
  const o = player.pos; // o ni bolhoor dursee buulgah gej ashiglana. 
  for (let y = 0; y < m.length; ++y) { 
    for (let x = 0; x < m[y].length; ++x) 
   
    {
      if (m[y][x] !== 0 && (arena[y  +o.y] && arena[y + o.y][x + o.x]) !== 0) {
        
        return true;
        
      }
    }
  }
  return false;
}

  //  createMatrix function bol shine matrix uusgej width height avnaa. 
function createMatrix(w, h) {
  const matrix = [];
  while (h--) {
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
}

// createPiece function ni matrix deer durs buteej bga.

function createPiece(type) {
  if (type === "I") {
    return [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ];
  } else if (type === "L") {
    return [
      [0, 2, 0],
      [0, 2, 0],
      [0, 2, 2],
    ];
  } else if (type === "J") {
    return [
      [0, 3, 0],
      [0, 3, 0],
      [3, 3, 0],
    ];
  } else if (type === "O") {
    return [
      [4, 4],
      [4, 4],
    ];
  } else if (type === "Z") {
    return [
      [5, 5, 0],
      [0, 5, 5],
      [0, 0, 0],
    ];
  } else if (type === "S") {
    return [
      [0, 6, 6],
      [6, 6, 0],
      [0, 0, 0],
    ];
  } else if (type === "T") {
    return [
      [0, 7, 0],
      [7, 7, 7],
      [0, 0, 0],
    ];
  }
}

// drawMatrix function ni dursiig buulgaj zai baigaa esehiig shalgadag function bga. uurur helvel cordinant aar shalgj bga.
function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    
    row.forEach((value, x) => {
      if (value !== 0) {
          
        context.fillStyle = colors[value];
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      
      }
    });
  });
}
// draw function bol talbaig zurj bna. hex code oor  #000 bol har ungiig ilerhiilj bna. 
function draw() {
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);

 drawMatrix(arena, { x: 0, y: 0 });
  drawMatrix(player.matrix, player.pos);
}
//Endees ehelnee
// mergre function ni bol x , y cordinant iig update hiij bna umnuh baigaa dursniha update hiij bna. Y ni 0 tei tentsuu baival game over bolno.
function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      
      }
    });
  });
}

// rotate function ni matrix, dir gesen 2 value avnaa. rotate function dotor loop yvna. y ni 0 ees ehelj matrix lenght hurtel yvnaa neg looped 1 eer nemne. 
// ehnii loop yvmagts dotrn dahiad neg loop yvna. ter loopd bol yg adilhn gehde x cordinantaar yvna. 

function rotate(matrix, dir) {
  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < y; ++x) {
      [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
    }
  }
//dir iin talaar yraltsna.
  if (dir > 0) {
    matrix.forEach((row) => row.reverse());
  } else {
    matrix.reverse();
  }
}
// playerDrop function ni  buh ymiig shineer ehluuldeg function bna. y ni 20 oos ih bhim bol buh ymiig shineer ehluulne. (player reset, arenasweep, update score gesen functionuudig ajluulna).
function playerDrop() {
  player.pos.y++;
  if (collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    playerReset();
    arenaSweep();
    updateScore();
    
  }
  dropCounter = 0;
}

//1
function playerMove(offset) {
  player.pos.x += offset;
  if (collide(arena, player)) {
    player.pos.x -= offset;
  }
}

function playerReset() {
  const pieces = "TJLOSZI";
  const btn = document.getElementById("myBtn")
  player.matrix = createPiece(pieces[(pieces.length * Math.random()) | 0]);
  player.pos.y = 0;
  player.pos.x =
    ((arena[0].length / 2) | 0) - ((player.matrix[0].length / 2) | 0);
  if (collide(arena, player)) {
    gameOver();
  
    btn.onclick = function(){
      console.log("clicked")
      lossMessageElement.classList.remove("show")
      arena.forEach((row) => row.fill(0));
      player.score = 0;
      updateScore();
    } 
  }
}

function playerRotate(dir) {
  const pos = player.pos.x;
  let offset = 1;
  rotate(player.matrix, dir);
  while (collide(arena, player)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > player.matrix[0].length) {
      rotate(player.matrix, -dir);
      player.pos.x = pos;
      return;
    }
  }
}

let dropCounter = 0;
let dropInterval = 1000;

let lastTime = 0;
function update(time = 0) {
  const deltaTime = time - lastTime;
  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    
    playerDrop();
  }

  lastTime = time;
   
  draw();
  requestAnimationFrame(update);
}

function updateScore() {
  document.getElementById("score").innerText = player.score;
}

document.addEventListener("keydown", (event) => {
  if (event.keyCode === 37) {
    playerMove(-1);
  } else if (event.keyCode === 39) {
    playerMove(1);
  } else if (event.keyCode === 40) {
    playerDrop();
  } else if (event.keyCode === 81) {
    playerRotate(-1);
  } else if (event.keyCode === 87) {
    playerRotate(1);
  }
});

const colors = [
  null,
  "#FF0D72",
  "#0DC2FF",
  "#0DFF72",
  "#F538FF",
  "#FF8E0D",
  "#FFE138",
  "#3877FF",
];

const arena = createMatrix(12, 20);



const player = {
  pos: { x: 0, y: 0 },
  matrix: null,
  score: 0,
};

playerReset();
updateScore();
update();



console.log(arena.length)

const lossMessageElement = document.getElementById("lostMessage");
function gameOver() { 
  lossMessageElement.classList.add("show");
}
