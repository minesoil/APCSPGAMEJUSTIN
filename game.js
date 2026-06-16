// ─────────────────────────────────────────────────────────────────────────
// 1. LINKING HTML ELEMENTS TO JAVASCRIPT VARIABLES
// ─────────────────────────────────────────────────────────────────────────
var caveBackground = document.getElementById("caveBackground");
var robert = document.getElementById("robertImage");
var lightSwitch = document.getElementById("lightSwitchImage");
var keypad = document.getElementById("keypadImage");
var arrow = document.getElementById("flamingArrowImage");
var skull = document.getElementById("skullImage");
var door = document.getElementById("doorImage");
var heart = document.getElementById("heartImage");
var leftHand = document.getElementById("leftHandImage");
var rightHand = document.getElementById("rightHandImage");

var dialogueText = document.getElementById("dialogueText");
var choiceButtons = document.getElementById("choiceButtons");
var timerBar = document.getElementById("timerBar");
var timerFill = document.getElementById("timerFill");
var typingArea = document.getElementById("typingArea");
var typingInput = document.getElementById("typingInput");
var typingButton = document.getElementById("typingButton");
var menuButton = document.getElementById("menuButton");

// AUDIO ELEMENT LINKS
var bgMusic = document.getElementById("bgMusic");
var scareSound = document.getElementById("scareSound");

// ─────────────────────────────────────────────────────────────────────────
// 2. STATE INTERFACES
// ─────────────────────────────────────────────────────────────────────────
var currentRoom = 1;
var timerTracker = null;
var moleClicks = 0;

// KEY-TAP CHALLENGE HOOKS
var keyTapTargetString = "";
var keyTapCurrentIndex = 0;
var isKeyTapActive = false;

// ─────────────────────────────────────────────────────────────────────────
// 3. SOUND PLAYER SUBROUTINES
// ─────────────────────────────────────────────────────────────────────────
function startBackgroundMusic() { bgMusic.play(); }
function stopBackgroundMusic() { bgMusic.pause(); bgMusic.currentTime = 0; }
function playScreamSound() { scareSound.play(); }
function playClickSound() { console.log("SFX: Interaction"); }
function playArrowSound() { console.log("SFX: Projectile Released"); }
function playWinSound() { console.log("SFX: Escape Sequence Win"); }

// ─────────────────────────────────────────────────────────────────────────
// 4. SCREEN RESTORATION ENGINE
// ─────────────────────────────────────────────────────────────────────────
function clearEverything() {
  clearTimeout(timerTracker);
  isKeyTapActive = false;

  timerBar.className = "hidden";
  timerFill.style.width = "100%";
  timerFill.style.transition = "none";

  robert.className = "hidden";
  lightSwitch.className = "hidden";
  keypad.className = "hidden";
  arrow.className = "hidden";
  skull.className = "hidden";
  door.className = "hidden";
  heart.className = "hidden";

  // Reset hands back to standard tracking states
  leftHand.className = "visible";
  rightHand.className = "visible";

  caveBackground.className = "visible";
  document.body.className = "";

  var oldClones = document.querySelectorAll(".temp-clone");
  oldClones.forEach(function (c) { c.remove(); });

  // Clear past prompt blocks from ui panel frame
  var oldPrompt = document.getElementById("keyPromptBox");
  if (oldPrompt) { oldPrompt.remove(); }

  typingArea.className = "hidden";
  typingInput.value = "";
  choiceButtons.innerHTML = "";
}

// ─────────────────────────────────────────────────────────────────────────
// 5. TIMEOUT PROGRESS TRACKER
// ─────────────────────────────────────────────────────────────────────────
function startRoomTimer(secondsToWait) {
  timerBar.className = "visible";
  timerFill.style.width = "100%";
  timerFill.style.transition = "none";

  setTimeout(function () {
    timerFill.style.transition = "width " + secondsToWait + "s linear";
    timerFill.style.width = "0%";
  }, 50);

  timerTracker = setTimeout(function () {
    showGameOver();
  }, secondsToWait * 1000);
}

