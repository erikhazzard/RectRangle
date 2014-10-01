window.ECS = {
    Components: {},

    systems: {},
    entities: [],
    game: {},

    score: 0,

    state: 'title'
};

ECS.$canvas = document.getElementById("game-canvas");
ECS.$canvasEl = $(ECS.$canvas); // jquery el ref
ECS.context = ECS.$canvas.getContext("2d");

ECS.$score = document.getElementById("score");
