// ===========================================================================
//
// base - initial setup
//
// ===========================================================================
;(function(){
    // configure logger
    // ----------------------------------
    BRAGI.transports.get('Console').property({showMeta: false});
    //BRAGI.options.groupsDisabled = [/systems/];
    BRAGI.options.enabled= [/ghost/i];

    // setup hungrybox
    // ----------------------------------
    window.HUNGRYBOX = {
        Components: {},

        player: {
            isGood: true,
            score: 0,
            highScore: 0,
            scores: []
        },

        systems: {},
        entities: [],
        game: {},

        score: 0,
        highScore: 0,
        numPlayersEaten: 0,

        // keep track of time player loads game
        loadDate: new Date(),

        // utility functions
        util: {
            clearCanvas: function clearCanvas () {
                // Store the current transformation matrix
                HUNGRYBOX.context.save();

                // Use the identity matrix while clearing the canvas
                HUNGRYBOX.context.setTransform(1, 0, 0, 1, 0, 0);
                HUNGRYBOX.context.clearRect(0, 0, HUNGRYBOX.$canvas.width, HUNGRYBOX.$canvas.height);

                // Restore the transform
                HUNGRYBOX.context.restore();
            }
        }
    };

    // setup canvas stuff
    // --------------------------------------
    HUNGRYBOX.$canvas = document.getElementById("game-canvas");
    HUNGRYBOX.$canvasEl = $(HUNGRYBOX.$canvas); // jquery el ref
    HUNGRYBOX.$canvasWrapper = $("#canvas-wrapper"); // jquery el ref
    HUNGRYBOX.context = HUNGRYBOX.$canvas.getContext("2d");

    HUNGRYBOX.$score = $("#score");

    // Configuration
    HUNGRYBOX.config = {
        // how long to wait until collision matters
        // NOTE: This should match up with the CSS delay when box is generated
        generationCollisionDelay: 300,
        blackBoxSize: 12,
        
        otherPlayerDecayTime: 5000,
        imageHostPrefix: '/img/'
    };

    // Setup data
    // --------------------------------------
    localforage.getItem('player', function(err, player){
        try{
            player = JSON.parse(player);
        } catch(parseError){
            player = null;
        }

        // setup player object
        HUNGRYBOX.player = player || {
            id: (Math.random()*10000|0).toString(16) + (+new Date()).toString(16),

            // generate a shitty random name
            name: 'box-' + (Math.random()*10000|0).toString(16) + (+new Date()).toString(16),
            isGood: true,
            scores: [],
            highScore: 0
        };

        // keep track of last access date (useful for dev and data insights)
        HUNGRYBOX.player.lastAccessDate = HUNGRYBOX.loadDate;

        BRAGI.log('localforage', 'got player data: ', {
            player: HUNGRYBOX.player
        });

        localforage.setItem('player', JSON.stringify(HUNGRYBOX.player));

        // setup pubnub client after a small delay
        setTimeout(function(){
            HUNGRYBOX.PubNub.client.setup();
        }, 40);
    });
})();
