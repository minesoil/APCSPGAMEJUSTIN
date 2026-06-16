# Teacher Robert — Complete Code Guide

This document explains the game's code from top to bottom. No experience required.

---

## File Structure

```
your-game-folder/
│
├── index.html       ← the main menu screen
├── inGame.html      ← the actual game screen
├── style.css        ← controls colours, sizes, and positions
├── game.js          ← controls all the game logic
│
├── Images/          ← all image files go here
│   ├── Robert_Background_Removed_Default.png
│   ├── Flaming_arrow.png
│   ├── Keypad.png
│   ├── left_hand.png
│   ├── right_hand.png
│   ├── lightswitch_flippable_.png
│   ├── Cave.png
│   ├── Home_Screen.png
│   ├── skull.png
│   └── door.png
│
└── Music/           ← audio files go here
    ├── BGM.mp3
    └── Loud Scream Sound Effect 4.mp3
```

---

## How the Game Works (The Big Picture)

The browser loads `index.html` first. That page has one button. Clicking it sends the player to `inGame.html`. That page loads `game.js`, which immediately sets up the game and calls `goToRoom(1)` — the starting room.

From there, the game works like a choose-your-own-adventure book. Each room is a plain JavaScript object stored in an array called `ROOMS`. The `goToRoom` function reads a room's data and updates the screen to match. The player makes choices, and each choice calls `goToRoom` with a new id.

---

## index.html — Every Line

```html
<!DOCTYPE html>
```
This tells the browser: "this file is written in HTML5". Every HTML file must start with this. Without it, old browsers fall back to quirky legacy display modes.

```html
<html lang="en">
```
The root tag that wraps everything. `lang="en"` tells assistive tools and search engines the page is in English.

```html
<head>
```
The head section holds information *about* the page — it does not display on screen.

```html
<meta charset="UTF-8">
```
`<meta>` carries metadata. `charset="UTF-8"` means the browser will correctly display every character — letters, symbols, accented characters.

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```
Tells phones and tablets to match their screen width exactly, at normal zoom. Without this, mobile browsers shrink the page as if it were a desktop site.

```html
<title>Teacher Robert Horror Game</title>
```
Sets the text shown in the browser tab.

```html
<link rel="stylesheet" href="style.css">
```
Loads the CSS file. `rel="stylesheet"` says what kind of file it is. `href="style.css"` says where to find it.

```html
</head>
<body id="mainMenuBody">
```
The body tag holds everything that appears on screen. `id="mainMenuBody"` gives this specific body a name, so CSS can give the menu its own cave background without affecting the game page.

```html
<div id="menuContainer">
```
`<div>` is a generic box. It groups related elements together. This one holds the title, subtitle, and start button.

```html
<h1 id="gameTitle">TEACHER ROBERT</h1>
```
`<h1>` is a heading — the largest heading by default. The CSS overrides its size to 72px and colours it red.

```html
<p id="gameSubtitle">Can you survive him?</p>
```
`<p>` is a paragraph tag. Used here for the short tagline under the title.

```html
<button id="startButton">Start Game</button>
```
A clickable button. `game.js` grabs this by its id and makes it navigate to `inGame.html` when clicked.

```html
<script src="game.js"></script>
```
Loads the JavaScript file. Placed at the bottom of body so the HTML elements above it are already loaded and ready when the script runs.

---

## inGame.html — Every Line

Most of the boilerplate is identical to `index.html`, so this section only covers the unique parts.

```html
<body id="gameBody">
```
The game body has id `gameBody`. CSS uses this to give it the cave background and apply special effects like `bloodFlash`.

```html
<button id="menuButton">Menu</button>
```
The top-right button. `game.js` makes it go back to `index.html`.

```html
<div id="gameWorld">
```
The full-screen container for all game images. It fills 100% of the screen width and height.

```html
<audio id="bgMusic" src="Music/BGM.mp3" loop></audio>
```
An invisible audio element. `src` points to the music file. `loop` makes it restart automatically when it ends. `game.js` plays it with JavaScript.

```html
<audio id="scareSound" src="Music/Loud Scream Sound Effect 4.mp3"></audio>
```
The jump-scare sound. It plays in room 99 (game over). It does *not* loop.

```html
<img id="robertImage" src="Images/Robert_Background_Removed_Default.png" class="hidden">
```
`<img>` displays an image. `src` is the file path. `class="hidden"` applies the CSS `.hidden` rule, which sets opacity to 0 — the image exists but you can't see it. `game.js` swaps the class to `visible` when a room needs it.

The pattern repeats for `lightSwitchImage`, `keypadImage`, `flamingArrowImage`, `skullImage`, and `doorImage`. All start hidden.

```html
<img id="leftHandImage"  src="Images/left_hand.png">
<img id="rightHandImage" src="Images/right_hand.png">
```
The player's hands. These start *without* a `hidden` class, so they're visible from the start. They only hide in room 99 (game over).

```html
<div id="uiPanel">
```
The dark panel at the bottom that shows story text, buttons, and the timer.

```html
<div id="keyRow"></div>
```
Empty by default. `game.js` fills it with key-box squares when a QTE starts.

```html
<p id="dialogueText">Loading...</p>
```
The story text. "Loading..." is replaced immediately when the game starts.

```html
<div id="choiceButtons"></div>
```
Empty by default. `game.js` creates `<button>` elements and puts them here.

```html
<div id="timerBar" class="hidden">
  <div id="timerFill"></div>
