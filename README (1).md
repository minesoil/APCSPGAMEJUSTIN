# 🪓 Survive Teacher Robert — Ultimate Developer & Modding Guide

Welcome to the official, master-level documentation for **Survive Teacher Robert**, an immersive, choice-driven survival horror game built specifically for web browsers! 

Whether you are a 10th grader learning to program, a middle schooler looking to understand how video games work, or a developer trying to add your own custom twist to the game, this guide breaks down every single line of code, folder structure, and engine mechanic in the simplest way possible.

---

## 🗺️ 1. The Big Picture: How Web Games Work

Before digging into the code files, you must understand how a web browser builds a game on your screen. It uses a triple-layer system working together like a human body:

1. **The Skeleton (`HTML`):** Sets up *what* physical items exist on the stage (images, hidden text boxes, audio files, buttons).
2. **The Muscles & Paint (`CSS`):** Decides *how* those elements look (the red glow, the deep black rooms, hand positions, and the adrenaline camera tremors).
3. **The Brain (`JavaScript` / `JS`):** Coordinates the *logic*. It tracks what room you are in, spins your countdown timers, scans individual keyboard presses, handles button clicks, and triggers the jumpscare when you fail.

---

## 📂 2. Master Project Directory

To keep your project from breaking, all your files must live inside one main folder on your computer. Capital letters and file extensions (`.png`, `.js`, `.css`) matter! If you rename a file or move it out of this folder, the browser will lose it, resulting in a blank white screen.

```text
📁 Teacher-Robert-Game/
│
├── 📄 index.html          (The Main Menu / Landing Title Screen)
├── 📄 inGame.html         (The Gameplay Stage Screen Arena)
├── 📄 style.css           (The Visual Rules, Alignments, and Animations)
├── 📄 game.js            (The Data Engine Brain & State Timeline)
│
├── 📁 Images/             (Your Graphic Art Assets Folder)
│   ├── Cave.png                              (Gameplay background wallpaper)
│   ├── Home Screen.png                       (Main menu background wallpaper)
│   ├── Robert Background Removed Default.png (Our antagonist, Teacher Robert)
│   ├── lightswitch(flippable).png            (Room 2 circuit breaker item)
│   ├── Keypad.png                            (Room 10 escape vault panel)
│   ├── Flaming arrow.png                     (Room 7 flying weapon projectile)
│   ├── skull.png                             (Game Over death screen decal)
│   ├── door.png                              (Victory escape scene hatch)
│   ├── heart.png                             (Robert's flashing weak-spot emblem)
│   ├── left hand.png                         (Your player's left arm perspective)
│   └── right hand.png                        (Your player's right arm perspective)
│
└── 📁 Music/              (Your Ambient Sound Effects Folder)
    ├── BGM.mp3            (Looping background tension tracker music)
    └── Loud Scream Sound Effect 4.mp3 (The instant death jumpscare audio clip)