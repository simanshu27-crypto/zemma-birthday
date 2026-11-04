
/* ==========================================
   A SPECIAL BIRTHDAY EXPERIENCE ✨
   PREMIUM ANIMATION ENGINE
========================================== */

const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

let rockets = [];
let particles = [];
let celebrationInterval = null;
let birthdayRevealStarted = false;

const colors = [
    "#ff4d8d",
    "#ffb6c1",
    "#ffd700",
    "#ffffff",
    "#c084fc",
    "#ff69b4",
    "#87cefa"
];

/* ==========================================
   CANVAS SETUP
========================================== */


/* ==========================================
   CANVAS SETUP
========================================== */

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);


/* ==========================================
   SCREEN TRANSITIONS
========================================== */

function nextScreen(id) {
    const current = document.querySelector(".screen.active");
    const next = document.getElementById(id);

    if (!next) return;

    if (current === next) return;

    if (typeof gsap !== "undefined") {
        gsap.to(current, {
            opacity: 0,
            scale: 0.96,
            duration: 0.45,
            onComplete: () => {
                current?.classList.remove("active");

                next.classList.add("active");

                gsap.fromTo(next,
                    {
                        opacity: 0,
                        scale: 1.04
                    },
                    {
                        opacity: 1,
                        scale: 1,
                        duration: 0.85,
                        ease: "power3.out"
                    }
                );

                activateScreen(id);
            }
        });
    } else {
        current?.classList.remove("active");
        next.classList.add("active");
        activateScreen(id);
    }
}

function activateScreen(id) {
    if (id === "birthday") {
        runBirthdayReveal();
    }

    if (id === "finale") {
        startCelebration();
    }
}

/* ==========================================
   CINEMATIC GIFT OPENING
========================================== */

function openSurprise() {
    const gift = document.querySelector(".gift-box");
    const button = document.querySelector(".magic-button");

    if (!gift || typeof gsap === "undefined") {
        nextScreen("birthday");
        return;
    }

    button?.classList.add("hidden");

    const timeline = gsap.timeline({
        onComplete: () => {
            nextScreen("birthday");
        }
    });

    timeline
        .to(gift, {
            y: -25,
            duration: 0.35,
            ease: "power2.out"
        })
        .to(".gift-lid", {
            rotation: -35,
            y: -100,
            x: -35,
            duration: 0.8,
            ease: "back.out(1.5)"
        })
        .to(".gift-glow", {
            opacity: 1,
            scale: 2.5,
            duration: 0.7
        }, "-=0.5")
        .to(gift, {
            scale: 1.15,
            duration: 0.5,
            ease: "power2.out"
        }, "-=0.5")
        .to(".hero-content", {
            opacity: 0,
            y: -40,
            duration: 0.7
        }, "-=0.3");
}

/* ==========================================
   BIRTHDAY COUNTDOWN REVEAL
========================================== */

function runBirthdayReveal() {
    if (birthdayRevealStarted) return;

    birthdayRevealStarted = true;

    const countdown = document.getElementById("countdown");
    const title = document.getElementById("birthdayTitle");
    const subtitle = document.getElementById("birthdaySub");
    const balloons = document.getElementById("birthdayBalloons");
    const button = document.getElementById("celebrateButton");

    if (!countdown || !title) return;

    countdown.style.display = "block";
    title.style.opacity = "0";
    subtitle?.style.setProperty("opacity", "0");
    balloons?.style.setProperty("opacity", "0");
    button?.style.setProperty("opacity", "0");

    let count = 3;
    countdown.textContent = count;

    if (typeof gsap !== "undefined") {
        gsap.fromTo(countdown,
            { scale: 0.3, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5 }
        );
    }

    const timer = setInterval(() => {
        count--;

        if (count > 0) {
            countdown.textContent = count;

            if (typeof gsap !== "undefined") {
                gsap.fromTo(countdown,
                    { scale: 1.8, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.5 }
                );
            }
        } else {
            clearInterval(timer);

            countdown.textContent = "🎉";

            setTimeout(() => {
                countdown.style.display = "none";

                if (typeof gsap !== "undefined") {
                    gsap.fromTo(title,
                        {
                            scale: 0.3,
                            opacity: 0,
                            rotation: -8
                        },
                        {
                            scale: 1,
                            opacity: 1,
                            rotation: 0,
                            duration: 1.3,
                            ease: "elastic.out(1, 0.6)"
                        }
                    );

                    gsap.to([subtitle, balloons, button], {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        stagger: 0.25,
                        delay: 0.5
                    });
                } else {
                    title.style.opacity = "1";
                    subtitle && (subtitle.style.opacity = "1");
                    balloons && (balloons.style.opacity = "1");
                    button && (button.style.opacity = "1");
                }

                launchFireworks(12);
                heartFirework(canvas.width / 2, canvas.height / 2);

            }, 700);
        }
    }, 1000);
}

