/**
 * Draws the UI elements such as the life bar and money display.
 * This function is responsible for rendering the visual components
 * of the user interface to provide feedback to the player.
 */
function UI(){
    this.health_bar = new health_bar();
    this.money_display = new money_display();

};

UI.prototype.draw = function(){
    this.health_bar.draw();
    this.money_display.draw();
};

function health_bar(){
    this.health = 100;
    this.max_health = 100;
    this.width = 100;
    this.height = 20;
}

health_bar.prototype.draw = function(){
    // Get canvas object, then its context
    var canvas = document.getElementById("game-layer");
    var context = canvas.getContext("2d");
    
    // Draw the rectangle
    context.fillStyle = "red";
    context.fillRect(0, 0, this.health, this.height);
}

function money_display(){
    this.money = 0;
    this.width = 100;
    this.height = 20;
}

money_display.prototype.draw = function(){
    // Get canvas object, then its context
    var canvas = document.getElementById("game-layer");
    var context = canvas.getContext("2d");
    
    // Draw the rectangle
    context.fillStyle = "green";
    context.fillRect(0, 20, this.width, this.height);
}