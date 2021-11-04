function seed() {
  return [...arguments];
}

function same([x, y], [j, k]) {
  return x === j && y === k;
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  let alive = false;
  this.map((item) => {
    if (same(cell, item)) {
      alive = true;
    }
  });
  return alive;
}

const printCell = (cell, state) => {
  if (contains.call(state, cell)) {
    return "\u25A3";
  }
  return "\u25A2";
};

const corners = (state = []) => {
  let topRight = [-Infinity, -Infinity];
  let bottomLeft = [Infinity, Infinity];
  if (state.length === 0) {
    topRight = [0, 0];
    bottomLeft = [0, 0];
    return { topRight, bottomLeft };
  }
  state.map((item) => {
    if (item[0] > topRight[0]) {
      topRight[0] = item[0];
    }
    if (item[1] > topRight[1]) {
      topRight[1] = item[1];
    }
    if (item[0] < bottomLeft[0]) {
      bottomLeft[0] = item[0];
    }
    if (item[1] < bottomLeft[1]) {
      bottomLeft[1] = item[1];
    }
  });
  return { topRight, bottomLeft };
};

const printCells = (state) => {
  let { topRight, bottomLeft } = corners(state);
  let line = "";
  for (let x = bottomLeft[0]; x <= topRight[0]; x++) {
    for (let y = bottomLeft[1]; y <= bottomLeft[1]; y++) {
      line += printCell([x, y], state);
      line += " ";
    }
    line += "\n";
  }
  return line;
};

const getNeighborsOf = ([x, y]) => [
  [x - 1, y - 1],
  [x - 1, y],
  [x - 1, y + 1],
  [x, y - 1],
  [x, y + 1],
  [x + 1, y - 1],
  [x + 1, y],
  [x + 1, y + 1],
];

const getLivingNeighbors = (cell, state) => {
  let neighbours = getNeighborsOf(cell);
  let result = [];
  neighbours.map((item) => {
    if (contains.call(state, item)) {
      result.push(item);
    }
  });
  return result;
};

const willBeAlive = (cell, state) => {
  let livingNeighbours = getLivingNeighbors(cell, state);
  return (
    livingNeighbours.length === 3 ||
    (contains.call(state, cell) && livingNeighbours.length === 2)
  );
};

const calculateNext = (state) => {
  let { topRight, bottomLeft } = corners(state);
  topRight = [topRight[0] + 1, topRight[1] + 1];
  bottomLeft = [bottomLeft[0] - 1, bottomLeft[1] - 1];
  let result = [];
  for (let x = bottomLeft[0]; x <= topRight[0]; x++) {
    for (let y = bottomLeft[1]; y <= topRight[1]; y++) {
      if (willBeAlive([x, y], state)) {
        result.push([x, y]);
      }
    }
  }
  return result;
};

const iterate = (state, iterations) => {
  let count = 0;
  let result = [];
  while (count <= iterations) {
    result.push(state);
    state = calculateNext(state);
    count++;
  }
  return result;
};

const main = (pattern, iterations) => {
  let states = iterate(startPatterns[pattern], iterations);
  states.forEach((r) => console.log(printCells(r)));
};

const startPatterns = {
  rpentomino: [
    [3, 2],
    [2, 3],
    [3, 3],
    [3, 4],
    [4, 4],
  ],
  glider: [
    [-2, -2],
    [-1, -2],
    [-2, -1],
    [-1, -1],
    [1, 1],
    [2, 1],
    [3, 1],
    [3, 2],
    [2, 3],
  ],
  square: [
    [1, 1],
    [2, 1],
    [1, 2],
    [2, 2],
  ],
};

const [pattern, iterations] = process.argv.slice(2);
const runAsScript = require.main === module;

if (runAsScript) {
  if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
    main(pattern, parseInt(iterations));
  } else {
    console.log("Usage: node js/gameoflife.js rpentomino 50");
  }
}

exports.seed = seed;
exports.same = same;
exports.contains = contains;
exports.getNeighborsOf = getNeighborsOf;
exports.getLivingNeighbors = getLivingNeighbors;
exports.willBeAlive = willBeAlive;
exports.corners = corners;
exports.calculateNext = calculateNext;
exports.printCell = printCell;
exports.printCells = printCells;
exports.startPatterns = startPatterns;
exports.iterate = iterate;
exports.main = main;