/* ==========================================
   ROCKET CLASS
========================================== */

class Rocket {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;

        this.targetY = Math.random() * canvas.height * 0.45 + 60;

        this.speed = Math.random() * 4 + 7;

        this.color = colors[
            Math.floor(Math.random() * colors.length)
        ];

        this.trail = [];
        this.exploded = false;
    }

    update() {
        this.trail.push({ x: this.x, y: this.y });

        if (this.trail.length > 8) {
            this.trail.shift();
        }

        this.y -= this.speed;

        if (this.y <= this.targetY) {
            this.explode();
        }
    }

    draw() {
        ctx.beginPath();

        if (this.trail.length > 0) {
            ctx.moveTo(
                this.trail[0].x,
                this.trail[0].y
            );

            this.trail.forEach(point => {
                ctx.lineTo(point.x, point.y);
            });
        }

        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
    }

    explode() {
        if (this.exploded) return;

        this.exploded = true;

        for (let i = 0; i < 100; i++) {
            particles.push(
                new Particle(this.x, this.y, this.color)
            );
        }

        for (let i = 0; i < 25; i++) {
            particles.push(
                new Particle(this.x, this.y, "#ffffff", true)
            );
        }
    }
}

/* ==========================================
   PARTICLE CLASS
========================================== */

class Particle {
    constructor(x, y, color, glitter = false) {
        this.x = x;
        this.y = y;

        this.color = color;

        this.angle = Math.random() * Math.PI * 2;

        this.speed = glitter
            ? Math.random() * 2
            : Math.random() * 7 + 1;

        this.gravity = 0.045;

        this.friction = 0.985;

        this.alpha = 1;

        this.size = glitter
            ? Math.random() * 1.5
            : Math.random() * 3 + 1;

        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
    }

    update() {
        this.vx *= this.friction;
        this.vy *= this.friction;

        this.vy += this.gravity;

        this.x += this.vx;
        this.y += this.vy;

        this.alpha -= 0.009;
    }

    draw() {
        ctx.save();

        ctx.globalAlpha = Math.max(this.alpha, 0);

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;

        ctx.fill();

        ctx.restore();
    }
}

/* ==========================================
   HEART-SHAPED FIREWORK
========================================== */

function heartFirework(x, y) {
    for (let t = 0; t < Math.PI * 2; t += 0.08) {
        const heartX = 16 * Math.pow(Math.sin(t), 3);

        const heartY =
            13 * Math.cos(t) -
            5 * Math.cos(2 * t) -
            2 * Math.cos(3 * t) -
            Math.cos(4 * t);

        particles.push(
            new HeartParticle(
                x + heartX * 6,
                y - heartY * 6
            )
        );
    }
}

class HeartParticle extends Particle {
    constructor(x, y) {
        super(x, y, "#ff4d8d");

        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;

        this.alpha = 1;
        this.size = 3;
    }
}

/* ==========================================
   FIREWORK CONTROLS
========================================== */

function launchFireworks(amount = 5) {
    for (let i = 0; i < amount; i++) {
        setTimeout(() => {
            rockets.push(new Rocket());
        }, i * 180);
    }
}

function startCelebration() {
    launchFireworks(8);

    if (celebrationInterval) {
        clearInterval(celebrationInterval);
    }

    celebrationInterval = setInterval(() => {
        launchFireworks(2);

        if (Math.random() > 0.65) {
            heartFirework(
                Math.random() * canvas.width,
                Math.random() * canvas.height * 0.4 + 100
            );
        }
    }, 1200);
}

function celebrateAgain() {
    launchFireworks(15);

    heartFirework(
        canvas.width / 2,
        canvas.height / 2
    );
}

/* ==========================================
   CAKE INTERACTIONS
========================================== */


function blowCandles() {
    const cake = document.getElementById("realCake");
    const message = document.getElementById("cakeMessage");
    const candleButton = document.getElementById("candleButton");
    const cutButton = document.getElementById("cutButton");

    cake?.classList.add("blown");

    if (message) {
        message.innerHTML =
            "Make a wish, Zemma... 💗";
    }

    if (candleButton) {
        candleButton.style.display = "none";
    }

    if (cutButton) {
        cutButton.hidden = false;

        if (typeof gsap !== "undefined") {
            gsap.fromTo(cutButton,
                { opacity: 0, scale: 0.5 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    ease: "back.out(1.7)"
                }
            );
        }
    }

    launchFireworks(6);

    heartFirework(
        canvas.width / 2,
        canvas.height / 2
    );
}


