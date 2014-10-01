window.HUNGRYBOX = {
    Components: {},

    systems: {},
    entities: [],
    game: {},

    score: 0,

    state: 'title'
};

HUNGRYBOX.$canvas = document.getElementById("game-canvas");
HUNGRYBOX.$canvasEl = $(HUNGRYBOX.$canvas); // jquery el ref
HUNGRYBOX.context = HUNGRYBOX.$canvas.getContext("2d");

HUNGRYBOX.$score = document.getElementById("score");
