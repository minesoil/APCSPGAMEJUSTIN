document.addEventListener("DOMContentLoaded", function () {

  // =========================
  // BUTTONS
  // =========================
  var startButton = document.getElementById("startButton");
  var menuButton = document.getElementById("menuButton");

  // =========================
  // GAME IMAGES
  // =========================
  var robert = document.getElementById("robertImage");
  var lightSwitch = document.getElementById("lightSwitchImage");
  var keypad = document.getElementById("keypadImage");
  var leftHand = document.getElementById("leftHandImage");
  var rightHand = document.getElementById("rightHandImage");
  var arrow = document.getElementById("flamingArrowImage");

  // =========================
  // UI ELEMENTS
  // =========================
  var textBox = document.getElementById("dialogueText");
  var buttonsBox = document.getElementById("choiceButtons");
  var keyRow = document.getElementById("keyRow");
  var timerBar = document.getElementById("timerBar");
  var timerFill = document.getElementById("timerFill");

  // =========================
  // AUDIO
  // =========================
  var bgMusic = document.getElementById("bgMusic");
  var scream = document.getElementById("scareSound");

  // =========================
  // GAME STATE
  // =========================
  var currentRoom = null;

  var qteIndex = 0;
  var qteActive = false;

  var timer = null;
  var timerLoop = null;

  // =========================
  // ROOMS (GAME LEVELS)
  // =========================
  var ROOMS = [

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
      text: "You look around the corner. A light switch on the rock wall was movingh all by itself.",
      options: [
        { text: "Reach out and flip the switch.", goTo: 3 }
      ]
    },

    {
      id: 3,
      isBlackout: true,
      text: "THE LIGHTS WENT OUT! RUN BEFORE HE GRABS YOU!",
      timeLimit: 2500,
      timeoutGoTo: 99,
      options: [
        { text: "DUCK INSIDE THE CORNER OF THE CAVE", goTo: 4 }
      ]
    },

    {
      id: 4,
      showRobert: true,
      robertPosition: "right",
      text: "Teacher Robert RUNS TOWARDS YOU! HE GRABS YOUR ARM! Press the key combo to break free!",
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
      shootArrow: true,
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
      text: "DIRECT HIT. He staggers back into the abyss.",
      options: [
        { text: "Sprint out.", goTo: 8 }
      ]
    },

    {
      id: 8,
      showRobert: true,
      robertPosition: "center",
      text: "Robert is FURIOUS.",
      options: [
        { text: "Punch him.", goTo: 9 },
        { text: "Reason with him.", goTo: 11 }
      ]
    },

    {
      id: 9,
      showRobert: true,
      robertPosition: "right",
      text: "You punch him and run.",
      options: [
        { text: "Keep running.", goTo: 12 }
      ]
    },

    {
      id: 10,
      showRobert: true,
      robertPosition: "center",
      text: "You hide under the desk. He is inches away.",
      options: [
        { text: "Hold breath.", goTo: 99 }
      ]
    },

    {
      id: 11,
      isBlackout: true,
      text: "He smashes you into the wall. Everything goes dark.",
      options: [
        { text: "Main Menu", goTo: -1 }
      ]
    },

    {
      id: 12,
      showKeypad: true,
      text: "A cage blocks your exit. Enter the code.",
      timeLimit: 5000,
      timeoutGoTo: 99,
      requiredKeys: ["1", "9", "7", "5"],
      qteSuccessGoTo: 101
    },

    {
      id: 99,
      // set width via property name instead of executing code here
      robertCloseup: true,
      robertPosition: "center",
      isBlackout: false,
      showRobert: true,
      bloodFlash: true,
      playScream: true,
      text: "GAME OVER",
      options: [
        { text: "Main Menu", goTo: -1 }
      ]
    },

    {
      id: 100,
      text: "You escaped.",
      options: [
        { text: "Main Menu", goTo: -1 }
      ]
    },

    {
      id: 101,
      text: "You escaped through the cage.",
      options: [
        { text: "Main Menu", goTo: -1 }
      ]
    }
  ];

  // =========================
  // NAV BUTTONS
  // =========================
  if (startButton) {
    startButton.onclick = function () {
      window.location.href = "inGame.html";
    };
  }

  if (menuButton) {
    menuButton.onclick = function () {
      window.location.href = "index.html";
    };
  }

  // =========================
  // MUSIC START
  // =========================
    bgMusic.play();

  // =========================
  // KEY INPUT (QTE SYSTEM)
  // =========================
  window.addEventListener("keydown", function (event) {

    if (!qteActive) return;

    var key = event.key.toUpperCase();

    var needed = currentRoom.requiredKeys;

    if (key === needed[qteIndex]) {

      qteIndex++;

      showKeyBoxes(needed, qteIndex);

      if (qteIndex >= needed.length) {
        stopTimers();
        loadRoom(currentRoom.qteSuccessGoTo);
      }

    } else {
      stopTimers();
      loadRoom(99);
    }
  });

  // =========================
  // MAIN GAME ENGINE
  // =========================





  // if(!robert){
  //   return;
  // }
  // if(room.id === 99) {
  //   robert.style.width = "900px";
  // }
  
  function moveRobert(position) {

    if (!robert) return;

    if (position === "left") {
      robert.style.left = "20%";
      robert.style.top = "55%";
    }

    if (position === "center") {
      robert.style.left = "50%";
      robert.style.top = "50%";
    }

    if (position === "right") {
      robert.style.left = "75%";
      robert.style.top = "55%";
    }

    if (position === "abyss") {
      robert.style.left = "10%";
      robert.style.top = "60%";
    }
  }

  function loadRoom(id) {

    if (id === -1) {
      window.location.href = "index.html";
      return;
    }

    stopTimers();

    qteActive = false;
    qteIndex = 0;

    var room = null;

    for (var i = 0; i < ROOMS.length; i++) {
      if (ROOMS[i].id === id) {
        room = ROOMS[i];
        break;
      }
    }

    if (!room) return;

    currentRoom = room;
    if (room.robertPosition) {
      moveRobert(room.robertPosition);
    }
    

    if(room.robertCloseup){
    robert.style.width = "1200px";
    robert.style.top = "120%";
    robert.style.animation = "jitter 200s infinite";
    }

    // BACKGROUND EFFECTS
    document.body.className = "";

    if (room.isBlackout) {
      document.body.classList.add("blackout");
    }

    if (room.bloodFlash) {
      document.body.classList.add("bloodFlash");
    }

    if (room.showSwitch || room.showKeypad) {
      document.body.classList.add("darkScene");
    }

    // IMAGE TOGGLE
    set(robert, room.showRobert);
    set(lightSwitch, room.showSwitch);
    set(keypad, room.showKeypad);

    arrow.classList.remove("shooting");
    arrow.classList.remove("hidden");

    if (room.shootArrow) {
      arrow.classList.add("shooting");
    } else {
      arrow.classList.add("hidden");
    }

    // TEXT
    textBox.innerText = room.text;

    // RESET UI
    buttonsBox.innerHTML = "";
    keyRow.innerHTML = "";
    timerBar.className = "hidden";

    // QTE OR OPTIONS
    if (room.requiredKeys) {

      qteActive = true;
      showKeyBoxes(room.requiredKeys, qteIndex);

    } else {

      for (var i = 0; i < room.options.length; i++) {

        var btn = document.createElement("button");
        btn.innerText = room.options[i].text;

        btn.onclick = (function (goTo) {
          return function () {
            loadRoom(goTo);
          };
        })(room.options[i].goTo);

        buttonsBox.appendChild(btn);
      }
    }

    // TIMER
    if (room.timeLimit) {

      timerBar.className = "";

      var timeLeft = room.timeLimit;

      timerFill.style.width = "100%";

      timerLoop = setInterval(function () {

        timeLeft -= 50;

        var percent = (timeLeft / room.timeLimit) * 100;
        if (percent < 0) percent = 0;

        timerFill.style.width = percent + "%";

      }, 50);

      timer = setTimeout(function () {
        loadRoom(room.timeoutGoTo);
      }, room.timeLimit);
    }
  }

  function showKeyBoxes(keys, currentIndex) {

    keyRow.innerHTML = "";

    for (var i = 0; i < keys.length; i++) {
      var box = document.createElement("div");
      box.className = "keyBox";

      // If they have successfully typed past this key's index, turn it green
      if (i < currentIndex) {
        box.classList.add("correct");
      }

      box.innerText = keys[i];
      keyRow.appendChild(box);
    }
  }

  function stopTimers() {
    clearTimeout(timer);
    clearInterval(timerLoop);
  }

  function set(el, show) {
    if (!el) return;
    // We now use classes to toggle opacity via CSS
    el.className = show ? "visible" : "hidden";
  }

  // START GAME
  if (textBox) {
    loadRoom(1);
  }

});