var Layout = require("Layout");
var Storage = require("Storage");

g.setBgColor(1,1,1);

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
    this.init();
  }
  
  init() {
    this.farm_unlocked = false;
    for (let i = 0; i < 6; i++){
      if (amounts[i] > 0) {
        this.farm_unlocked = true;
      }
    }
  }

  draw(){
    g.clear();
    //--- draw main screen
    // draw images
    g.drawImage(Storage.read("farmer.img"), 0, 1); // farmer
    g.drawImage(Storage.read("field.img"), 90, 15);  // field
    g.drawImage(Storage.read("stats2.img"), 49, 95); // stats
    
    if (this.farm_unlocked == false){
      g.drawLine(85, 3, 155, 83);
      g.drawLine(85, 83, 155, 3);
    }
    
    //g.drawImage(Storage.read("farm.img"), 88, 96);   // market

    // draw labels
    g.setColor(0).setFont("6x8").drawString("Contracts", 13, 75);
    g.setFont("6x8").drawString("Farm", 110, 75);
    g.setFont("6x8").drawString("Stats", 65, 165);
    //g.setFont("6x8").drawString("Shop", 110, 165);

    // draw rectangles to indicate button areas
    g.drawRect(5, 3, 75, 83);
    g.drawRect(85, 3, 155, 83);
    g.drawRect(45, 93, 115, 173);
    //g.drawRect(85, 93, 155, 173);
  }

  update(){
  }

  touch(button, xy){
    if (xy.x > 5 && xy.x < 75 && xy.y > 3 && xy.y < 83) {
      screenStack.push(new ContractsScreen());
    }

    if (xy.x > 85 && xy.x < 155 && xy.y > 3 && xy.y < 83) {
      for (var i = 0; i< 6; i++){
        if (amounts[i] > 0) {
            for (let j = 0; j < 6; j++){
              recentstats[j] = 0;
            }

            screenStack.push(new FarmScreen());
            return;
        }
      }
    }

    if (xy.x > 45 && xy.x < 115 && xy.y > 93 && xy.y < 173) {
      screenStack.push(new StatsScreenRecent());
    }

    //if (xy.x > 85 && xy.x < 155 && xy.y > 93 && xy.y < 173) {
    //  screenStack.push(new WinScreen());
    //}
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
    this.index = Math.floor(Math.random() * contractor_images.length);
    this.img = contractor_images[this.index];
    this.selected = false;
    this.amounts = [0, 0, 0, 0, 0, 0];
    this.amounts[Math.floor(Math.random()*6)] += Math.floor(3+Math.random()*5);
  }
}

// store which amounts of vegetables have been selected
var amounts = [0, 0, 0, 0, 0, 0];
var stats = [0, 0, 0, 0, 0, 0];
var recentstats = [0, 0, 0, 0, 0, 0];
var contractor_stats = [];

for (let i = 0; i < contractor_images.length; i++) {
  contractor_stats.push(0);
}

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
        this.contractarea.drawImage(Storage.read("checkbox_checked.img"), i*90+70, 0);
      }
      else {
        this.contractarea.drawImage(Storage.read("checkbox.img"), i*90+70, 0);
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
    g.drawImage(Storage.read("turnip.img"), 8, 10, {scale:0.5}); // turnip
    g.setFont("6x8:2x2").drawString("x" + amounts[0], 40, 15);

    g.drawImage(Storage.read("tomato.img"), 6, 40, {scale:0.5}); // tomato
    g.setFont("6x8:2x2").drawString("x" + amounts[1], 40, 47);

    g.drawImage(Storage.read("chilli.img"), 5, 68, {scale:0.5}); // chilli
    g.setFont("6x8:2x2").drawString("x" + amounts[2], 40, 76);

    g.drawImage(Storage.read("corn.img"), 86, 10, {scale:0.5}); // corn
    g.setFont("6x8:2x2").drawString("x" + amounts[3], 116, 15);

    g.drawImage(Storage.read("onion.img"), 86, 37, {scale:0.5}); // onion
    g.setFont("6x8:2x2").drawString("x" + amounts[4], 116, 47);

    g.drawImage(Storage.read("wheat.img"), 86, 72, {scale:0.5}); // wheat
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
          this.contractarea.setColor(0).drawImage(Storage.read("checkbox_checked.img"), i*90+70, 0);
          for (let j = 0; j < 6; j++){
            amounts[j] += contractors[i].amounts[j];
          }
        } else {
          this.contractarea.setColor(0).drawImage(Storage.read("checkbox.img"), i*90+70, 0);
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
    screenStack[screenStack.length - 1].init();
  }
}

