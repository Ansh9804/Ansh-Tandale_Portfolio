document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. NEW CUSTOM CURSOR LOGIC ---
    // Inject cursor elements via JS so you don't need to change HTML
    const cursorDot = document.createElement('div');
    cursorDot.classList.add('cursor-dot');
    const cursorOutline = document.createElement('div');
    cursorOutline.classList.add('cursor-outline');
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;
        
        // Dot follows instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        
        // Outline follows with lag (CSS transition handles smoothness)
        cursorOutline.style.left = `${posX}px`;
        cursorOutline.style.top = `${posY}px`;
    });

    // Hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, .btn, .theme-switch, .project-card, .contact-card, .skill-category, input, button');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });


    // --- 2. Navigation & Persistent Theme Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const themeSwitch = document.querySelector('.theme-switch');
    const body = document.body;

    // Check localStorage on load
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
    }

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    if (themeSwitch) {
        themeSwitch.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            localStorage.setItem('theme', body.classList.contains('light-mode') ? 'light' : 'dark');
        });
    }

    // --- 3. Typing Animation ---
    const typedTextSpan = document.querySelector(".typed-text");
    const textArray = ["Data Analyst", "AI Researcher", "Python Developer", "Cloud Architect"];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000; 
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (typedTextSpan && charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else if (typedTextSpan) {
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (typedTextSpan && charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else if (typedTextSpan) {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 1100);
        }
    }

    if(typedTextSpan) setTimeout(type, newTextDelay + 250);


    // --- 4. 3D Tilt Effect (Isometric) ---
    const cards = document.querySelectorAll('.project-card, .contact-card, .pub-card, .skill-category');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -8; 
            const rotateY = ((x - centerX) / centerX) * 8;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });


    // --- 5. Neural Data Lattice (Gravity Background) ---
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let particlesArray;

        // Mouse acts as a "Gravity Well" for background particles too
        let mouse = {
            x: null,
            y: null,
            radius: 150 
        }

        window.addEventListener('mousemove', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        });
        
        window.addEventListener('touchstart', (e) => {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        }, {passive: true});
        
        window.addEventListener('touchmove', (e) => {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        }, {passive: true});

        window.addEventListener('resize', () => {
            canvas.width = innerWidth;
            canvas.height = innerHeight;
            init();
        });

        window.addEventListener('mouseout', () => {
            mouse.x = undefined;
            mouse.y = undefined;
        });

        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update(particleColor, activeColor) {
                if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
                if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

                // Mouse Gravity Logic for Background
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouse.radius - distance) / mouse.radius;
                    const directionX = forceDirectionX * force * 2;
                    const directionY = forceDirectionY * force * 2;
                    
                    this.x += directionX;
                    this.y += directionY;
                    this.color = activeColor; 
                } else {
                    this.color = particleColor;
                    this.x += this.directionX;
                    this.y += this.directionY;
                }
                this.draw();
            }
        }

        function init() {
            particlesArray = [];
            let numberOfParticles = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * 0.5) - 0.25;
                let directionY = (Math.random() * 0.5) - 0.25;
                let color = '#66fcf1';
                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, innerWidth, innerHeight);

            const isLight = document.body.classList.contains('light-mode');
            const particleColor = isLight ? '#2962ff' : '#45a29e'; 
            const activeColor = isLight ? '#ff3366' : '#ffffff'; 
            const lineRGB = isLight ? '41, 98, 255' : '102, 252, 241';

            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update(particleColor, activeColor);
            }
            connect(lineRGB);
        }

        function connect(rgbColor) {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                                   ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = `rgba(${rgbColor}, ${opacityValue})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        init();
        animate();
    }
});
