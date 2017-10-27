// // var game = game || {};
// game = {
//     //Class Variables

//     isRunning: true,
//     // To Stop the interval
//     intervalId: 0,
//     i: 0,


//     // Functions 
//     start: function () {
//         canvas = document.getElementById("game");
//         canvasContext = canvas.getContext("2d");
//         if(this.isRunning){
//             this.intervallId = setInterval(this.update, 1000 / 60);
//             console.log(this.intervalId);
//         }
//     },
//     update: function () {
//         console.log("");
//     },
//     stop: function() {
//         clearInterval(this.intervalId);
//         this.isRunning = false;
//     }
// }
// window.onload = game.start();

//Phaser Test

window.onload = function () {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create});

    function preload(){
        // Sachen die vorgeladen werden sollen
    }

    function create(){
    }

}