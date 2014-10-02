/* =========================================================================
 *
 * game.js
 *  This script contains the game logic acts as a controller for the Entity 
 *  Component System
 *
 * ========================================================================= */
(function setupState(){
    var $title = $('#game-title');

    HUNGRYBOX.state = {
        state: 'title',

        // init - from nothing to game
        init: function initializeState(){
            // setup initial state

            $('#start-game').click(function(){
                if(HUNGRYBOX.state !== 'game'){
                    HUNGRYBOX.state.toGame();
                }
            });
        },

        // transitions
        // ------------------------------
        toGame: function stateToGame(){
            // transition from current state to game
            HUNGRYBOX.state = 'game';

            // Kick off the game
            HUNGRYBOX.game = new HUNGRYBOX.Game();

            $title.velocity({opacity: 0}, {
                complete: function(){
                    $title.hide();
                }
            })
        }
    };
})();
