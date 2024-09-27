crossorigin = "anonymous";
var faceStyle = getComputedStyle(document.querySelector('.face'));
var side = parseInt(faceStyle.width);
var dLeft = side * Math.pow(3, 1 / 2) / 2;
var dTop = side / 2;
var player = {
  x: 0,
  y: 0,
  z: 1
};
var worldLim = 5;
var blockRange = worldLim+2;

function assign(elemTrans, x, y, z, elemRel) {
  if (elemRel == null) {
    elemRel = document.getElementById("origin");
  }
  dx = parseInt(elemRel.style.left) * window.innerWidth / 100;
  dy = parseInt(elemRel.style.top) * window.innerHeight / 100;
  zdex = parseInt(elemRel.style.zIndex);
  dx += -Math.floor(x) * dLeft + Math.floor(y) * dLeft;
  dy += Math.floor(x) * dTop - Math.floor(z) * side + Math.floor(y) * dTop;
  zdex += Math.floor(x) + Math.floor(y) + 10 * Math.floor(z);
  elemTrans.style.left = dx + "px";
  elemTrans.style.top = dy + "px";
  elemTrans.style.zIndex = zdex;
}

function addCube(x, y, z, material) {
  var id = x + "-" + y + "-" + z;
  if (material == null) {
    material = "grass";
    console.log("Warning: Material Not Specified for Block " + id)
  }
  if (document.getElementById(id) == null) {
    $('body').append("<div id='" + id + "'></div>");
    var cube = $("#" + id);
    cube.attr('style', 'top: 0px; left: 0px; z-index: 0');
    cube.addClass(material);
    cube.addClass("cube");
    cube.append("<div class='face top'></div>");
    cube.append("<div class='face left shadeL'></div>");
    cube.append("<div class='face right shadeR'></div>");
    var cubeElement = document.getElementById(id);
    assign(cubeElement, x, y, z);
    getOpacity(x, y, z);
  }else{console.log("Warning: Block "+id+"already exists");}
}

function removeCube(x, y, z) {
  var id = x + "-" + y + "-" + z;
  $("#" + id).remove();
}

function getOpacity(x, y, z) {
  var id = x + "-" + y + "-" + z;
  var elem = $("#" + id);
  var distX = Math.abs(player.x - x);
  var distY = Math.abs(player.y - y);
  if (distX < blockRange && distY < blockRange) {
    elem.removeClass("fade");
    elem.removeClass("hide");
  } else {
    elem.addClass("hide");
    elem.removeClass("fade");
  }
}

function generateTree(x,y,z,height){
  if(height == null){
    height = 4+Math.floor(Math.random());
  }
  
  for(var num=z+1;num<z+height+1;num++){
    addCube(x,y,num,'oak');
  }
  
  for(var leafX=-1;leafX<2;leafX++){
    for(var leafY=-1;leafY<2;leafY++){
      addCube(x+leafX,y+leafY,z-1+height,'leaf');
      addCube(x+leafX,y+leafY,z+height,'leaf');
    }
  }
  for(var leaf=-1;leaf<2;leaf++){
    addCube(x+leaf,y,z+1+height,'leaf');
    addCube(x,y+leaf,z+1+height,'leaf');
  }
}

var z = new Object();
var dzdx = new Object();
var dxDir = Math.sign(.5-Math.random());
var dzdy = new Object();
var dyDir = Math.sign(.5-Math.random());

z[-worldLim+","+-worldLim] = Math.floor(Math.random()*-5);
dzdx[-worldLim+','+-worldLim] = Math.random()*dxDir/2;
dzdy[-worldLim+','+-worldLim] = Math.random()*dyDir/2;
addCube(-worldLim,-worldLim,z[-worldLim+','+-worldLim],"grass");

for(var a=-worldLim+1;a<worldLim;a++){
  z[a+','+-worldLim] = z[a-1+','+-worldLim]+dzdx[a-1+','+-worldLim];
  if(Math.abs(dzdx[a-1+','+-worldLim])>.5){
    dxDir = dxDir*-1;
  }
  dzdx[a+','+-worldLim] = dzdx[a-1+','+-worldLim]+dxDir*Math.random()/5;
  
  dzdy[a+','+-worldLim] = (.75+Math.random()/2)*dzdy[a-1+','+-worldLim];
  
  addCube(a,-worldLim,Math.floor(z[a+','+-worldLim]),'grass');
}

for(var a=-worldLim+1;a<worldLim;a++){
  prev = a-1;
  z[-worldLim+','+a] = z[-worldLim+','+prev]+dzdy[-worldLim+','+prev];
  if(Math.abs(dzdy[-worldLim+','+prev])>.5){
    dyDir = dyDir*-1;
  }
  dzdy[-worldLim+','+a] = dzdy[-worldLim+','+prev]+dyDir*Math.random()/5;
  
  dzdx[-worldLim+','+a] = (.75+Math.random()/2)*dzdx[-worldLim+','+prev];
  
  addCube(-worldLim,a,Math.floor(z[-worldLim+','+a]),'grass');
}

for(var a=-worldLim+1;a<worldLim;a++){
  var aPrev = a-1;
  for(var b = -worldLim+1;b<worldLim;b++){
    var bPrev = b-1;
    
    zxEst = z[aPrev+','+b]+dzdx[aPrev+','+b];
    zyEst = z[a+','+bPrev]+dzdy[a+','+bPrev];
    z[a+','+b] = (zxEst+zyEst)/2;
    
    dzdx[a+','+b] = (.5+Math.random())*(dzdx[a+','+bPrev]+dzdx[aPrev+','+b])/2;
    dzdy[a+','+b] = (.5+Math.random())*(dzdy[a+','+bPrev]+dzdy[aPrev+','+b])/2;
    
    addCube(a,b,Math.floor(z[a+','+b]),"grass");
  }
}

for(var a=-worldLim;a<worldLim;a++){
  for(var b=-worldLim;b<worldLim;b++){
    zCur = Math.floor(z[a+','+b]);
    for(var dirt=1;dirt<3;dirt++){
      addCube(a,b,zCur-dirt,'dirt')
    }
    for(var stone=-2*worldLim;stone<zCur-2;stone++){
      if(Math.random()<.1){
        addCube(a,b,stone,'coal');
      }
      else if(Math.random()<.05){
        addCube(a,b,stone,"iron");
      }
      else if(Math.random()<.05 && stone<-worldLim){
        addCube(a,b,stone,"gold");
      }
      else if(Math.random()<.03 && stone<-1.25*worldLim){
        addCube(a,b,stone,"diamond");
      }
      else{
        addCube(a,b,stone,'stone');
      }
    }
  }
}

for(var trees=0;trees<4;trees++){
  x = Math.floor(-worldLim+2*worldLim*Math.random());
  y = Math.floor(-worldLim+2*worldLim*Math.random());
  zCur = Math.floor(z[x+','+y]);
  
  generateTree(x,y,zCur);
}