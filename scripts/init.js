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

    var names1 = [
        'hungry', 'happy', 'sad', 'content', 'mellow', 'chill', 'angry',
        'anxious'
    ];
    var names2 = [
        'lasso', 'cowboy', 'cowangle', 'coffeebean', 'hat',
        'shirt', 'square', 'triangle', 'cube', 'rhombus'
    ];

    var randomName = names1[Math.random() * names1.length | 0] + 
        ' ' + names2[Math.random() * names2.length | 0];

    // setup player name input
    var $name = $('#player-name');
    $name.on('input', function(){
        var val = $name.val();
        val = val.replace(/[^a-zA-Z0-9 '".,?@#]/gi, '');
        $name.val(val);
        HUNGRYBOX.player.setName = true;

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
            // ensure properties exist
            if(player.sprite === undefined){
                player = null;
            }

        } catch(parseError){
            player = null;
        }

        // setup player object
        HUNGRYBOX.player = player || {
            id: (Math.random()*10000|0).toString(16) + (+new Date()).toString(16),

            // generate a random name
            name: randomName,
            setName: false,
            isGood: true,
            sprite: 'boxman1',
            scores: [],
            deaths: 0,
            totalPlayersEaten: 0,
            totalRectsEaten: 0,
            highScore: 0
        };

        if(HUNGRYBOX.player.setName === true){
            $name.val(HUNGRYBOX.player.name);

        } else {
            $name.attr({ placeholder: randomName });
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

        // setup the skins
        HUNGRYBOX.setupSkins();

        // setup pubnub client after a small delay
        setTimeout(function(){
            HUNGRYBOX.PubNub.client.setup();
        }, 40);
    });

    // ----------------------------------
    // Setup skins
    // ----------------------------------
    var $skins = $('#skins-list');
    var $skinsTemplate = _.template($('#skins-item-template').html());

    HUNGRYBOX.setupSkins = function setupSkins(){
        $skins.empty();

        _.each(HUNGRYBOX.skinsInfo, function(value, key){
            var spriteImg = 'unknown';
            var requirements = '';

            // Configure unlock info
            // --------------------------
            if(!value.unlock){
                spriteImg = value.sprite;

            } else if (value.unlock.highScore){
                requirements = 'Best Score: ' + value.unlock.highScore;

                if(HUNGRYBOX.player.highScore >= value.unlock.highScore){
                    spriteImg = value.sprite;
                }

            } else if (value.unlock.deaths){
                requirements = 'Deaths: ' + value.unlock.deaths;

                if(HUNGRYBOX.player.deaths >= value.unlock.deaths){
                    spriteImg = value.sprite;
                }

            } else if (value.unlock.totalRectsEaten){
                requirements = 'Rects Eaten: ' + value.unlock.totalRectsEaten;

                if(HUNGRYBOX.player.totalRectsEaten >= value.unlock.totalRectsEaten){
                    spriteImg = value.sprite;
                }
            }

            // hide requirements?
            if(value.unlock && value.unlock.hide === true){
                requirements = 'Unknown';
            }

            // setup element
            var $el = $('<div></div>').html($skinsTemplate({
                id: 'skin-item-' + value.sprite,
                name: spriteImg === 'unknown' ? 'Unknown' : value.name,
                requirements: requirements,
                sprite: spriteImg
            }));

            // add classes
            $el.addClass('skin-item-wrapper');
            $el.addClass('skin-item-' + spriteImg);
            $el.attr({
                'data-skin': spriteImg
            });

            if(HUNGRYBOX.player.sprite === value.sprite){
                $el.addClass('selected');
            }

            // on click, change the skin
            $el.click(function(e){
                BRAGI.log('skins:click', 'clicked on skin');

                // NOTE: janky way to check
                // if it can't be selected, return false
                var $target = $(e.currentTarget);
                $target.removeClass('shake shake-constant');

                if($target.hasClass('skin-item-unknown')){
                    $target.addClass('shake shake-constant');
                    setTimeout(function(){
                        $target.removeClass('shake shake-constant');
                    }, 130);
                    return false;
                } else {
                    // change the active sprite
                    $('.selected', $skins).removeClass('selected');
                    $target.addClass('selected');

                    HUNGRYBOX.player.sprite = $target.attr('data-skin');

                    // save the choice
                    localforage.setItem('player', 
                        JSON.stringify(HUNGRYBOX.player));
                }
            });

            // add the element
            $skins.append( $el );
        });
    };

    // ----------------------------------
    // Kick off the game
    // ----------------------------------
    HUNGRYBOX.game = new HUNGRYBOX.Game();
})();
