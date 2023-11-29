// Set the number of pixels for the pixelized method
let numPixels = 10;

// Set the count to 0 for the pixelized method
let numBoxes = 0;
let numInside = 0;

// Set the dimensions of the pond
let pondWidth = 500;
let pondHeight = 500;

// Set the position and radius of the pond
let pondX = 250;
let pondY = 250;
let pondRadius = 250;

// Set the dimensions of the canvas
let canvasWidth = 500;
let canvasHeight = 500;

// Check if the device is a mobile device
if (window.matchMedia("(max-width: 600px)").matches) {
    // Set the dimensions of the pond
    pondWidth = 250;
    pondHeight = 250;

    // Set the position and radius of the pond
    pondX = 125;
    pondY = 125;
    pondRadius = 125;

    // Set the dimensions of the canvas
    canvasWidth = 250;
    canvasHeight = 250;
}

// Get the canvas element for the pixelized method
const canvasDet = document.getElementById("canvas_det");
canvasDet.width = canvasWidth;
canvasDet.height = canvasHeight;

// Get the 2D context of the canvas for the pixelized method
const ctxDet = canvasDet.getContext("2d");

// Get the input box and button for the pixelized method
const inputDet = document.getElementById("num-pixels");
const buttonDet = document.getElementById("change-num-pixels");

// When the button is clicked, update the number of pixels for the pixelized method
buttonDet.addEventListener("click", changeNumPixels);

drawBoxes();

// Get the canvas element for the Monte Carlo method
const canvasMonte = document.getElementById("canvas_montecarlo");
canvasMonte.width = canvasWidth;
canvasMonte.height = canvasHeight;

// Get the 2D context of the canvas for the Monte Carlo method
const ctxMonte = canvasMonte.getContext("2d");

// Set the count to 0 for the Monte Carlo method
let numPoints = 1000;
let numInsideMonte = 0;

// Get the input box and button for the Monte Carlo method
const inputMonte = document.getElementById("num-points");
const buttonMonte = document.getElementById("change-num-points");

// When the button is clicked, update the number of points for the Monte Carlo method
buttonMonte.addEventListener("click", changeNumPoints);

drawPoints();

drawPond();

// --- Functions for the pixelized method --- //
function drawBoxes() {
    // Set the stroke style for the pixelized method


    // Calculate the size of each pixel based on the number of pixels
    const pixelSize = pondWidth / numPixels;

    // Loop through all the pixels in the canvas for the pixelized method
    for (let y = 0; y < pondHeight; y += pixelSize) {
        for (let x = 0; x < pondWidth; x += pixelSize) {
            numBoxes++;

            // Calculate the distance between the center of the circle and the current pixel for the pixelized method
            const distance = Math.sqrt(Math.pow(pondX - (x + pixelSize / 2), 2) + Math.pow(pondY - (y + pixelSize / 2), 2));
            // If the distance is less than the radius, create a box element and add it to the canvas for the pixelized method
            if (distance < pondRadius) {
                // Draw a strocked rectangle for the pixelized method
                ctxDet.strokeStyle = "blue";
                ctxDet.strokeRect(x, y, pixelSize, pixelSize);
                // Draw a filled rectangle for the pixelized method
                ctxDet.fillStyle = "cyan";
                ctxDet.fillRect(x, y, pixelSize, pixelSize);
                // Increment the count for the pixelized method
                numInside++;
            }
            else {
                // Draw a strocked rectangle for the pixelized method
                ctxDet.strokeStyle = "red";
                ctxDet.strokeRect(x, y, pixelSize, pixelSize);
                // Draw a filled rectangle for the pixelized method
                ctxDet.fillStyle = "white";
                ctxDet.fillRect(x, y, pixelSize, pixelSize);
            }
        }
    }

    document.getElementById("div_ratiodet").textContent = `비율: ${numInside} / ${numBoxes}`;
    document.getElementById("div_areadet").textContent = `원면적 = 비율 × 정사각형면적 = ${numInside / numBoxes * 10000}`;
}

