/* =========================================================================
 *
 * Assemblages.js
 *  Contains assemblages. Assemblages are essentially entity "templates"
 *
 * ========================================================================= */
;(function(){
    HUNGRYBOX.Assemblages = {
        // Each assemblage creates an entity then returns it. The entity can 
        // then have components added or removed - this is just like a helper
        // factory to create objects which can still be modified

        CollisionRect: function CollisionRect(options){
            options = options || {};

            // Basic collision rect
            var entity = new HUNGRYBOX.Entity();
            entity.addComponent( new HUNGRYBOX.Components.Appearance({
                size: options.size
            }));
            entity.addComponent( new HUNGRYBOX.Components.Position());
            entity.addComponent( new HUNGRYBOX.Components.Collision());
            return entity;
        }

    };
})();
