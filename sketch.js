var saveButton;
var clearButton;
var painting = false;
var current;
var previous;
var img;
var offset = 0;
function centerButtons() {
  saveButton.position(windowWidth/2, windowHeight/2 + 96);
  clearButton.position(windowWidth/2 - 64, windowHeight/2 + 96);
}

function setup() {
  createCanvas(128, 128);
  background(0);
  imageMode(CORNER);
  img = createGraphics(128, 128);
  img.background(250);
  img.fill(0);
  img.stroke(0);
  img.strokeWeight(10);
  current = createVector(0,0);
  previous = createVector(0,0);
  saveButton = createButton('Save Image');
  clearButton = createButton('Clear')
  centerButtons();
  clearButton.mousePressed(changeBG);
  saveButton.mousePressed(saveImage);
}

function draw() {
  image(img, offset, offset);
  current.x = mouseX - offset;
  current.y = mouseY - offset;

  if(painting) {
    img.ellipse(mouseX - offset, mouseY - offset, 0, 0);
    img.line(previous.x, previous.y, current.x, current.y);
  }

  previous.x = current.x;
  previous.y = current.y;

}

function changeBG() {
  img.background(250);
}

function saveImage() {
  saveCanvas(img, 'char', 'jpg');  
  img.background(250);
}

function windowResized() {
  centerButton();
}

function mousePressed() {
  painting = true;
}

function mouseReleased() {
  painting = false;
}