function changeNumPixels() {
    // Clear the canvas for the pixelized method
    ctxDet.clearRect(0, 0, canvasWidth, canvasHeight);

    // Redraw the pond for the pixelized method
    numPixels = parseInt(inputDet.value);

    // Set the maximum value of numPixels
    const maxNumPixels = 1000;

    // If numPixels exceeds the maximum value, display an alert and reset numPixels to the maximum value
    if (numPixels > maxNumPixels) {
        alert(`The maximum value for numPixels is ${maxNumPixels}. Please enter a value less than or equal to ${maxNumPixels}.`);
        numPixels = maxNumPixels;
    }

    // Reset the count variables for the pixelized method
    numBoxes = 0;
    numInside = 0;

    drawBoxes();
    drawPond();
}


// --- Functions for the Monte Carlo method --- //
function drawPoints() {
    // Set the stroke style for the Monte Carlo method
    ctxMonte.strokeStyle = "black";

    // Loop through the specified number of points for the Monte Carlo method
    for (let i = 0; i < numPoints; i++) {
        // Generate random coordinates for the Monte Carlo method
        const x = Math.random() * pondWidth;
        const y = Math.random() * pondHeight;

        // Calculate the distance between the center of the circle and the current point for the Monte Carlo method
        const distance = Math.sqrt(Math.pow(pondX - x, 2) + Math.pow(pondY - y, 2));
        // If the distance is less than the radius, create a point element and add it to the canvas for the Monte Carlo method
        if (distance < pondRadius) {
            // Draw a filled point for the Monte Carlo method
            ctxMonte.fillStyle = "blue";
            ctxMonte.beginPath();
            ctxMonte.arc(x, y, 1, 0, 2 * Math.PI);
            ctxMonte.fill();
            // Increment the count for the Monte Carlo method
            numInsideMonte++;
        }
        else {
            // Draw a filled point for the Monte Carlo method
            ctxMonte.fillStyle = "red";
            ctxMonte.beginPath();
            ctxMonte.arc(x, y, 1, 0, 2 * Math.PI);
            ctxMonte.fill();
        }
    }

    document.getElementById("div_ratiomontecarlo").textContent = `비율: ${numInsideMonte} / ${numPoints}`;
    document.getElementById("div_areamontecarlo").textContent = `원면적 = 비율 × 정사각형면적 = ${numInsideMonte / numPoints * 10000}`;
}

function changeNumPoints() {
    // Get the new value of numPoints
    numPoints = parseInt(inputMonte.value);

    // Set the maximum value of numPoints
    const maxNumPoints = 1000000;

    // If numPoints exceeds the maximum value, display an alert and reset numPoints to the maximum value
    if (numPoints > maxNumPoints) {
        alert(`The maximum value for numPoints is ${maxNumPoints}. Please enter a value less than or equal to ${maxNumPoints}.`);
        numPoints = maxNumPoints;
    }

    // Clear the canvas for the Monte Carlo method
    ctxMonte.clearRect(0, 0, canvasWidth, canvasHeight);

    // Reset the count variables for the Monte Carlo method
    numInsideMonte = 0;

    drawPoints();
    drawPond();
}


function drawPond() {
    // Set the stroke & fill style for the pond
    ctxDet.strokeStyle = '#000000';
    ctxDet.fillStyle = '#000000';
    ctxMonte.strokeStyle = '#000000';
    ctxMonte.fillStyle = '#000000';

    // Draw the pond on the canvas for both methods
    ctxDet.beginPath();
    ctxDet.arc(pondX, pondY, pondRadius, 0, 2 * Math.PI);
    ctxDet.stroke();
    ctxMonte.beginPath();
    ctxMonte.arc(pondX, pondY, pondRadius, 0, 2 * Math.PI);
    ctxMonte.stroke();

    // Set the stroke style for the box
    ctxDet.strokeStyle = '#000000';
    ctxMonte.strokeStyle = '#000000';

    // Draw the box around the pond for both methods
    ctxDet.beginPath();
    ctxDet.rect(pondX - pondWidth / 2, pondY - pondHeight / 2, pondWidth, pondHeight);
    ctxMonte.stroke();
}


