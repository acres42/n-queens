// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function(params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = +!this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


    /*
             _             _     _
         ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
        / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
        \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
        |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

     */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var context = this;
      var total = 0;

      for (var i = 0; i < context.attributes[rowIndex].length; i++) {
        if (context.attributes[rowIndex][i] === 1) {
          total++;
        }
      }

      if (total > 1) {
        return true;
      }

      return false;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var context = this;

      for (var key in context.attributes) {
        var total = 0;

        for (var i = 0; i < context.attributes[key].length; i++) {
          if (context.attributes[key][i] === 1) {
            total++;
          }
        }

        if (total > 1) {
          return true;
        }
      }

      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var context = this;
      var total = 0;

      for (var key in context.attributes) {
        if (context.attributes[key][colIndex] === 1) {
          total++;
        }
      }

      if (total > 1) {
        return true;
      }

      return false;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var context = this;
      var rowKeys = Object.keys(context.attributes);

      for (var i = 0; i < rowKeys.length; i++) {
        var total = 0;

        for (var key in context.attributes) {
          if (context.attributes[key][i] === 1) {
            total++;
          }
        }

        if (total > 1) {
          return true;
        }
      }

      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var row = 0;
      var col = majorDiagonalColumnIndexAtFirstRow;
      var context = this;
      var total = 0;

      if (col >= 0) {
        for (var i = col; i < context.attributes[0].length; i++) {
          if (context.attributes[row][i] === 1) {
            total++;
          }
          row++;
        }

        if (total > 1) {
          return true;
        }
      }

      return false;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var context = this;
      var startingPoints = [];
      var conflict = false;

      if (context.attributes[0] !== undefined) {


        for (var i = 0; i < context.attributes[0].length; i++) {
          startingPoints.push([0, i]);
          startingPoints.push([i, 0]);
        }

        for (var j = 0; j < startingPoints.length; j++) {
          var total = 0;

        function recursion(position, total) {
         if (position[0] >= context.attributes[0].length || position[1] >= context.attributes[0].length) {
            if (total > 1) {
              conflict = true;
              return;
            } else {
              return;
            }
          }

          var row = position[0];
          var col = position[1];

          if (context.attributes[row][col] === 1) {
            total++;
          }

          var row = position[0] + 1;
          var col = position[1] + 1;

          return recursion([row, col], total);
        }

        recursion(startingPoints[j], total);
        }
      }
      return conflict;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var row = 0;
      var col = minorDiagonalColumnIndexAtFirstRow;
      var context = this;
      var total = 0;

      if (col >= 0 && col < context.attributes[0].length) {
        for (var i = col; i >= 0; i--) {
          if (context.attributes[row][i] === 1) {
            total++;
          }
          row++;
        }

        if (total > 1) {
          return true;
        }
      }

      return false;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var context = this;
      var startingPoints = [];
      var conflict = false;

      if (context.attributes[0] !== undefined) {

        for (var i = 0; i < context.attributes[0].length; i++) {
          startingPoints.push([0, i]);
          startingPoints.push([i, context.attributes[0].length - 1]);
        }

        for (var j = 0; j < startingPoints.length; j++) {
          var total = 0;

        function recursion(position, total) {
          if (position[0] >= context.attributes[0].length || position[1] < 0) {
            if (total > 1) {
              conflict = true;
              return;
            } else {
              return;
            }
          }

          var row = position[0];
          var col = position[1];

          if (context.attributes[row][col] === 1) {
            total++;
          }

          var row = position[0] + 1;
          var col = position[1] - 1;

          return recursion([row, col], total);
        }

          recursion(startingPoints[j], total);
        }
      }
      return conflict;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());