</div>
```
The countdown bar. The outer div is the grey track. The inner div is the red fill, whose width shrinks from 100% to 0 as time runs out.

---

## style.css — Every Rule

### `*` (the global reset)

```css
* {
  margin:     0;
  padding:    0;
  box-sizing: border-box;
}
```
The `*` selector targets every element on the page. Browsers add default spacing to many elements — this wipes all of that out. `box-sizing: border-box` changes how width and height are calculated: borders and padding are *included* in the stated size, not added on top.

### `body`

```css
body {
  font-family: "Courier New", monospace;
  color:       white;
  overflow:    hidden;
  height:      100vh;
}
```
`font-family` sets the default font. `"Courier New"` is a monospaced typewriter font; `monospace` is the fallback if Courier New is not installed. `overflow: hidden` prevents scroll bars. `100vh` means 100% of the viewport height (the visible screen area).

### `#mainMenuBody`

```css
#mainMenuBody {
  background: url("Images/Home_Screen.png") center / cover no-repeat;
  display:    flex;
  justify-content: center;
  align-items:     center;
}
```
`url(...)` sets a background image. `center` positions it in the middle. `cover` scales it to fill the whole screen. `no-repeat` prevents it from tiling. `display: flex` turns the body into a flexbox container, which lets `justify-content: center` and `align-items: center` perfectly centre its child (the menu box) both horizontally and vertically.

### `#gameTitle`

```css
#gameTitle {
  font-size:   72px;
  color:       #ff3333;
  text-shadow: 0 0 24px red, 0 0 6px #ff000088;
}
```
`text-shadow` takes four values: horizontal offset, vertical offset, blur radius, colour. Both shadows are centred (0 horizontal, 0 vertical), with different blur sizes — the larger one gives the big glow, the smaller one sharpens the core.

### `#gameBody`

```css
#gameBody {
  background: url("Images/Cave.png") center / 115% no-repeat;
  position:   relative;
}
```
`115%` makes the cave image slightly wider than the screen, giving it a zoomed-in, tight feeling. `position: relative` is required so that child elements with `position: absolute` are placed relative to this div, not to the entire page.

### `#gameBody::before`

```css
#gameBody::before {
  content:    "";
  position:   absolute;
  left:       0;
  top:        0;
  width:      22%;
  height:     100%;
  background: radial-gradient(circle at left, black 20%, transparent 80%);
}
```
`::before` is a *pseudo-element* — it adds an invisible element as the first child of `#gameBody` without touching the HTML. `content: ""` is required for pseudo-elements to appear. `radial-gradient` draws a circular dark shadow that fades from solid black on the left edge to transparent, giving the cave scene a dark corner atmosphere.

