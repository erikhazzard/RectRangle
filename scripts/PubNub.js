/* =========================================================================
 *
 * PubNub.js
 *  Send messages with pubnub
 *
 * ========================================================================= */
HUNGRYBOX.PubNub = {
    client: PUBNUB.init({
        publish_key: 'pub-c-02fbdc8c-b95d-4e68-84f7-b87eb77f8e00',
        subscribe_key: 'sub-c-6b242512-4b58-11e4-b332-02ee2ddab7fe'
    }),
    channel: 'hungrybox'
};

// setup client immediately
HUNGRYBOX.PubNub.client.subscribe({
    channel : HUNGRYBOX.channel,

    message : function onMessage(m){ 
        // Do something
    },

    connect : function onConnect() {
        HUNGRYBOX.PubNub.client.publish({
            channel : HUNGRYBOX.PubNub.channel,
            message : {
                type: 'connect'
            }
        });
    }
});
