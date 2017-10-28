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
        game.load.image('ground', 'assets/ground.png');
        game.load.spritesheet('creep', 'assets/creep.png', 350, 350, 6);

        // game.load.spritesheet('player', 'assets/player.png', x, y);
        // game.load.image('circuit', 'assets/circuit_board.png');
        // game.load.image('background', 'assets/background.png');
    }


    // I have to declare these objects so I can use them in the update function
    var stageGroup;
    var ground;

    var entityGroup;
    var creep;
    var cWalk;
    var player;

    var guiGroup;
    var debugStats;

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

    var cVel = 10;

    var mouseX, mouseY;
    var mousePositionText;
    function update() {
        // Scale the game to always fit the Screen
        width = documentElement.clientWidth - 20;
        height = documentElement.clientHeight - 20;
        game.scale.setGameSize(width, height);

        // Simple Creep Movement from left to right
        // If the creep goes further then the screen is wide it will reset
        // creep.x += cVel;
        // if (creep.x > width - creep.width) {
        //     creep.x = 0;
        // }

        // Mouse Cursor Stats
        mouseX = game.input.mousePointer.x;
        mouseY = game.input.mousePointer.y;
        mousePositionText = mouseX + "x" + mouseY;
        debugStats.text = mousePositionText;
    }

    function render() {
        // game.debug.inputInfo(0, 500);
    }

    function guiGroupSetup() {
        guiGroup = game.add.group();

        var debugText = "";
        var debugTextStyle = { font: "14pt Consolas", fill: "#00FF00", align: "left" };
        debugStats = game.add.text(50, 50, debugText, debugTextStyle);
        debugStats.anchor.set(0.5);
        guiGroup.add(debugStats);

    }

    function entityGroupSetup(){
        entityGroup = game.add.group();

        creep = game.add.sprite(0, 0, 'creep');
        creep.animations.add('walk');
        creep.animations.play('walk', 10, true);
        entityGroup.add(creep);
    }

    function stageGroupSetup(){
        stageGroup = game.add.group();

        ground = game.add.sprite(0, 400, 'ground');
        stageGroup.add(ground);
    }

    function configGroupSetup(){
        configGroup = game.add.group();
        
    }
}