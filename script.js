const API_BASE = "http://localhost:8080";
let ghost = "";

 // 👻 spooky placeholder setup
let firstUsed = false;
const input = document.getElementById("userInput");

const spookyPlaceholders = [
  "The shadows are listening...",
  "What secrets do you seek?",
  "Careful... choose your words wisely...",
  "The spirits are restless...",
  "still conversing?...",
  "Brave soul, I must say.",
  "Your curiosity is commendable.",
  "Too late to turn back now..."
];
let phIndex = 0;

function changePlaceholder(text) {
// fade out
  input.classList.add("fade");
  setTimeout(() => {
    input.placeholder = text; // swap text while invisible
    input.classList.remove("fade"); // fade back in
  }, 400); // half duration of transition
}

async function initGhost() {
  try {
    const res = await fetch(`${API_BASE}/ghost`);
    const data = await res.json();
    ghost = data.ghost;
    window.currentGhost = ghost;
    document.getElementById("ghostName").innerText = `You are speaking with:\n ${ghost}`;
  } catch (error) {
    ghost = "The Phantom Roaster";
    window.currentGhost = ghost;
    document.getElementById("ghostName").innerText = `You are speaking with:\n ${ghost}`;
    appendMessage("system", "🌙 Connection to spirit realm couldn't be established... but the true connection is eternal...");
  }
}

function appendMessage(sender, text) {
  const chatBox = document.getElementById("chatBox");
  const div = document.createElement("div");

  // Container alignment
  div.className =
    sender === "you"
      ? "flex justify-end mb-2" // user messages right
      : sender === "system"
      ? "flex justify-center mb-3"
      : "flex justify-start mb-3"; // ghost/bot messages left

  // Bubble
  const bubble = document.createElement("span");
  bubble.className = "chat-bubble"; // base bubble styling

  if (sender === "ghost") {
    const ghostName = window.currentGhost || "Ghost";
    bubble.classList.add("bot-bubble"); // bot styling
    bubble.innerHTML = `<b>${ghostName}:</b> ${text}`;
  } else if (sender === "you") {
    bubble.classList.add("user-bubble"); // user styling
    bubble.innerHTML = `<b>You:</b> ${text}`;
  } else if (sender === "system") {
    bubble.classList.add("system-bubble"); // system styling
    bubble.innerHTML = `<b>System:</b> ${text}`;
  }

  div.appendChild(bubble);
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}



async function sendMessage() {
  const input = document.getElementById("userInput");
  const msg = input.value.trim();
  if (!msg) return;

  appendMessage("you", msg);

  // fade out "The Beginning" only on the first real message
  if (startMessage && !firstUsed) {
    fadeOutBeginning();
  }
  input.value = "";

  
        if (!firstUsed) {
          firstUsed = true;
        } else {
          changePlaceholder(spookyPlaceholders[phIndex]);
          phIndex = (phIndex + 1) % spookyPlaceholders.length;
        }

  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg }),
    });

    if (!res.ok) {
      if (res.status === 429) {
        appendMessage("ghost", "Whoa there! Try typing slower, you impatient mortal...");
        return;
      } else {
        throw new Error(res.statusText);
      }
    }

    const data = await res.json();
    appendMessage("ghost", data.reply);
  } catch (error) {
    const spookyResponses = [
      "The spirits are restless... they sense your presence...",
      "From beyond the veil, I sense... confusion in your mortal words...",
      "The ethereal realm grows cold when you speak such things...",
      "Even in death, I find your statement... questionably amusing...",
      "The phantom winds whisper... 'that's not quite right, mortal...'",
    ];
    const randomResponse = spookyResponses[Math.floor(Math.random() * spookyResponses.length)];
    setTimeout(() => appendMessage("ghost", randomResponse), 500);
  }
}

// Initialize connection
initGhost();
setTimeout(() => {
  appendMessage("", "The candles flicker as spirits gather...");
}, 2000);

// === Beginning text animation ===
const startMessage = document.getElementById("startMessage");
const introLines = ["The", "Beginning"]; // separate lines
let lineIndex = 0;
let charIndex = 0;

function typeWriterIntro() {
  if (lineIndex < introLines.length) {
    if (charIndex < introLines[lineIndex].length) {
      startMessage.innerHTML += introLines[lineIndex].charAt(charIndex);
      charIndex++;
      setTimeout(typeWriterIntro, 150);
    } else {
      // Finished a line → add line break
      if (lineIndex < introLines.length - 1) {
        startMessage.innerHTML += "<br/>";
      }
      lineIndex++;
      charIndex = 0;
      setTimeout(typeWriterIntro, 400); // pause before next line
    }
  }
}
typeWriterIntro();

// === Fade-out trigger without redefining sendMessage ===
function fadeOutBeginning() {
  if (startMessage) {
    startMessage.classList.remove("flicker");
    startMessage.classList.add("haunt-fade");
    // remove from DOM after animation ends
    startMessage.addEventListener("animationend", () => {
      startMessage.remove();
    });
  }
}



// Hook into first send (button + enter key) to fade out "The Beginning"
document.getElementById("userInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.value.trim() !== "") {
    fadeOutBeginning();
  }
});
document.querySelector(".send-btn").addEventListener("click", () => {
  const input = document.getElementById("userInput");
  if (input.value.trim() !== "") {
    fadeOutBeginning();
  }
});


