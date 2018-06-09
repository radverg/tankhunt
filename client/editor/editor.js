$(function() {

	$(window).on("contextmenu", function() {return false;});
	$(window).on("dragstart", function() {return false;});

	$("#copyLevel").on("click", copyJSON);
	$("#reloadLevel").on("click", loadFromJSON);

	$("#propTable input").on("change", function() {
		level[$(this).attr("name")] = $(this).val();
		putJSONText();
	});

	$("#inversions input").on("change", invertInputChange);
	$("input[name='editTypeRadio']").on("change", updateMode)

	// createDefaultLevel();
	putJSONText();
	loadFromJSON();

});

var level = {

	squareSize: 3,
	tilesCountX: 10,
	tilesCountY: 10,
	wallThickness: 0.1,
	walls: [],
	spawns1: [],
	spawns2: [],
	spawnsItems: [],
	invert1: false,
	invert2: false,
	invertItem: false

}

var viewSquareSize = 60;
var viewThickness = 5;

function blockEdit(e) {
	$(this).addClass("hovered");

	var blockX = $(this).attr("data-x");
	var blockY = $(this).attr("data-y");

	// Building walls
	if ($("input[value='walls']").prop("checked") == true) {

		if (e.buttons == 1) { // Left mouse button => horizontal wall
			// Is there a horizontal wall already?
			var index = level.walls.indexOf(wallToString(blockX, blockY, 0));

			if (index !== -1) { // This wall is there
				$(this).find("div[data-type='horizontal']").remove();
				level.walls.splice(index, 1);
			} else {
				$(this).append(newWall(blockX, blockY, 0));	
				level.walls.push(wallToString(blockX, blockY, 0));	
			}
			putJSONText();
		}

		if (e.buttons == 2) { // right mouse button => vertical wall
			// Is there a vertical wall already?
			var index = level.walls.indexOf(wallToString(blockX, blockY, 1));
			
			if (index !== -1) {
				$(this).find("div[data-type='vertical']").remove();
				level.walls.splice(index, 1);
			} else {
				$(this).append(newWall(blockX, blockY, 1));
				level.walls.push(wallToString(blockX, blockY, 1));	
			}
			putJSONText();
		}
	}

	// Spawns 1
	if ($("input[value='spawns1']").prop("checked") == true && e.buttons == 1) {
		if ($(this).hasAttr("spawns1")) {

		}
	}
}

function invertInputChange() {
	level[$(this).attr("id")] = $(this).prop("checked");
	putJSONText();
}

function loadFromJSON() {
	
	var jsontext = $("#levelTextArea").val();
		
	try {
		level = JSON.parse(jsontext);
		setValues();
		rebuildLevel();

	} catch(error) {
		alert("Cannot make level from this text! " + error.message);
	}
}		

function setValues() {
	$("#squareSizeInp").val(level.squareSize);
	$("#squareCountXInp").val(level.tilesCountX);
	$("#squareCountYInp").val(level.tilesCountY);
	$("#wallThicknessInp").val(level.wallThickness);
	$("#invert1").prop("checked", level.invert1);
	$("#invert2").prop("checked", level.invert2);
	$("#invertItem").prop("checked", level.invertItem);
}

function putJSONText() {
	$("#levelTextArea").val(JSON.stringify(level));
}

function copyJSON() {
	$("#levelTextArea").select();
	document.execCommand("copy");
}

// function createDefaultLevel() {
// 	for (var x = 0; x < level.tilesCountX; x++) {
// 		level.walls.push([]);
// 		for (var y = 0; y < level.tilesCountY; y++) {
// 			level.walls[x].push([false, false]);
// 		}
// 	}
// }

function rebuildLevel() {
	$workSpace = $("#workSpace");

	$workSpace.empty();

	$workSpace.css({ width: pixelize(viewSquareSize * level.tilesCountX),
						height: pixelize(viewSquareSize * level.tilesCountY), left: "260px" });

	for (var x = 0; x < level.tilesCountX; x++) {
		for (var y = 0; y < level.tilesCountY; y++) {
			// Firstly, create the block
			$block = $('<div class="levelBlock"></div>').css({
				top: pixelize(y * viewSquareSize),
				left: pixelize(x * viewSquareSize),
				width: pixelize(viewSquareSize),
				height: pixelize(viewSquareSize)
			});
			$block.attr("data-x", x).attr("data-y", y);
			$workSpace.append($block);
			$block.on("mouseover", blockEdit).on("mousedown", blockEdit).on("mouseout", function() { $(this).removeClass("hovered"); });

			// Now lets add the walls, if any
			if (level.walls.indexOf(wallToString(x, y, 0)) !== -1) { // Horizontal
				$wall = newWall(x, y, 0);
				$block.append($wall);
			}

			if (level.walls.indexOf(wallToString(x, y, 1)) !== -1) { // Vertical
				$wall = newWall(x, y, 1);
				$block.append($wall);
			}

			// Now the spawns
			if (level.spawns1.indexOf(blockToString(x, y)) !== -1) {
				$block.attr("spawns1", "");
			}

			if (level.spawns2.indexOf(blockToString(x, y)) !== -1) {
				$block.attr("spawns2", "");
			}

			if (level.spawnsItems.indexOf(blockToString(x, y)) !== -1) {
				$block.attr("spawnsItems", "");
			}
		}
	}
}

function updateMode() {

	var mode = $("input[name='editTypeRadio']:checked").val();

	switch (mode) {

		case "walls": 
			// Turn of the background
			$("#workSpace > div").removeClass("greenBlock");
			break;
		case "spawns1": 
			$("#workSpace > div").removeClass("greenBlock");
			$("#workSpace > div[spawns1]").addClass("greenBlock");
			break;
		case "spawns2":
			$("#workSpace > div").removeClass("greenBlock");
			$("#workSpace > div[spawns2]").addClass("greenBlock");
			break;
		case "spawnsItems":
			$("#workSpace > div").removeClass("greenBlock");
			$("#workSpace > div[spawnsItems]").addClass("greenBlock");
			break;
	}
}

function newWall(x, y, type) {
	var $wall = $("<div class='wall'></div>");
	if (type == 0) { // Horizontal
		$wall.attr("data-type", "horizontal");
		$wall.css({
			width: pixelize(viewSquareSize),
			height: pixelize(viewThickness)
		});
	} else { // Vertical
		$wall.attr("data-type", "vertical");
		$wall.css({
			width: pixelize(viewThickness),
			height: pixelize(viewSquareSize)
		});
	}

	return $wall;
}

function changeLevelSize(tilesX, tilesY) {
	// level.tilesCountX = tilesX;
	// // level.tilesCountY = tilesY;
	// var prevX = level.tilesCountX;
	// var prevY = level.tilesCountY;

	// if (prevX < tilesX) {
	// 	var diff = tilesX - prevX;
	// 	for (var i = prevX; i < tilesX; i++) {
			
	// 	}
	// }

	// if (level.walls.length <)
}

function wallToString(squareX, squareY, type) {
	return squareX + "|" + squareY + "|" + type;
}

function blockToString(squareX, squareY) {
	return squareX + "|" + squareY;
}

function getBlock(squareX, squareY) {
	return $("#workSpace div[data-x='" + squareX + "'][data-y='" + squareY + "']");
}

function pixelize(number) {
	return number + "px";
}