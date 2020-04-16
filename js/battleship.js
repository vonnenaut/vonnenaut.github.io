/* Battleship Game
	
	Model: keeps track of ships -- location, hit, sunk
	View:  Keep display updated w/hits, misses and messages for user
	Controller: logic and user input
*/

function init() {
	// set up mouse click event handling
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;
	// set up keyboard return event handling
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;

	model.generateShipLocations();
}


function handleFireButton() {
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value;
	controller.processGuess(guess);
	guessInput.value = "";
}


function handleKeyPress(key) {
	var fireButton = document.getElementById("fireButton");
	if (key.keyCode === 13) {  // 13 is return key  
		fireButton.click();
		return false;  // prevents form from submitting
	}
}


window.onload = init;


var model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,

	ships: [ { locations: [0, 0, 0,], hits: ["", "", ""] },
			 { locations: [0, 0, 0,], hits: ["", "", ""] },
			 { locations: [0, 0, 0,], hits: ["", "", ""] } ],

	generateShipLocations: function() {
		var locations;

		for (var idx = 0; idx < this.numShips; idx++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[idx].locations = locations;
		}
	},

	generateShip: function() {
		var direction = Math.floor(Math.random() * 2);
		var row, col;

		if (direction === 1) {
			//  generate starting location for horizontal ship
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - 3));
		} else {
			// generate starting location for vertical ship
			row = Math.floor(Math.random() * (this.boardSize - 3));
			col = Math.floor(Math.random() * this.boardSize);
		}

		var newShipLocations = [];

		for (var idx = 0; idx < this.shipLength; idx++) {
			if (direction === 1) {
				// add location to array for new horizontal ship
				newShipLocations.push(row + "" + (col + idx));
			} else {
				// add location to array for new vertical ship
				newShipLocations.push((row + idx) + "" + col);
			}
		}
		return newShipLocations;
	},

	collision: function(locations) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = model.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	},

	fire: function(guess) {
		for (var idx = 0; idx < this.numShips; idx++) {
			var ship = this.ships[idx];
			var index = ship.locations.indexOf(guess);

			if(index >= 0) {
				// add a hit to ship
				ship.hits[index] = "hit";
				
				// update view
				view.displayHit(guess);
				view.displayMessage("HIT!");

				// check if ship is sunk
				if (this.isSunk(ship)) {
					view.displayMessage("You sank my battleship!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		// Otherwise, update with a miss
		view.displayMiss(guess);
		view.displayMessage("You missed.");
		return false;
	},

	isSunk: function(ship) {
		for (var idx = 0; idx < this.shipLength; idx++) {
			if (ship.hits[idx] !== "hit") {
				return false;
			}
		}
		return true;
	}
};


var view = {
	// this method takes a string message and displays it in messageArea
	displayMessage: function(msg) {
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},

	displayHit: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},

	displayMiss: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	}
};


var controller = {
	guesses: 0,

	parseGuess: function(guess) {
		var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

		if (guess === null || guess.length !== 2) {
			alert("Oops, pleas enter a letter and a number on the board.");
		} else {
			firstChar = guess.charAt(0).toUpperCase();
			var row = alphabet.indexOf(firstChar);
			var column = guess.charAt(1);

			if (isNaN(row) || isNaN(column)) {
				alert("Oops, that isn't on the board");
			} else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
				alert("Oops, that's off the board!");
			} else {
				return row + column;
			}
		}
		return null;
	},

	processGuess: function(guess) {
		var location = this.parseGuess(guess);
		if (location) {
			this.guesses++;
			var hit = model.fire(location);
			if (hit && model.shipsSunk === model.numShips) {
				view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
			}
		}
	}
};