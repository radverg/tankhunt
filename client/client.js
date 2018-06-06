// The main client file, start of the application
var game = null;
var socket = null;

$(function () {
    // $("#usr").focus();
    // $("#playButton").on("click", function () {
    //     var name = $("#usr").val();

    //    // showCanvas();
    //     if (name) {
    //         socket.emit("nameEnter", name);
    //         showQueue();
    //     } else if (!$("#playButton").next().hasClass("alert")) { // Show alert
    //         $('<div class="alert alert-danger" style="margin-top: 2rem; text-align: center">You have to type your name to the text box above!</div>').insertAfter($("#playButton"));
    //     }


    // });



    // Initialize phaser and connect to websocket
    window.onload = function() {
         initPhaser();
         setTimeout(initSocket, 500);  
    }
});



function updateQueue(data) {
    $("#queueMembers").empty();

    for (var i = 0; i < data.length; i++) {
        $("#queueMembers").append(
            $('<li class="list-group-item"></li>').html(data[i].name + '<span class="badge">' + data[i].address + '</span>')
        );
    }

}

function showQueue() {
    $(".mainCont").fadeOut();
    $(".queueCont").fadeIn();
}

function hideQueue() {
    $(".queueCont").hide();
}

function hideCanvas() {
    $(game.canvas).addClass("hidden");
}

function showCanvas() {
    $(game.canvas).removeClass("hidden");
}

function initPhaser() {
    game = new Phaser.Game(1920, 1080, Phaser.AUTO, '');
    extendPhaserSprite();
    game.state.add("load", LoadState);
    game.state.add("play", PlayState);
    game.state.start("load");
    game.sizeCoeff = 70;
}

function initSocket() {
    
    socket = io.connect();

    socket.on("connect", function () {
        console.log("Conection approved! My id is: " + socket.id);
    });

    socket.on("queueInfo", function (data) {
        updateQueue(data);
    });

    socket.on("countDown", function(data) {
        setTimeout(function() {
           
            if (game.width == 0) {
                game.scale.setGameSize(1920, 1080);
            }

            game.state.start("play");
            hideQueue();
            showCanvas();
        }, (data / 2) * 1000)
        //hideCanvas();
        showQueue();
    });

    socket.on("movableState", function(data) { PlayState.onGameStateInfo.call(PlayState, data); });
    socket.on("startInfo", function(data) { PlayState.onStartInfo.call(PlayState, data); });
    socket.on("removePlayer", function(data) { PlayState.onRemovePlayer.call(PlayState, data); });
    socket.on("shot", function(data) { PlayState.onNewShot.call(PlayState, data); });
    socket.on("level", function(data) { PlayState.onLevel.call(PlayState, data); }); 

}

function extendPhaserSprite() {
    Phaser.Sprite.prototype.interpolate = function() {
        var diffX = this.remX - this.x;
        var diffY = this.remY - this.y;

        var dist = Math.sqrt(diffX * diffX + diffY * diffY);

        if (dist < 2) { // Jump directly to the remote position
            this.x = this.remX;
            this.y = this.remY;
            return;
        }

        this.x += diffX * this.interpolationConst;
        this.y += diffY * this.interpolationConst;

    }

    Phaser.Sprite.prototype.interpolateAngle = function() {
        var diff = this.remAngle - this.rotation;

        if (Math.abs(diff) < Math.PI / 90) {
            this.rotation = this.remAngle;
            return;
        }

        this.rotation += diff * this.interpolationConst;
    }

    Phaser.Sprite.prototype.interpolationConst = 0.2;
}