class Vegetable {
  constructor(count) {
  }
}


class Chilli extends Vegetable{
  constructor(count){
    this.count = count;
    this.name = "Chilli";
    this.anim1 = ["squats1.img", "side_squats1.img", "reverse_lunches1.img", "burpee1.img",];
    this.anim2 = ["squats2.img", "side_squats2.img",  "reverse_lunches2.img", "burpee2.img",];
    this.text = ["SQUAT to SOW!", "SIDE SQUAT to WATER!", "REVERSE LUNCH to GROW", "BURPEE to HARVEST!"];
    this.countstyle = [true, true, true, true];
    this.harvest = ["harvestchili1.img", "harvestchili2.img"];
  }
}

class Turnip extends Vegetable{
  constructor(count){
    this.count = count;
    this.name = "Turnip";
    this.anim1 = ["plank.img", "plank.img", "plank.img", "plank.img",];
    this.anim2 = ["plank.img", "plank_side_kicks.img",  "planks_kicks2.img", "plank_raise.img",];
    this.text = ["PlANK to SOW!", "PLANK SIDE KICKS to WATER!", "PLANK KICKS to GROW", "PLANK RAISE to HARVEST!"];
    this.countstyle = [true, true, true, true];
    this.harvest = ["harvestturnip1.img", "harvestturnip2.img"];
  }
}


class Onion extends Vegetable{
  constructor(count){
    this.count = count;
    this.name = "Onion";
    this.anim1 = ["flutter1.img", "plank.img", "plank.img", "plank.img",];
    this.anim2 = ["flutter2.img", "plank_side_kicks.img",  "planks_kicks2.img", "plank_raise.img",];
    this.text = ["FLUTTER KICKS to SOW!", "PLANK SIDE KICKS to WATER!", "PLANK KICKS to GROW", "PLANK RAISE to HARVEST!"];
    this.countstyle = [true, true, true, true];
    this.harvest = ["harvestonion1.img", "harvestonion2.img"];
  }
}

class Tomato extends Vegetable{
  constructor(count){
    this.count = count;
    this.name = "Tomato";
    this.anim1 = ["plank.img", "plank.img", "plank.img", "plank.img",];
    this.anim2 = ["plank.img", "plank_side_kicks.img",  "planks_kicks2.img", "plank_raise.img",];
    this.text = ["PlANK to SOW!", "PLANK SIDE KICKS to WATER!", "PLANK KICKS to GROW", "PLANK RAISE to HARVEST!"];
    this.countstyle = [true, true, true, true];
    this.harvest = ["harvesttomato1.img", "harvesttomato2.img"];
  }
}

class Wheat extends Vegetable{
  constructor(count){
    this.count = count;
    this.name = "Wheat";
    this.anim1 = ["plank.img", "plank.img", "plank.img", "plank.img",];
    this.anim2 = ["plank.img", "plank_side_kicks.img",  "planks_kicks2.img", "plank_raise.img",];
    this.text = ["PlANK to SOW!", "PLANK SIDE KICKS to WATER!", "PLANK KICKS to GROW", "PLANK RAISE to HARVEST!"];
    this.countstyle = [true, true, true, true];
    this.harvest = ["harvestwheat1.img", "harvestwheat2.img"];
  }
}


class Corn extends Vegetable{
  constructor(count){
    this.count = count;
    this.name = "Corn";
    this.anim1 = ["plank.img", "plank.img", "plank.img", "plank.img",];
    this.anim2 = ["plank.img", "plank_side_kicks.img",  "planks_kicks2.img", "plank_raise.img",];
    this.text = ["PlANK to SOW!", "PLANK SIDE KICKS to WATER!", "PLANK KICKS to GROW", "PLANK RAISE to HARVEST!"];
    this.countstyle = [true, true, true, true];
    this.harvest = ["harvestcorn1.img", "harvestcorn2.img"];
  }
}



var cropPhase1 = ["seeding.img", "watering1.img", "grow1.img"];
var cropPhase2 = ["seeding2.img", "watering2.img", "grow2.img"];


