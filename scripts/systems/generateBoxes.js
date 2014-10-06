/* =========================================================================
 *
 * generateBoxes.js
 *  Generate some random boxes every once in a while
 *
 * ========================================================================= */
// Setup the system
// --------------------------------------
HUNGRYBOX.systems.GenerateBoxes = function systemGenerate () {
    // number of boxes generated when the player has very low health
    this.numGeneratedForLowHealth = 0;

    return this;
};

HUNGRYBOX.systems.GenerateBoxes.prototype.generateBox = function generateBox(options){
    // Generate a box either randomly or based on passed params
    options = options || {};

    if(Object.keys(HUNGRYBOX.entities).length > 80){
        // Don't generate if there's too many
        return;
    }

    // Config based on health
    // ----------------------------------
    // most will decay by default
    var decayChance = 0.1;
    var size = 8;

    // depending on health, maybe not.
    if(HUNGRYBOX.score < 10){
        decayChance = 0.3;
        size = Math.random() * 20 | 0;

    } else if(HUNGRYBOX.score < 30){
        decayChance = 0.9;
        size = Math.random() * 28 | 0;

    } else if(HUNGRYBOX.score < 50){
        decayChance = 0.75;
        size = Math.random() * 38 | 0;

    } else if(HUNGRYBOX.score < 100){
        decayChance = 0.5;
        size = Math.random() * 55 | 0;

    } else if(HUNGRYBOX.score < 250){
        decayChance = 0.3;
        size = Math.random() * 85 | 0;

    } else if(HUNGRYBOX.score < 500){
        decayChance = 0.1;
        size = Math.random() * 135 | 0;

    }

    // decay chance might be 0, so explicitly check for undefined
    decayChance = options.decayChance !== undefined ? options.decayChance : decayChance;

    // allow size to be passed in
    size = options.size !== undefined ? options.size : size;

    var newEntity = new HUNGRYBOX.Assemblages.CollisionRect({   
        size: size
    });
    HUNGRYBOX.entities[newEntity.id] = newEntity;

    // add a % chance that they'll decay
    // TODO: can set size below by creating entity after conditional
    if(Math.random() < decayChance){
        newEntity.addComponent( new HUNGRYBOX.Components.Health(
            size
        ) );
    }

    // if size is really big, generate another small one somewhere
    if(size > 25){
        this.generateBox({ size: Math.random() * 10, decayChance: 0.8 });
    }
};

HUNGRYBOX.systems.GenerateBoxes.prototype.run = function generateRun(entities) {
    // Generate a random box.
    var self = this;
    
    // TODO: determine generation based on score and existing boxes

    // if the player's health is really low, generate a white dot for them
    if(HUNGRYBOX.PCEntity.components.health.value < 20){
        if(this.numGeneratedForLowHealth < 3){
            this.generateBox();
            this.numGeneratedForLowHealth++;
        }
    } else {
        this.numGeneratedForLowHealth = 0;
    }
    
    // Randomize for now
    if(Math.random() < 0.15){
        // Don't add more entities if there are already too many
        if(Object.keys(HUNGRYBOX.entities).length < 60){
            self.generateBox();
        }
    }
};