// ── NEW ADVANCED MECHANIC: LIVE KEYBOARD TRACKING LOOPS ──────────────────
function startKeyTapChallenge(targetLetters, secondsToComplete) {
  isKeyTapActive = true;
  keyTapTargetString = targetLetters.toUpperCase();
  keyTapCurrentIndex = 0;

  // Dynamically inject a beautiful stylized key tracker readout inside the user panel
  var promptDisplay = document.createElement("div");
  promptDisplay.id = "keyPromptBox";
  promptDisplay.innerText = "TAP: " + generatePromptString();
  uiPanel.appendChild(promptDisplay);

  startRoomTimer(secondsToComplete);
}

function generatePromptString() {
  var output = "";
  for (var i = 0; i < keyTapTargetString.length; i++) {
    if (i < keyTapCurrentIndex) {
      output += "_" + " "; // Hides letters already typed correctly
    } else {
      output += keyTapTargetString[i] + " ";
    }
  }
  return output;
}

// ─────────────────────────────────────────────────────────────────────────
// 6. ROOM SCENE LOGIC MATRIX
// ─────────────────────────────────────────────────────────────────────────

function showRoom1() {
  currentRoom = 1;
  clearEverything();
  dialogueText.innerText = "Oh my god... the heavy steel door just slammed shut behind me. I'm completely trapped in here. I can hear heavy thudding footsteps echoing deeper inside the cave... Teacher Robert is coming for me. What should I do?!";

  var btn1 = document.createElement("button");
  btn1.innerText = "Creep forward quietly into the dark tunnel.";
  btn1.onclick = function () { startBackgroundMusic(); playClickSound(); showRoom2(); };
  choiceButtons.appendChild(btn1);

  var btn2 = document.createElement("button");
  btn2.innerText = "Dive under that dusty old desk right there.";
  btn2.onclick = function () { startBackgroundMusic(); playClickSound(); showRoomUnderTable(); };
  choiceButtons.appendChild(btn2);
}

function showRoom2() {
  currentRoom = 2;
  clearEverything();
  caveBackground.className = "hidden";
  document.body.className = "blackout";
  lightSwitch.className = "visible";
  dialogueText.innerText = "It's way too dark down here, I can't see a single thing... Wait, there's a dirty old plastic light switch attached directly to the wall. Click on the physical switch right now to flip the circuit breakers!";
}

function showRoom3() {
  currentRoom = 3;
  clearEverything();
  caveBackground.className = "hidden";
  document.body.className = "totalBlackout";
  leftHand.className = "hidden";
  rightHand.className = "hidden";
  typingArea.className = "visible";
  typingInput.placeholder = "Type LEFT or RIGHT to dodge!";
  dialogueText.innerText = "NO! The bulb exploded! Total darkness! I hear something sprinting straight at me at full speed! Dodge immediately!\n\nQUICK TYPING TEST: Type 'LEFT' or 'RIGHT' and hit enter to jump out of the way!";
  startRoomTimer(6);
}

function showRoom4() {
  currentRoom = 4;
  clearEverything();

  // Immersive Shake Feature: Add panic visual tremors to view arms
  leftHand.className = "visible panicShake";
  rightHand.className = "visible panicShake";

  robert.className = "visible robert-center";
  heart.className = "visible";
  dialogueText.innerText = "HE'S RIGHT IN FRONT OF ME! HE'S LUNGING! Quick, punch him right in his glowing weak-spot heart emblem before he grabs my neck!";
  startRoomTimer(4);
}

function showRoom5() {
  currentRoom = 5;
  clearEverything();
  robert.className = "visible robert-left";
  typingArea.className = "visible";
  typingInput.placeholder = "Answer here...";
  dialogueText.innerText = "Yes! I dodged him! He slammed face-first into the wall and is totally dazed. Wait, he's muttering a creepy riddle at me...\n\n'I have keys but open no locks. I have space but no room. You can enter but can't go outside. What am I?'\n\n💡 HINT: You are using one right now to interface with this game text box!";
  startRoomTimer(35);
}

