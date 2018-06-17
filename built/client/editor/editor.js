"use strict";
// Tankhunt level editor
// CAUTION: SPAGHETTI CODE!! DO NOT EVEN TRY TO LOOK AT IT
$(function () {
    $(window).on("contextmenu", function () { return false; });
    $(window).on("dragstart", function () { return false; });
    $("#copyLevel").on("click", copyJSON);
    $("#reloadLevel").on("click", loadFromJSON);
    $("#propTable input").on("change", function () {
        level[$(this).attr("name")] = $(this).val();
        putJSONText();
    });
    $("#propTable input[name='tilesCountX']").off().on("change", sizeInputChanged);
    $("#propTable input[name='tilesCountY']").off().on("change", sizeInputChanged);
    $("#inversions input").on("change", invertInputChange);
    $("input[name='editTypeRadio']").on("change", updateMode);
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
    invertspawns1: false,
    invertspawns2: false,
    invertspawnsItems: false
};
var viewSquareSize = 90;
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
            }
            else {
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
            }
            else {
                $(this).append(newWall(blockX, blockY, 1));
                level.walls.push(wallToString(blockX, blockY, 1));
            }
            putJSONText();
        }
    }
    // Spawns 1
    if ($("input[value='spawns1']").prop("checked") == true && e.buttons == 1) {
        if ($(this).is("[spawns1]")) {
            $(this).removeAttr("spawns1");
            $(this).removeClass("greenBlock");
            level.spawns1.splice(level.spawns1.indexOf(blockToString(blockX, blockY)), 1);
        }
        else {
            $(this).attr("spawns1", "");
            $(this).addClass("greenBlock");
            level.spawns1.push(blockToString(blockX, blockY));
        }
        putJSONText();
    }
    // Spawns 2 
    if ($("input[value='spawns2']").prop("checked") == true && e.buttons == 1) {
        if ($(this).is("[spawns2]")) {
            $(this).removeAttr("spawns2");
            $(this).removeClass("greenBlock");
            level.spawns2.splice(level.spawns2.indexOf(blockToString(blockX, blockY)), 1);
        }
        else {
            $(this).attr("spawns2", "");
            $(this).addClass("greenBlock");
            level.spawns2.push(blockToString(blockX, blockY));
        }
        putJSONText();
    }
    // Spawns items 
    if ($("input[value='spawnsItems']").prop("checked") == true && e.buttons == 1) {
        if ($(this).is("[spawnsItems]")) {
            $(this).removeAttr("spawnsItems");
            $(this).removeClass("greenBlock");
            level.spawnsItems.splice(level.spawns2.indexOf(blockToString(blockX, blockY)), 1);
        }
        else {
            $(this).attr("spawnsItems", "");
            $(this).addClass("greenBlock");
            level.spawnsItems.push(blockToString(blockX, blockY));
        }
        putJSONText();
    }
}
function sizeInputChanged() {
    var x = $(this).is("[name='tilesCountX']") ? $(this).val() : level.tilesCountX;
    var y = $(this).is("[name='tilesCountY']") ? $(this).val() : level.tilesCountY;
    changeLevelSize(x, y);
    putJSONText();
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
    }
    catch (error) {
        alert("Cannot make level from this text! " + error.message);
    }
}
function setValues() {
    $("#squareSizeInp").val(level.squareSize);
    $("#squareCountXInp").val(level.tilesCountX);
    $("#squareCountYInp").val(level.tilesCountY);
    $("#wallThicknessInp").val(level.wallThickness);
    $("#invertspawns1").prop("checked", level.invertspawns1);
    $("#invertspawns2").prop("checked", level.invertspawns2);
    $("#invertspawnsItems").prop("checked", level.invertspawnsItems);
}
function putJSONText() {
    $("#levelTextArea").val(JSON.stringify(level));
}
function copyJSON() {
    $("#levelTextArea").select();
    document.execCommand("copy");
}
function rebuildLevel() {
    $workSpace = $("#workSpace");
    $workSpace.empty();
    viewSquareSize = window.innerHeight / level.tilesCountY;
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
            $block.on("mouseover", blockEdit).on("mousedown", blockEdit).on("mouseout", function () { $(this).removeClass("hovered"); });
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
    updateMode();
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
    }
    else { // Vertical
        $wall.attr("data-type", "vertical");
        $wall.css({
            width: pixelize(viewThickness),
            height: pixelize(viewSquareSize)
        });
    }
    return $wall;
}
function changeLevelSize(tilesX, tilesY) {
    var prevX = level.tilesCountX;
    var prevY = level.tilesCountY;
    level.tilesCountX = tilesX;
    level.tilesCountY = tilesY;
    if (prevX > tilesX || prevY > tilesY) {
        // Delete all items that are not within the range 
        deleteOutOfRange();
    }
    rebuildLevel();
}
function deleteOutOfRange() {
    var iterate = [level.walls, level.spawns1, level.spawns2, level.spawnsItems];
    for (var z = 0; z < iterate.length; z++) {
        for (var i = 0; i < iterate[z].length; i++) {
            var data = iterate[z][i].split("|");
            if (parseInt(data[0]) >= level.tilesCountX || parseInt(data[1]) >= level.tilesCountY) {
                iterate[z].splice(i, 1);
                i--;
            }
        }
    }
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
