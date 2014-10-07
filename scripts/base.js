// ===========================================================================
//
// base - initial setup
//
// ===========================================================================
;(function(){
    // configure logger
    // ----------------------------------
    BRAGI.transports.get('Console').property({showMeta: false});
    BRAGI.log('game', 'Welcome to Rect Rangle. by @enoex');

    // don't log anything by default
    BRAGI.options.groupsEnabled = [];
    BRAGI.options.groupsEnabled = [/pubnub/i];

    // setup hungrybox
    // ----------------------------------
    window.HUNGRYBOX = {
        Components: {},

        player: {
            isGood: true,
            deaths: 0,
            sprite: 'boxman1',
            totalPlayersEaten: 0,
            totalRectsEaten: 0,
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

        // analytics - simple
        totalMessagesReceived: 0,
        totalMessagesReceivedByName: {},

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
            },
            addCommas: function addCommas(str) {
                return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
})();
