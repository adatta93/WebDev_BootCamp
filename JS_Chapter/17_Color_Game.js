var numSquares = 6;
var colors = []; // Array of random colors (3 or 6) to show
var pickedColor; // Random color picked as answer

var squares = document.querySelectorAll(".square");
var colorDisplay = document.getElementById("colorDisplay");
var msgDisplay = document.getElementById("msg");
var h1 = document.querySelector("h1");
var resetBtn = document.querySelector("#reset");
var btn = document.querySelectorAll(".btn");

init();

function init() {
    onBtnChange();
    onSquareClick();
    reset();
}

function onBtnChange() {
    // Choose Easy or Hard mode
    for (let i = 0; i < btn.length; i++) {
        btn[i].addEventListener("click", function () {
            btn[0].classList.remove("selected");
            btn[1].classList.remove("selected");
            this.classList.add("selected");
            numSquares = this.textContent == 'Easy' ? 3 : 6;
            reset();
        });
    }
}

function onSquareClick() {
    // Event listner for squares
    for (var i = 0; i < squares.length; i++) {
        squares[i].addEventListener("click", function () {
            var clickedColor = this.style.backgroundColor;
            // Check if clicked square's color is correct
            if (clickedColor === pickedColor) {
                // Show a success message
                msgDisplay.textContent = "Correct!";
                // Change the reset button text
                resetBtn.textContent = "Play Again?";
                // Change all the other squares' color
                changeColor(pickedColor);
                // Change the header color to answer color
                h1.style.backgroundColor = pickedColor;
            } else {
                this.style.backgroundColor = "#232323";
                msgDisplay.textContent = "Try Again";
            }
        });
    }
}

// Event listner for reset button
resetBtn.addEventListener("click", function () {
    reset();
});

// Reset the page
function reset() {
    // Generate random color
    colors = generateRandomColors(numSquares);
    // Pick a random color as answer
    pickedColor = pickColor();
    // Display the answer color in the header
    colorDisplay.textContent = pickedColor;
    // Clear the Success/Fail message text
    msgDisplay.textContent = "";
    // Reset the reset button text
    resetBtn.textContent = "New Colors";
    // Reste the header background
    h1.style.backgroundColor = "steelblue";
    // change color of all squares
    for (var i = 0; i < squares.length; i++) {
        if (colors[i]) {
            squares[i].style.backgroundColor = colors[i];
            squares[i].style.display = "block";
        } else {
            squares[i].style.display = "none";
        }
    }
}

function generateRandomColors(num) {
    // Generate a random RGB color value and push it in array
    var arr = [];
    for (let i = 0; i < num; i++) {
        arr.push(randomColor());
    }
    return arr;
}

function randomColor() {
    // Generate random Red, Green and Blue values
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

function changeColor(color) {
    // For correct answer change all the squares color to the correct color
    for (var i = 0; i < squares.length; i++) {
        squares[i].style.backgroundColor = color;
    }
}

function pickColor() {
    // Pick a random color as the Answer color
    var random = Math.floor(Math.random() * colors.length);
    return colors[random];
}
