# Teacher Robert — Beginner Guide

This version is simpler on purpose:
- fewer confusing scenes
- more basic buttons and typing
- one clear goal: survive, escape, and type the code

## What each file does

- index.html — the start screen
- inGame.html — the game screen with the story, buttons, and typing box
- game.js — the simple room system that moves the story forward
- style.css — the look of the game: dark cave, glowing text, and simple animations

## How the game works

1. The page opens on room 1.
2. The code looks at the current room in the ROOMS list.
3. It shows the correct text, buttons, and images.
4. When the player clicks or types, the code moves to the next room.

That is the whole game loop.

## The 4 main parts of the code

### 1. ROOMS
This is the story list. Every room is one small scene.

Example:

```js
{
  id: 2,
  text: "A light switch is blinking. Type LIGHT to flip it.",
  typingPrompt: "LIGHT",
  typingSuccessGoTo: 3
}
```

This means:
- show this text
- ask the player to type LIGHT
- if correct, go to room 3

### 2. goToRoom(id)
This function loads the next room.

### 3. setBackground(room)
This changes the screen look for each room, such as dark scenes or the run scene.

### 4. setControls(room)
This decides what the player sees:
- buttons
- typing box
- QTE key boxes

## Easy tips for explaining your code

- The ROOMS list is your story map.
- goToRoom is your travel button.
- setBackground changes the scene mood.
- setControls decides what the player can do right now.

## Simple gameplay notes

- Type LIGHT to flip the switch.
- Press the key combo to break free.
- Type 1975 to unlock the door.
- The game over screen now only gives Main Menu.

## How to run it

Open index.html in a browser, or use:

```bash
python -m http.server 8000
```

Then visit http://127.0.0.1:8000/.

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
