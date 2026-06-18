//LINKING HTML ELEMENTS TO JAVASCRIPT VARIABLES
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
var clickSound = document.getElementById("clickSound");
var arrowSound = document.getElementById("arrowSound");

// GAME STATE VARIABLES
var currentRoom = 1;
var timerTracker = null;
var moleClicks = 0;

// KEY-TAP CHALLENGES
var keyTapTargetString = ""; //the string to be typed
var keyTapCurrentIndex = 0; //current position in the string
var isKeyTapActive = false; //tells whether the challenge is happening


// Music and Sounds
function startBackgroundMusic() {
  bgMusic.play();
}

function stopBackgroundMusic() {
  bgMusic.pause();
  bgMusic.currentTime = 0;
}

function playScreamSound() {
  // dont need to rest time to 0 because it can only happen once per run
  scareSound.play();
}

function playClickSound() {
  clickSound.currentTime = 0;
  clickSound.play();
  console.log("SFX: click/type");
}

function playArrowSound() {
  arrowSound.currentTime = 0;
  arrowSound.play();
  console.log("SFX: Arrow Fired");
}

function playWinSound() {
  console.log("SFX: Win!");
  //to be continued
}


// SCREEN RESET
function clearEverything() {
  clearTimeout(timerTracker);
  isKeyTapActive = false;

  typingInput.onkeydown = null;//prevents enter key 

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

  // Reset hands back to normal
  leftHand.className = "visible";
  rightHand.className = "visible";

  //makes the background img visible again
  caveBackground.className = "visible";

  //gets rid of all extra css effects
  document.body.className = "";

  // Find all temporary clone images on the screen and delete them one by one
  var oldClones = document.querySelectorAll(".temp-clone");
  for (var i = 0; i < oldClones.length; i++) {
    var c = oldClones[i];
    c.remove();
  }

  // If a keyboard challenge letters box is still on the screen, delete it
  var oldPrompt = document.getElementById("keyPromptBox");
  if (oldPrompt) {
    oldPrompt.remove();
  }

  //clears the typing areas
  typingArea.className = "hidden";
  typingInput.value = "";
  choiceButtons.innerHTML = "";
}


// TIMEOUT PROGRESS
function startRoomTimer(secondsToWait) {//creates a timer bar 
  timerBar.className = "visible";
  timerFill.style.width = "100%";
  timerFill.style.transition = "none";

  setTimeout(function () {
    timerFill.style.transition = "width " + secondsToWait + "s linear";
    timerFill.style.width = "0%";
  }, 50) //50 ms delay so it dont break)

  //in background, once it hits 6 secs gameover screen shows
  timerTracker = setTimeout(function () {
    showGameOver();
  }, secondsToWait * 1000);
}

function startKeyTapChallenge(targetLetters, secondsToComplete) {
  //the "xqsp thing"

  isKeyTapActive = true;//turns the key tap challenge mode on

  //make it so that it doesnt matter if caps or not
  keyTapTargetString = targetLetters.toUpperCase();

  //lets the player start from the very beginning of the sequence
  keyTapCurrentIndex = 0;

  //creates a fresh new blank text box in my container
  var promptDisplay = document.createElement("div");

  promptDisplay.id = "keyPromptBox"; //label for the css


  promptDisplay.innerText = "TAP: " + generatePromptString();// new text

  uiPanel.appendChild(promptDisplay);//places it in uiPanel

  startRoomTimer(secondsToComplete);//creates a timer bar for this
}

function generatePromptString() {
  var output = "";
  for (var i = 0; i < keyTapTargetString.length; i++) {
    //if you moved onto the next one, the previous one will be "_ "
    if (i < keyTapCurrentIndex) {
      output += "_" + " ";

    } else {
      output += keyTapTargetString[i] + " ";//grabs the letter and puts it to the output string
    }
  }
  return output;
}


//ROOMS

function showRoom1() {
  currentRoom = 1;
  clearEverything();
  dialogueText.innerText = "Oh my god... the heavy door just slammed shut behind me. I'm completely trapped in here. I can hear heavy thudding footsteps echoing deeper inside the cave. \n Teacher Robert is coming for me. What should I do?!";

  var btn1 = document.createElement("button");
  btn1.innerText = "slowly walk into the dark tunnel.";
  btn1.onclick = function () {
    startBackgroundMusic();
    playClickSound();
    showRoom2();
  };
  choiceButtons.appendChild(btn1);

  var btn2 = document.createElement("button");
  btn2.innerText = "Dive under that dusty old desk right there.";
  btn2.onclick = function () {
    startBackgroundMusic();
    playClickSound();
    showRoomDeskPuzzle();
  };
  choiceButtons.appendChild(btn2);
}