function cutCake() {
    const cake = document.getElementById("realCake");
    const message = document.getElementById("cakeMessage");

    if (cake && typeof gsap !== "undefined") {
        gsap.to(cake, {
            rotation: -8,
            scale: 1.08,
            duration: 0.7,
            ease: "elastic.out(1, 0.5)"
        });
    } else if (cake) {
        cake.style.transform = "rotate(-8deg) scale(1.08)";
    }

    if (message) {
        message.innerHTML =
            "First slice of happiness... 🍰";
    }

    launchFireworks(8);

    setTimeout(() => {
        nextScreen("letter");
    }, 2500);
}

/* ==========================================
   INTERACTIVE FIREWORK CANVAS
========================================== */

window.addEventListener("click", (event) => {
    const target = event.target;

    if (
        target.closest("button") ||
        target.closest("a") ||
        target.closest(".gift-box")
    ) {
        return;
    }

    if (
        document.getElementById("finale")?.classList.contains("active")
    ) {
        heartFirework(event.clientX, event.clientY);
    }
});

/* ==========================================
   ANIMATION LOOP
========================================== */


/* ==========================================
   ANIMATION LOOP
========================================== */

function animate() {
    requestAnimationFrame(animate);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    rockets.forEach(rocket => {
        rocket.update();
        rocket.draw();
    });

    rockets = rockets.filter(
        rocket => !rocket.exploded
    );

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    particles = particles.filter(
        particle => particle.alpha > 0
    );
}

animate();



/* ==========================================
   INITIAL SCREEN
========================================== */

window.addEventListener("load", () => {
    if (typeof gsap !== "undefined") {
        gsap.from(".hero-content > *", {
            opacity: 0,
            y: 35,
            duration: 1.2,
            stagger: 0.2,
            ease: "power3.out"
        });

        gsap.to(".gift-box", {
            y: -12,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
});

/* ==========================================
   ANIMATED LOVE LETTER
========================================== */

let letterOpened = false;

function openLetter() {

    if (letterOpened) return;

    letterOpened = true;

    const envelope = document.getElementById("loveEnvelope");
    const typedLetter = document.getElementById("typedLetter");
    const openButton = document.getElementById("openLetterButton");
    const continueButton = document.getElementById("letterContinueButton");
    const hint = document.getElementById("envelopeHint");

    const message =
     "Who would've thought that meeting someone on WePlay " +
    "would turn into something this special? ❤️\n\n" +
    "Out of all the people and all the random moments, " +
    "somehow I got lucky enough to meet you. " +
    "And honestly, I'm really glad I did.\n\n" +
    "From those little conversations to the smiles " +
    "you bring without even trying, you've become " +
    "someone genuinely special to me.\n\n" +
    "I don't know what the future holds, but I know " +
    "I'm happy that our paths crossed. " +
    "I hope I get to make you smile, annoy you a little, " +
    "and create a lot more beautiful memories with you. 💗\n\n" +
    "Happy Birthday, Zemma. 🎂\n" +
    "Keep smiling, keep shining, and never forget " +
    "how precious you are.\n\n" +
    "Lots of love,\n" +
    "❤️";

    envelope?.classList.add("open");

    if (openButton) {
        openButton.style.display = "none";
    }

    if (hint) {
        hint.textContent = "A little message from my heart... ❤️";
    }

    setTimeout(() => {

        let index = 0;

        const typing = setInterval(() => {

            if (index < message.length) {

                typedLetter.textContent += message.charAt(index);

                index++;

            } else {

                clearInterval(typing);

                if (hint) {
                    hint.textContent = "Made with a little extra love. 💗";
                }

                if (continueButton) {
                    continueButton.hidden = false;

                    if (typeof gsap !== "undefined") {
                        gsap.fromTo(continueButton,
                            {
                                opacity: 0,
                                y: 20,
                                scale: 0.8
                            },
                            {
                                opacity: 1,
                                y: 0,
                                scale: 1,
                                duration: 1,
                                ease: "back.out(1.5)"
                            }
                        );
                    }
                }

                heartFirework(
                    canvas.width / 2,
                    canvas.height / 2
                );

            }

        }, 38);

    }, 1000);
}
