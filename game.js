document.addEventListener("DOMContentLoaded", function () {

  // ── PAGE ELEMENTS ──────────────────────────────────────────────────────
  // We grab every HTML element the game needs to change.

  const img = {
    robert: document.getElementById("robertImage"),
    switch: document.getElementById("lightSwitchImage"),
    keypad: document.getElementById("keypadImage"),
    arrow:  document.getElementById("flamingArrowImage"),
    skull:  document.getElementById("skullImage"),
    door:   document.getElementById("doorImage"),
    lHand:  document.getElementById("leftHandImage"),
    rHand:  document.getElementById("rightHandImage"),
  };

  const ui = {
    text:    document.getElementById("dialogueText"),
    buttons: document.getElementById("choiceButtons"),
    keys:    document.getElementById("keyRow"),
    timer:   document.getElementById("timerBar"),
    fill:    document.getElementById("timerFill"),
    typingArea: document.getElementById("typingArea"),
    typingInput: document.getElementById("typingInput"),
    typingButton: document.getElementById("typingButton"),
  };

  const audio = {
    music:  document.getElementById("bgMusic"),
    scream: document.getElementById("scareSound"),
  };

  // ── GAME STATE ──────────────────────────────────────────────────────────
  // These variables track what's happening at this exact moment.

  let currentRoom  = null;  // the room object currently on screen
  let qteIndex     = 0;     // which key in the sequence the player is on
  let qteActive    = false; // true while the player must press a key sequence
  let timerTimeout = null;  // the countdown until game-over
  let timerTick    = null;  // the visual timer bar updater

  // ── ROOMS ───────────────────────────────────────────────────────────────
  // Think of ROOMS as the story cards in a deck.
  // Each room tells the game what to show and where to go next.
  //
  //  id           — unique number for this room
  //  text         — the sentence shown in the bottom panel
  //  options      — list of clickable buttons; each has text and a goTo id
  //  requiredKeys — if present, a QTE (quick-time event) instead of buttons
  //  qteSuccessGoTo — room to go to when the QTE is completed
  //  timeLimit    — milliseconds before the game forces timeoutGoTo
  //  timeoutGoTo  — room to go to when time runs out
  //  isBlackout   — makes the background black
  //  bloodFlash   — makes the background red (used in game over)
  //  showSwitch   — shows the light-switch image
  //  showKeypad   — shows the keypad image
  //  showRobert   — shows Teacher Robert
  //  robertCloseup— makes Robert fill the screen (horror effect)
  //  robertPosition — "left", "center", "right", or "abyss"
  //  shootArrow   — plays the arrow-fly animation
  //  showSkull    — shows the pixel-art skull (game over rooms)
  //  showDoor     — shows the pixel-art door (victory rooms)
  //  hideHands    — hides the player's first-person hands
  //  playScream   — plays the scare sound

  const ROOMS = [

    {
      id: 1,
      text: "You stepped inside the stone cave...",
      options: [
        { text: "Investigate the dark tunnel.", goTo: 2 },
        { text: "Hide underneath a big heavy desk.", goTo: 10 }
      ]
    },

    {
      id: 2,
      isBlackout: true,
      showSwitch: true,
      text: "A light switch is blinking. Type LIGHT to flip it.",
      typingPrompt: "LIGHT",
      typingSuccessGoTo: 3
    },

    {
      id: 3,
      isBlackout: true,
      text: "THE LIGHTS WENT OUT! RUN BEFORE HE GRABS YOU!",
      timeLimit: 2500,
      timeoutGoTo: 99,
      options: [
        { text: "DUCK INTO THE CORNER OF THE CAVE", goTo: 4 }
      ]
    },

    {
      id: 4,
      showRobert: true,
      robertPosition: "right",
      text: "Teacher Robert CHARGES TOWARDS YOU! Press the key combo to break free!",
      timeLimit: 4000,
      timeoutGoTo: 99,
      requiredKeys: ["W", "S", "A", "D", "F", "G", "P", "A"],
      qteSuccessGoTo: 5
    },

    {
      id: 5,
      showRobert: true,
      robertPosition: "center",
      text: "You kick his legs and break free! He stumbles backwards.",
      options: [
        { text: "Draw your bow and shoot.", goTo: 6 }
      ]
    },

    {
      id: 6,
      showRobert: true,
      robertPosition: "center",
      text: "HE SEES YOU. Release the flaming arrow.",
      timeLimit: 3000,
      timeoutGoTo: 99,
      requiredKeys: ["Q", "R", "E", "X", "C", "V", "Q"],
      qteSuccessGoTo: 7
    },

    {
      id: 7,
      showRobert: true,
      robertPosition: "left",
      shootArrow: true,
      text: "DIRECT HIT. He staggers back into the abyss.",
      options: [
        { text: "Sprint for the exit.", goTo: 8 }
      ]
    },

    {
      id: 8,
      showRobert: true,
      robertPosition: "center",
      text: "Robert blocks the path, FURIOUS.",
      options: [
        { text: "Punch him.", goTo: 9 },
        { text: "Reason with him.", goTo: 11 }
      ]
    },

    {
      id: 9,
      showRobert: true,
      robertPosition: "right",
      text: "You punch him square in the jaw and bolt.",
      options: [
        { text: "Keep running.", goTo: 12 }
      ]
    },

    {
      id: 10,
      showRobert: true,
      robertPosition: "center",
      text: "You crawl under the desk. His footsteps stop. He is inches away.",
      options: [
        { text: "Hold your breath.", goTo: 99 }
      ]
    },

    {
      id: 11,
      isBlackout: true,
      text: "He listens. Then he smashes you into the wall. Everything goes dark.",
      options: [
        { text: "Main Menu", goTo: -1 }
      ]
    },

    {
      id: 12,
      escapeRun: true,
      isBlackout: true,
      text: "The cage snaps open. You bolt into the dark and the world zooms in.",
      options: [
        { text: "Keep running.", goTo: 13 }
      ]
    },

    {
      id: 13,
      showKeypad: true,
      escapeRun: true,
      text: "A keypad flashes in the dark. Type 1975 to unlock the door.",
      typingPrompt: "1975",
      typingSuccessGoTo: 101
    },

    {
      id: 99,
      showRobert: true,
      robertCloseup: true,
      bloodFlash: true,
      hideHands: true,
      playScream: true,
      showSkull: true,
      text: "GAME OVER",
      options: [
        { text: "Main Menu", goTo: -1 }
      ]
    },

    {
      id: 100,
      showDoor: true,
      text: "You escaped into the sunlight. You survived.",
      options: [
        { text: "Main Menu", goTo: -1 }
      ]
    },

    {
      id: 101,
      showDoor: true,
      escapeRun: true,
      text: "The cage swings open. You sprint through and never look back.",
      options: [
        { text: "Main Menu", goTo: -1 }
      ]
    }

  ];

  // ── NAV BUTTONS ─────────────────────────────────────────────────────────
  // These buttons exist only on the relevant page; the checks prevent errors
  // when a button is missing (e.g., "startButton" only exists on index.html).

  const startBtn = document.getElementById("startButton");
  const menuBtn  = document.getElementById("menuButton");

  if (startBtn) startBtn.onclick = () => { window.location.href = "inGame.html"; };
  if (menuBtn)  menuBtn.onclick  = () => { window.location.href = "index.html"; };

  // ── MUSIC ────────────────────────────────────────────────────────────────
  // .catch() silences the browser error that fires if autoplay is blocked.

  if (audio.music) audio.music.play().catch(() => {});

  if (ui.typingButton) {
    ui.typingButton.addEventListener("click", checkTypingAnswer);
  }

  if (ui.typingInput) {
    ui.typingInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") checkTypingAnswer();
    });
  }

  // ── KEYBOARD INPUT ───────────────────────────────────────────────────────
  // Fires every time the player presses a key.
  // If a QTE is active, we check whether the right key was pressed.

  window.addEventListener("keydown", function (e) {
    if (!qteActive) return;

    const key    = e.key.toUpperCase();
    const needed = currentRoom.requiredKeys;

    if (key === needed[qteIndex]) {
      qteIndex++;
      renderKeyBoxes(needed, qteIndex);
      if (qteIndex >= needed.length) {  // all keys entered correctly
        stopTimers();
        goToRoom(currentRoom.qteSuccessGoTo);
      }
    } else {
      stopTimers();
      goToRoom(99);  // wrong key → instant game over
    }
  });

  // ── ROOM LOADER ──────────────────────────────────────────────────────────
  // This is the main switch. It loads the next room when the player clicks.

  function goToRoom(id) {
    if (id === -1) { window.location.href = "index.html"; return; }

    stopTimers();
    qteActive = false;
    qteIndex  = 0;

    const room = ROOMS.find(r => r.id === id);
    if (!room) return;
    currentRoom = room;

    setBackground(room);
    setImages(room);
    ui.text.innerText = room.text;
    setControls(room);

    if (room.timeLimit) startTimer(room);
    if (room.playScream && audio.scream) audio.scream.play().catch(() => {});
  }

  // ── HELPER FUNCTIONS ─────────────────────────────────────────────────────
  // Each helper has one simple job:
  // setBackground = change the look
  // setImages = show or hide pictures
  // setControls = decide what buttons or typing box appear

  function setBackground(room) {
    document.body.className = "";
    if (room.showDoor || room.id === 100 || room.id === 101) {
      document.body.classList.add("doorScene");
    }
    if (room.escapeRun) {
      document.body.classList.add("rushScene");
    }
    if (room.isBlackout)                   document.body.classList.add("blackout");
    if (room.bloodFlash)                   document.body.classList.add("bloodFlash");
    if (room.showSwitch || room.showKeypad) document.body.classList.add("darkScene");
  }

  function setImages(room) {
    // Hide everything first, then selectively show what this room needs.
    img.robert.classList.remove("robert-closeup", "robert-left", "robert-center", "robert-right");
    img.arrow.classList.remove("shooting", "visible");

    hide(img.robert);
    hide(img.switch);
    hide(img.keypad);
    hide(img.skull);
    hide(img.door);
    hide(img.arrow);

    if (room.escapeRun) {
      hide(img.robert);
      hide(img.lHand);
      hide(img.rHand);
    } else if (room.showRobert || room.robertCloseup) {
      const poseClass = room.robertCloseup ? "robert-closeup" : `robert-${room.robertPosition || "center"}`;
      show(img.robert, poseClass);
    }

    if (room.showSwitch) show(img.switch, "switch-glow");
    if (room.showKeypad) show(img.keypad);
    if (room.showSkull)  show(img.skull);
    if (room.showDoor)   show(img.door, "door-glow");

    if (room.shootArrow) {
      img.arrow.classList.remove("hidden");
      img.arrow.classList.add("visible", "shooting");
    }

    // Hands represent the player's first-person view;
    // hide them in full-screen horror moments.
    if (room.hideHands) {
      hide(img.lHand);
      hide(img.rHand);
    } else {
      show(img.lHand);
      show(img.rHand);
    }
  }

  function setControls(room) {
    ui.buttons.innerHTML = "";
    ui.keys.innerHTML    = "";
    ui.timer.className   = "hidden";

    if (ui.typingArea) ui.typingArea.className = "hidden";

    if (room.typingPrompt) {
      if (ui.typingArea) ui.typingArea.className = "";
      if (ui.typingInput) ui.typingInput.value = "";
      return;
    }

    if (room.requiredKeys) {
      qteActive = true;
      renderKeyBoxes(room.requiredKeys, 0);
      return;
    }

    room.options.forEach(opt => {
      const btn     = document.createElement("button");
      btn.innerText = opt.text;
      btn.onclick   = () => goToRoom(opt.goTo);
      ui.buttons.appendChild(btn);
    });
  }

  function checkTypingAnswer() {
    if (!currentRoom || !currentRoom.typingPrompt) return;

    const typed = (ui.typingInput?.value || "").trim().toUpperCase();
    const answer = currentRoom.typingPrompt.toUpperCase();

    if (typed === answer) {
      goToRoom(currentRoom.typingSuccessGoTo || 1);
    } else {
      goToRoom(99);
    }
  }

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

  function stopTimers() {
    clearTimeout(timerTimeout);
    clearInterval(timerTick);
  }

  function renderKeyBoxes(keys, currentIndex) {
    ui.keys.innerHTML = "";
    keys.forEach((key, i) => {
      const box     = document.createElement("div");
      box.className = i < currentIndex ? "keyBox correct" : "keyBox";
      box.innerText = key;
      ui.keys.appendChild(box);
    });
  }

  function show(el, extraClass = "") {
    if (!el) return;
    el.classList.remove("hidden");
    el.classList.add("visible");
    extraClass.split(/\s+/).filter(Boolean).forEach(cls => el.classList.add(cls));
  }

  function hide(el) {
    if (!el) return;
    el.classList.remove("visible", "shooting");
    el.classList.add("hidden");
  }

  // ── START ────────────────────────────────────────────────────────────────
  // Only kick off the game if the dialogue box exists (we're on inGame.html).

  if (ui.text) goToRoom(1);

});