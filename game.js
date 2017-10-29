window.onload = function () {
    var width = 1280;
    var height = 720;

    var gameState = "Menu";

    var maze1String = "1904,215 1050,215 900,63 0,63 0,134 858,134 1011,286 1904,286";
    var maze2String = "1904,71 1904,0 1004,0 859.5,126.6 0,126.6 0,207.6 858.1,207.6 1005.3,350 1904,350 1904,279 1079.9,279 974.5,171.9 1075.9,71";
    var maze3String = "1194,0 1194,275.3 1118.5,275.3 1118.5,141.8 871,141.8 871,10.8 661,10.8 333,162 0,162 0,233 343,233 667.8,81.8 800,81.8 800,212.8 1047.5,212.8 1047.5,346.3 1265,346.3 1265,71 1414,71 1414,105 1298.4,215 1297.9,215 1297.9,286 1904,286 1904,215 1404,215 1560.1,71 1560.1,0"


    var game = new Phaser.Game(width, height, Phaser.CANVAS, 'stage', {
        preload: preload,
        create: create,
        update: update,
        render: render
    });

    function preload() {
        // Preload Sprites and other Assets
        game.load.image('startScreen', 'assets/start-screen.jpg');

        game.load.image('hallway', 'assets/bg.jpg');
        game.load.spritesheet('creep', 'assets/creep.png', 260, 250, 6);
        game.load.spritesheet('player', 'assets/nerd.png', 200, 234, 9);
        game.load.image('cables', 'assets/cables.png');

        game.load.audio('mainTheme', ['assets/main-theme.mp3', 'assets/main-theme.ogg']);
        game.load.audio('monsterLaugh', ['assets/monster-laugh.mp3', 'assets/monster-laugh.ogg']);
    }

    var cursors;    

    // Basically an initialization function
    function create() {
        if (gameState === "Menu") {
        menuGroupSetup();
        } else if (gameState === "Playing") {
        stageGroupSetup();
        entityGroupSetup();
        guiGroupSetup();
        } else if (gameState === "GameOver") {
        } else if (gameState === "Win") {
        }


        cursors = game.input.keyboard.createCursorKeys();
    }


    var backgroundMovementTriggerWidth;

    var mouseX, mouseY;
    var mousePositionText;
    var gameTime = 0;
    var startTime;
    var timeElapsed;

    function update() {
        if (gameState === "Menu") {
            showMenuScreen();
        } else if (gameState === "Playing") {
            showGameScreen();
        } else if (gameState === "GameOver") {
            showGameOverScreen();
        } else if (gameState === "Win") {
            showWinScreen();
        }
    }

    function render() {
    }

    var menuGroup;
    var startScreen;
    var startButton;
    function menuGroupSetup() {
        menuGroup = game.add.group();
        startScreen = game.add.sprite(0, 0, 'startScreen');
        startScreen.width = width;
        startScreen.height = height;
        menuGroup.add(startScreen);
    }

    var guiGroup;
    var debugStats;
    var time;
    function guiGroupSetup() {
        guiGroup = game.add.group();

        var debugText = "";
        var debugTextStyle = { font: "14pt Consolas", fill: "#00FF00", align: "left" };
        debugStats = game.add.text(50, 450, debugText, debugTextStyle);
        debugStats.anchor.set(0.5);
        guiGroup.add(debugStats);

        var timeText = 0;
        var timeTextStyle = { font: "18pt Arial", fill: "#00FF00", align: "left" };
        time = game.add.text(50, 50, timeText, timeTextStyle);
        time.anchor.set(0.5);
        guiGroup.add(time);

        var bmd = game.add.bitmapData(width, height);
        bmd.ctx.beginPath();
        bmd.ctx.rect(0, 0, width, height);
        bmd.ctx.fillStyle = '#000000';
        bmd.ctx.fill();
        overlay = game.add.sprite(0, 0, bmd);
        overlay.alpha = 0.75;
    }

    var entityGroup;

    var creep;
    var cVel = 5;

    var player;
    var playerStartPosX = 600;
    var pVel = 35;

    function entityGroupSetup() {
        entityGroup = game.add.group();

        creep = game.add.sprite(-250, 15, 'creep');
        creep.animations.add('walk', [0, 1, 2, 3, 4, 5], 6, true);
        creep.scale.set(0.9);
        creep.y = hallway.height - creep.height;
        entityGroup.add(creep);

        player = game.add.sprite(playerStartPosX, 95, 'player');
        player.animations.add('walk', [0, 1, 2, 3, 4, 5, 6, 7, 8], 9, true);
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

        if (doMove) {
            if (player.x <= backgroundMovementTriggerWidth) {
                player.x += pVel;
            } else {
                hallway.x -= pVel;
                hallway2.x -= pVel;
                cables.x -= pVel * 1.5;
                creep.x -= cVel * 6;
                resetHallwayPosition(hallway, hallway2);
                resetHallwayPosition(hallway2, hallway);
            }
            playerLastMoved = game.time.totalElapsedSeconds();
            player.animations.play('walk');
        } else if (game.time.totalElapsedSeconds() - playerLastMoved > 0.25) {
            player.animations.play('idle');
        }
    }

    var stageGroup;
    var hallway, hallway2, cables, maze, mouseLine;
    var mazePolygon;
    var monsterLaugh, mainTheme;
    var introPlayed;
    var overlay;
    function stageGroupSetup() {
        stageGroup = game.add.group();
        // Two hallway sprites will be used to simulate endless walking
        // One will always be put behind the other.
        // So that, as the player is complete on the second one the first one will put behind the other
        hallway = game.add.sprite(0, 0, 'hallway');
        hallway2 = game.add.sprite(hallway.width, 0, 'hallway');
        cables = game.add.sprite(0, 0, 'cables');
        stageGroup.add(hallway);
        stageGroup.add(hallway2);
        stageGroup.add(cables);

        // Stage Config
        // var mazePolygonPoints = getMazePolygonPoints(maze1String);
        var mazePolygonPoints = getMazePolygonPoints(maze3String);
        mazePolygon = new Phaser.Polygon(mazePolygonPoints);
        mazePolygon.flatten();
        var mazePolyY = hallway.height;
        maze = game.add.graphics(0, mazePolyY);
        maze.scale.set(0.7);
        maze.beginFill(0xFFFFFF);
        maze.drawPolygon(mazePolygon.points);
        maze.endFill();

        mouseLine = game.make.bitmapData(width, height - mazePolyY);
        mouseLine.addToWorld(maze.x, maze.y);
        mouseLine.ctx.beginPath();
        mouseLine.ctx.lineWidth = 2;
        mouseLine.ctx.strokeStyle = 'red';
        var mouseOnMazePos = worldPosToMazePos(game.input);
        mouseLine.ctx.moveTo(mouseOnMazePos.x, mouseOnMazePos.y);
        game.input.addMoveCallback(drawOnMouseMove);

        monsterLaugh = game.add.audio('monsterLaugh');
        mainTheme = game.add.audio('mainTheme');

        game.sound.setDecodedCallback([ monsterLaugh, mainTheme ], playIntro);
    }

    function playIntro() {
        monsterLaugh.play();
        mainTheme.play();
        game.add.tween(overlay).to( { alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 1500, 0, false);
        setTimeout(function() {
            introPlayed = true;
        }, 2000);
    }

    function isPlayable() {
        return (gameState === 'Playing' && mazeStarted && introPlayed);
    }

    function drawOnMouseMove() {
        if(isPlayable()) {
            var mouseOnMazePos = worldPosToMazePos(game.input);
            mouseLine.ctx.lineTo(mouseOnMazePos.x, mouseOnMazePos.y);
            mouseLine.ctx.stroke();
        }
    }

    function worldPosToMazePos(pos, scaled) {
        scaled = scaled || false;
        return {
            x: (pos.x - maze.x) * (scaled ? 1 / maze.scale.x : 1),
            y: (pos.y - maze.y) * (scaled ? 1 / maze.scale.y : 1)
        };
    }

    function resetHallwayPosition(hallwayToReset, otherHallway) {
        if (hallwayToReset.x < -hallwayToReset.width) {
            hallwayToReset.x = otherHallway.width + otherHallway.x;
        }
        if (cables.x < ((cables.width + (0.25 * cables.width)) * -1)) {
            cables.x = width + (0.25 * cables.width);
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
        // if()
    }

    var mazeStarted = false;
    function showGameScreen() {
        gameTime += game.time.elapsed / 1000;

        if (creep.x + creep.width - 100 >= player.x) {
            gameOver();
        }

        // Mouse Cursor Stats
        mouseX = game.input.mousePointer.x;
        mouseY = game.input.mousePointer.y;
        mousePositionText = mouseX + "x" + mouseY;
        debugStats.text = mousePositionText;
        var mouseOnMazePos = worldPosToMazePos(game.input);
        var mouseOnMazePolyPos = worldPosToMazePos(game.input, true);

        // Check Mouse Position
        if (mazePolygon.contains(mouseOnMazePolyPos.x, mouseOnMazePolyPos.y) && mouseX <= 30) {
            if (!mazeStarted) {
                mouseLine.ctx.moveTo(mouseOnMazePos.x, mouseOnMazePos.y);
            }
            mazeStarted = true;
            startTime = gameTime;
        }

        if (isPlayable()) {
            timeElapsed = gameTime - startTime;
            time.text = timeElapsed.toFixed(2).toString();
            moveCreep();
            movePlayer();
            if (!mazePolygon.contains(mouseOnMazePolyPos.x, mouseOnMazePolyPos.y)) {
                mazeStarted = false;
                gameOver();
            }
            if (mouseX > width - 30 && mouseY > hallway.height) {
                mazeStarted = false;
                win();
            }
        }


    }

    function gameOver() {
        game.input.deleteMoveCallback(drawOnMouseMove);
        mouseLine.ctx.closePath();

        timeElapsed = gameTime - startTime;
        mainTheme.stop();

        gameState = "GameOver";
    }

    function win() {
        timeElapsed = gameTime - startTime;
        gameState = "Win";
    }

    function getTextForElapsedTime(){
        var timeText = timeElapsed.toFixed(2).toString();
        var timeTextStyle = { font: "54pt Arial", fill: "#00FF00", align: "center" };
        var time = game.add.text(game.world.centerX, game.world.centerY + 100, timeText, timeTextStyle);
        time.anchor.set(0.5);
        return time;
    }

    function showGameOverScreen() {
        // Create Game Over Screen here
        game.world.removeAll();
        var gameOverGroup = game.add.group();

        var gameOverText = "-GAME OVER-";
        var gameOverTextStyle = { font: "80pt Arial", fill: "#FF0000", align: "center" };
        var gameOver = game.add.text(game.world.centerX, game.world.centerY, gameOverText, gameOverTextStyle);
        gameOver.anchor.set(0.5);
        gameOverGroup.add(gameOver);
        var gameOverTime = getTextForElapsedTime();
        gameOverGroup.add(gameOverTime);

        // Add a retry Button
    }

    function showWinScreen() {
        game.world.removeAll();
        var gameWinGroup = game.add.group();
        var gameWinText = "-YOU WIN-";
        var gameWinTextStyle = { font: "80pt Arial", fill: "#FF0000", align: "center" };
        var winScreen = game.add.text(game.world.centerX, game.world.centerY, gameWinText, gameWinTextStyle);
        winScreen.anchor.set(0.5);
        gameWinGroup.add(winScreen);
        var gameWinTime = getTextForElapsedTime();
        gameWinGroup.add(gameWinTime);
    }
}
