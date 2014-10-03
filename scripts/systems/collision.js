/* =========================================================================
 *
 * collision.js
 *   This system checks to see if a usermovable entity is colliding with any
 *   other entities that have a collision component
 *
 * ========================================================================= */
// Collision system
// --------------------------------------
HUNGRYBOX.systems.Collision = function systemCollision () {
    // Basic collision detection for rectangle intersection (NOTE: again, this would
    // live inside the system itself) 
    return this;
};

HUNGRYBOX.systems.Collision.prototype.doesIntersect = function doesIntersect(obj1, obj2) {
    // Takes in two objects with position and size properties
    //  obj1: player controlled position and size
    //  obj2: object to check
    //
    var rect1 = {
        x: obj1.position.x - obj1.size,
        y: obj1.position.y - obj1.size,
        height: obj1.size * 2,
        width: obj1.size * 2
    };
    var rect2 = {
        x: obj2.position.x - obj2.size,
        y: obj2.position.y - obj2.size,
        height: obj2.size * 2,
        width: obj2.size * 2
    };

    return (rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.height + rect1.y > rect2.y);
};

HUNGRYBOX.systems.Collision.prototype.run = function collisionRun(entities){
    // Here, we've implemented systems as functions which take in an array of
    // entities. An optimization would be to have some layer which only 
    // feeds in relevant entities to the system, but for demo purposes we'll
    // assume all entities are passed in and iterate over them.
    var self = this;
    var SMALL_LIMIT = 1.3;

    // keep track of current date
    var date = new Date();

    var curEntity; 
    var entityIdsCollidedWith = [];

    // iterate over all entities
    for( var entityId in entities ){
        curEntity = entities[entityId];

        // If the generation date is too new, don't collide
        if(date - curEntity.generationDate < HUNGRYBOX.config.generationCollisionDelay){
            continue;
        }

        // Only check for collision on player controllable entities 
        // (playerControlled) and entities with a collision component
        if( curEntity.components.appearance &&
            curEntity.components.playerControlled && 
            curEntity.components.position ){

            // test for intersection of player controlled rects vs. all other
            // collision rects
            for( var entityId2 in entities){ 
                // Don't check player controller entities for collisions 
                // (otherwise, it'd always be true)
                if( !entities[entityId2].components.playerControlled &&
                    entities[entityId2].components.position &&
                    entities[entityId2].components.collision &&
                    entities[entityId2].components.appearance ){

                    if( self.doesIntersect( 
                        {
                            position: curEntity.components.position,
                            size: curEntity.components.appearance.size
                        },
                        {
                            position: entities[entityId2].components.position, 
                            size: entities[entityId2].components.appearance.size
                        }
                    )){
                        // Don't modify the array in place; we're still iterating
                        // over it
                        entityIdsCollidedWith.push(entityId2);
                        var negativeDamageCutoff = HUNGRYBOX.config.blackBoxSize;

                        if(curEntity.components.health){
                            // Increase the entity's health, it ate something
                            curEntity.components.health.value += Math.max(
                                -2,
                                negativeDamageCutoff - entities[entityId2].components.appearance.size
                            );

                            // extra bonus for hitting small entities
                            if(entities[entityId2].components.appearance.size < SMALL_LIMIT){
                                if(curEntity.components.health.value < 30){
                                    // Add some bonus health if it's really small,
                                    // but don't let it get out of control
                                    curEntity.components.health.value += 9;
                                }
                            }
                            if ( entities[entityId2].components.appearance.size > negativeDamageCutoff ){
                                // Flash the canvas. NOTE: This is ok for a tutorial,
                                // but ideally this would not be coupled in the
                                // collision system
                                HUNGRYBOX.$canvasWrapper.addClass('badHit shake shake-hard shake-constant');

                                setTimeout(function(){
                                    HUNGRYBOX.$canvasWrapper.removeClass('badHit shake shake-hard shake-constant');
                                }, 200);

                                // substract even more health from the player
                                // but don't let it take away more than 5 dm
                                curEntity.components.health.value -= Math.min(
                                    5,
                                    entities[entityId2].components.appearance.size - negativeDamageCutoff
                                );


                            } else {
                                // Flash the canvas. NOTE: This is ok for a tutorial,
                                // but ideally this would not be coupled in the
                                // collision system
                                // extra bonus for small boxes
                                if(entities[entityId2].components.appearance.size < SMALL_LIMIT){
                                    HUNGRYBOX.$canvasWrapper.addClass('goodHit pulse');
                                } else {
                                    HUNGRYBOX.$canvasWrapper.addClass('goodHit pulse');
                                }

                                setTimeout(function(){
                                    HUNGRYBOX.$canvasWrapper.removeClass('goodHit pulse pulse-big');
                                }, 100);
                            }
                        }

                        // update the score
                        HUNGRYBOX.score++;

                        HUNGRYBOX.$score.addClass('updated');
                        HUNGRYBOX.$score[0].innerHTML = HUNGRYBOX.score;

                        setTimeout(function(){
                            HUNGRYBOX.$score.removeClass('updated');
                        }, 100);
                        break;
                    }
                }
            }
        }
    }

    // Add new entities if the player collided with any entities
    // ----------------------------------
    var chanceDecay = 0.8;
    var numNewEntities = 2;

    if(HUNGRYBOX.score > 100){
        chanceDecay = 0.6;
        numNewEntities = 2;
    }

    var healthModifier = 0;

    if(entityIdsCollidedWith.length > 0){
        for(i=0; i<entityIdsCollidedWith.length; i++){
            var newEntity;

            // if a BIG box got eaten, make a some
            if(entities[entityIdsCollidedWith[i]].components.appearance.size > 10){
                healthModifier = 10;
            }
            else if(entities[entityIdsCollidedWith[i]].components.appearance.size <= SMALL_LIMIT){
                healthModifier = -5;
            }

            // IMPORTANT: remove reference to entity
            delete HUNGRYBOX.entities[entityIdsCollidedWith[i]];

            // Don't add more entities if there are already too many
            if(Object.keys(HUNGRYBOX.entities).length < 30){

                for(var k=0; k < numNewEntities; k++){
                    // Add some new collision rects randomly
                    if(Math.random() < 0.8){
                        newEntity = new HUNGRYBOX.Assemblages.CollisionRect();
                        HUNGRYBOX.entities[newEntity.id] = newEntity;

                        // add a % chance that they'll decay
                        if(Math.random() < chanceDecay){
                            newEntity.addComponent( new HUNGRYBOX.Components.Health(
                                Math.max(15, (20 + ((Math.random * 80) | 0) + healthModifier))
                            ) );
                        }
                    }
                }

            }
        }
    }
};
