// js/utils.js

/**
 * Converts a flat array to a 3x3 matrix.
 * @param {Array} arr - Flat array of length 9.
 * @returns {Array} - 3x3 matrix.
 */
function arrayToMatrix(arr) {
    return [arr.slice(0, 3), arr.slice(3, 6), arr.slice(6, 9)];
}

/**
 * Converts a 3x3 matrix to a flat array.
 * @param {Array} matrix - 3x3 matrix.
 * @returns {Array} - Flat array of length 9.
 */
function matrixToArray(matrix) {
    return matrix[0].concat(matrix[1], matrix[2]);
}

/**
 * Rotates a matrix 90 degrees clockwise.
 * @param {Array} matrix - 3x3 matrix.
 * @returns {Array} - Rotated matrix.
 */
function rotateMatrixClockwise(matrix) {
    const N = matrix.length;
    let result = Array.from({ length: N }, () => Array(N).fill(null));
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            result[j][N - 1 - i] = matrix[i][j];
        }
    }
    return result;
}

/**
 * Rotates a matrix 90 degrees counter-clockwise.
 * @param {Array} matrix - 3x3 matrix.
 * @returns {Array} - Rotated matrix.
 */
function rotateMatrixCounterClockwise(matrix) {
    const N = matrix.length;
    let result = Array.from({ length: N }, () => Array(N).fill(null));
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            result[N - 1 - j][i] = matrix[i][j];
        }
    }
    return result;
}

/**
 * Checks if two arrays are equal.
 * @param {Array} a - First array.
 * @param {Array} b - Second array.
 * @returns {Boolean} - True if equal, else false.
 */
function arraysEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}