function showRoom6() {
  currentRoom = 6;
  clearEverything();
  robert.className = "visible robert-center";
  typingArea.className = "visible";
  typingInput.placeholder = "Answer here...";
  dialogueText.innerText = "It actually worked! He's screaming in pain! I just found an old hunting bow on the ground. I need to aim it at him! He's dropping another riddle equation!:\n\n'The more of them you take, the more you leave behind. What are they?'\n\n💡 HINT: Think about what your boots leave in the mud when running away.";
  startRoomTimer(30);
}

function showRoom7() {
  currentRoom = 7;
  clearEverything();
  robert.className = "visible robert-right";
  arrow.className = "visible shooting";
  playArrowSound();
  dialogueText.innerText = "BULLSEYE! The flaming arrow hit him clean in the shoulder! He staggered backwards off the platform down into the deep mine shafts! I need to move before he climbs out!";

  var btn = document.createElement("button");
  btn.innerText = "Sprint down the corridor toward the ventilation shaft.";
  btn.onclick = function () { playClickSound(); showRoomMoleIntro(); };
  choiceButtons.appendChild(btn);
}

function showRoomMoleIntro() {
  currentRoom = 14;
  clearEverything();
  moleClicks = 0;
  dialogueText.innerText = "Oh no, he's crawling up out of the vents all over the place! He's everywhere! Look at them crawling! Click on ALL 4 Teacher Roberts to disintegrate his illusions and clear a path out!";

  spawnClone(1);
  spawnClone(2);
  spawnClone(3);
  spawnClone(4);

  startRoomTimer(7);
}

function spawnClone(positionNumber) {
  var gameWorld = document.getElementById("gameWorld");
  var cloneImg = document.createElement("img");
  cloneImg.src = "Images/Robert Background Removed Default.png";
  cloneImg.className = "temp-clone clone-pos" + positionNumber;

  cloneImg.onclick = function () {
    playClickSound();
    cloneImg.remove();
    moleClicks = moleClicks + 1;
    dialogueText.innerText = "SQUASHED! (Total Clones Defeated: " + moleClicks + "/4)";
    if (moleClicks >= 4) { showRoomVentDrop(); } // Moves to NEW EXTRA SCENE
  };
  gameWorld.appendChild(cloneImg);
}

// ── NEW EXTRA SCENE 1: THE VENTILATION DESCENT DROP (KEYPRESS EVENT) ─────
function showRoomVentDrop() {
  currentRoom = 15;
  clearEverything();

  // Immersive Dark setting fits naturally without extra art graphics
  caveBackground.className = "hidden";
  document.body.className = "totalBlackout";
  leftHand.className = "hidden";
  rightHand.className = "hidden";

  dialogueText.innerText = "You dive headfirst down the ventilation shaft to escape the clone room! But the ancient metal shafts are splitting apart! You have to crawl and grab the edges instantly!\n\n⚠️ QUICK REFLEX KEY EVENT: Click on the screen to focus, then tap these keys quickly in order to stay on the path!";

  // Require quick processing sequence
  startKeyTapChallenge("XQSP", 5);
}

// ── NEW EXTRA SCENE 2: THE DEEP CORE PIPES (ADDITIONAL RIDDLE) ────────────
function showRoomDeepCore() {
  currentRoom = 16;
  clearEverything();

  caveBackground.className = "hidden";
  document.body.className = "blackout";
  typingArea.className = "visible";
  typingInput.placeholder = "Answer here...";

  dialogueText.innerText = "You land safely at the bottom of the deep shaft. It's an abandoned furnace grid! Suddenly, a locked security valve terminal blocks your route. A text warning flashes on the rusted console screen:\n\n'Give me food, and I will live. Give me water, and I will die. What am I?'\n\n💡 HINT: Think of wood campfire logs burning in the dark context.";

  startRoomTimer(30);
}

