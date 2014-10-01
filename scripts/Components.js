/* =========================================================================
 *
 * Components.js
 *  This contains all components for the tutorial (ideally, components would
 *  each live in their own module)
 *
 *  Components are just data. 
 *
 * ========================================================================= */
var IMAGES = {
    boxman1: new Image()
};
IMAGES.boxman1.src = '/img/boxman1.png';

// Appearance 
// --------------------------------------
ECS.Components.Appearance = function ComponentAppearance ( params ){
    // Appearance specifies data for color and size
    params = params || {};

    this.colors = params.colors;
    if(!this.colors){
        // generate random color if not passed in (get 6 random hex values)
        this.colors = {
            r: 255,
            g: 255,
            b: 255
        };
    }

    this.size = params.size || (1 + (Math.random() * 30 | 0));

    return this;
};
ECS.Components.Appearance.prototype.name = 'appearance';

// Appearance - Image
// -------------------------------------- 
ECS.Components.AppearanceImage = function ComponentAppearanceImage ( params ){
    params = params || {};

    // name matches key in IMAGES object
    this.sprite = params.sprite || 'boxman1';
    // NOTE: size is retrieved from appearance component

    this.image = IMAGES[this.sprite];

    return this;
};
ECS.Components.AppearanceImage.prototype.name = 'appearanceImage';

// Appearance - Dom Element
// -------------------------------------- 
ECS.Components.AppearanceDOMElement = function ComponentAppearanceDOMElement ( params ){
    params = params || {};
    var self = this;

    // If an ID was passed in, use it - otherwise, use a class and create a 
    // DOM element
    var $el;
    if(params.id){
        $el = $('#game-player');
    }
    this.$el = $el;

    if(params.isPlayer){
        // if it's a player controllable entity, update the position
        // when the mouse moves
        var bounds = ECS.$canvas.getBoundingClientRect();

        var lastMoveDate = new Date();
        $(ECS.$canvas).on('mousemove', function(e){
            requestAnimationFrame(function(){
                self.$el.css({
                    top: e.clientY - bounds.top,
                    left: e.clientX - bounds.left
                });
            });
        });
    }

    return this;
};
ECS.Components.AppearanceDOMElement.prototype.name = 'appearanceDOMElement';


// Health
// --------------------------------------
ECS.Components.Health = function ComponentHealth ( value ){
    value = value || 20;
    this.value = value;

    return this;
};
ECS.Components.Health.prototype.name = 'health';

// Position
// --------------------------------------
ECS.Components.Position = function ComponentPosition ( params ){
    params = params || {};

    // Generate random values if not passed in
    // NOTE: For the tutorial we're coupling the random values to the canvas'
    // width / height, but ideally this would be decoupled (the component should
    // not need to know the canvas's dimensions)
    this.x = params.x || 20 + (Math.random() * (ECS.$canvas.width - 20) | 0);
    this.y = params.y || 20 + (Math.random() * (ECS.$canvas.height - 20) | 0);

    return this;
};
ECS.Components.Position.prototype.name = 'position';

// playerControlled 
// --------------------------------------
ECS.Components.PlayerControlled = function ComponentPlayerControlled ( params ){
    this.pc = true;
    return this;
};
ECS.Components.PlayerControlled.prototype.name = 'playerControlled';

// Collision
// --------------------------------------
ECS.Components.Collision = function ComponentCollision ( params ){
    this.collides = true;
    return this;
};
ECS.Components.Collision.prototype.name = 'collision';
