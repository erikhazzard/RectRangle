/* =========================================================================
 *
 * game.js
 *  This script contains the game logic acts as a controller for the Entity 
 *  Component System
 *
 * ========================================================================= */
;(function(){
    var $name = $('#player-name-wrapper');

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
        
        // game modes
        //  normal - default
        //  viceversa - white becomes black, vice versa
        //  NOT USED (yet)
        this.mode = 'normal';

        // players eaten each round
        this.playersEaten = [];

        // if another player dies outside of the game, we need to add that player
        // when the game starts
        this.entitiesToAdd = [];

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


    // --------------------------------------
    // handle multi-player death
    // --------------------------------------
    HUNGRYBOX.Game.prototype.handleMultiplayerDeath = function otherPlayerDied(message){
        var self = this;
        
        // called when another player dies
        BRAGI.log('game:handleMultiplayerDeath', 'other player died', {
            message: message
        });
        
        // add entity
        entity = new HUNGRYBOX.Entity();
        entity.score = message.score;

        entity.addComponent(new HUNGRYBOX.Components.Appearance({
            size: 40
        }));

        entity.addComponent(new HUNGRYBOX.Components.AppearanceImage({
            sprite: message.sprite || 'boxman1'
        }));

        entity.addComponent(new HUNGRYBOX.Components.OtherPlayer({
            playerName: message.player.name,
            isGood: message.player.isGood
        }));

        entity.addComponent(new HUNGRYBOX.Components.Position({
            x: message.position.x,
            y: message.position.y
        }));

        // % chance for decaying rects
        if(Math.random() < 0.8){
            entity.addComponent(new HUNGRYBOX.Components.Health() );
        }

        // NOTE: If we wanted some rects to not have collision, we could set it
        // here. Could provide other gameplay mechanics perhaps?
        entity.addComponent(new HUNGRYBOX.Components.Collision());

        // if the game is on the title screen or gameover screen, add the entity
        // when the game starts
        this.entitiesToAdd.push(entity);

        // If the game is running, add it directly to the entities array
        if(HUNGRYBOX.entities){
            HUNGRYBOX.entities[entity.id] = entity;
        } 
        return;
    };

    // ======================================
    //
    // STATE Transitions
    //
    // ======================================
    HUNGRYBOX.Game.prototype.toGame = function toGame(options){
        var self = this;
        options = options || {};

        $name.addClass('invisible');

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

        // if there are existing entities that need to be added
        // ----------------------------------
        var gameStartDate = new Date();
        _.each(this.entitiesToAdd, function(entity){
            entities[entity.id] = entity;
        });

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

    // --------------------------------------
    //
    // LOSE
    //
    // --------------------------------------
    HUNGRYBOX.Game.prototype.toGameOver = function endGame(){ 
        var self = this;
        this._running = false;
        // get rid of any box divs
        $('.new-box').remove();

        $name.removeClass('invisible');

        var deathPosition = HUNGRYBOX.PCEntity.components.position;

        // publish a message 
        HUNGRYBOX.PubNub.pub({
            type: 'death',
            player: HUNGRYBOX.player,
            sprite: HUNGRYBOX.PCEntity.components.appearanceImage.sprite,
            score: HUNGRYBOX.score,
            isGood: HUNGRYBOX.player.isGood,
            position: {
                x: deathPosition.x,
                y: deathPosition.y
            }
        });

        // change css / html states
        // ----------------------------------
        HUNGRYBOX.$canvasWrapper.removeClass('state-game state-title');
        HUNGRYBOX.$canvasWrapper.addClass('state-gameOver');

        //update local store
        // ----------------------------------
        if(HUNGRYBOX.score >= (HUNGRYBOX.highScore || 0)){
            HUNGRYBOX.highScore = HUNGRYBOX.score;  
            HUNGRYBOX.player.highScore = HUNGRYBOX.highScore;

            $('#high-score').removeClass('invisible');
            $('#high-score-value').html(HUNGRYBOX.player.highScore);
        }
        HUNGRYBOX.player.scores.push({
            score: HUNGRYBOX.score,
            date: new Date(),
            deathPosition: {x: deathPosition.x, y: deathPosition.y}
        });

        // sort the list by score, then make sure it's not too big
        HUNGRYBOX.player.scores = _.sortBy(HUNGRYBOX.player.scores, function(d){ 
            return -d.score; 
        });
        HUNGRYBOX.player.scores = HUNGRYBOX.player.scores.splice(0, 20);

        localforage.setItem('player', JSON.stringify(HUNGRYBOX.player));

        // Reset values
        // ----------------------------------
        HUNGRYBOX.score = 0;
        HUNGRYBOX.numPlayersEaten = 0;
        this.entitiesToAdd = [];
        this.playersEaten = [];

        //// TODO: if we have a gameover screen, show it
        //this.$gameOver.show();
        //this.$gameOver.velocity({opacity: 1});

        // show title
        this.$title.show();
        this.$title.velocity({opacity: 1});

        // get rid of all entities
        HUNGRYBOX.Entity.prototype._count = 0;
        delete HUNGRYBOX.entities; 
    };
})();
