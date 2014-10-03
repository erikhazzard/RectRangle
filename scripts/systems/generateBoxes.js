/* =========================================================================
 *
 * generateBoxes.js
 *  Generate some random boxes every once in a while
 *
 * ========================================================================= */
// Setup the system
// --------------------------------------
HUNGRYBOX.systems.GenerateBoxes = function systemGenerate () {
    return this;
};

HUNGRYBOX.systems.GenerateBoxes.prototype.run = function generateRun(entities) {
    // Generate a random box.
    
    // TODO: determine generation based on score and existing boxes
    
    
    // Randomize for now
    if(Math.random() < 0.15){
        // Don't add more entities if there are already too many
        if(Object.keys(HUNGRYBOX.entities).length < 40){

            var newEntity = new HUNGRYBOX.Assemblages.CollisionRect({   
                size: Math.random() * 20 | 0 
            });
            HUNGRYBOX.entities[newEntity.id] = newEntity;

            // add a % chance that they'll decay
            // TODO: can set size below by creating entity after conditional
            if(Math.random() < 0.3){
                newEntity.addComponent( new HUNGRYBOX.Components.Health(
                    Math.max(15, (20 + ((Math.random * 80) | 0)))
                ) );
            }

        }
    }
};
