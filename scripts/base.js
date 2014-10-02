window.HUNGRYBOX = {
    Components: {},

    systems: {},
    entities: [],
    game: {},

    score: 0
};

HUNGRYBOX.$canvas = document.getElementById("game-canvas");
HUNGRYBOX.$canvasEl = $(HUNGRYBOX.$canvas); // jquery el ref
HUNGRYBOX.$canvasWrapper = $("#canvas-wrapper"); // jquery el ref
HUNGRYBOX.context = HUNGRYBOX.$canvas.getContext("2d");

HUNGRYBOX.$score = $("#score");
