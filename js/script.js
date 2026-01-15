document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Navigation Logic ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // --- 2. Typing Animation (Hero Section) ---
    const typedTextSpan = document.querySelector(".typed-text");
    const textArray = ["Data Analyst.", "AI Researcher.", "Python Developer.", "Cloud Architect."];
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

    if(typedTextSpan) {
        setTimeout(type, newTextDelay + 250);
    }

    // --- 3. "Neon Fluid" Background Animation ---
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];
        const colors = ['#4facfe', '#00f2fe', '#a18cd1', '#ff014f']; // Neon Anime Palette
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let mouse = {
            x: null,
            y: null,
            radius: 150
        }

        window.addEventListener('mousemove', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        });

        class Particle {
            constructor(x, y, dx, dy, size, color) {
                this.x = x;
                this.y = y;
                this.dx = dx;
                this.dy = dy;
                this.size = size;
                this.color = color;
                this.angle = Math.random() * Math.PI * 2; // For waviness
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 10; // Neon Glow
                ctx.shadowColor = this.color;
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            update() {
                // Fluid Wavy Motion
                this.angle += 0.05;
                this.y += this.dy + Math.sin(this.angle) * 0.5;
                this.x += this.dx + Math.cos(this.angle) * 0.5;

                // Wall Bounce
                if (this.x > canvas.width || this.x < 0) this.dx = -this.dx;
                if (this.y > canvas.height || this.y < 0) this.dy = -this.dy;

                // Mouse Interaction (Fluid Push)
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouse.radius - distance) / mouse.radius;
                    const directionX = forceDirectionX * force * 3;
                    const directionY = forceDirectionY * force * 3;

                    this.x -= directionX;
                    this.y -= directionY;
                }

                this.draw();
            }
        }

        function init() {
            particlesArray = [];
            // Particle count
            let numberOfParticles = (canvas.height * canvas.width) / 10000; 
            
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 3) + 1;
                let x = Math.random() * canvas.width;
                let y = Math.random() * canvas.height;
                let dx = (Math.random() * 1.5) - 0.75; 
                let dy = (Math.random() * 1.5) - 0.75; 
                let color = colors[Math.floor(Math.random() * colors.length)];
                
                particlesArray.push(new Particle(x, y, dx, dy, size, color));
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            // Trail Effect: Draw semi-transparent rect instead of clearRect
            ctx.fillStyle = 'rgba(16, 16, 16, 0.15)'; 
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
        }

        window.addEventListener('resize', () => {
            canvas.width = innerWidth;
            canvas.height = innerHeight;
            init();
        });

        window.addEventListener('mouseout', () => {
            mouse.x = undefined;
            mouse.y = undefined;
        });

        init();
        animate();
    }
});
