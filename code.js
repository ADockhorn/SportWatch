var Layout = require("Layout");
var Storage = require("Storage");


var screenStack = [];

// abstract screen class
class Screen {
  constructor() { 
    if (this.constructor == Screen) {
      throw new Error("Abstract classes can't be instantiated.");
    }
  }

  draw(){
      throw new Error("Method 'draw()' must be implemented.");
  }

  update(){
      throw new Error("Method 'update()' must be implemented.");
  }

  touch(button, xy){
      throw new Error("Method 'touch(button, xy)' must be implemented.");
  }

  drag(event){
      throw new Error("Method 'drag(event)' must be implemented.");
  }

  button(){
      throw new Error("Method 'button()' must be implemented.");
  }
}


// implements the main screen showing four buttons, one for each area of the game
class MainScreen extends Screen {
  constructor() {
  }

  draw(){
    g.clear();
    //--- draw main screen
    // draw images
    g.drawImage(Storage.read("farmer.img"), 0, 1); // farmer
    g.drawImage(Storage.read("field.img"), 90, 15);  // field
    g.drawImage(Storage.read("stats2.img"), 9, 95); // stats
    g.drawImage(Storage.read("farm.img"), 88, 96);   // market

    // draw labels
    g.setFont("6x8").drawString("Contracts", 13, 75);
    g.setFont("6x8").drawString("Farm", 110, 75);
    g.setFont("6x8").drawString("Stats", 25, 165);
    g.setFont("6x8").drawString("Shop", 110, 165);

    // draw rectangles to indicate button areas
    g.drawRect(5, 3, 75, 83);
    g.drawRect(85, 3, 155, 83);
    g.drawRect(5, 93, 75, 173);
    g.drawRect(85, 93, 155, 173);
  }

  update(){
  }

  touch(button, xy){
    console.log("touch", xy.x, xy.y);
    if (xy.x > 5 && xy.x < 75 && xy.y > 3 && xy.y < 83) {
      screenStack.push(new ContractsScreen());
    }

    if (xy.x > 85 && xy.x < 155 && xy.y > 3 && xy.y < 83) {
      screenStack.push(new FarmScreen());
    }

    if (xy.x > 5 && xy.x < 75 && xy.y > 93 && xy.y < 173) {
      screenStack.push(new StatsScreen());
    }

    if (xy.x > 85 && xy.x < 155 && xy.y > 93 && xy.y < 173) {
      screenStack.push(new ShoppingScreen());
    }
  }

  drag(event){
  }

  button(){
    //main screen does not pop
    //screenStack.pop()
  }
}

// implements the contracts screen showing the different customers and their needs
class ContractsScreen extends Screen {
  constructor() {
  }

  draw(){
    g.clear();
    g.drawImage(Storage.read("otto.img"), 9, 95); // otto
    g.drawImage(Storage.read("otto.img"), 109, 95); // otto
    g.drawImage(Storage.read("cat.img"), 190, 95); // cat
  }

  update(){
  }

  touch(button, xy){
  }

  drag(event){
  }

  button(){
    screenStack.pop();
  }
}

// implements the farming screen showing the different crops and which exercises need to be completed to harvest them
class FarmScreen extends Screen {
  constructor() {
  }

  draw(){
    g.clear();
    g.setFont("6x8").drawString("Farm", 10, 10);
    g.drawImage(Storage.read("oldman.img"), 9, 95); // oldman
  }

  update(){
  }

  touch(button, xy){
  }

  drag(event){
  }

  button(){
    console.log(screenStack.length);
    screenStack.pop(screenStack.length-1);
  }
}

// implements the stats screen showing previously completed exercises
class StatsScreen extends Screen {
  constructor() {
  }

  draw(){
    g.clear();
    g.setFont("6x8").drawString("Stats", 10, 10);
  }

  update(){
  }

  touch(button, xy){
  }

  drag(event){
  }

  button(){
    screenStack.pop(screenStack.length-1);
  }
}

// implements the shopping screen allowing to buy cool stuff
class ShoppingScreen extends Screen {
  constructor() {
  }

  draw(){
    g.clear();
    g.setFont("6x8").drawString("Shop", 10, 10);
  }

  update(){
  }

  touch(button, xy){
  }

  drag(event){
  }

  button(){
    screenStack.pop(screenStack.length-1);
  }
}



// prepare screenStack
screenStack.push(new MainScreen());

// function to be called every tick
var ticktime = 10;
function tick(){
  screenStack[screenStack.length-1].update();
  screenStack[screenStack.length-1].draw();
}
setInterval(tick, ticktime);

// forward touch events
Bangle.on('touch', function(button, xy) {
  screenStack[screenStack.length-1].touch(button, xy);
});

// forward drag events
Bangle.on('drag', function(event) { 
  screenStack[screenStack.length-1].drag(event);
});

setWatch(function() {
  screenStack[screenStack.length-1].button();
}, BTN, {edge:"rising", debounce:50, repeat:true});
