/* =========================================================================
 *
 * collision-util
 *      utility collision functions
 *
 * ========================================================================= */
;(function(){
    HUNGRYBOX.util.collision = {
        ghostGood: function ghostGood(entity){
            // triggered with a "good" ghost collision
            //
            BRAGI.log('collision:systems:util:goodGhost', 
                'collided with a good ghost', {
                entity: entity
            });

            //// remove ALL bad rects and spawn some good ones
            requestAnimationFrame(function(){
                _.each(HUNGRYBOX.entities, function(entity, key){
                    if(entity.components.appearance &&
                        !entity.components.playerControlled && 
                        !entity.components.otherPlayer && 
                        entity.components.appearance.size > HUNGRYBOX.config.blackBoxSize

                    ){
                        delete HUNGRYBOX.entities[key];
                    }
                });
            });
        },
        ghostBad: function ghostBad(entity){
            // triggered with a "bad" ghost collision
            //
            BRAGI.log('collision:systems:util:badGhost', 
                'collided with a bad ghost', {
                entity: entity
            });

            _.each(_.range(30), function(){
                HUNGRYBOX.systems.GenerateBoxes.prototype.generateBox.call(
                    HUNGRYBOX.systems.GenerateBoxes,
                    {
                        size: 20 + (Math.random * 20|0),
                        decayChance: 0.2
                });
            });
        }
    };
})();
