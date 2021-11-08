// Pixelatory 2021

var solutionDisplayTimer;
$( document ).ready(function() {

  /*
    GAME APPEARANCE SECTION
  */

  /*
    Set the height of the table to match fullscreen height
    minus the options menu height. Without doing this, the
    scrollbar appears because I use height: 100% in CSS.
  */

  $(window).resize(function() {
    $('#game').css('height', $(window).height() - $('#options').height());
  });

  $('#game').css('height', $(window).height() - $('#options').height());

  /*
    GAME FUNCTIONALITY SECTION
  */

  let n = 4; // Initial grid size (it's always n x n)
  let level = Math.floor(2); // Initial level

  let solutionArray = generateGame(n, level); // Generates the table grid.
  let correct = 0; // Number of correct pieces selected.
  let incorrect = 0;
  let score = 0;

  $('#incGrid').click(function() {
    if(!displayingSolution) {
      level = 2;
      correct = 0;
      solutionArray = changeGridSize(++n, level);
    }
  });

  $('#decGrid').click(function() {
    if(!displayingSolution) {
      level = 2;
      correct = 0;
      solutionArray = changeGridSize(--n, level);
    }
  });

  $(document).on('click', 'td', function() {
    if(!$(this).hasClass('activated') && !$(this).hasClass('error') && !displayingSolution) {
      let col = $(this).index(), row = $(this).parent().index();
      if(solutionArray[row][col] == 1) { // You guessed correctly
        correct++;
        score++;
        $(this).addClass('activated');
        if(correct == level) {
          correct = 0;
          incorrect = 0;
          if(level == Math.floor(n * n / 3)) {
            level = 2;
            solutionArray = changeGridSize(++n, level);
          } else {
            level++;
            solutionArray = generateGame(n, level);
          }
        }
      } else { // You guessed incorrectly
        $(this).addClass('error');
        incorrect++;
        if(incorrect >= 3) {
          score = 0;
          level = 2;
          correct = 0;
          incorrect = 0;
          solutionArray = generateGame(n, level);
        }
      }
    }
    $('#score').text("Score: " + score.toString());
  });
});



/*
  UTILITY FUNCTIONS
*/
function generateGame(n, level) {
  var table = $('#game'); // This is the table of the grid.
  table.empty(); // Remove all child elements

  let array = generateInitialArray(n); // Creating the grid virtually (to store solution).

  // Place solution pieces randomly on grid up to level.
  for(let i = 0; i < level; i++) {
    while(true) {
      let row = randomNumber(0, n);
      let col = randomNumber(0, n);

      if(array[row][col] == 0) {
        array[row][col] = 1;
        break;
      }
    }
  }

  console.log(array);

  for (let i = 0; i < n; i++) {
    var tr = document.createElement('tr');
    for (let j = 0; j < n; j++) {
      var td = document.createElement('td');
      tr.append(td);
      if(array[i][j] == 1)
        td.className = "activated";
    }
    table.append(tr);
  }

  displayingSolution = true;

  setTimeout(function() {
    table.empty();

    for (let i = 0; i < n; i++) {
      var tr = document.createElement('tr');
      for (let j = 0; j < n; j++) {
        tr.append(document.createElement('td'));
      }
      table.append(tr);
    }

    displayingSolution = false;
  }, 1000);

  return array;
}

function generateInitialArray(n) {
  let array = new Array(n); // Creating the grid virtually (to store solution).

  for(let i = 0; i < n; i++) { // To create the two-dimensional array.
    array[i] = new Array(n);
    for(let j = 0; j < n; j++) {
      array[i][j] = 0; // initialize values to 0.
    }
  }

  return array;
}

function changeGridSize(n, level) {
  $('#gridSize').text(n.toString() + 'x' + n.toString());
  return generateGame(n, level);
}

// From https://stackoverflow.com/questions/5226578/check-if-a-timeout-has-been-cleared
function Timeout(fn, interval) {
    var id = setTimeout(fn, interval);
    this.cleared = false;
    this.clear = function () {
        this.cleared = true;
        clearTimeout(id);
    };
}

// From https://www.geeksforgeeks.org/how-to-generate-random-number-in-given-range-using-javascript/
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
