var Layout = require("Layout");
var Storage = require("Storage");

var layout = new Layout( {
  type:"v", c: [
    {type:"txt", font:"6x8:2", label:"A Test", id:"label"},
    {type:"h", c: [
      {type:"btn", font:"6x8:2", label:"Farm", cb: l=>setLabel("Farm") },
      {type:"btn", font:"6x8:2", label:"Market", cb: l=>setLabel("Market") }
    ]}
  ]
}, {lazy:true});


function setLabel(x) {
  layout.label.label = x;
  layout.render();
}


g.clear();

//g.drawImage(img,10,10);
g.drawImage(Storage.read("farmer.img"), 0, 1); // farmer
g.drawImage(Storage.read("field.img"), 90, 15);  // field
g.drawImage(Storage.read("stats2.img"), 9, 95); // stats
g.drawImage(Storage.read("farm.img"), 88, 96);   // market

g.setFont("6x8").drawString("Contracts", 13, 75);
g.setFont("6x8").drawString("Farm", 110, 75);
g.setFont("6x8").drawString("Stats", 25, 165);
g.setFont("6x8").drawString("Shop", 110, 165);

g.drawRect(5, 3, 75, 83);
g.drawRect(85, 3, 155, 83);
g.drawRect(5, 93, 75, 173);
g.drawRect(85, 93, 155, 173);
//layout.render();


Bangle.on('touch', function(button, xy) {
  if (xy.x > 5 && xy.x < 75 && xy.y > 3 && xy.y < 83) {
    g.clear();
    g.setFont("6x8").drawString("Contracts", 10, 10);
    g.drawImage(Storage.read("otto.img"), 9, 95); // otto
    g.drawImage(Storage.read("otto.img"), 109, 95); // otto
    g.drawImage(Storage.read("cat.img"), 190, 95); // cat
    

    Bangle.on('drag', function(event) { 
      g.clear();
            g.drawImage(Storage.read("otto.img"), 9, 95); // otto
    g.drawImage(Storage.read("otto.img"), 109, 95); // otto
    g.drawImage(Storage.read("cat.img"), 190, 95); // cat
      g.scroll(event.dx, 0); 

    }
     );
                  
    
  }
  
  if (xy.x > 85 && xy.x < 155 && xy.y > 3 && xy.y < 83) {
    g.clear();
    g.setFont("6x8").drawString("Farm", 10, 10);
    g.drawImage(Storage.read("oldman.img"), 9, 95); // oldman
  }
  
  if (xy.x > 5 && xy.x < 75 && xy.y > 93 && xy.y < 173) {
    g.clear();
g.setFont("6x8").drawString("Stats", 10, 10);

  }
  
  if (xy.x > 85 && xy.x < 155 && xy.y > 93 && xy.y < 173) {
    g.clear();
    g.setFont("6x8").drawString("Shop", 10, 10);

  }
});