// ── NEW EXTRA SCENE 3: INTERCEPTED ON THE TRACKS (KEYPRESS EVENT 2) ──────
function showRoomTrackEscape() {
  currentRoom = 17;
  clearEverything();

  // Immersive Shake added to hands
  leftHand.className = "visible panicShake";
  rightHand.className = "visible panicShake";

  dialogueText.innerText = "You crawl through the furnace onto the old mine tracks! But look behind you—Teacher Robert survived the drop! He is running down the rails directly at you with insane speed!\n\n⚠️ FINAL REFLEX KEY EVENT: Dodge his grasping hands! Rapidly tap these keys in order!";

  startKeyTapChallenge("OUIVG", 6);
}

function showRoom8() {
  currentRoom = 8;
  clearEverything();
  robert.className = "visible robert-closeup";
  typingArea.className = "visible";
  typingInput.placeholder = "Answer here...";
  dialogueText.innerText = "You outran him and slammed a heavy mesh security grate behind you! But the real Teacher Robert catches up and is blocking the final electronic gateway bunker! Solve this final riddle to bypass his override lines:\n\n'I am light as a feather, yet the strongest human cannot hold me for much more than five minutes. What am I?'\n\n💡 HINT: You take one when you inhale deeply!";
  startRoomTimer(30);
}

function showRoom9() {
  currentRoom = 9;
  clearEverything();
  leftHand.className = "hidden";
  rightHand.className = "hidden";
  dialogueText.innerText = "His brain fried! He collapsed to his knees clutching his head. This is my chance! I'm leaping right past him into the control room bunker!";

  var btn = document.createElement("button");
  btn.innerText = "Slide into the master security console chair.";
  btn.onclick = function () { playClickSound(); showRoom10(); };
  choiceButtons.appendChild(btn);
}

function showRoom10() {
  currentRoom = 10;
  clearEverything();
  caveBackground.className = "hidden";
  document.body.className = "blackout";
  keypad.className = "visible";
  typingArea.className = "visible";
  typingInput.placeholder = "Enter calculation...";
  dialogueText.innerText = "The heavy gate is controlled by a digital vault layout cipher code panel.\n\n'A grandfather, a father, and a son walk into a room, yet there are only two people in total. Multiply their total head count by the year Teacher Robert was founded (1975). Type the final math answer.'\n\n💡 EXTENDED HINT: The grandfather IS a father, so there are only 2 people total. Math formula: 2 * 1975 = ?";
  startRoomTimer(45);
}

function showRoomUnderTable() {
  currentRoom = 11;
  clearEverything();
  robert.className = "visible robert-center";
  dialogueText.innerText = "What was I thinking?! I hid under the desk, but the wooden panels just got ripped to shreds by his bare hands. He's looking down at me right now laughing. It's over.";

  var btn = document.createElement("button");
  btn.innerText = "Accept fate...";
  btn.onclick = function () { showGameOver(); };
  choiceButtons.appendChild(btn);
}

function showRoomBlindPanic() {
  currentRoom = 12;
  clearEverything();
  caveBackground.className = "hidden";
  document.body.className = "totalBlackout";
  dialogueText.innerText = "I ran completely blind in the dark and smashed my head directly into a sharp hanging stalactite rock. I'm dizzy on the floor, and I can hear his heavy breathing right over my face...";

  var btn = document.createElement("button");
  btn.innerText = "Look up...";
  btn.onclick = function () { showGameOver(); };
  choiceButtons.appendChild(btn);
}

function showGameOver() {
  currentRoom = 99;
  clearEverything();
  stopBackgroundMusic();
  playScreamSound();

  caveBackground.className = "hidden";
  document.body.className = "bloodFlash";
  robert.className = "visible robert-closeup";
  skull.className = "visible";
  leftHand.className = "hidden";
  rightHand.className = "hidden";
  dialogueText.innerText = "GAME OVER. Teacher Robert captured you. You became another lost student in his cave.";

  var btn = document.createElement("button");
  btn.innerText = "Return to Main Menu";
  btn.onclick = function () { window.location.href = "index.html"; };
  choiceButtons.appendChild(btn);
}

