class MinHeap {
  constructor() {
    this.heap = [];
  }

  insert(node) {
    this.heap.push(node);
    this.bubbleUp();
  }

  extractMin() {
    if (this.heap.length === 1) return this.heap.pop();
    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.bubbleDown();
    return min;
  }

  bubbleUp() {
    let index = this.heap.length - 1;
    while (index > 0) {
      let parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[parentIndex][0] <= this.heap[index][0]) break;
      [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
      index = parentIndex;
    }
  }

  bubbleDown() {
    let index = 0;
    while (2 * index + 1 < this.heap.length) {
      let left = 2 * index + 1;
      let right = 2 * index + 2;
      let smallest = left;
      if (right < this.heap.length && this.heap[right][0] < this.heap[left][0]) {
        smallest = right;
      }
      if (this.heap[index][0] <= this.heap[smallest][0]) break;
      [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }

  isEmpty() {
    return this.heap.length === 0;
  }
}

// Direcciones posibles (incluyendo diagonales para zigzag)
const DIRECCIONES = [
  [-1, 0], [1, 0], [0, -1], [0, 1],
  [-1, -1], [-1, 1], [1, -1], [1, 1]
];

// Distancia Manhattan como heurística
function heuristica(a, b) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

// Algoritmo A*
function aStar(grid, start, goal) {
  const filas = grid.length;
  const columnas = grid[0].length;
  const priorityQueue = new MinHeap();
  priorityQueue.insert([0, start]);

  const cameFrom = {};
  const gScore = {};
  const fScore = {};
  const explorados = new Set();

  for (let i = 0; i < filas; i++) {
    for (let j = 0; j < columnas; j++) {
      gScore[`${i},${j}`] = Infinity;
      fScore[`${i},${j}`] = Infinity;
    }
  }

  gScore[`${start[0]},${start[1]}`] = 0;
  fScore[`${start[0]},${start[1]}`] = heuristica(start, goal);

  while (!priorityQueue.isEmpty()) {
    const [, actual] = priorityQueue.extractMin();
    explorados.add(`${actual[0]},${actual[1]}`);

    if (actual[0] === goal[0] && actual[1] === goal[1]) {
      return { path: reconstruirRuta(cameFrom, actual), explorados };
    }

    for (const [dx, dy] of DIRECCIONES) {
      const vecino = [actual[0] + dx, actual[1] + dy];

      if (
        vecino[0] >= 0 && vecino[0] < filas &&
        vecino[1] >= 0 && vecino[1] < columnas &&
        grid[vecino[0]][vecino[1]] === 0
      ) {
        const costoMovimiento = (dx !== 0 && dy !== 0) ? Math.SQRT2 : 1;
        const tentativeGScore = gScore[`${actual[0]},${actual[1]}`] + costoMovimiento;

        if (tentativeGScore < gScore[`${vecino[0]},${vecino[1]}`]) {
          cameFrom[`${vecino[0]},${vecino[1]}`] = actual;
          gScore[`${vecino[0]},${vecino[1]}`] = tentativeGScore;
          fScore[`${vecino[0]},${vecino[1]}`] = tentativeGScore + heuristica(vecino, goal);
          priorityQueue.insert([fScore[`${vecino[0]},${vecino[1]}`], vecino]);
        }
      }
    }
  }
  return { path: [], explorados };
}


// Reconstrucción de la ruta óptima
function reconstruirRuta(cameFrom, actual) {
  const ruta = [actual];
  while (cameFrom[`${actual[0]},${actual[1]}`]) {
    actual = cameFrom[`${actual[0]},${actual[1]}`];
    ruta.push(actual);
  }
  return ruta.reverse();
}

module.exports = { aStar };