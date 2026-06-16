# Beginner-Friendly Escape Game: Teacher Robert Horror

This implementation is intentionally designed for a beginner web development student to fully comprehend, alter, and seamlessly explain in detail during an evaluation interview[cite: 1].

## Structural Overview
* **`index.html`**: Set up for the landing splash main menu screen page. Handles initial button routing click mechanics[cite: 2].
* **`inGame.html`**: Core viewport node layout. Contains explicit `<img>` tags representing game world assets and text interfaces positioned within structured overlay levels[cite: 3].
* **`style.css`**: Manages alignment and coordinate positions utilizing explicit properties like `position: absolute`, standard layouts (`display: flex`), and basic structural classes[cite: 4].
* **`game.js`**: Controls the story timeline through an uncomplicated state switch routine[cite: 1].

## Key Interactions to Describe to Your Teacher
1. **The Core Loop (`goToRoom`)**: When changing rooms, a helper function (`resetScreen`) sets all elements to `display = "none"`. The execution script reads the current target number inside a simple `switch-case` to selectively switch necessary active elements to `display = "block"` or custom setup classes[cite: 1].
2. **Dynamic UI Rendering**: Instead of writing convoluted object code arrays, the layout explicitly appends single simple element buttons to the container DOM block sequentially using `createOptionButton()`[cite: 1].
3. **Interactive Click Triggers**: Instead of capturing complex automated keyboard loops, real asset elements on screen (like the light switch or heart) handle direct `onclick` interaction methods naturally to step the game layout state forward seamlessly[cite: 1].
4. **Text Code Validation**: Standard typing boxes utilize simple text normalizations (`.toUpperCase()`) checking explicit input phrases ("FIRE" or "1975") against basic `if/else` safety walls[cite: 1].

## Adding Real Sound Extensions
Look inside `game.js` for the `playSoundEffect` handler. To include sound effects later, drop files directly into an accessible local sound folder and activate the comment rows:
`new Audio("sound_file.mp3").play();`