function showRoomDeskPuzzle() {
  currentRoom = "deskPuzzle";
  clearEverything(); //Stops any other background room clocks
  blackOut();
  //Turn on the text input layout box
  typingArea.className = "visible";
  typingInput.value = "";
  typingInput.placeholder = "Type the 4 colors here...";

  //the panic scenario text
  dialogueText.innerText = "You dive under the desk. Peeking out, you see an emergency panel with 4 colored wires cut: RED, BLUE, GREEN, YELLOW.\n\nTeacher Robert is right outside! You need to reconnect the power safely. Type all 4 colors in alphabetical order with spaces, then press Enter";

  //Start a 15-second timer
  startRoomTimer(15);

  //Listen for pressing enter in the text input box
  typingInput.onkeydown = function (e) {
    if (e.key === "Enter") {
      var playerAnswer = typingInput.value.toUpperCase().trim();

      // Alphabetical order for: RED, BLUE, GREEN, YELLOW 
      // is: BLUE GREEN RED YELLOW
      if (playerAnswer === "BLUE GREEN RED YELLOW") {
        playClickSound();
        typingArea.className = "hidden"; // Hide the typing block frame
        typingInput.value = "";
        showRoomDeskSuccess(); // Go to the safe room
      } else {
        // Keeps the timer ticking down but gives feedback on a screw-up
        dialogueText.innerText = "ERROR: WRONG COMBINATION!\nThe wires spark! Quick, type the 4 colors in alphabetical order (separated by spaces)!";
        typingInput.value = "";
      }
    }
  };
}

function showRoomDeskSuccess() {
  currentRoom = "deskSuccess";
  clearEverything(); // Cuts the 15-second timeer and stuff

  dialogueText.innerText = "The battery turns on to life under the desk. A low electrical buzzing sound distracts Teacher Robert, and you hear his heavy footsteps stomp away down the opposite wall. You crawled back out from under the desk safely.";

  // Create the progression button to keep moving through the game
  var moveOnBtn = document.createElement("button");
  moveOnBtn.innerText = "Creep down the corridor where Robert came from.";
  moveOnBtn.onclick = function () {
    playClickSound();
    showRoom2(); // Loops them back into the main path room
  };
  choiceButtons.appendChild(moveOnBtn);
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
  dialogueText.innerText = "NO! The bulb exploded! Total darkness! I hear something sprinting straight at me at full speed! Dodge immediately!\n\nType 'LEFT' or 'RIGHT' and hit enter to jump out of the way!";
  startRoomTimer(6);
}

function showRoom4() {
  currentRoom = 4;
  clearEverything();

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
  dialogueText.innerText = "It actually worked! He's screaming in pain! I just found an old hunting bow on the ground. I need to aim it at him! He's dropping another riddle equation!:\n\n'The more of them you take, the more you leave behind. What are they?'\n\n💡 HINT: Think about what the boots leave in the mud when running away.";
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
  btn.onclick = function () {
    playClickSound();
    showRoomMoleIntro();
  };
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
    if (moleClicks >= 4) {
      showRoomVentDrop();
    }
  };
  gameWorld.appendChild(cloneImg);
}

function showRoomVentDrop() {
  currentRoom = 15;
  clearEverything();

  caveBackground.className = "hidden";
  document.body.className = "totalBlackout";
  leftHand.className = "hidden";
  rightHand.className = "hidden";

  dialogueText.innerText = "You dive headfirst down the ventilation shaft to escape the clone room! But the ancient metal shafts are splitting apart! You have to crawl and grab the edges instantly!\n\n⚠️ QUICK REFLEX KEY EVENT: Click on the screen to focus, then tap these keys quickly in order to stay on the path!";

  startKeyTapChallenge("XQSP", 5);
}

function showRoomDeepCore() {
  currentRoom = 16;
  clearEverything();

  caveBackground.className = "hidden";
  document.body.className = "blackout";
  typingArea.className = "visible";
  typingInput.placeholder = "Answer here...";

  dialogueText.innerText = "You land safely at the bottom of the deep shaft. It's an abandoned furnace grid! Suddenly, a locked security valve terminal blocks the route. A text warning flashes on the rusted console screen:\n\n'Give me food, and I will live. Give me water, and I will die. What am I?'\n\n💡 HINT: Think of wood campfire logs burning in the dark context.";

  startRoomTimer(30);
}

