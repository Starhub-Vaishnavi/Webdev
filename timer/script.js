let interval;
let totalTime = 0;
let timeLeft = 0;

const display = document.getElementById("display");
const quote = document.getElementById("quote");
const sound = document.getElementById("alertSound");
const circle = document.getElementById("progressCircle");


const confettiContainer = document.createElement("div");
confettiContainer.style.position = "fixed";
confettiContainer.style.top = 0;
confettiContainer.style.left = 0;
confettiContainer.style.width = "100%";
confettiContainer.style.height = "100%";
confettiContainer.style.pointerEvents = "none";
confettiContainer.style.overflow = "hidden";
document.body.appendChild(confettiContainer);

const quotes = [
    "✨ You got this!",
    "🔥 Stay focused!",
    "💪 One step at a time.",
    "🌱 Progress is progress.",
    "🚀 Believe in yourself!"
];

document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.onclick = () => {
        document.getElementById("secondsInput").classList.add("hidden");
        document.getElementById("minutesInput").classList.add("hidden");
        document.getElementById("customInputs").classList.add("hidden");

        if (btn.dataset.mode === "seconds") document.getElementById("secondsInput").classList.remove("hidden");
        if (btn.dataset.mode === "minutes") document.getElementById("minutesInput").classList.remove("hidden");
        if (btn.dataset.mode === "custom") document.getElementById("customInputs").classList.remove("hidden");
    };
});

document.getElementById("startBtn").onclick = () => {
    const sec = Number(document.getElementById("secondsInput").value);
    const min = Number(document.getElementById("minutesInput").value);
    const hh = Number(document.getElementById("hh").value);
    const mm = Number(document.getElementById("mm").value);
    const ss = Number(document.getElementById("ss").value);

    totalTime = sec || (min * 60) || (hh * 3600 + mm * 60 + ss);
    if (!totalTime) return;

    timeLeft = totalTime;
    updateDisplay();
    updateRing();
    randomQuote();

    clearInterval(interval);
    interval = setInterval(() => {
        timeLeft--;
        updateDisplay();
        updateRing();

        if (timeLeft <= 0) finishTimer();
    }, 1000);
};

document.getElementById("pauseBtn").onclick = () => clearInterval(interval);

document.getElementById("resumeBtn").onclick = () => {
    clearInterval(interval);
    interval = setInterval(() => {
        timeLeft--;
        updateDisplay();
        updateRing();
        if (timeLeft <= 0) finishTimer();
    }, 1000);
};

document.getElementById("resetBtn").onclick = () => {
    clearInterval(interval);
    timeLeft = 0;
    updateDisplay();
    updateRing();
};


function updateDisplay() {
    let m = Math.floor(timeLeft / 60);
    let s = timeLeft % 60;
    display.textContent = `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

function updateRing() {
    if (totalTime === 0) return;
    const progress = (timeLeft / totalTime) * 750; // matches stroke-dasharray
    circle.style.strokeDashoffset = progress;
}


function finishTimer() {
    clearInterval(interval);
    display.textContent = "00:00";
    sound.play();


    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);


    if (Notification.permission !== "granted") Notification.requestPermission();
    else new Notification("⏳ Timer Finished!", { body: "Your countdown is complete!" });

    quote.textContent = "🎉 Great job! Time to celebrate!";

    
    launchConfetti();
}


function randomQuote() {
    quote.textContent = quotes[Math.floor(Math.random() * quotes.length)];
}


document.querySelectorAll(".theme-switcher span").forEach(btn => {
    btn.onclick = () => {
        document.body.className = "";
        document.body.classList.add(btn.dataset.theme);
    };
});


function launchConfetti() {
    const emojis = ["🎉","✨","💖","🎊","🌟","🔥"];
    for(let i=0;i<50;i++){
        const emoji = document.createElement("div");
        emoji.textContent = emojis[Math.floor(Math.random()*emojis.length)];
        emoji.style.position = "absolute";
        emoji.style.fontSize = `${Math.random()*24 + 16}px`;
        emoji.style.left = `${Math.random()*100}%`;
        emoji.style.top = `-50px`;
        emoji.style.opacity = 0.9;
        emoji.style.transform = `rotate(${Math.random()*360}deg)`;
        confettiContainer.appendChild(emoji);

        let fall = 0;
        const speed = Math.random()*3 + 2;

        const anim = setInterval(() => {
            fall += speed;
            emoji.style.top = `${fall}px`;
            emoji.style.left = `${parseFloat(emoji.style.left) + Math.random()*1.5}px`;
            if(fall > window.innerHeight){
                clearInterval(anim);
                confettiContainer.removeChild(emoji);
            }
        },16);
    }
}