### Special body states

```css
#gameBody.blackout   { background: black; }
#gameBody.bloodFlash { background: #bb0000; }
#gameBody.darkScene  { background: #0a0a0a; }
```
When `game.js` adds the class `blackout`, `bloodFlash`, or `darkScene` to the body, these rules kick in and override the cave background. The selector `#gameBody.blackout` means "the element with id gameBody that *also* has the class blackout."

### `.hidden` and `.visible`

```css
.hidden  { opacity: 0 !important; pointer-events: none; }
.visible { opacity: 1 !important; pointer-events: auto; }
```
`opacity: 0` makes something invisible but it still takes up space and can be transitioned. `!important` forces this rule to win over any other opacity setting. `pointer-events: none` means the mouse ignores the hidden element completely.

### `#robertImage`

```css
#robertImage {
  position:   absolute;
  width:       260px;
  left:        20%;
  top:         50%;
  transform:   translate(-50%, -50%);
  transition:  left 0.7s ease, top 0.7s ease, opacity 0.3s ease, width 0.3s ease;
}
```
`position: absolute` places this image relative to `#gameWorld`. `transform: translate(-50%, -50%)` shifts the image left by half its own width and up by half its own height — this means `left` and `top` point to the *centre* of the image, not the top-left corner. `transition` makes certain properties animate smoothly when `game.js` changes them.

### `image-rendering: pixelated`

```css
#skullImage, #doorImage {
  image-rendering: pixelated;
}
```
When the browser scales up a small image it normally blurs the edges. `pixelated` keeps each pixel sharp, which is essential for pixel-art assets.

### `@keyframes jitter`

```css
@keyframes jitter {
  0%,  100% { transform: translate(-50%, -50%) translateX(0);    }
  25%        { transform: translate(-50%, -50%) translateX(-3px); }
  75%        { transform: translate(-50%, -50%) translateX(3px);  }
}
```
`@keyframes` defines an animation sequence. `jitter` is the name used to apply it. At 0% and 100% the element is in its normal position. At 25% it shifts 3px left; at 75% it shifts 3px right. The `translate(-50%, -50%)` must be repeated in each keyframe or the centring fix would be lost during the animation.

### `@keyframes arrowFly`

```css
@keyframes arrowFly {
  from { left: -220px; }
  to   { left: 110vw;  }
}
```
Moves the arrow from -220px (hidden off the left side) to 110vw (past the right side of the screen). `vw` means viewport-width units, so 110vw is 110% of the screen width.

---

## game.js — Every Function

The whole file is wrapped in:

```js
document.addEventListener("DOMContentLoaded", function () { ... });
```

`document` is the page itself. `addEventListener` says "when something happens, call this function." `"DOMContentLoaded"` is the event name — it fires when the browser has finished building all the HTML elements. Everything inside the callback function runs only after the page is ready.

---

### Section: PAGE ELEMENTS

```js
const img = { ... };
```

`const` declares a variable that cannot be reassigned. `img` is an object (a collection of named values). Each property holds a reference to an HTML element grabbed by `document.getElementById("someId")`. Instead of writing `document.getElementById("robertImage")` everywhere, we just write `img.robert`.

```js
const ui = { ... };
```

Same pattern — groups all the UI elements (text, buttons, timer) into one object.

```js
const audio = { ... };
```

Groups the two audio elements.

---

### Section: GAME STATE

```js
let currentRoom  = null;
let qteIndex     = 0;
let qteActive    = false;
let timerTimeout = null;
let timerTick    = null;
```

`let` declares a variable that *can* change later (unlike `const`). `null` means "empty for now." These five variables keep track of what's happening right now:
- `currentRoom` — the room object currently on screen
- `qteIndex` — the position in the required-keys array (which key is next)
- `qteActive` — whether the QTE listener should pay attention to keypresses
- `timerTimeout` — the handle for the timed game-over; stored so we can cancel it
- `timerTick` — the handle for the timer bar visual update; stored so we can cancel it

