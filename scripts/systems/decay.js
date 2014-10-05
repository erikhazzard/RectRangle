/* =========================================================================
 *
 * decay.js
 *  This system "decays" entities that have a health component. Each tick
 *  decreases the size and health slightly
 *
 *  This is where a lot of the core gameplay experience comes from. Too slow,
 *  the game is too easy. If it decays to fast, the game isn't so fun.
 *
 * ========================================================================= */
// Setup the system
// --------------------------------------
HUNGRYBOX.systems.Decay = function systemDecay () {
    return this;
};

HUNGRYBOX.systems.Decay.prototype.run = function decayRun(entities) {
    // Here, we've implemented systems as functions which take in an array of
    // entities. An optimization would be to have some layer which only 
    // feeds in relevant entities to the system, but for demo purposes we'll
    // assume all entities are passed in and iterate over them.
    var curEntity; 

    // how much to modify decay values by. NOTE: Be sure to use very small
    // changes here, it will greatly impact play
    var decayModifier = 1;
    var date = new Date();

    // iterate over all entities
    for( var entityId in entities ){
        curEntity = entities[entityId];

        // First, check if the entity is dead
        if(curEntity.components.playerControlled){
            if(curEntity.components.health.value < 0){
                // Dead! End game if player controlled
                console.log('Game over! Player died because they ran out of health');
                HUNGRYBOX.game.toGameOver();
                return false;
            }
        }

        // if the entity has no health, it's been around for a very long time, 
        // and it's not the player, then give it health so it decayse
        if(!curEntity.components.playerControlled &&
        date - curEntity.generationDate > 3000 &&
        !curEntity.components.health){

            curEntity.addComponent( new HUNGRYBOX.Components.Health(
                curEntity.components.appearance.size
            ) );
        }

        // Only run logic if entity has relevant components
        if( curEntity.components.health ){

            // Decrease health depending on current health
            // --------------------------
            // Here's where we configure how fun the game is
            if(curEntity.components.health.value < 0.7){
                curEntity.components.health.value -= 0.007 * decayModifier;

            } else if(curEntity.components.health.value < 2){
                curEntity.components.health.value -= 0.028 * decayModifier;

            } else if(curEntity.components.health.value < 10){
                curEntity.components.health.value -= 0.07 * decayModifier;

            } else if(curEntity.components.health.value < 20){
                curEntity.components.health.value -= 0.15 * decayModifier;

            } else if(curEntity.components.health.value < 40){
                // If the square is huge, it should very quickly decay
                if(curEntity.components.playerControlled){
                    curEntity.components.health.value -= 1.1 * decayModifier;
                } else {
                    curEntity.components.health.value -= 0.3 * decayModifier;
                }
            } else {
                // If the square is huge, it should very quickly decay
                if(curEntity.components.playerControlled){
                    curEntity.components.health.value -= 5.1 * decayModifier;
                } else {
                    curEntity.components.health.value -= 0.5 * decayModifier;
                }
            }

            // Check for alive / dead
            // --------------------------
            if(curEntity.components.health.value >= 0){

                // Set style based on other components too - player controlled 
                // entity should be style differently based on their health
                //
                // Update appearance based on health
                // TODO: change size / appearance of rect guy
                if(curEntity.components.playerControlled){ 
                    if(curEntity.components.health.value > 10){
                    } else {
                    } 
                }

                // Entity is still ALIVE
                // Update size in appearance
                if(curEntity.components.appearance &&
                curEntity.components.appearance.size){
                    curEntity.components.appearance.size = curEntity.components.health.value;
                }
                if(curEntity.components.appearanceImage &&
                curEntity.components.appearanceImage.size){
                    curEntity.components.appearanceImage.size = curEntity.components.health.value;
                }

                // TOO BIG DETECTION
                if(curEntity.components.playerControlled){
                    if(curEntity.components.health.value > 100){
                        curEntity.components.health.value = 40;
                    }
                }

            } else {

                //Entity is DEAD
                if(curEntity.components.playerControlled){

                    // Dead! End game if player controlled
                    HUNGRYBOX.game.toGameOver();
                } else {
                    // otherwise, remove the entity
                    delete entities[entityId];
                }
            }
        }
    }
};
