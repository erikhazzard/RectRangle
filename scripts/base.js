window.HUNGRYBOX = {
    Components: {},

    systems: {},
    entities: [],
    game: {},

    score: 0,

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
    blackBoxSize: 12
};