---

### Section: ROOMS

Each room is a plain JavaScript object in curly braces `{ }`. A JavaScript object is like a dictionary — it holds named data. Example:

```js
{
  id: 1,
  text: "You stepped inside the stone cave...",
  options: [
    { text: "Investigate the dark tunnel.", goTo: 2 },
    { text: "Hide underneath a big heavy desk.", goTo: 10 }
  ]
}
```

`id: 1` — the number used to navigate here. Call `goToRoom(1)` to load this room.  
`text: "..."` — the string displayed in the dialogue box.  
`options: [ ]` — an array of button objects. Each has `text` (button label) and `goTo` (which room to load when clicked).

Special properties used by some rooms:

| Property | Type | What it does |
|---|---|---|
| `isBlackout` | boolean | adds class `blackout` to body (black background) |
| `bloodFlash` | boolean | adds class `bloodFlash` (red background) |
| `showSwitch` | boolean | makes the light switch visible |
| `showKeypad` | boolean | makes the keypad visible |
| `showRobert` | boolean | makes Teacher Robert visible |
| `robertPosition` | string | `"left"`, `"center"`, `"right"`, or `"abyss"` |
| `robertCloseup` | boolean | fills screen with Robert's face (game over horror) |
| `shootArrow` | boolean | starts the arrow-fly animation |
| `showSkull` | boolean | shows the pixel-art skull image |
| `showDoor` | boolean | shows the pixel-art door image |
| `hideHands` | boolean | hides the player's hands |
| `playScream` | boolean | plays the scream sound effect |
| `timeLimit` | number | milliseconds before automatic game over |
| `timeoutGoTo` | number | room id to go to if time expires |
| `requiredKeys` | array | key sequence the player must type (QTE) |
| `qteSuccessGoTo` | number | room id to go to after a successful QTE |

---

### Section: NAV BUTTONS

```js
const startBtn = document.getElementById("startButton");
if (startBtn) startBtn.onclick = () => { window.location.href = "inGame.html"; };
```

`document.getElementById` searches the page for the element with that id and returns it. We check `if (startBtn)` before using it because this script runs on *both* pages — `startButton` only exists on `index.html`, not `inGame.html`. Without the check, the script would throw an error on the game page.

`onclick` is an event handler — it holds a function that runs when the user clicks. `window.location.href = "inGame.html"` navigates the browser to the game page.

`() => { ... }` is an arrow function — a short way to write `function() { ... }`.

---

### Section: MUSIC

```js
if (audio.music) audio.music.play().catch(() => {});
```

`.play()` starts the audio. It returns a Promise (an object representing something that will finish in the future). Modern browsers block autoplay unless the user has interacted with the page. `.catch(() => {})` silently ignores the error if autoplay is blocked — without this, the browser would log a red error every time.

---

### Section: KEYBOARD INPUT

```js
window.addEventListener("keydown", function (e) {
  if (!qteActive) return;
  const key    = e.key.toUpperCase();
  const needed = currentRoom.requiredKeys;
  ...
});
```

`"keydown"` fires every time any key is pressed. `e` is the event object — it carries information about which key was pressed. `e.key` gives the key as a string like `"w"` or `"ArrowLeft"`. `.toUpperCase()` converts it to `"W"` so the check is case-insensitive.

`if (!qteActive) return;` — if no QTE is happening, exit the function immediately. The `!` is "not", so this reads "if NOT qteActive, stop."

```js
if (key === needed[qteIndex]) {
  qteIndex++;
  renderKeyBoxes(needed, qteIndex);
  if (qteIndex >= needed.length) {
    stopTimers();
    goToRoom(currentRoom.qteSuccessGoTo);
  }
} else {
  stopTimers();
  goToRoom(99);
}
```

`===` is strict equality — it checks both value and type. `needed[qteIndex]` gets the element at position `qteIndex` from the array. `qteIndex++` increases qteIndex by 1. If `qteIndex >= needed.length`, the player has typed the whole sequence correctly — success. Otherwise, if the wrong key was pressed, immediate game over.

