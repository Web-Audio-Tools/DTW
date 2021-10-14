// Snail Sort
// Given an n x n array, return the array elements arranged from outermost elements to the middle element, traveling clockwise.

//     array = [[1, 2, 3],
//     [4, 5, 6],
//     [7, 8, 9]]
// snail(array) # => [1, 2, 3, 6, 9, 8, 7, 4, 5]
// For better understanding, please follow the numbers of the next array consecutively:

// array = [[1, 2, 3],
// [8, 9, 4],
// [7, 6, 5]]
// snail(array) # => [1, 2, 3, 4, 5, 6, 7, 8, 9]
// This image will illustrate things more clearly:

// NOTE: The idea is not sort the elements from the lowest value to the highest; the idea is to traverse the 2 - d array in a clockwise snailshell pattern.

//     NOTE 2: The 0x0(empty matrix) is represented as en empty array inside an array[[]].

snail = function (array) {
  if (!array || (array.length && !array[0].length)) {
    return [];
  }

  const start = 0,
    nbCols = array[0].length,
    nbRows = array.length;
  return parse(array, start, nbCols, 0, nbRows);
};

function parse(array, start, nbCols, row, nbRows) {
  const results = [];
  for (let i = start; i < start + nbCols; i++) {
    results.push(array[row][i]);
  }
  if (nbCols == 1) return results;

  for (let i = row + 1; i < row + nbRows; i++) {
    results.push(array[i][start + nbCols - 1]);
  }
  for (let i = nbCols + start - 2; i >= start; i--) {
    results.push(array[row + nbRows - 1][i]);
  }
  for (let i = nbRows + row - 2; i > row; i--) {
    results.push(array[i][start]);
  }
  if (row === Math.floor(array.length / 2) + 1) return results;

  return results.concat(
    parse(array, start + 1, nbCols - 2, row + 1, nbRows - 2)
  );
}

console.log(snail([1, 2, 3, 4, 5, 6, 7, 8, 9]));

//----------------------------------TEST---------------------------------------
describe("Tests", () => {
  it("test", () => {
    Test.assertDeepEquals(snail([[]]), []);
    Test.assertDeepEquals(snail([[1]]), [1]);
    Test.assertDeepEquals(
      snail([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]),
      [1, 2, 3, 6, 9, 8, 7, 4, 5]
    );
    Test.assertDeepEquals(
      snail([
        [1, 2, 3, 4, 5],
        [6, 7, 8, 9, 10],
        [11, 12, 13, 14, 15],
        [16, 17, 18, 19, 20],
        [21, 22, 23, 24, 25],
      ]),
      [
        1, 2, 3, 4, 5, 10, 15, 20, 25, 24, 23, 22, 21, 16, 11, 6, 7, 8, 9, 14,
        19, 18, 17, 12, 13,
      ]
    );
    Test.assertDeepEquals(
      snail([
        [1, 2, 3, 4, 5, 6],
        [20, 21, 22, 23, 24, 7],
        [19, 32, 33, 34, 25, 8],
        [18, 31, 36, 35, 26, 9],
        [17, 30, 29, 28, 27, 10],
        [16, 15, 14, 13, 12, 11],
      ]),
      [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
      ]
    );
  });
});
