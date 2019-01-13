/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

window.findNRooksSolution = function(n) {
  var solution = [];
  var board = new Board({
    n: n
  });
  var tracker = 0;

  function recursion(currentRow, tracker) {
    if (currentRow >= n) {
      if (tracker === n) {
        for (var key in board.attributes) {
          var row = board.attributes[key];
          solution.push(row);
        }
      }
      return;
    }

    for (var i = 0; i < n; i++) {
      board.togglePiece(currentRow, i);
      if (board.hasAnyRooksConflicts()) {
        board.togglePiece(currentRow, i);
      } else {
        tracker++;
        return recursion(currentRow + 1, tracker);
      }
    }

    return recursion(currentRow + 1, tracker);
  } //EOF recursion

  recursion(0, tracker);


  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return board.rows();
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = 0;
  var board = new Board({
    n: n
  });

  function recursion(currentRow) {
    if (currentRow >= n) {
      solutionCount++;
      return;
    }

    for (var i = 0; i < n; i++) {
      board.togglePiece(currentRow, i);

      if (!board.hasAnyRooksConflicts()) {
        recursion(currentRow + 1);
      }
      //this de-toggles to remove position to move on to next position
      board.togglePiece(currentRow, i);
    }
  }

  recursion(0);

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = undefined; //fixme

  var board = new Board({
    n: n
  });

  var recursion = function(currentRow) {

    if (currentRow === n) {
      if (solution === undefined) {
        solution = [];

        for (var i = 0; i < n; i++) {
          solution.push(board.get(i).slice());
        }
      }
      return;
    }

    for (var i = 0; i < n; i++) {
      board.togglePiece(currentRow, i);

      if (!board.hasAnyQueensConflicts()) {
        recursion(currentRow + 1);
      }
      board.togglePiece(currentRow, i);
    }

  };

  recursion(0);
  return solution || (new Board({
    n: n
  })).rows();
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = 0;
  var board = new Board({
    n: n
  });

  if (n === 2 || n === 3) {
    return solutionCount;
  }

  function recursion(currentRow) {
    if (currentRow >= n) {
      solutionCount++;
      return;
    }

    for (var i = 0; i < n; i++) {
      board.togglePiece(currentRow, i);

      if (!board.hasAnyQueensConflicts()) {
        recursion(currentRow + 1);
      }
      //this de-toggles to remove position to move on to next position
      board.togglePiece(currentRow, i);
    }
  }

  recursion(0);

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};