function showRoomTrackEscape() {
  currentRoom = 17;
  clearEverything();

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
  btn.onclick = function () {
    playClickSound();
    showRoom10();
  };
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

// function showRoomUnderTable() {
//   currentRoom = 11;
//   clearEverything();
//   robert.className = "visible robert-center";
//   dialogueText.innerText = "What was I thinking?! I hid under the desk, but the wooden panels just got ripped to shreds by his bare hands. He's looking down at me right now laughing. It's over.";

//   var btn = document.createElement("button");
//   btn.innerText = "Accept fate...";
//   btn.onclick = function () {
//     playClickSound();
//     showGameOver();
//   };
//   choiceButtons.appendChild(btn);
// }

function showRoomBlindPanic() {
  currentRoom = 12;
  clearEverything();
  caveBackground.className = "hidden";
  document.body.className = "totalBlackout";
  dialogueText.innerText = "I ran completely blind in the dark and smashed my head directly into a sharp hanging stalactite rock. I'm dizzy on the floor, and I can hear his heavy breathing right over my face...";

  var btn = document.createElement("button");
  btn.innerText = "Look up...";
  btn.onclick = function () {
    playClickSound();
    showGameOver();
  };
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
  btn.onclick = function () {
    playClickSound();
    window.location.href = "index.html";
  };
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
  btn.onclick = function () {
    playClickSound();
    window.location.href = "index.html";
  };
  choiceButtons.appendChild(btn);
}


// 7. INTERACTIVE INPUT HANDLERS
lightSwitch.onclick = function () {
  if (currentRoom === 2) {
    playClickSound();
    showRoom3();
  }
};

heart.onclick = function () {
  if (currentRoom === 4) {
    playClickSound();
    showRoom5();
  }
};

function checkMyTyping() {
  playClickSound();
  var typedAnswer = typingInput.value.trim().toUpperCase();

  if (currentRoom === 3) {
    if (typedAnswer === "LEFT") {
      showRoom4();
    } else if (typedAnswer === "RIGHT") {
      showRoomBlindPanic();
    } else {
      showGameOver();
    }
  } else if (currentRoom === 5) {
    if (typedAnswer === "KEYBOARD") {
      showRoom6();
    } else {
      showGameOver();
    }
  } else if (currentRoom === 6) {
    if (typedAnswer === "FOOTSTEPS" || typedAnswer === "FOOTSTEP") {
      showRoom7();
    } else {
      showGameOver();
    }
  } else if (currentRoom === 16) {
    if (typedAnswer === "FIRE" || typedAnswer === "A FIRE") {
      showRoomTrackEscape();
    } else {
      showGameOver();
    }
  } else if (currentRoom === 8) {
    if (typedAnswer === "BREATH" || typedAnswer === "AIR" || typedAnswer === "A BREATH") {
      showRoom9();
    } else {
      showGameOver();
    }
  } else if (currentRoom === 10) {
    if (typedAnswer === "3950") {
      showVictory();
    } else {
      showGameOver();
    }
  }
}

// GLOBAL REGISTRATION OF KEYBOARD SELECTION CLICKS
window.onkeydown = function (event) {
  var keyPressed = event.key.toUpperCase();

  if (isKeyTapActive) {
    var expectedKey = keyTapTargetString[keyTapCurrentIndex];

    if (keyPressed === expectedKey) {
      keyTapCurrentIndex++;
      playClickSound();

      var promptBox = document.getElementById("keyPromptBox");
      if (promptBox) {
        promptBox.innerText = "TAP: " + generatePromptString();
      }

      if (keyTapCurrentIndex >= keyTapTargetString.length) {
        if (currentRoom === 15) {
          showRoomDeepCore();
        } else if (currentRoom === 17) {
          showRoom8();
        }
      }
    } else {
      if (["SHIFT", "CONTROL", "ALT", "META", "CAPSLOCK"].indexOf(keyPressed) === -1) {
        playClickSound();
        showGameOver();
      }
    }
    return;
  }

  if (event.key === "Enter") {
    checkMyTyping();
  }
};

typingButton.onclick = checkMyTyping;
menuButton.onclick = function () {
  playClickSound();
  window.location.href = "index.html";
};

showRoom1();