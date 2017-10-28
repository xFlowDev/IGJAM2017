//Phaser Test
window.onload = function () {
    var width = 1280;
    var height = 720;

    var gameState = "Playing";

    var maze1String = "1194,1.7 1194,317 1078.5,317 1078.5,143.5 1063,143.5 1047.5,143.5 831,143.5 831,12.5 823,12.5 " +
        "800,12.5 661,12.5 661,12.5 333,163.7 0,163.7 0,194.7 339.8,194.7 339.8,194.7 343,194.7 343,193.2 667.8,43.5 800,43.5 800,143.5 " +
        "800,174.5 831,174.5 1047.5,174.5 1047.5,317 1047.5,317 1047.5,348 1078.5,348 1194,348 1209.5,348 1225,348 1225,32.7 " +
        "1454.1,32.7 1298.4,176.7 1297.9,176.7 1297.9,207.7 1904,207.7 1904,176.7 1344,176.7 1499.8,32.7 1500.1,32.7 1500.1,1.7";

    var maze2String = "0,0 0,50 520,50 520,238 570,238 570,0 ";

    var game = new Phaser.Game(width, height, Phaser.CANVAS, 'stage', {
            preload: preload,
            create: create,
            update: update,
            render: render
        });

    function preload() {
        // Preload Sprites and other Assets
        game.load.image('hallway', 'assets/bg.jpg');
        game.load.spritesheet('creep', 'assets/creep.png', 260, 250, 6);
        game.load.spritesheet('player', 'assets/nerd.png', 200, 234, 9);
        // game.load.image('maze', 'assets/maze1.png');
    }

    var cursors;
    // Basically an initialization function
    function create() {
        game.physics.startSystem(Phaser.Physics.P2JS);

        // This sets the display order of the Groups
        stageGroupSetup();
        entityGroupSetup();
        guiGroupSetup();

        cursors = game.input.keyboard.createCursorKeys();
    }


    var backgroundMovementTriggerWidth;

    var mouseX, mouseY;
    var mousePositionText;
    function update() {
        if (gameState === "Menu") {
            showMenuScreen();
        } else if (gameState === "Playing") {
            showGameScreen();
        } else if (gameState === "GameOver") {
            showGameOverScreen();
        }
    }

    function render() {
        // game.debug.inputInfo(0, 500);
    }

    var guiGroup;
    var debugStats;
    function guiGroupSetup() {
        guiGroup = game.add.group();

        var debugText = "";
        var debugTextStyle = { font: "14pt Consolas", fill: "#00FF00", align: "left" };
        debugStats = game.add.text(50, 50, debugText, debugTextStyle);
        debugStats.anchor.set(0.5);
        guiGroup.add(debugStats);

    }

    var entityGroup;

    var creep;
    var cWalk;
    var cVel = 5;

    var player;
    var playerStartPosX = 600;
    var pVel = 35;
    function entityGroupSetup() {
        entityGroup = game.add.group();

        creep = game.add.sprite(0, 15, 'creep');
        creep.animations.add('walk', [0,1,2,3,4,5], 6, true);
        creep.scale.set(0.9);
        creep.y = hallway.height - creep.height;
        entityGroup.add(creep);

        player = game.add.sprite(playerStartPosX, 95, 'player');
        player.animations.add('walk', [0,1,2,3,4,5,6,7,8], 9, true);
        player.animations.add('idle', [0], 9, true);
        player.animations.play('idle');
        player.scale.set(0.75);
        player.y = hallway.height - player.height;
        backgroundMovementTriggerWidth = width * 0.75 - player.width;
        entityGroup.add(player);
    }

    function moveCreep() {
        // Simple Creep Movement from left to right
        // If the creep goes further then the screen is wide it will reset
        creep.x += cVel;
        if (creep.x > width - creep.width) {
            creep.x = 0;
        }
        creep.animations.play('walk');
    }

    var lastDirectionPressed;
    var playerLastMoved = 0;
    function movePlayer() {
        var doMove = false;
        // Movement for the player
        // When hitting left and right the player moves by pVel
        // It is only possible to use a key once, to reuse the key, the player has to hit the other key
        if (cursors.right.isDown && lastDirectionPressed !== "right" && !cursors.left.isDown) {
            lastDirectionPressed = "right";
            doMove = true;
        } else if (cursors.left.isDown && lastDirectionPressed !== "left" && !cursors.right.isDown) {
            lastDirectionPressed = "left";
            doMove = true;
        }

        if(doMove) {
            if (player.x <= backgroundMovementTriggerWidth) {
                player.x += pVel;
            } else {
                hallway.x -= pVel;
                hallway2.x -= pVel;
                creep.x -= cVel * 0.9;
                resetHallwayPosition(hallway, hallway2);
                resetHallwayPosition(hallway2, hallway);
            }
            playerLastMoved = game.time.totalElapsedSeconds();
            player.animations.play('walk');
        } else if(game.time.totalElapsedSeconds() - playerLastMoved > 0.25) {
            player.animations.play('idle');
        }
    }

    function killPlayer() {
        gameState = "GameOver";
    }

    var stageGroup;
    var hallway, hallway2;

    var maze;
    function stageGroupSetup() {
        stageGroup = game.add.group();
        // Two hallway sprites will be used to simulate endless walking
        // One will always be put behind the other.
        // So that, as the player is complete on the second one the first one will put behind the other
        hallway = game.add.sprite(0, 0, 'hallway');
        hallway2 = game.add.sprite(hallway.width, 0, 'hallway');
        stageGroup.add(hallway);
        stageGroup.add(hallway2);

        // maze = game.add.sprite(0, hallway.height, 'maze');
        // stageGroup.add(maze);
        var mazePolygonPoints = getMazePolygonPoints(maze1String);
        var mazePolyY = hallway.height;
        maze = game.add.graphics(0, mazePolyY);
        maze.scale.set(0.7);
        maze.beginFill(0xFFFFFF);
        maze.moveTo(0, 0);
        for (var i = 0; i < mazePolygonPoints.length; i++) {
            var x = mazePolygonPoints[i].x;
            var y = mazePolygonPoints[i].y;
            maze.lineTo(x, y);
        }
        maze.endFill();
    }

    function resetHallwayPosition(hallwayToReset, otherHallway) {
        if (hallwayToReset.x < -hallwayToReset.width) {
            hallwayToReset.x = otherHallway.width + otherHallway.x;
        }
    }

    function getMazePolygonPoints(svgMazePolygonPointsString) {
        var mazePolygonPoints = svgMazePolygonPointsString.split(" ");
        var phaserPoints = [];
        for (var i = 0; i < mazePolygonPoints.length; i++) {
            var point = mazePolygonPoints[i].split(",");
            var x = parseInt(point[0]);
            var y = parseInt(point[1]);
            phaserPoints.push(new Phaser.Point(x, y));
        }
        return phaserPoints;
    }


    function showMenuScreen() {
        // Create Menu here
    }

    function showGameScreen() {
        moveCreep();

        // Ich muss unterscheiden ob ich den Spieler bewege oder den Background
        // Je nach dem wo der Spieler ist in der World, bewegt sich erst der Spieler
        // Und danach nur noch der Background
        movePlayer();

        if (creep.x + creep.width - 100 >= player.x) {
            killPlayer();
        }

        // Mouse Cursor Stats
        mouseX = game.input.mousePointer.x;
        mouseY = game.input.mousePointer.y;
        mousePositionText = mouseX + "x" + mouseY;
        debugStats.text = mousePositionText;

        // Check Mouse Position
        // maze.inputEnabled = true;
        // maze.events.onInputOver.add(inBounds, this);
        // maze.events.onInputOut.add(outOffBounds, this);
    }

    function outOffBounds(item) {
        console.log("Off Bounds");
    }

    function inBounds(item) {
        console.log("In Bounds");
    }

    function showGameOverScreen() {
        // Create Game Over Screen here
        game.world.removeAll();
        var gameOverGroup = game.add.group();
        // var debugText = "";
        // var debugTextStyle = { font: "14pt Consolas", fill: "#00FF00", align: "left" };
        // debugStats = game.add.text(50, 50, debugText, debugTextStyle);
        // debugStats.anchor.set(0.5);
        var gameOverText = "-GAME OVER-";
        var gameOverTextStyle = { font: "80pt Arial", fill: "#FF0000", align: "center" };
        var gameOver = game.add.text(game.world.centerX, game.world.centerY, gameOverText, gameOverTextStyle);
        gameOver.anchor.set(0.5);
        gameOverGroup.add(gameOver);
    }
}