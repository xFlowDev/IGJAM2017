//Phaser Test
window.onload = function () {
    var documentElement = document.documentElement;
    var width = documentElement.clientWidth - 20;
    var height = documentElement.clientHeight - 20;
    var scaleFactor = 1;

    var gameState = "Playing";

    var game = new Phaser.Game(width, height,
        Phaser.AUTO, '',
        {
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
        game.load.image('poster', 'assets/sign1.png');

        // game.load.spritesheet('player', 'assets/player.png', x, y);
        // game.load.image('circuit', 'assets/circuit_board.png');
        // game.load.image('background', 'assets/background.png');

    }

    var cursors;
    // Basically an initialization function
    function create() {
        game.stage.backgroundColor = 0xFFFFFF;

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
        }
        else if (gameState === "Playing") {
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
        creep.animations.add('walk');
        creep.scale.set(0.9);
        creep.y = hallway.height - creep.height;
        entityGroup.add(creep);

        player = game.add.sprite(playerStartPosX, 95, 'player');
        player.animations.add('walk');
        player.animations.play('walk', 7, true)
        player.scale.set(0.75);
        player.y = hallway.height - player.height;
        entityGroup.add(player);
    }

    function moveCreep() {
        // Simple Creep Movement from left to right
        // If the creep goes further then the screen is wide it will reset
        creep.x += cVel;
        if (creep.x > width - creep.width) {
            creep.x = 0;
        }
        creep.animations.play('walk', cVel, true);
    }

    var lastDirectionPressed;
    function movePlayer() {
        // Movement for the player
        // When hitting left and right the player moves by pVel
        // It is only possible to use a key once, to reuse the key, the player has to hit the other key
        if (cursors.right.isDown && lastDirectionPressed !== "right") {
            player.x += pVel;
            lastDirectionPressed = "right";
        } else if (cursors.left.isDown && lastDirectionPressed !== "left") {
            player.x += pVel;
            lastDirectionPressed = "left";
        }
    }

    function killPlayer() {
        // player.animations.play('die', 10, true);
        gameState = "GameOver";
    }

    var stageGroup;
    var hallway, hallway2;
    function stageGroupSetup() {
        stageGroup = game.add.group();
        // Two hallway sprites will be used to simulate endless walking
        // One will always be put behind the other.
        // So that, as the player is complete on the second one the first one will put behind the other
        hallway = game.add.sprite(0, 0, 'hallway');
        hallway2 = game.add.sprite(hallway.width, 0, 'hallway');
        stageGroup.add(hallway);
        stageGroup.add(hallway2);
        backgroundMovementTriggerWidth = hallway.width * 0.6;
    }

    function moveBackground() {
        if (cursors.right.isDown && lastDirectionPressed !== "right") {
            lastDirectionPressed = "right";
            hallway.x -= pVel;
            hallway2.x -= pVel;
            creep.x -= pVel * 0.9;
        } else if (cursors.left.isDown && lastDirectionPressed !== "left") {
            lastDirectionPressed = "left";
            hallway.x -= pVel;
            hallway2.x -= pVel;
            creep.x -= pVel * 0.9;
        }
        resetHallwayPosition(hallway, hallway2);
        resetHallwayPosition(hallway2, hallway);

    }

    function resetHallwayPosition(hallwayToReset, otherHallway) {
        if (hallwayToReset.x < -hallwayToReset.width) {
            hallwayToReset.x = otherHallway.width + otherHallway.x;
        }
    }

    function showMenuScreen() {
        // Create Menu here
    }

    function showGameScreen() {
        // Scale the game to always fit the Screen
        width = documentElement.clientWidth - 20;
        height = documentElement.clientHeight - 20;
        game.scale.setGameSize(width, height);

        moveCreep();

        // Ich muss unterscheiden ob ich den Spieler bewege oder den Background
        // Je nach dem wo der Spieler ist in der World, bewegt sich erst der Spieler
        // Und danach nur noch der Background
        if (player.x <= backgroundMovementTriggerWidth) {
            movePlayer();
        } else {
            moveBackground();
        }

        if (creep.x + creep.width - 20 >= player.x) {
            killPlayer();
        }


        // Mouse Cursor Stats
        mouseX = game.input.mousePointer.x;
        mouseY = game.input.mousePointer.y;
        mousePositionText = mouseX + "x" + mouseY;
        debugStats.text = mousePositionText;
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
        var gameOverTextStyle = { font: "60pt Arial", fill: "#FF0000", align: "center" };
        var gameOver = game.add.text(game.world.centerX, game.world.centerY, gameOverText, gameOverTextStyle);
        gameOver.anchor.set(0.5);
        gameOverGroup.add(gameOver);
    }
}