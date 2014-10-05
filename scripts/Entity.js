/* =========================================================================
 *
 * Entity.js
 *  Definition of our "Entity". Abstractly, an entity is basically an ID. 
 *  Here we implement an entity as a container of data (container of components)
 *
 * ========================================================================= */
HUNGRYBOX.Entity = function Entity(){
    var self = this;

    // Generate a pseudo random ID
    this.id = (+new Date()).toString(16) + 
        (Math.random() * 100000000 | 0).toString(16) +
        HUNGRYBOX.Entity.prototype._count;

    // increment counter
    HUNGRYBOX.Entity.prototype._count++;

    // store date it was generated
    this.generationDate = new Date();

    // The component data will live in this object
    this.components = {};

    // add a new box to give a little animation
    setTimeout(function(){

        requestAnimationFrame(function(){
            // add a new element
            var $el = $('<div class="new-box"></div>');

            $el.css({ 
                background: '#ffffff',
                opacity: 1,
                left: self.components.position.x,
                top: self.components.position.y
            });

            if(self.components.appearance.size >= HUNGRYBOX.config.blackBoxSize){
                $el.css({ background: "#000000" });
            }

            // add new box
            if(!HUNGRYBOX.game._running){
                return false;
            }

            HUNGRYBOX.$canvasWrapper.append( $el );

            setTimeout(function(){
                requestAnimationFrame(function(){
                    $el.css({ 
                        transform: "scale(" + 
                            (self.components.appearance.size + 2) +
                        ")",
                        opacity: 0.8
                    });

                    // remove it
                    setTimeout(function(){
                        $el.velocity({ 
                            transform: "scale(0)",
                            opacity: 0 
                        }, {
                            complete: function(){
                                $el.remove();
                            }
                        });
                    }, 200);
                });
            }, 10);

        });

    }, 10);

    return this;
};
// keep track of entities created
HUNGRYBOX.Entity.prototype._count = 0;

HUNGRYBOX.Entity.prototype.addComponent = function addComponent ( component ){
    // Add component data to the entity
    this.components[component.name] = component;
    return this;
};
HUNGRYBOX.Entity.prototype.removeComponent = function removeComponent ( componentName ){
    // Remove component data by removing the reference to it.
    // Allows either a component function or a string of a component name to be
    // passed in
    var name = componentName; // assume a string was passed in

    if(typeof componentName === 'function'){ 
        // get the name from the prototype of the passed component function
        name = componentName.prototype.name;
    }

    delete this.components[name];
    return this;
};

HUNGRYBOX.Entity.prototype.print = function print () {
    // Function to print / log information about the entity
    console.log(JSON.stringify(this, null, 4));
    return this;
};
