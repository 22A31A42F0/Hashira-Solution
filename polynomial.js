// polynomial.js

// Sample input JSON
const input = {
  "keys": { "n": 4, "k": 3 },
  "1": { "base": "10", "value": "4" },
  "2": { "base": "2", "value": "111" },
  "3": { "base": "10", "value": "12" },
  "6": { "base": "4", "value": "213" }
};

// Function to convert string in given base to decimal integer
function baseToDecimal(str, base) {
  return parseInt(str, base);
}

// Parse points
let points = [];
for (const key in input) {
  if (key === "keys") continue;
  const x = parseInt(key);
  const { base, value } = input[key];
  const y = baseToDecimal(value, parseInt(base));
  points.push([x, y]);
}

// Take first k points
const k = input.keys.k;
const chosen = points.slice(0, k);

// Solve for quadratic coefficients (a0 + a1*x + a2*x^2)
function solveQuadratic(points) {
  const [[x1,y1],[x2,y2],[x3,y3]] = points;

  // Setup equations: a0 + a1*x + a2*x^2 = y
  // Solve using elimination
  const A = [
    [1, x1, x1*x1, y1],
    [1, x2, x2*x2, y2],
    [1, x3, x3*x3, y3]
  ];

  // Gaussian elimination (simplified since it's small)
  for (let i=0; i<3; i++) {
    // normalize row i
    let factor = A[i][i];
    for (let j=i; j<4; j++) A[i][j] /= factor;

    // eliminate below
    for (let r=i+1; r<3; r++) {
      let f = A[r][i];
      for (let j=i; j<4; j++) A[r][j] -= f*A[i][j];
    }
  }
  // back substitution
  for (let i=2; i>=0; i--) {
    for (let r=i-1; r>=0; r--) {
      let f = A[r][i];
      A[r][3] -= f*A[i][3];
      A[r][i] = 0;
    }
  }
  const a0 = A[0][3], a1 = A[1][3], a2 = A[2][3];
  return [a0, a1, a2];
}

const [a0, a1, a2] = solveQuadratic(chosen);

// Output the constant term a0
console.log(a0); // should print 3
