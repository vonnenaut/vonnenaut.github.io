/* The Color-Guessing Game */
//
var game = {};

// Variable Declarations
game.numSquares = 6;
game.colors = [];
game.pickedColor;
game.squares = document.querySelectorAll(".square");
game.colorDisplay = document.getElementById("colorDisplay");
game.messageDisplay = document.querySelector("#message");
game.h1 = document.querySelector("h1");
game.resetButton = document.querySelector("#reset");
game.modeButtons = document.querySelectorAll(".mode");


// Event Listeners
game.resetButton.addEventListener("click", function(){
	game.reset();
});


// Function Declarations
game.init = function(){
	// mode button event listeners
	game.setupModeButtons();
	game.setupSquares();	
	game.reset();
}


game.setupModeButtons = function(){
	for(var idx = 0; idx < game.modeButtons.length; idx++){
		game.modeButtons[idx].addEventListener("click", function(){
			game.modeButtons[0].classList.remove("selected");
			game.modeButtons[1].classList.remove("selected");
			this.classList.add("selected");
			// ternary operator
			this.textContent === "Easy" ? game.numSquares = 3: game.numSquares = 6;
			game.reset();
		});
	}
}


game.setupSquares = function(){
	for(var idx = 0; idx < game.squares.length; idx++){
		// add click listeners to squares
		game.squares[idx].addEventListener("click", function(){
		// grab color of picked square
		var clickedColor = this.style.backgroundColor;
		//compare color to pickedColor
		if(clickedColor === game.pickedColor){
			game.messageDisplay.textContent = "Correct!";
			game.resetButton.textContent = "Play again?";
			game.changeColors(clickedColor);
			game.h1.style.backgroundColor = clickedColor;
		} else {
			this.style.backgroundColor = "#232323";
			game.messageDisplay.textContent = "Try Again";
		  }
		});
	}
}


game.reset = function(){
	// reset button text
	game.resetButton.textContent = "New Colors";
	// reset message text
	game.messageDisplay.textContent = "";
	// generate new color array
	game.colors = game.genRandColors(game.numSquares);
	// pick a new random color from the color array
	game.pickedColor = game.pickColor();
	// change color display to match picked color
	game.colorDisplay.textContent = game.pickedColor;
	// change colors of squares on page
	for(var idx = 0; idx < game.squares.length; idx++){
		if(game.colors[idx]){
			game.squares[idx].style.display = "block";
			game.squares[idx].style.backgroundColor = game.colors[idx]
		} else {
			game.squares[idx].style.display = "none";
		  }
	}
	game.h1.style.backgroundColor = "steelblue";
}


game.changeColors = function(color){
	for(var idx = 0; idx < game.colors.length; idx++){
	game.squares[idx].style.backgroundColor = color;  
	}
}


game.pickColor = function(){
	var random = Math.floor(Math.random() * game.colors.length);
	return game.colors[random];
}


game.genRandColors = function(num){
	// make an array
	var colorArray = [];
	// add num random colors to array
	for(var idx = 0; idx < num; idx++){
	colorArray.push(game.randomColor());
	}
	//return array	
	return colorArray;
}


game.randomColor = function(){
	// pick a "red", "green" and "blue" from 0 - 255
	var rgb = [];

	for(var idx = 0; idx < 3; idx++){
	rgb.push(Math.floor(Math.random() * 256));
	}

	return "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")";
}


// Game setup call
game.init();