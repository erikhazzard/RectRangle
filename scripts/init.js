/* =========================================================================
 *
 * init.js
 *  Called to kick off game
 *
 * ========================================================================= */
// set canvas size based on page width / height
HUNGRYBOX.$canvas.width = parseInt(HUNGRYBOX.$canvasEl.css('width'));
HUNGRYBOX.$canvas.height = parseInt(HUNGRYBOX.$canvasEl.css('height'));

// Kick off the game
HUNGRYBOX.game = new HUNGRYBOX.Game();
