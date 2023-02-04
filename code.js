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

class Vegetable {
  constructor(count) {
  }
}

class Onion extends Vegetable{
  constructor(count){
    this.count = count;
    this.name = "Onion";
    this.anim1 = ["flutter1.img", "sealjacks1.img", "kneeelbow1.img", ""];
    this.anim2 = ["flutter2.img", "sealjacks2.img", "kneeelbow2.img", ""];
    this.text = ["FLUTTER KICKS to SOW!", "SEAL JACKS to WATER!", "KNEE TO ELBOW to GROW", ""];
    this.countstyle = [true, true, true, true];
    this.harvest = []
  }
}

class Tomato extends Vegetable{
  constructor(count){
    this.count = count;
    this.name = "Tomato";
    this.anim1 = ["sealjacks1.img", "sealjacks1.img", "kneeelbow1.img", ""];
    this.anim2 = ["sealjacks2.img", "sealjacks2.img", "kneeelbow2.img", ""];
    this.text = ["SEAL JACKS to SOW!", "SEAL JACKS to WATER!", "KNEE TO ELBOW to GROW", ""];
    this.countstyle = [true, false, true, true]; // if true = time, else repetitions
  }
}

var cropPhase1 = ["seeding.img", "seeding.img"];
var cropPhase2 = ["seeding2.img", "seeding2.img"];


// implements the farming screen showing the different crops and which exercises need to be completed to harvest them
class FarmScreen extends Screen {
  constructor() {
    g.clear();
    this.currentPhase = 0;
    this.vegetable = new Onion(5);
    
    this.dragged = 0;
    this.validdrag = true;
    
    if (this.vegetable.countstyle[0])
    {
      this.seconds = this.vegetable.count * 10; //max time for timer
      this.timerInterval = setInterval(function(screen){
        console.log(screen.seconds);
        screen.seconds -= 1;
        screen.drawTimer();
      }, 1000, this); //seconds
    } else {
      this.seconds = -1;
    }
    
    this.flippedTrainer = false;
    
    this.trainerInterval = setInterval(function(screen){
      console.log(screen.flippedTrainer);
      screen.flippedTrainer = !screen.flippedTrainer;
      screen.drawTrainer();
    }, 1000, this); //every two seconds
  }

  draw(){
    //g.setFont("6x8").drawString("Farm", 10, 10);
    //g.drawImage(Storage.read("oldman.img"), 9, 95); // oldman
  }

  drawTimer(){ //once per second
    min = String(Math.floor(this.seconds/60));
    if(min.length < 2){
      min = '0'+min;
    }
    sec = String(this.seconds%60);
    if(sec.length < 2){
      sec = '0'+sec;
    }
    g.clearRect(0, 0, 176, 70);
    g.setFont("6x8:3x3").drawString(''+min+':'+sec, 55, 42);
  }

  drawTrainer(){
      g.clearRect(0, 95, 176, 176);
      g.setFont("6x8").drawString(this.vegetable.text[this.currentPhase], 35, 70);
    if(this.flippedTrainer){
      g.drawImage(Storage.read(this.vegetable.anim1[this.currentPhase]), 9, 105, {scale:0.3});
      g.drawImage(Storage.read(cropPhase1[this.currentPhase]), 120, 105, {scale:1});
    }
    else {
      g.drawImage(Storage.read(this.vegetable.anim2[this.currentPhase]), 9, 105, {scale:0.3});
      g.drawImage(Storage.read(cropPhase2[this.currentPhase]), 120, 105, {scale:1});
    }
  }

  update(){
  }

  touch(button, xy){
  }

  drag(event){
    g.clear();

    this.dragged += event.dx;
    if (this.dragged < -100 && this.validdrag == true){
      this.currentPhase += 1;
      console.log("phase: " + this.currentPhase);
      this.validdrag = false;
      this.dragged = 0;

      // next exercise & timer reset
      if (this.timerInterval != undefined){
        clearInterval(this.timerInterval);
        this.timerInterval = undefined;
      }
      if (this.vegetable.countstyle[this.currentPhase])
      {
        this.seconds = this.vegetable.count * 10; //max time for timer
        this.timerInterval = setInterval(function(screen){
          console.log(screen.seconds);
          screen.seconds -= 1;
          screen.drawTimer();
        }, 1000, this); //seconds
      } else {
        this.seconds = -1;
      }
    }

    if (event.b == 0) {
      this.dragged = 0;
      this.validdrag = true;
    }
  }

  button(){
    g.clear();
    
    // clear seconds timer interval
    if (this.timerInterval != undefined) {
      clearInterval(this.timerInterval);
    }
    this.timerInterval = undefined;
    
    // clear trainer animation interval
    clearInterval(this.trainerInterval);
    this.trainerInterval = undefined;
    
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
    this.posx = [10, 70, 130, 10, 70, 130];
    this.posy = [10, 10, 10, 130, 130, 130];
    this.ang = 0;
    this.object = Storage.read("farmer.img");
    this.drawCall = setInterval(function(screen) {
      screen.ang += 0.01;
      screen.drawRotatedObjects();
    }, 100, this);
    
  }

  drawRotatedObjects() {
    g.clear();
    g.setFont("6x8:4x4").drawString("You did it!", 50, 50);
    for (let i = 0; i < 6; i++){
      g.drawImage(this.object, this.posx[i], this.posy[i], {scale:0.8, rotate:this.ang});
    }
  }

  draw(){

  }

  update(){

  }

  touch(button, xy){
  }

  drag(event){
  }

  button(){
    g.clear();
    
    // clear seconds timer interval
    if (this.drawCall != undefined) {
      clearInterval(this.drawCall);
    }
    this.drawCall = undefined;
    
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
