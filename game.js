//Phaser Test
window.onload = function () {
    var game = new Phaser.Game("99%", "99%",
        Phaser.AUTO, '',
        {
            preload: preload,
            create: create,
            update: update
        });

    function preload() {
        // Preload Sprites and other Assets
        
        // [TODO] Start Positionen noch anpassen
        game.load.image('ground', 'assets/ground.png');
        game.load.spritesheet('creep', 'assets/creep.png', 350, 350);
        
    }


    // I have to declare these objects so I can use them in the update function
    var ground;
    var creep;
    var cursors;
    // Basically an initialization function
    function create() {
        game.stage.backgroundColor = 0xFFFFFF;

        ground = game.add.sprite(0, 400, 'ground');

        creep = game.add.sprite(0, 0, 'creep');
        creep.animations.add('right', [0, 1, 2, 3, 4, 5], 10, true);

        cursors = game.input.keyboard.createCursorKeys();
    }


    var cVel = 10;
    function update() {
        // Scale the game to always fit the Screen
        var documentElement = document.documentElement;
        var width = documentElement.clientWidth - 20;
        var height = documentElement.clientHeight - 20;
        game.scale.setGameSize(width, height);

        // Simple Creep Movement from left to right
        // If the creep goes further then the screen is wide it will reset

        creep.x += cVel;
        if(creep.x > width - creep.width){
            creep.x = 0;
        }
    }

}