---

### Function: `goToRoom(id)`

The main game engine. Called whenever the scene changes.

```js
function goToRoom(id) {
  if (id === -1) { window.location.href = "index.html"; return; }
  stopTimers();
  qteActive = false;
  qteIndex  = 0;
  const room = ROOMS.find(r => r.id === id);
  if (!room) return;
  currentRoom = room;
  ...
}
```

`id === -1` is the special code for "go back to the main menu". `stopTimers()` cancels any countdown left over from the last room. `ROOMS.find(r => r.id === id)` searches the ROOMS array for the first object whose `id` property matches — `r` is each object as we scan through. `if (!room) return` protects against broken room ids.

---

### Function: `setBackground(room)`

```js
function setBackground(room) {
  document.body.className = "";
  if (room.isBlackout)   document.body.classList.add("blackout");
  if (room.bloodFlash)   document.body.classList.add("bloodFlash");
  if (room.showSwitch || room.showKeypad) document.body.classList.add("darkScene");
}
```

First we clear *all* classes from the body with `className = ""`. Then we add back only what this room needs. `classList.add("className")` adds a class without removing existing ones. The `||` means "or" — a dark scene happens for *either* the switch or the keypad room.

---

### Function: `setImages(room)`

```js
function setImages(room) {
  hide(img.robert);
  hide(img.switch);
  ...
  if (room.showRobert || room.robertCloseup) {
    show(img.robert);
    if (room.robertCloseup) {
      img.robert.style.width     = "115%";
      img.robert.style.left      = "50%";
      img.robert.style.top       = "8%";
      img.robert.style.animation = "jitter 0.25s infinite";
    } else {
      img.robert.style.width     = "260px";
      img.robert.style.animation = "";
      positionRobert(room.robertPosition);
    }
  }
  ...
}
```

`img.robert.style.width` directly sets the element's inline CSS style. Inline styles override stylesheet rules. Clearing `animation` back to `""` removes the jitter when Robert returns to normal.

---

### Function: `positionRobert(position)`

```js
function positionRobert(position) {
  const spots = {
    left:   { left: "20%", top: "55%" },
    center: { left: "50%", top: "50%" },
    right:  { left: "75%", top: "55%" },
    abyss:  { left: "12%", top: "65%" },
  };
  const spot = spots[position] || spots.center;
  img.robert.style.left = spot.left;
  img.robert.style.top  = spot.top;
}
```

`spots` is an object used as a lookup table. `spots[position]` retrieves the matching set of coordinates. The `|| spots.center` fallback means if an unknown position string is passed, Robert defaults to the centre instead of crashing.

---

### Function: `setControls(room)`

```js
function setControls(room) {
  ui.buttons.innerHTML = "";
  ui.keys.innerHTML    = "";
  ui.timer.className   = "hidden";

  if (room.requiredKeys) {
    qteActive = true;
    renderKeyBoxes(room.requiredKeys, 0);
  } else {
    room.options.forEach(opt => {
      const btn     = document.createElement("button");
      btn.innerText = opt.text;
      btn.onclick   = () => goToRoom(opt.goTo);
      ui.buttons.appendChild(btn);
    });
  }
}
```

`innerHTML = ""` empties the element, removing any buttons or key boxes from the last room. `document.createElement("button")` makes a new button element in memory. `btn.innerText` sets its label. `appendChild` attaches it as the last child of `ui.buttons`, making it appear on screen. `forEach` runs the given function once for each option in the array.

---

### Function: `startTimer(room)`

```js
function startTimer(room) {
  let timeLeft        = room.timeLimit;
  ui.timer.className  = "";
  ui.fill.style.width = "100%";

  timerTick = setInterval(() => {
    timeLeft -= 50;
    const pct = Math.max(0, (timeLeft / room.timeLimit) * 100);
    ui.fill.style.width = pct + "%";
  }, 50);

  timerTimeout = setTimeout(() => goToRoom(room.timeoutGoTo), room.timeLimit);
}
```

