/* =========================================================================
 *
 * init.js
 *  Called to kick off game
 *
 * ========================================================================= */
;(function(){
    // set canvas size based on page width / height
    function resizeCanvas(){
        HUNGRYBOX.$canvas.width = parseInt(HUNGRYBOX.$canvasEl.css('width'));
        HUNGRYBOX.$canvas.height = parseInt(HUNGRYBOX.$canvasEl.css('height'));
    }

    $(window).resize( resizeCanvas );
    resizeCanvas();

    // setup player name input
    var $name = $('#player-name');
    $name.on('input', function(){
        var val = $name.val();
        val = val.replace(/[^a-zA-Z0-9 '".,?@#]/gi, '');
        $name.val(val);
        if(val.length > 0){
            HUNGRYBOX.player.name = val.substring(0,20);
            // update store
            localforage.setItem('player', JSON.stringify(HUNGRYBOX.player));
        }
    });

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

        if(HUNGRYBOX.player.name.slice(0,4) !== 'box-'){
            $name.val(HUNGRYBOX.player.name);
        }

        if(HUNGRYBOX.player.highScore > 0){
            $('#high-score').removeClass('invisible');
            $('#high-score-value').html(HUNGRYBOX.player.highScore);
        }

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

    // Kick off the game
    HUNGRYBOX.game = new HUNGRYBOX.Game();
})();
