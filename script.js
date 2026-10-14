// Confetti Animation Helper
function fireConfetti() {
  confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
}

// Dark / Light Mode Toggle
function toggleDarkMode() {
  document.body.classList.toggle("light-mode");
}

// Modern Custom Alert Popup
function showAlertMessage() {
  const existing = document.querySelector(".apex-alert");
  if (existing) existing.remove();

  const popup = document.createElement("div");
  popup.className = "apex-alert";
  popup.innerHTML = `
    <h3 style="color: #4ade80; margin-top:0; font-size:1.2rem;">⛳ APEX CADDIE TIP</h3>
    <p style="color: #f8fafc; margin-bottom: 18px;">Always account for wind direction and green elevation before pulling a club!</p>
    <button class="action-btn glow-btn" id="alert-close" style="padding: 8px 18px; font-size: 14px;">Got It</button>
  `;
  document.body.appendChild(popup);

  document.getElementById("alert-close").addEventListener("click", () => popup.remove());
}

// Smart Caddie Logic (If / Else Decision Engine)
function updateUserText() {
  const inputField = document.getElementById("user-input");
  const displayElement = document.getElementById("display-text");
  if (!inputField || !displayElement) return;

  const yards = parseInt(inputField.value.trim());
  let decision = "";

  if (isNaN(yards) || yards <= 0) {
    decision = "⚠️ Please enter a valid remaining distance in yards!";
  } else if (yards > 230) {
    decision = "🏌️ " + yards + " Yards: Unleash the DRIVER off the tee for max distance!";
    fireConfetti();
  } else if (yards >= 180 && yards <= 230) {
    decision = "🪵 " + yards + " Yards: Pull out a 3-Wood or Hybrid to reach the green.";
  } else if (yards >= 130 && yards < 180) {
    decision = "🎯 " + yards + " Yards: Mid Iron distance (6i - 8i). Aim straight for the flag!";
  } else if (yards < 130) {
    decision = "⛳ " + yards + " Yards: Short wedge approach (PW/SW). High spin soft landing!";
  }

  displayElement.innerText = decision;
  inputField.value = "";
}

// Oracle Predictor (Random Answer Feature)
function askEightBall() {
  const answers = [
    "⛳ Pure strike! Driving straight down the fairway center.",
    "🏌️ Perfect tempo! Pin-high approach shot coming up.",
    "⚠️ Careful! Gusting winds pulling towards the bunker.",
    "🌊 Hazard alert! Mind the water on the right side.",
    "🎉 Incredible shot! Rolling right towards the hole!",
    "🟢 Pure roll! Bouncing off the fringe onto the green."
  ];
  const randomIndex = Math.floor(Math.random() * answers.length);
  const resultElement = document.getElementById("eight-ball-result");
  if (resultElement) {
    resultElement.innerText = answers[randomIndex];
  }
}

// =========================================
// 2D GOLF LAUNCH SIMULATOR (CANVAS ENGINE)
// =========================================
let canvas, ctx;
let ballX = 35;
let ballY = 260;
let ballVX = 0;
let ballVY = 0;
let isShotActive = false;
let score = 0;

function drawDrivingRange() {
  canvas = document.getElementById("golf-canvas");
  if (!canvas) return;
  ctx = canvas.getContext("2d");

  // Sky Gradient
  const skyGradient = ctx.createLinearGradient(0, 0, 0, 190);
  skyGradient.addColorStop(0, '#0284c7');
  skyGradient.addColorStop(1, '#0e7490');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvas.width, 190);

  // Grass Fairway
  ctx.fillStyle = "#15803d";
  ctx.fillRect(0, 190, canvas.width, 130);

  // Tee Box Pad
  ctx.fillStyle = "#0f766e";
  ctx.fillRect(25, 262, 30, 8);

  // Target Greens
  drawTargetGreen(180, 220, "150 YDS");
  drawTargetGreen(320, 220, "250 YDS");
  drawTargetGreen(440, 220, "350 YDS");

  // White Golf Ball
  ctx.save();
  ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
  ctx.shadowBlur = 8;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(ballX, ballY, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawTargetGreen(x, y, label) {
  // Oval Green
  ctx.fillStyle = "#22c55e";
  ctx.beginPath();
  ctx.ellipse(x, y, 28, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Flag Pole
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - 24);
  ctx.stroke();

  // Red Flag
  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.moveTo(x, y - 24);
  ctx.lineTo(x + 12, y - 18);
  ctx.lineTo(x, y - 12);
  ctx.closePath();
  ctx.fill();

  // Label
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 11px system-ui";
  ctx.textAlign = "center";
  ctx.fillText(label, x, y + 22);
}

function swingClub() {
  if (isShotActive) return;

  // Reset Tee Position
  ballX = 35;
  ballY = 260;

  // Launch Velocities
  ballVX = Math.random() * 5 + 6;
  ballVY = -(Math.random() * 4 + 7.5);

  isShotActive = true;
  animateShot();
}

function animateShot() {
  if (!isShotActive) return;

  // Gravity & Physics
  ballVY += 0.28;
  ballX += ballVX;
  ballY += ballVY;

  drawDrivingRange();

  // Ground Contact
  if (ballY >= 260) {
    ballY = 260;
    isShotActive = false;

    // Calculate Yardage
    const calculatedYards = Math.floor((ballX / canvas.width) * 400);
    document.getElementById("drive-dist").innerText = calculatedYards + " YDS";

    // Score Tracking
    if (calculatedYards >= 300) {
      score += 100;
      fireConfetti();
    } else if (calculatedYards >= 150) {
      score += 50;
    } else {
      score += 20;
    }
    document.getElementById("game-score").innerText = score;
  } else {
    requestAnimationFrame(animateShot);
  }
}

// Event Listeners Attachment
document.addEventListener("DOMContentLoaded", () => {
  const themeBtn = document.getElementById("theme-btn");
  if (themeBtn) themeBtn.addEventListener("click", toggleDarkMode);

  const alertBtn = document.getElementById("alert-btn");
  if (alertBtn) alertBtn.addEventListener("click", showAlertMessage);

  const submitBtn = document.getElementById("submit-btn");
  if (submitBtn) submitBtn.addEventListener("click", updateUserText);

  const eightBallBtn = document.getElementById("eight-ball-btn");
  if (eightBallBtn) eightBallBtn.addEventListener("click", askEightBall);

  const swingBtn = document.getElementById("swing-btn");
  if (swingBtn) swingBtn.addEventListener("click", swingClub);

  // Initialize Canvas
  drawDrivingRange();
});
