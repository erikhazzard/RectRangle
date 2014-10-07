/* =========================================================================
 *
 * PubNub.js
 *  Send messages with pubnub
 *
 * ========================================================================= */
;(function(){
    var start = new Date();

    // keep track of a couple message rates
    var numMessagesPerSecond = 0;
    var numMessagesPerTenSeconds = 0;

    // reset all messages after 1 second, to allow message rate limiting 
    setInterval(function resetMessages(){
        numMessagesPerSecond = 0;
    }, 1000);

    setInterval(function resetMessages(){
        numMessagesPerTenSeconds = 0;
    }, 1000 * 10);

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
                // Handle message. *DO* the same behavior for the local player
                // as for a remote player
                BRAGI.log('pubnub', 'received message from a different player: ', {
                    message: message
                });

                // clean it
                message.player.name = message.player.name.replace(/[^a-zA-Z0-9 '".,?@#]/gi, '');

                // do some message limitting
                numMessagesPerSecond++;
                numMessagesPerTenSeconds++;

                if(numMessagesPerSecond > 3){
                    BRAGI.log('pubnub', 
                        'too many messages received per second, ignoring...');
                    return;
                }
                if(numMessagesPerTenSeconds > 20){
                    BRAGI.log('pubnub', 
                        'too many messages per 10 seconds, ignoring...');
                    return;
                }

                // Draw the ghost
                if(message.type === 'death'){
                    HUNGRYBOX.game.handleMultiplayerDeath(message);
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
