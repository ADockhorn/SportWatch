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


class Contractor {
  constructor(){
    this.img = contractor_images[Math.floor(Math.random() * contractor_images.length)];
    this.selected = false;
    this.amounts = [0, 0, 0, 0, 0, 0];
    this.amounts[Math.floor(Math.random()*6)] += Math.floor(3+Math.random()*5);
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

    g.drawImage(Storage.read("wheat.png"), 86, 72, {scale:0.5}); // wheat
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

class Vegetable {
  constructor(count) {
  }
}

class Onion extends Vegetable{
  constructor(count){
    this.count = count;
    this.name = "Onion";
    this.anim1 = ["flutter1.img", "sealjacks1.img", "kneeelbow1.img", "flutter1.img"];
    this.anim2 = ["flutter2.img", "sealjacks2.img", "kneeelbow2.img", "flutter2.img"];
    this.text = ["FLUTTER KICKS to SOW!", "SEAL JACKS to WATER!", "KNEE TO ELBOW to GROW", "FLUTTER KICKS to HARVEST!"];
    this.countstyle = [true, true, true, true];
    this.harvest = ["harvestonion1.png", "harvestonion2.png"];
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

var cropPhase1 = ["seeding.img", "watering1.png", "grow1.png"];
var cropPhase2 = ["seeding2.img", "watering2.png", "grow2.png"];


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
      this.active = false;
      /*
      this.timerInterval = setInterval(function(screen){
        if (screen.seconds > 0) {
          screen.seconds -= 1;
          if (screen.seconds == 0){
            Bangle.buzz()
          }
        }
        screen.drawTimer();
      }, 1000, this); //seconds*/
    } else {
      this.seconds = -1;
    }

    this.flippedTrainer = false;

    this.trainerInterval = setInterval(function(screen){
      screen.flippedTrainer = !screen.flippedTrainer;
      screen.drawTrainer();
    }, 1000, this); //every two seconds

    this.drawTrainer();
    this.drawTimer();
    this.drawStartButton();

  }

  draw(){
    //g.setFont("6x8").drawString("Farm", 10, 10);
    //g.drawImage(Storage.read("oldman.img"), 9, 95); // oldman
  }

  drawStartButton() {
    g.drawRect(6, 3, 165, 40);
    g.setFont("6x8:3x3").drawString('Start', 42, 12);
    g.drawRect(0,0,172,172);
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
    g.clearRect(1, 42, 171, 65);
    g.setFont("6x8:3x3").drawString(''+min+':'+sec, 42, 42);
  }

  drawTrainer(){
    // clear bottom half of screen
    g.clearRect(0, 95, 176, 176);

    // write exercise description
    g.setFont("6x8").drawString(this.vegetable.text[this.currentPhase], 25, 70);

    // two animation steps
    if(this.flippedTrainer){
      // draw gropPhase, last gropPhase is dependent on the vegetable
      if (this.currentPhase == 3){
        g.drawImage(Storage.read(this.vegetable.harvest[1]), 100, 105, {scale:0.8});
      } else {
        g.drawImage(Storage.read(cropPhase1[this.currentPhase]), 100, 105, {scale: this.currentPhase == 0 ? 1 : 0.8});
      }

      // draw the exercise
      g.drawImage(Storage.read(this.vegetable.anim1[this.currentPhase]), 9, 105, {scale:0.3});
    }
    else {
      // draw gropPhase, last gropPhase is dependent on the vegetable
      if (this.currentPhase == 3){
        g.drawImage(Storage.read(this.vegetable.harvest[0]), 100, 105, {scale:0.8});
      } else {
        g.drawImage(Storage.read(cropPhase2[this.currentPhase]), 100, 105, {scale:this.currentPhase == 0 ? 1 : 0.8});
      }

      // draw the exercise
      g.drawImage(Storage.read(this.vegetable.anim2[this.currentPhase]), 9, 105, {scale:0.3});
    }
  }

  update(){
    if (this.active==false){
    }
  }

  touch(button, xy){
    if (this.active == false && xy.x > 6 && xy.x < 165 && xy.y > 3 && xy.y < 40){
      this.active = true;
      g.clearRect(6,3,165,40);

      if (this.vegetable.countstyle[this.currentPhase])
      {
        this.timerInterval = setInterval(function(screen){
          if (screen.seconds > 0) {
            screen.seconds -= 1;
            if (screen.seconds == 0){
              Bangle.buzz();
            }
          }
          screen.drawTimer();
        }, 1000, this); //seconds*/
      }
    }
  }

  drag(event){
    this.dragged += event.dx;
    if (this.dragged < -50 && this.validdrag == true){
      g.clear();
      this.currentPhase += 1;
      console.log("phase: " + this.currentPhase);
      this.validdrag = false;
      this.dragged = 0;
      this.active = false;

      // next exercise & timer reset
      if (this.timerInterval != undefined){
        clearInterval(this.timerInterval);
        this.timerInterval = undefined;
      }
      if (this.vegetable.countstyle[this.currentPhase])
      {
        this.seconds = this.vegetable.count * 10; //max time for timer
        this.active = false;
        /*this.timerInterval = setInterval(function(screen){
          if (screen.seconds > 0) {
            screen.seconds -= 1;
            if (screen.seconds == 0){
              Bangle.buzz()
            }
          }
          screen.drawTimer();
        }, 1000, this); //seconds*/
      } else {
        this.seconds = -1;
      }
      this.drawTrainer();
      this.drawTimer();
      this.drawStartButton();
    }

    if (event.b == 0) {
      this.validdrag = true;
      this.dragged = 0;
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

  //test data
  var data1 = new Array( 0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
  var data2 = new Array( 5, 6, 7, 8, 9, 0, 1, 2, 3, 4);  
  var data3 = new Array( 0, 1, 2, 8, 9, 0, 1, 2, 3, 4);  
  var data4 = new Array( 9, 8, 7, 6, 5, 4, 3, 2, 1, 0);  

  //render function for bar plot
  function renderBar(xCo, yCo, data) {
    require("graph").drawBar(g, data, {
      miny: 0,
      axes : true,
      x:xCo, y:yCo, width:70, height:80
    });
  }

  //render function for line plot
  function renderLine(xCo, yCo, data) {
    require("graph").drawLine(g, data, {
      miny: 0,
      axes : true,
      x:xCo, y:yCo, width:70, height:80
    });
  }

  g.setFont("6x8").drawString("Custom per day", 0, 3);
  renderLine(5,10,data1);
  g.setFont("6x8").drawString("Veggies last week", 90, 3);
  renderBar(90,10,data2);
  g.setFont("6x8").drawString("Custom per day", 0, 90);
  renderBar(5,100,data3);
  g.setFont("6x8").drawString("Veggies per day", 90, 90);
  renderLine(90,100,data4);
  //g.setFont("6x8").drawString("Finished", 100, 110);
  //g.setFont("6x8").drawString("Routines:", 100, 130);
  //g.setFont("6x8").drawString("168", 115, 150);
  }

  update(){
  }

  touch(button, xy){
    console.log("touch", xy.x, xy.y);

    //test data
    var data1 = new Array( 0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
    var data2 = new Array( 5, 6, 7, 8, 9, 0, 1, 2, 3, 4);  
    var data3 = new Array( 0, 1, 2, 8, 9, 0, 1, 2, 3, 4);  
    var data4 = new Array( 9, 8, 7, 6, 5, 4, 3, 2, 1, 0);  

    //transition to detail view of the plots
    if (xy.x > 5 && xy.x < 75 && xy.y > 3 && xy.y < 83) {
      screenStack.push(new PlotScreen("Customer per day", data1, true));
    }

    if (xy.x > 85 && xy.x < 155 && xy.y > 3 && xy.y < 83) {
      screenStack.push(new PlotScreen("Veggies last week", data2, false));
    }

    if (xy.x > 5 && xy.x < 75 && xy.y > 93 && xy.y < 173) {
      screenStack.push(new PlotScreen("Customer per day", data3, false));
    }

    if (xy.x > 85 && xy.x < 155 && xy.y > 93 && xy.y < 173) {
      screenStack.push(new PlotScreen("Veggies per day", data4, true));
    }
  }

  drag(event){
  }

  button(){
    screenStack.pop(screenStack.length-1);
  }
}

// implements the plot screen for a single plot
class PlotScreen extends Screen {  
  constructor(caption, plotData, view) {
    renderText = caption;
    data = plotData;
    style = view;
  }

  draw(){
    g.clear();

    //render function bar plot full screen
    function renderBar(xCo, yCo, data) {
      require("graph").drawBar(g, data, {
        miny: 0,
        axes : true,
        x:xCo, y:yCo, width:150, height:150
      });
    }

    //render function line plot full screen
    function renderLine(xCo, yCo, data) {
      require("graph").drawLine(g, data, {
        miny: 0,
        axes : true,
        x:xCo, y:yCo, width:150, height:150
      });
    }

    g.setFont("6x8").drawString(renderText, 44, 3);
    if(style){
      renderLine(5,20,data);
    }
    else{
      renderBar(5,20,data);
    }

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