function showVictory() {
  currentRoom = 100;
  clearEverything();
  stopBackgroundMusic();
  playWinSound();

  caveBackground.className = "hidden";
  document.body.className = "blackout";
  door.className = "visible";
  dialogueText.innerText = "ACCESS GRANTED! The massive hydraulic security blast doors slowly slide open! Bright morning sunlight blindingly pours inside the room. I run out into freedom, leaving Teacher Robert locked inside the deep cave forever. I survived!";

  var btn = document.createElement("button");
  btn.innerText = "Play Again";
  btn.onclick = function () { window.location.href = "index.html"; };
  choiceButtons.appendChild(btn);
}

// ─────────────────────────────────────────────────────────────────────────
// 7. INTERACTIVE INPUT HANDLERS
// ─────────────────────────────────────────────────────────────────────────
lightSwitch.onclick = function () { if (currentRoom === 2) { showRoom3(); } };
heart.onclick = function () { if (currentRoom === 4) { showRoom5(); } };

function checkMyTyping() {
  var typedAnswer = typingInput.value.trim().toUpperCase();

  if (currentRoom === 3) {
    if (typedAnswer === "LEFT") { showRoom4(); }
    else if (typedAnswer === "RIGHT") { showRoomBlindPanic(); }
    else { showGameOver(); }
  }
  else if (currentRoom === 5) {
    if (typedAnswer === "KEYBOARD") { showRoom6(); } else { showGameOver(); }
  }
  else if (currentRoom === 6) {
    if (typedAnswer === "FOOTSTEPS" || typedAnswer === "FOOTSTEP") { showRoom7(); } else { showGameOver(); }
  }
  // NEW SCENE RIDDLE SYSTEM RESOLUTION
  else if (currentRoom === 16) {
    if (typedAnswer === "FIRE" || typedAnswer === "A FIRE") { showRoomTrackEscape(); } else { showGameOver(); }
  }
  else if (currentRoom === 8) {
    if (typedAnswer === "BREATH" || typedAnswer === "AIR" || typedAnswer === "A BREATH") { showRoom9(); } else { showGameOver(); }
  }
  else if (currentRoom === 10) {
    if (typedAnswer === "3950") { showVictory(); } else { showGameOver(); }
  }
}

// ── GLOBAL REGISTRATION OF KEYBOARD SELECTION CLICKS ──────────────────────
window.onkeydown = function (event) {
  var keyPressed = event.key.toUpperCase();

  // If a live keypress typing event sequence is currently loaded on screen
  if (isKeyTapActive) {
    var expectedKey = keyTapTargetString[keyTapCurrentIndex];

    if (keyPressed === expectedKey) {
      keyTapCurrentIndex++;
      playClickSound();

      // Instantly update the visual prompt string display
      var promptBox = document.getElementById("keyPromptBox");
      if (promptBox) {
        promptBox.innerText = "TAP: " + generatePromptString();
      }

      // Check if player tapped every single needed letter successfully
      if (keyTapCurrentIndex >= keyTapTargetString.length) {
        if (currentRoom === 15) {
          showRoomDeepCore(); // Move from Vent Drop to Deep Core Riddle
        } else if (currentRoom === 17) {
          showRoom8();        // Move from Tracks Escape back into Room 8 Boss Scene
        }
      }
    } else {
      // If they type any wrong key during the reaction window, it triggers an instant game-over
      if (["SHIFT", "CONTROL", "ALT", "META", "CAPSLOCK"].indexOf(keyPressed) === -1) {
        showGameOver();
      }
    }
    return; // Block execution layout routing so it doesn't leak into text input checks
  }

  // Fallback: Enable normal input box operations when pressing "Enter"
  if (event.key === "Enter") {
    checkMyTyping();
  }
};

typingButton.onclick = checkMyTyping;
menuButton.onclick = function () { window.location.href = "index.html"; };

showRoom1();