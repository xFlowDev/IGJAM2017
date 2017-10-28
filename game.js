//Phaser Test
window.onload = function () {
    var documentElement = document.documentElement;
    var width = documentElement.clientWidth - 20;
    var height = documentElement.clientHeight - 20;
    var scaleFactor = 1;


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
        game.load.spritesheet('creep', 'assets/creep.png', 200, 192, 6);
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
        // Mouse Cursor Stats
        mouseX = game.input.mousePointer.x;
        mouseY = game.input.mousePointer.y;
        mousePositionText = mouseX + "x" + mouseY;
        debugStats.text = mousePositionText;
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
    var playerStartPosX = 450;
    var pVel = 10;
    function entityGroupSetup() {
        entityGroup = game.add.group();

        creep = game.add.sprite(0, 15, 'creep');
        creep.animations.add('walk');
        creep.animations.play('walk', cVel, true);
        entityGroup.add(creep);

        player = game.add.sprite(playerStartPosX, 95, 'player');
        player.animations.add('walk');
        player.animations.play('walk', pVel, true);
        entityGroup.add(player);
    }

    function moveCreep() {
        // Simple Creep Movement from left to right
        // If the creep goes further then the screen is wide it will reset
        creep.x += cVel;
        if (creep.x > width - creep.width) {
            creep.x = 0;
        }
    }

    var lastDirectionPressed;
    function movePlayer() {
        // Movement for the player
        // When hitting left and right the player moves by pVel
        // It is only possible to use a key once, to reuse the key, the player has to hit the other key
        if (cursors.right.isDown && lastDirectionPressed !== "right") {
            lastDirectionPressed = "right";
            player.x += pVel;
        } else if (cursors.left.isDown && lastDirectionPressed !== "left") {
            lastDirectionPressed = "left";
            player.x += pVel;
        }
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
            creep.x -= pVel / 2;
        } else if (cursors.left.isDown && lastDirectionPressed !== "left") {
            lastDirectionPressed = "left";
            hallway.x -= pVel;
            hallway2.x -= pVel;
            creep.x -= pVel * 0.7;            
        }
        resetHallwayPosition(hallway, hallway2);
        resetHallwayPosition(hallway2, hallway);

    }

    function resetHallwayPosition(hallwayToReset, otherHallway) {
        if (hallwayToReset.x < -hallwayToReset.width) {
            hallwayToReset.x = otherHallway.width + otherHallway.x;
        }
    }
}