/* =========================================================================
 *
 * render.js
 *  This script contains the game logic acts as a controller for the Entity 
 *  Component System
 *
 * ========================================================================= */
// HUNGRYBOX - System - Render
// --------------------------------------
HUNGRYBOX.systems.Render = function systemRender ( entities ) {
    return this;
};

HUNGRYBOX.systems.Render.prototype.run = function renderRun( entities ) {
    // Here, we've implemented systems as functions which take in an array of
    // entities. An optimization would be to have some layer which only 
    // feeds in relevant entities to the system, but for demo purposes we'll
    // assume all entities are passed in and iterate over them.

    // This happens each tick, so we need to clear out the previous rendered
    // state
    HUNGRYBOX.util.clearCanvas();

    var curEntity, fillStyle; 

    // iterate over all entities
    for( var entityId in entities ){
        curEntity = entities[entityId];

        // Only run logic if entity has relevant components
        //
        // For rendering, we need appearance and position. Your own render 
        // system would use whatever other components specific for your game
        if( !curEntity.components.appearanceImage && curEntity.components.appearance && curEntity.components.position ){

            // Solid image rects
            // --------------------------
            // Build up the fill style based on the entity's color data
            fillStyle = 'rgba(' + [
                curEntity.components.appearance.colors.r,
                curEntity.components.appearance.colors.g,
                curEntity.components.appearance.colors.b
            ];
 
            if(!curEntity.components.collision){
                // If the entity does not have a collision component, give it 
                // some transparency
                fillStyle += ',0.1)';
            } else {
                // Has a collision component
                fillStyle += ',1)';
            }

            HUNGRYBOX.context.fillStyle = fillStyle;

            // Color big squares differently
            if(!curEntity.components.playerControlled &&
            curEntity.components.appearance.size > 12){
                HUNGRYBOX.context.fillStyle = 'rgba(0,0,0,0.8)';
            }

            // draw a little black line around every rect
            HUNGRYBOX.context.strokeStyle = 'rgba(0,0,0,1)';

            if(curEntity.components.appearance.size < 1){
                HUNGRYBOX.context.strokeStyle = 'rgba(255,255,255,1)';
            }

            // draw the rect
            HUNGRYBOX.context.fillRect( 
                curEntity.components.position.x - curEntity.components.appearance.size,
                curEntity.components.position.y - curEntity.components.appearance.size,
                curEntity.components.appearance.size * 2,
                curEntity.components.appearance.size * 2
            );
            // stroke it
            HUNGRYBOX.context.strokeRect(
                curEntity.components.position.x - curEntity.components.appearance.size,
                curEntity.components.position.y - curEntity.components.appearance.size,
                curEntity.components.appearance.size * 2,
                curEntity.components.appearance.size * 2
            );
        } 

        if ( curEntity.components.appearance && curEntity.components.appearanceImage && curEntity.components.position ){
            // --------------------------
            // For entities that have an IMAGE (the player and other players)
            // --------------------------
            // draw the image
            HUNGRYBOX.context.drawImage(
                curEntity.components.appearanceImage.image,
                curEntity.components.position.x - curEntity.components.appearance.size,
                curEntity.components.position.y - curEntity.components.appearance.size,
                curEntity.components.appearance.size * 2,
                curEntity.components.appearance.size * 2
            );

            // draw a box if it's too small
            if(curEntity.components.appearance.size < 8){
                // draw a little black line around every rect
                HUNGRYBOX.context.strokeStyle = 'rgba(0,0,0,1)';
                HUNGRYBOX.context.fillStyle = 'rgba(' + [
                    curEntity.components.appearance.colors.r,
                    curEntity.components.appearance.colors.g,
                    curEntity.components.appearance.colors.b,
                    0
                ];

                // draw the rect
                HUNGRYBOX.context.fillRect( 
                    curEntity.components.position.x - curEntity.components.appearance.size,
                    curEntity.components.position.y - curEntity.components.appearance.size,
                    curEntity.components.appearance.size * 2,
                    curEntity.components.appearance.size * 2
                );
                // stroke it
                HUNGRYBOX.context.strokeRect(
                    curEntity.components.position.x - curEntity.components.appearance.size,
                    curEntity.components.position.y - curEntity.components.appearance.size,
                    curEntity.components.appearance.size * 2,
                    curEntity.components.appearance.size * 2
                );
            }
            
        }
    }
};