`setInterval(fn, 50)` calls `fn` every 50 milliseconds. Each tick subtracts 50 from timeLeft and recalculates the bar fill percentage. `Math.max(0, ...)` clamps the value so it never goes negative. `setTimeout(fn, ms)` calls `fn` once after `ms` milliseconds — this triggers game over when the countdown hits zero.

---

### Function: `stopTimers()`

```js
function stopTimers() {
  clearTimeout(timerTimeout);
  clearInterval(timerTick);
}
```

`clearTimeout` and `clearInterval` cancel the running timers using the handles we stored earlier. Without this, changing rooms would not stop a countdown — the old timer would fire after the new room has loaded, potentially sending the player to game over mid-scene.

---

### Function: `renderKeyBoxes(keys, currentIndex)`

```js
function renderKeyBoxes(keys, currentIndex) {
  ui.keys.innerHTML = "";
  keys.forEach((key, i) => {
    const box     = document.createElement("div");
    box.className = i < currentIndex ? "keyBox correct" : "keyBox";
    box.innerText = key;
    ui.keys.appendChild(box);
  });
}
```

Clears the key row and redraws it. `(key, i)` in the forEach gives both the value and its index. `i < currentIndex` is true for keys the player has already typed — those get the `correct` class (green). The ternary `? :` works like a one-line if/else: `condition ? valueIfTrue : valueIfFalse`.

---

### Functions: `show(el)` and `hide(el)`

```js
function show(el) { if (el) el.className = "visible"; }
function hide(el) { if (el) el.className = "hidden";  }
```

These set the element's class to either `visible` or `hidden`, triggering the CSS opacity rules. The `if (el)` check prevents a crash if the element doesn't exist on the current page.

---

### Section: START

```js
if (ui.text) goToRoom(1);
```

`ui.text` is the dialogue paragraph, which only exists on `inGame.html`. If it exists, we load room 1. If it doesn't exist (we're on `index.html`), we do nothing. This one line lets a single `game.js` file serve both HTML pages without errors.

---

## How to Add a New Room

1. Open `game.js` and find the `ROOMS` array.
2. Copy an existing room object.
3. Change its `id` to a number not already in use.
4. Write the new `text` and `options`.
5. Connect it to another room by changing a `goTo` value to your new `id`.

Example — a new room 20:

```js
{
  id: 20,
  showRobert: true,
  robertPosition: "center",
  text: "A secret chamber. A chest sits in the corner.",
  options: [
    { text: "Open the chest.", goTo: 21 },
    { text: "Back away slowly.", goTo: 8 }
  ]
}
```

Then change any existing room's `goTo` to `20` to make it reachable.

---

## How to Change Something Visual

**Move an image on screen:** Find the element's CSS rule (e.g. `#keypadImage`) and change `left` and `top`. Both are percentages of the screen size.

**Change the colour of the timer bar:** In CSS find `#timerFill` and change `background`.

**Change how Robert looks in a closeup:** In `game.js`, find `if (room.robertCloseup)` and adjust the `style.width`, `style.left`, and `style.top` values.

**Add a timed room:** Add `timeLimit: 3000` (3 seconds), `timeoutGoTo: 99` (game over), and leave off the `options` array if you want it to be pure timer with a QTE, or keep `options` for a race-the-clock button choice.

**Change a QTE key sequence:** Find the room in `ROOMS` and edit the `requiredKeys` array. Each entry is a single character string — letters or numbers.

---

## Common Mistakes

**The image does not appear:** Check that the filename in the `src` attribute exactly matches the file in the Images folder, including capital letters and underscores.

**Audio does not play:** Browsers block audio until the user has clicked something. The main menu's Start button counts as that interaction, which is why music starts reliably on `inGame.html` but might not on `index.html`.

**A room loads but nothing shows:** Make sure the room's `id` is not shared with another room. `ROOMS.find` returns the first match — duplicate ids cause the second room to be unreachable.

**The timer keeps running after switching rooms:** This should not happen with the current code, but if you edit the timer logic, always call `stopTimers()` before switching rooms.
