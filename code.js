var Layout = require("Layout");
var Storage = require("Storage");

// allowing to print a graphicsbuffer to console
Graphics.prototype.print = function() {
  for (var y=0;y<this.getHeight();y++)
    console.log(new Uint8Array(this.buffer,this.getWidth()*y,this.getWidth()).toString());
};


// stack of screens used during the game loop
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

const contractor_images = ["otto.img", "oldman.img", "cat.img"];
const vegetables = ["onion", "corn", "turnip", "salad", "tomato", "potato", "chilli"];

class Vegetable {
  constructor(){
    this.name = "";
    this.anim1 = "";
    this.anim2 = "";
    
    //sow 
    //water
    //grow
    //harvest
  }
}

class Contractor {
  constructor(){
    this.img = contractor_images[Math.floor(Math.random() * contractor_images.length)];
    this.vegetable = new Vegetable();
    this.selected = false;
    this.amounts = [0, 0, 0, 0, 0, 0];
    this.amounts[Math.floor(Math.random()*6)] += Math.floor(3+Math.random()*5);
    console.log(this.amounts);
  }
}

// store which amounts of vegetables have been selected
var amounts = [0, 0, 0, 0, 0, 0];

// initialize contractors at the beginning of the game, replace them after their contracts have been fulfilled
var contractors = [];
for (let i = 0; i < 5; i++) {
      let c = new Contractor();
      this.contractors.push(c);
}


// implements the contracts screen showing the different customers and their needs
class ContractsScreen extends Screen {
  constructor() {
    this.contractarea = Graphics.createArrayBuffer(450, 90, 8);
    this.contractarea.fillRect(0, 0, 450, 90);



    for (let i = 0; i < 5; i++) {
      this.contractarea.drawImage(Storage.read(contractors[i].img), i*90, 0);
      //this.contractarea.setColor(0).drawRect(i*90, 0, i*90+69, 65);
      if (contractors[i].selected){
        this.contractarea.drawImage(Storage.read("checkbox_checked.png"), i*90+70, 0);
      }
      else {
        this.contractarea.drawImage(Storage.read("checkbox.png"), i*90+70, 0);
      }
    }

    this.offset_x = 0;

    var gimg = {
      width:  450,
      height:  90,
      bpp:  8,
      buffer:  this.contractarea.buffer
    };

    this.contractarea.flip = function(offset_x) {
      g.drawImage(gimg, offset_x, 110);
    };

    g.clear();
    this.contractarea.flip();
  }

  draw(){
    g.clear();
    this.contractarea.flip(this.offset_x);
    g.drawRect(5,5, 163, 100);
    g.drawImage(Storage.read("turnip.png"), 8, 10, {scale:0.5}); // turnip
    g.setFont("6x8:2x2").drawString("x" + amounts[0], 40, 15);

    g.drawImage(Storage.read("tomato.img"), 6, 40, {scale:0.5}); // tomato
    g.setFont("6x8:2x2").drawString("x" + amounts[1], 40, 47);
    
    g.drawImage(Storage.read("chilli.img"), 5, 68, {scale:0.5}); // chilli
    g.setFont("6x8:2x2").drawString("x" + amounts[2], 40, 76);
    
    g.drawImage(Storage.read("corn.img"), 86, 10); // corn
    g.setFont("6x8:2x2").drawString("x" + amounts[3], 116, 15);
    
    g.drawImage(Storage.read("onion.img"), 86, 37, {scale:0.5}); // onion
    g.setFont("6x8:2x2").drawString("x" + amounts[4], 116, 47);
    
    g.drawImage(Storage.read("wwheat.png"), 86, 72, {scale:0.5}); // wheat
    g.setFont("6x8:2x2").drawString("x" + amounts[5], 116, 76);
    
    g.drawLine(84, 5, 84, 100);
    
  }

  update(){
  }

  touch(button, xy){
    //otto size = 71x71
    for (let i = 0; i < 5; i++) {
      if (xy.x > i*90+this.offset_x && xy.x < i*90+69+this.offset_x && xy.y > 110 && xy.y < 175){
        //this.contractarea.setColor(0).drawRect(i*90, 0, i*90+69, 69);
        contractors[i].selected = !contractors[i].selected;
        this.contractarea.setColor("#FFFFFF").fillRect(i*90+70, 0, i*90+70+13, 13);
        
        if (contractors[i].selected){
          this.contractarea.setColor(0).drawImage(Storage.read("checkbox_checked.png"), i*90+70, 0);
          for (let j = 0; j < 6; j++){
            amounts[j] += contractors[i].amounts[j];
          }
        } else {
          this.contractarea.setColor(0).drawImage(Storage.read("checkbox.png"), i*90+70, 0);
          for (let j = 0; j < 6; j++){
            amounts[j] -= contractors[i].amounts[j];
          }
        }
      }
    }
  }

  drag(event){
    this.offset_x += event.dx;
    if (this.offset_x > 0){
      this.offset_x = 0;
    }
    if (this.offset_x < -450+172) {
      this.offset_x = -450+172;
    }
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