// implements the farming screen showing the different crops and which exercises need to be completed to harvest them
class FarmScreen extends Screen {
  constructor() {
    console.log("farm screen");
    console.log("stacksize: " + screenStack.length);

    g.clear();
    this.currentPhase = 0;

    this.vegetable = undefined;

    for (var i = 0; i< 6; i++){
        if (amounts[i] > 0 && this.vegetable == undefined) {
          switch (i) {
            case 0:
              this.vegetable = new Turnip(amounts[i]);
              break;
            case 1:
              this.vegetable = new Tomato(amounts[i]);
              break;
            case 2:
              this.vegetable = new Chilli(amounts[i]);
              break;
            case 3:
              this.vegetable = new Corn(amounts[i]);
              break;
            case 4:
              this.vegetable = new Onion(amounts[i]);
              break;
            case 5:
              this.vegetable = new Wheat(amounts[i]);
              break;
            default: 
              screenStack.pop(screenStack.length-1);
              return;
        }
      }
    }

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
    g.setFont("6x8").setFontAlign(0, 0).drawString(this.vegetable.text[this.currentPhase], 86, 70);
    g.setFontAlign(-1, -1);

    // two animation steps
    if(this.flippedTrainer){
      // draw gropPhase, last gropPhase is dependent on the vegetable
      if (this.currentPhase == 3){
        g.drawImage(Storage.read(this.vegetable.harvest[1]), 100, 105, {scale:0.8});
      } else {
        g.drawImage(Storage.read(cropPhase1[this.currentPhase]), 100, 105, {scale: this.currentPhase == 0 ? 1 : 0.8});
      }

      // draw the exercise
      g.drawImage(Storage.read(this.vegetable.anim1[this.currentPhase]), 9, 95, {scale:1});
    }
    else {
      // draw gropPhase, last gropPhase is dependent on the vegetable
      if (this.currentPhase == 3){
        g.drawImage(Storage.read(this.vegetable.harvest[0]), 100, 105, {scale:0.8});
      } else {
        g.drawImage(Storage.read(cropPhase2[this.currentPhase]), 100, 105, {scale:this.currentPhase == 0 ? 1 : 0.8});
      }

      // draw the exercise
      g.drawImage(Storage.read(this.vegetable.anim2[this.currentPhase]), 9, 95, {scale:1});
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
      if (this.currentPhase >= 4){
        return this.win();
      }
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

  win() {
    g.clear();

    // clear seconds timer interval
    if (this.timerInterval != undefined) {
      clearInterval(this.timerInterval);
    }
    this.timerInterval = undefined;

    // clear trainer animation interval
    clearInterval(this.trainerInterval);
    this.trainerInterval = undefined;

    screenStack.pop(screenStack.length-1);

    for (let i = 0; i< 6; i++){
      if (amounts[i] > 0)
      {
        // find and replace satisfied contractors
        for (let j = 0; j < 5; j++){
          let c = contractors[j];
          if (c.amounts[i] > 0) {
            contractors[j] = new Contractor();
            contractor_stats[c.index] += 1;
          }
        }

        //add amount of this vegetable to stats
        stats[i] += amounts[i];
        recentstats[i] = amounts[i];
        
        amounts[i] = 0;
        break;
      }
    }

    for (let i = 0; i< 6; i++){
      if (amounts[i] > 0){
        screenStack.push(new FarmScreen());
        return;
      }
    }

    screenStack.push(new WinScreen());
  }

  button(){
    console.log("button farmscreen");
    console.log("stacksize: " + screenStack.length);

    g.clear();

    // clear seconds timer interval
    if (this.timerInterval != undefined) {
      clearInterval(this.timerInterval);
    }
    this.timerInterval = undefined;

    // clear trainer animation interval
    clearInterval(this.trainerInterval);
    this.trainerInterval = undefined;
    
    console.log("stacksize: " + screenStack.length);
    screenStack.pop(screenStack.length-1);
    console.log("stacksize: " + screenStack.length);
    screenStack[screenStack.length-1].init();
  }
}

// implements the stats screen showing previously completed exercises
class StatsScreenRecent extends Screen {
  constructor() {
  }

  draw(){
    g.clear();

    //render function for bar plot
    function renderBar(xCo, yCo, data) {
      require("graph").drawBar(g, data, {
        miny: 0,
        axes : true,
        x:xCo, y:yCo, width:150, height:70
      });

    g.drawImage(Storage.read("turnip.img"), 30, 145, {scale:0.3}); // turnip

    g.drawImage(Storage.read("tomato.img"), 50, 145, {scale:0.3}); // tomato

    g.drawImage(Storage.read("chilli.img"), 70, 145, {scale:0.3}); // chilli

    g.drawImage(Storage.read("corn.img"), 90, 145, {scale:0.3}); // corn

    g.drawImage(Storage.read("onion.img"), 110, 145, {scale:0.3}); // onion

    g.drawImage(Storage.read("wheat.img"), 130, 145, {scale:0.3}); // wheat
  }

    g.setFont("6x8:2x2").setFontAlign(0,0).drawString("Harvested", 86, 10);
    g.setFont("6x8:2x2").setFontAlign(0,0).drawString("Veggies", 86, 25);
    g.setFont("6x8:2x2").setFontAlign(0,0).drawString("Last Workout", 86, 40);
    g.setFontAlign(-1,-1);
    renderBar(10,70,recentstats);
  }

  update(){
  }

  touch(button, xy){
    screenStack.pop(screenStack.length-1);
    screenStack.push(new StatsScreenAll());
  }

  drag(event){
  }

  button(){
    screenStack.pop(screenStack.length-1);
  }
}

// implements the stats screen showing previously completed exercises
class StatsScreenAll extends Screen {
  constructor() {
  }

  draw(){
    g.clear();

    //render function for bar plot
    function renderBar(xCo, yCo, data) {
      require("graph").drawBar(g, data, {
        miny: 0,
        axes : true,
        x:xCo, y:yCo, width:150, height:70
      });

    g.drawImage(Storage.read("turnip.img"), 30, 145, {scale:0.3}); // turnip

    g.drawImage(Storage.read("tomato.img"), 50, 145, {scale:0.3}); // tomato

    g.drawImage(Storage.read("chilli.img"), 70, 145, {scale:0.3}); // chilli

    g.drawImage(Storage.read("corn.img"), 90, 145, {scale:0.3}); // corn

    g.drawImage(Storage.read("onion.img"), 110, 145, {scale:0.3}); // onion

    g.drawImage(Storage.read("wheat.img"), 130, 145, {scale:0.3}); // wheat
  }

  g.setFont("6x8:2x2").setFontAlign(0,0).drawString("Harvested", 86, 10);
  g.setFont("6x8:2x2").setFontAlign(0,0).drawString("Veggies", 86, 25);
  g.setFont("6x8:2x2").setFontAlign(0,0).drawString("In Total", 86, 40);
  g.setFontAlign(-1,-1);
  renderBar(10,70,stats);
  }

  update(){
  }

  touch(button, xy){
    screenStack.pop(screenStack.length-1);
    screenStack.push(new StatsScreenRecent());
  }

  drag(event){
  }

  button(){
    screenStack.pop(screenStack.length-1);
  }
}


// implements the shopping screen allowing to buy cool stuff
class WinScreen extends Screen {
  constructor() {
    this.flip = false;
    this.posx = [0, 50, 100, 0, 50, 100];
    this.posy = [5, 5, 5, 100, 100, 100];

    this.img = [Storage.read("corn.img"), Storage.read("tomato.img"), Storage.read("chilli.img"), Storage.read("onion.img"), Storage.read("wheat.img"), Storage.read("turnip.img")];
    this.img_rot = [Storage.read("corn_rot.img"), Storage.read("tomato_rot.img"), Storage.read("chili_rot.img"), Storage.read("onion_rot.img"), Storage.read("wheat_rot.img"), Storage.read("turnip_rot.img")];

    this.drawCall = setInterval(function(screen) {
      screen.flip = !screen.flip;
      screen.drawRotatedObjects();
    }, 1000, this);
  }

  drawRotatedObjects() {
    g.clear();
    Bangle.buzz();
    let target = 0;
    if (this.flip)
      target = 1;
    g.setFont("6x8:2x3").drawString("You did it!", 28, 75);
    for (let i = 0; i < 6; i++){
      if (i % 2 == target) { //draw even positions 
         g.drawImage(this.img[i], this.posx[i]+10, this.posy[i]+10, {scale:0.8});
      } else { //draw uneven positions
         g.drawImage(this.img_rot[i], this.posx[i]+10, this.posy[i]+10, {scale:0.8});
      }
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
    console.log(screenStack.length);
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
