/*
Define here layers
-1: Empty
0 : Dirt
1 : Dirt with grass
2 : Water
3 : Stone
*/
var layer1 = [ 1, 1, 1, 1, 1, 1, 1, 1,
	1, 1, 1, 1, 1, 1, 1, 1,
	1, 1, 2, 2, 2, 1, 1, 1,
	1, 1, 2, 2, 2, 1, 1, 1,
	1, 1, 1, 1, 1, 1, 1, 1,
	1, 1, 0, 0, 0, 1, 1, 1,
	1, 1, 0, 0, 0, 0, 0, 1,
	1, 1, 1, 1, 1, 1, 0, 1  ]

var layer2 = [ 1, 1, 1, -1, -1, -1, -1, -1,
	1, 1, 1, 1, -1, -1, -1, -1,
	1, 1, 2, -2, -2, -1, -1, -1,
	1, 1, -2, -2, -2, -1, -1, -1,
	1, -1, -1, -1, -1, -1, -1, -1,
	-1, -1, -1, -1, -1, -1, -1, -1,
	-1, -1, -1, -1, -1, -1, -1, -1,
	-1, -1, -1, -1, -1, -1, -1, -1  ]

var layer3 = [ 1, 1, 1, -1, -1, -1, -1, -1,
		1, 1, 2, -1, -1, -1, -1, -1,
		-1, -1, -1, -2, -2, -1, -1, -1,
		-1, -1, -2, -2, -2, -1, -1, -1,
		1, -1, -1, -1, -1, -1, -1, -1,
		-1, -1, -1, -1, -1, -1, -1, -1,
		-1, -1, -1, -1, -1, -1, -1, -1,
		-1, -1, -1, -1, -1, -1, -1, -1 ]

var layer4 = [ 1, -1, -1, -1, -1, -1, -1, -1,
		-1, -1, -2, -1, -1, -1, -1, -1,
		-1, -1, -1, -2, -2, -1, -1, -1,
		-1, -1, -2, -2, -2, -1, -1, -1,
		1, -1, -1, -1, -1, -1, -1, -1,
		-1, -1, -1, -1, -1, -1, -1, -1,
		-1, -1, -1, -1, -1, -1, -1, -1,
		-1, -1, -1, -1, -1, -1, -1, -1 ]

//Layers are added to map 
var mapValues = [layer1, layer2, layer3, layer4];

var cubeTypes = ["dirt","grass","water", "stone"];

//Number of cube by rows (Nombre de cubes par ligne, faut que ça corresponde à la taille des layers)
var nbCubeOneRow = 8;
var sizeCube = 100 / nbCubeOneRow;

//SizeMap in vw
//Needed to compute each bloc position in window
var sizeMap = 20;



$(document).ready(function(){
var map = $("#map");

buildMap(map, mapValues);
});


function buildMap(map, mapValues){
var column, line;

mapValues.forEach((layer,layerIndex) => {
layer.forEach((element,elementIndex) => {
	if(element >= 0){
		column = elementIndex % 8;
		line = Math.floor(elementIndex / 8);
		
		map.append(buildNewCube(layerIndex,column, line, cubeTypes[element]));
	}
});
});



$(".cube").each(function(){
$(this).append("<div class='face right'></div>");
$(this).append("<div class='face left'></div>");
$(this).append("<div class='face top'></div>");
});
}


function buildNewCube(layer, column, line, type){
var leftPourcent = column * sizeCube;
var topPourcent = line * sizeCube;
return "<div class='cube "+ type +"' data-layer='"+ layer + "' data-column='"+ column +"' data-line='"+ line +"' style='left:"+ leftPourcent +"% ; top:"+ topPourcent +"% ; transform: translateZ(calc("+ sizeMap +"vw * "+ (sizeCube / 100) * layer +"))'></div>";
}