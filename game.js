// This event waits until the entire HTML page loads before executing code
document.addEventListener("DOMContentLoaded", function () {

    // ── 1. ELEMENT SELECTION ─────────────────────────────────────────────
    // Grabbing elements from HTML using their unique ID tags so JS can change them.
    const robertImg = document.getElementById("robertImage");
    const switchImg = document.getElementById("lightSwitchImage");
    const keypadImg = document.getElementById("keypadImage");
    const arrowImg  = document.getElementById("flamingArrowImage");
    const skullImg  = document.getElementById("skullImage");
    const doorImg   = document.getElementById("doorImage");
    const heartImg  = document.getElementById("heartImage");
    const leftHand  = document.getElementById("leftHandImage");
    const rightHand = document.getElementById("rightHandImage");

    const dialogueText = document.getElementById("dialogueText");
    const choiceButtons = document.getElementById("choiceButtons");
    const typingArea   = document.getElementById("typingArea");
    const typingInput  = document.getElementById("typingInput");
    const typingButton = document.getElementById("typingButton");
    const gameBody     = document.getElementById("gameBody");
    const menuButton   = document.getElementById("menuButton");

    // ── 2. GAME VARIABLES ────────────────────────────────────────────────
    let currentRoom = 1; 
    let clickCounter = 0; // Tracks clicking actions for interaction events

    // ── 3. SOUND CONTROLLER (EASY PLACEHOLDERS) ─────────────────────────
    // To add real sounds later, uncomment the lines inside this function!
    function playSoundEffect(soundType) {
        if (soundType === "click") {
            console.log("Playing Sound: UI Button Clicked");
            // new Audio("sounds/click.mp3").play();
        }
        if (soundType === "scare") {
            console.log("Playing Sound: Loud Jumpscare Scream!");
            // new Audio("sounds/scream.mp3").play();
        }
        if (soundType === "arrow") {
            console.log("Playing Sound: Arrow shooting swissssh!");
            // new Audio("sounds/arrow.mp3").play();
        }
        if (soundType === "win") {
            console.log("Playing Sound: Victory Fanfare");
            // new Audio("sounds/victory.mp3").play();
        }
    }

    // ── 4. HELPER FUNCTION: RESET THE VIEW ──────────────────────────────
    // Turns off every image and option before we build a brand new scene layout.
    function resetScreen() {
        robertImg.style.display = "none";
        switchImg.style.display = "none";
        keypadImg.style.display = "none";
        arrowImg.style.display = "none";
        skullImg.style.display = "none";
        doorImg.style.display = "none";
        heartImg.style.display = "none";
        
        // Default hands back to visible state
        leftHand.style.display = "block";
        rightHand.style.display = "block";

        // Remove any specialty background override classes
        gameBody.className = "";
        
        // Hide text keyboard inputs, clear past input text values
        typingArea.style.display = "none";
        typingInput.value = "";

        // Completely empty out the old selection buttons box container
        choiceButtons.innerHTML = "";
    }

    // ── 5. HELPER FUNCTION: CREATE OPTION BUTTONS ───────────────────────
    // A clean utility function that generates buttons inside the bottom UI panel.
    function createOptionButton(buttonText, targetRoomNumber) {
        const newBtn = document.createElement("button");
        newBtn.innerText = buttonText;
        
        // When clicked, run room change function passing target room destination
        newBtn.onclick = function() {
            playSoundEffect("click");
            goToRoom(targetRoomNumber);
        };
        choiceButtons.appendChild(newBtn);
    }

    // ── 6. THE CORE GAME STATE ENGINE ────────────────────────────────────
    // Main execution function. Reads the room number and explicitly renders it.
    function goToRoom(roomNumber) {
        currentRoom = roomNumber;
        resetScreen();

        switch(roomNumber) {

            case 1:
                dialogueText.innerText = "You stepped inside the cold stone cave...";
                createOptionButton("Investigate the dark tunnel.", 2);
                createOptionButton("Hide underneath a big heavy desk.", 10);
                break;

            case 2:
                dialogueText.innerText = "A physical light switch is right here on the stone wall. Move your mouse up and click directly on it to flip it!";
                gameBody.classList.add("darkScene");
                
                // Make the physical element switch visible on screen so user can click it directly!
                switchImg.style.display = "block"; 
                break;

            case 3:
                dialogueText.innerText = "THE LIGHTS WENT OUT! RUN BEFORE HE GRABS YOU!";
                gameBody.classList.add("blackout");
                createOptionButton("DUCK INTO THE CORNER OF THE CAVE", 4);
                break;

            case 4:
                dialogueText.innerText = "Teacher Robert CHARGES TOWARDS YOU! Quick, click the glowing survival heart appearing on screen to dodge him!";
                robertImg.style.display = "block";
                robertImg.className = "robert-center"; 
                
                // Interactive event: Make a survival heart element appear to click on
                heartImg.style.display = "block";
                break;

            case 5:
                dialogueText.innerText = "You successfully dodge his charging attack! He stumbles backwards into the center.";
                robertImg.style.display = "block";
                robertImg.className = "robert-center";
                createOptionButton("Draw your heavy bow and shoot.", 6);
                break;

            case 6:
                dialogueText.innerText = "HE SEES YOU. Type 'FIRE' exactly into the box below to release the flaming arrow!";
                robertImg.style.display = "block";
                robertImg.className = "robert-center";
                typingArea.style.display = "block"; // Show the user text input area
                break;

            case 7:
                dialogueText.innerText = "DIRECT HIT. He staggers backward away from you into the abyss.";
                playSoundEffect("arrow");
                robertImg.style.display = "block";
                robertImg.className = "robert-left";
                
                // Show the flaming arrow element running its fly CSS movement script animation
                arrowImg.style.display = "block";
                arrowImg.className = "shooting";

                createOptionButton("Sprint for the exit.", 8);
                break;

            case 8:
                dialogueText.innerText = "Robert blocks the final exit path, absolutely FURIOUS.";
                robertImg.style.display = "block";
                robertImg.className = "robert-center";
                createOptionButton("Punch him square in the jaw.", 9);
                createOptionButton("Try to reason with him calmly.", 11);
                break;

            case 9:
                dialogueText.innerText = "You punch him square in the jaw! Run away while he's staggered!";
                robertImg.style.display = "block";
                robertImg.className = "robert-right";
                createOptionButton("Keep running without stopping.", 12);
                break;

            case 10:
                dialogueText.innerText = "You crawl under the desk. His loud footsteps echo near and stop. He is inches away... you failed to escape.";
                createOptionButton("See what happens...", 99);
                break;

            case 11:
                dialogueText.innerText = "He listens to you for a split second, then smashes you directly into the stone wall. Everything turns dark.";
                createOptionButton("Continue...", 99);
                break;

            case 12:
                dialogueText.innerText = "The heavy cave security gate snaps open. You bolt out into the darkness ahead!";
                gameBody.classList.add("rushScene");
                leftHand.style.display = "none";  // Hiding hands for perspective cinematic zoom style
                rightHand.style.display = "none";
                createOptionButton("Keep running toward the light.", 13);
                break;

            case 13:
                dialogueText.innerText = "A terminal code keypad flashes in the dark. Type the safety exit code '1975' to unlock the exit door!";
                gameBody.classList.add("darkScene");
                keypadImg.style.display = "block";
                typingArea.style.display = "block"; // Open input interaction system
                break;

            case 99: // GAME OVER SCENE STATE
                dialogueText.innerText = "GAME OVER. Teacher Robert captured you.";
                playSoundEffect("scare");
                
                gameBody.classList.add("bloodFlash");
                skullImg.style.display = "block";
                
                robertImg.style.display = "block";
                robertImg.className = "robert-closeup"; // Trigger giant zoom animation via style class
                
                leftHand.style.display = "none";
                rightHand.style.display = "none";

                createOptionButton("Return to Main Menu", -1);
                break;

            case 100: // VICTORY SCENE STATE
                dialogueText.innerText = "You successfully opened the heavy gate and escaped into the sunlight! You survived.";
                playSoundEffect("win");
                gameBody.classList.add("doorScene");
                doorImg.style.display = "block";
                
                createOptionButton("Play Again", -1);
                break;
        }
    }

    // ── 7. DIRECT INTERACTION EVENT LISTENERS ────────────────────────────
    
    // Direct Image Interaction Event 1: Clicking the physical Light Switch
    switchImg.onclick = function() {
        goToRoom(3); // Moves straight to blackout scene
    };

    // Direct Image Interaction Event 2: Clicking the Life Saving Heart graphic
    heartImg.onclick = function() {
        goToRoom(5); // Moves straight to escape success scene
    };

    // Text Input Submission Handler: Typing Interaction Box Button
    typingButton.onclick = function() {
        checkTypingSubmission();
    };

    // Allow players to hit the "Enter" key on keyboard to submit typing texts
    typingInput.onkeydown = function(event) {
        if (event.key === "Enter") {
            checkTypingSubmission();
        }
    };

    // Evaluates typed input strings depending entirely on what room state user is in
    function checkTypingSubmission() {
        const userText = typingInput.value.trim().toUpperCase();

        if (currentRoom === 6) {
            if (userText === "FIRE") {
                goToRoom(7);
            } else {
                goToRoom(99); // Wrong entry results in game over
            }
        } 
        else if (currentRoom === 13) {
            if (userText === "1975") {
                goToRoom(100); // Correct code yields Victory!
            } else {
                goToRoom(99);
            }
        }
    }

    // Top Right Emergency Escape Menu Button navigation click handler
    menuButton.onclick = function() {
        window.location.href = "index.html";
    };

    // ── 8. EXECUTION INITIALIZER ────────────────────────────────────────
    // Kick off the whole sequence game starting on scene space 1 on execution load
    goToRoom(1);
});