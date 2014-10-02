/* =========================================================================
 *
 * init.js
 *  Called to kick off game
 *
 * ========================================================================= */
// set canvas size based on page width / height
function resizeCanvas(){
    HUNGRYBOX.$canvas.width = parseInt(HUNGRYBOX.$canvasEl.css('width'));
    HUNGRYBOX.$canvas.height = parseInt(HUNGRYBOX.$canvasEl.css('height'));
}

$(window).resize( resizeCanvas );
resizeCanvas();

HUNGRYBOX.state.init();
