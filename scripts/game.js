/* =========================================================================
 *
 * game.js
 *  This script contains the game logic acts as a controller for the Entity 
 *  Component System
 *
 * ========================================================================= */
HUNGRYBOX.Game = function Game (){
    // This is our "main" function which controls everything. We setup the 
    // systems to loop over, setup entities, and setup and kick off the game
    // loop.
    var self = this;

    // store and track mouse position
    this.mousePosition = {
        x: 300,
        y: 200
    };

    this.state = 'title';

    // setup elements
    this.$title = $('#game-title');
    this.$gameOver = $('#game-over');

    this.$startGameButton = $('#start-game');

    // transition to game when start button is clicked
    this.$startGameButton.click(function(e){
        var bound = HUNGRYBOX.$canvasWrapper[0].getBoundingClientRect();

        var x = e.clientX - bound.left;
        var y = e.clientY - bound.top;

        // Start the game
        if(self.state !== 'game'){
            requestAnimationFrame(function(){
                self.toGame({ startPosition: {x: x, y: y} });
            });
        }
    });

    HUNGRYBOX.$canvasWrapper.addClass('state-title');

    return this;
};

// ======================================
// util
// ======================================
HUNGRYBOX.Game.prototype.getPositionAvoidStart = function(startPosition){
    var targetX, targetY;
    var x = startPosition.x;
    var y = startPosition.y;

    var foundX = false;
    var foundY = false;
    
    var avoidFactor = 120;

    while(!foundX && !foundY){
        // generate x / y and avoid center
        if(!foundX){
            targetX = HUNGRYBOX.Components.Position.prototype.generateX();
            if(targetX < (x - avoidFactor) || targetX > ( x + avoidFactor)){
                foundX = true;
            }
        }
        if(!foundY){
            targetY = HUNGRYBOX.Components.Position.prototype.generateY();
            if(targetY < (y - avoidFactor) || targetY > ( y + avoidFactor)){
                foundY = true;
            }
        }
    }
    
    return {x: targetX, y: targetY};
};

// ======================================
//
// STATE Transitions
//
// ======================================
HUNGRYBOX.Game.prototype.toGame = function toGame(options){
    var self = this;
    options = options || {};

    // start position is where the user clicked start
    var startPosition = options.startPosition;

    this.mousePosition.x = startPosition.x;
    this.mousePosition.y = startPosition.y;

    // setup elements
    HUNGRYBOX.$score.html(0);
    HUNGRYBOX.$canvasWrapper.removeClass('state-title state-gameOver');
    HUNGRYBOX.$canvasWrapper.addClass('state-game');

    // Hide non game elements
    requestAnimationFrame(function(){
        self.$title.velocity({opacity: 0}, {
            duration: 200,
            complete: function(){
                self.$title.hide();
            }
        });

        self.$gameOver.velocity({opacity: 0}, {
            duration: 200,
            complete: function(){
                self.$gameOver.hide();
            }
        });
    });

    // Create some entities
    // ----------------------------------
    var entities = {}; // object containing { id: entity  }
    var entity;

    // Create a bunch of random entities
    for(var i=0; i < 20; i++){
        entity = new HUNGRYBOX.Entity();
        entity.addComponent(new HUNGRYBOX.Components.Appearance());
        entity.addComponent(new HUNGRYBOX.Components.Position(
            self.getPositionAvoidStart(startPosition)
        ));

        // % chance for decaying rects
        if(Math.random() < 0.8){
            entity.addComponent(new HUNGRYBOX.Components.Health() );
        }

        // NOTE: If we wanted some rects to not have collision, we could set it
        // here. Could provide other gameplay mechanics perhaps?
        entity.addComponent(new HUNGRYBOX.Components.Collision());

        entities[entity.id] = entity;
    }

    // PLAYER entity
    // ----------------------------------
    // Make the last entity the "PC" entity - it must be player controlled,
    // have health and collision components
    entity = new HUNGRYBOX.Entity();
    entity.addComponent(new HUNGRYBOX.Components.Appearance());
    entity.addComponent(new HUNGRYBOX.Components.AppearanceImage());
    entity.addComponent(new HUNGRYBOX.Components.Position(startPosition));
    entity.addComponent(new HUNGRYBOX.Components.PlayerControlled() );
    entity.addComponent(new HUNGRYBOX.Components.Health() );
    entity.addComponent(new HUNGRYBOX.Components.Collision() );

    // we can also edit any component, as it's just data
    entities[entity.id] = entity;

    // store a ref to the player entity (there's only ever one)
    HUNGRYBOX.PCEntity = entity;

    // store reference to entities
    HUNGRYBOX.entities = entities;

    // Setup systems
    // ----------------------------------
    // Setup the array of systems. The order of the systems is likely critical, 
    // so ensure the systems are iterated in the right order
    var systems = [
        new HUNGRYBOX.systems.GenerateBoxes(),
        new HUNGRYBOX.systems.UserInput(),
        new HUNGRYBOX.systems.Collision(),
        new HUNGRYBOX.systems.Decay(), 
        new HUNGRYBOX.systems.Render()
    ];
    
    // Game loop
    // ----------------------------------
    function gameLoop (){
        // Simple game loop
        for(var i=0,len=systems.length; i < len; i++){
            // Call the system and pass in entities
            // NOTE: One optimal solution would be to only pass in entities
            // that have the relevant components for the system, instead of 
            // forcing the system to iterate over all entities
            systems[i].run(HUNGRYBOX.entities);
        }

        // Run through the systems. 
        // continue the loop
        if(self._running !== false){
            requestAnimationFrame(gameLoop);
        } else {
            HUNGRYBOX.util.clearCanvas();
        }
    }
    // Kick off the game loop
    requestAnimationFrame(gameLoop);

    // Lose condition
    // ----------------------------------
    this._running = true; // is the game going?
};

HUNGRYBOX.Game.prototype.toGameOver = function endGame(){ 
    var self = this;

    this._running = false;

    $('.new-box').remove();

    HUNGRYBOX.$canvasWrapper.removeClass('state-game state-title');
    HUNGRYBOX.$canvasWrapper.addClass('state-gameOver');

    HUNGRYBOX.score = 0;

    //// have gameover?
    //this.$gameOver.show();
    //this.$gameOver.velocity({opacity: 1});

    this.$title.show();
    this.$title.velocity({opacity: 1});

    // get rid of all entities
    HUNGRYBOX.Entity.prototype._count = 0;
    HUNGRYBOX.entities = {};
};
