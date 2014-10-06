/* =========================================================================
 *
 * PubNub.js
 *  Send messages with pubnub
 *
 * ========================================================================= */
;(function(){
    var start = new Date();

    var numMessages = 0;

    // reset all messages after 1 second, to allow message rate limiting 
    setInterval(function resetMessages(){
        numMessages = 0;
    }, 1000);

    HUNGRYBOX.PubNub = {
        client: PUBNUB.init({
            publish_key: 'pub-c-02fbdc8c-b95d-4e68-84f7-b87eb77f8e00',
            subscribe_key: 'sub-c-6b242512-4b58-11e4-b332-02ee2ddab7fe'
        }),
        channel: 'hungrybox'
    };

    // Util for publishing
    HUNGRYBOX.PubNub.pub = function publishMessage(message){
        BRAGI.log('pubnub:pub', 'publishing message...', {
            message: message
        });

        HUNGRYBOX.PubNub.client.publish({
            channel: HUNGRYBOX.PubNub.channel,
            message: message
        });
    };

    // initial setup (called in base)
    // ----------------------------------
    HUNGRYBOX.PubNub.client.setup = function setupClient(){
        // setup client immediately after player info has been fetched from
        // localstorage / server. HUNGRYBOX.player info will be defined at this
        // time
        
        HUNGRYBOX.PubNub.client.subscribe({
            channel : HUNGRYBOX.PubNub.channel,

            message : function onMessage(message){ 
                // Do something
                
                // If the received message was from THIS player, do nothing
                if(message.player && 
                message.player.name === HUNGRYBOX.player.name &&
                // FOR DEV:
                (+new Date(message.player.lastAccessDate)) === +HUNGRYBOX.loadDate
                ){
                    // SAME player
                    BRAGI.log('pubnub', '[X] received message. SAME player, ignoring: ', {
                        message: message
                    });
                    return;


                } else {
                    // DIFFERENT player
                    BRAGI.log('pubnub', 'received message from a different player: ', {
                        message: message
                    });

                    // clean it
                    message.player.name = message.player.name.replace(/[^a-zA-Z0-9 '".,?@#]/gi, '');

                    // do some message limitting
                    numMessages++;
                    if(numMessages > 3){
                        BRAGI.log('pubnub', 
                            'too many messages received, ignoring...');
                        return;
                    }


                    if(message.type === 'death'){
                        HUNGRYBOX.game.handleMultiplayerDeath(message);
                    }
                }
            },

            connect : function onConnect() {
                BRAGI.log('pubnub', 'connected in ' + (new Date() - start) + 'ms');

                HUNGRYBOX.PubNub.pub({
                    type: 'connect',
                    player: HUNGRYBOX.player
                });
            }
        });
    };

})();
