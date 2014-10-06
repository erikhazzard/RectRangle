JS_TARGETS = scripts/lib/lodash.min.js \
			scripts/lib/bragi.min.js \
			scripts/lib/pubnub.js \
			scripts/lib/localforage.js \
			scripts/lib/jquery.js \
			scripts/lib/velocity.js \
			scripts/base.js \
			scripts/PubNub.js \
			scripts/Entity.js \
			scripts/Components.js \
			scripts/Assemblages.js \
			scripts/systems/generateBoxes.js \
			scripts/systems/decay.js \
			scripts/systems/userInput.js \
			scripts/systems/collision.js \
			scripts/systems/collision-util.js \
			scripts/systems/render.js \
			scripts/game.js \
			scripts/init.js

js:
	@echo "Concating and minifying JS"
	@cat $(JS_TARGETS) > build/all.js
	@uglifyjs build/all.js -o build/all.min.js
	@rm build/all.js
	@echo "Done!"
