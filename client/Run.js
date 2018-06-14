/* The main client file, start of the application */

var game = null; // Phaser instance
var TankHunt = new TankHuntClient(); // TankHunt instance

$(function () { 
    // Initialize
    window.onload = function() {
        TankHunt.init();
    }
});

// function hideCanvas() {
//     $(game.canvas).addClass("hidden");
// }

// function showCanvas() {
//     $(game.canvas).removeClass("hidden");
// }
