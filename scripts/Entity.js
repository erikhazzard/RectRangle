/* =========================================================================
 *
 * Entity.js
 *  Definition of our "Entity". Abstractly, an entity is basically an ID. 
 *  Here we implement an entity as a container of data (container of components)
 *
 * ========================================================================= */
;(function(){
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
        this.score = 0;

        // The component data will live in this object
        this.components = {};

        // render new HTML div box for animation
        setTimeout(function(){ requestAnimationFrame(function(){
            if(!self.components.otherPlayer){
                // draw the regular div
                self.drawNormalDiv();
            } else {
                // draw the other player
                self.drawOtherPlayerDiv();
            }
        });}, 20);

        return this;
    };

    // ======================================
    //
    // draw initial divs for animation
    //
    // ======================================
    HUNGRYBOX.Entity.prototype.drawNormalDiv = function drawDiv(){
        var self = this;

        // add a new box to give a little animation
        var boxClass = 'new-box';

        // add a new element
        var $el = $('<div class="' + boxClass + '"></div>');

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
                        (self.components.appearance.size ) +
                    ")",
                    '-webkit-transform': "scale(" + 
                        (self.components.appearance.size ) +
                    ")",
                    '-moz-transform': "scale(" + 
                        (self.components.appearance.size ) +
                    ")",
                    opacity: 0.8
                });

                // remove it
                setTimeout(function(){
                    $el.velocity({ 
                        transform: "scale(0)",
                        opacity: 0 
                    }, {
                        duration: 100,
                        complete: function(){
                            $el.remove();
                        }
                    });
                }, 200);
            });
        }, 10);

        return this;
    };

    // --------------------------------------
    // other player died
    // --------------------------------------
    HUNGRYBOX.Entity.prototype.drawOtherPlayerDiv = function drawOtherPlayerDiv(){
        var self = this;
        BRAGI.log('entity:drawOtherPlayerDiv', 'drawing other play div', {
            self: this
        });

        // add a new box to give a little animation
        var boxClass = 'new-box other-player';

        // add a new element
        var $el = $('<div class="' + boxClass + '"></div>');

        self.$boxEl = $el;

        $el.css({ 
            background: 'none',
            opacity: 1,
            // 50 is the height / width of the image
            left: (self.components.position.x - self.components.appearance.size),
            top: (self.components.position.y - self.components.appearance.size)
        });

        // append name
        $el.append( $('<p></p>')
            .html(
                self.components.otherPlayer.playerName + ' : ' + this.score
            )
        );

        var sprite = self.components.appearanceImage.sprite;
        if( !HUNGRYBOX._images[sprite] ){
            sprite = 'boxman1';
        }

        // actual image
        $el.append( $('<img />')
            .attr({
                src: HUNGRYBOX.config.imageHostPrefix + sprite + '.png'
            })
            .css({
                height: '100%',
                width: '100%'
            })
        );

        HUNGRYBOX.$canvasWrapper.append( $el );

        setTimeout(function(){ requestAnimationFrame(function(){ // remove it
            $el.css({
                transform: 'scale(1)',
                '-webkit-transform': 'scale(1)',
                '-moz-transform': 'scale(1)',
            });

            // NOTE: remove decay animation when player eats box
            setTimeout(function(){
                $el.velocity({ 
                    opacity: 0 
                }, {
                    duration: HUNGRYBOX.config.otherPlayerDecayTime,
                    easing: "easeOutCubic",
                    complete: function(){
                        $el.remove();
                    }
                });
            }, 200);
        }); }, 10);

        return this;
    };

    // ======================================
    //
    // keep track of entities created
    //
    // ======================================
    HUNGRYBOX.Entity.prototype._count = 0;

    // ======================================
    //
    // components
    //
    // ======================================
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
})();
