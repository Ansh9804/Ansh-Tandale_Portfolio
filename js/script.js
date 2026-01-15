document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Custom Cursor Logic ---
    const cursorDot = document.createElement('div');
    cursorDot.classList.add('cursor-dot');
    const cursorOutline = document.createElement('div');
    cursorOutline.classList.add('cursor-outline');
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;
        
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        
        // Animate outline with slight delay
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Hover effect for cursor
    const interactiveElements = document.querySelectorAll('a, .btn, .theme-switch, .project-card, .contact-card, .skill-category');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursorOutline.classList.add('hovered'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovered'));
    });


    // --- 2. Navigation & Theme Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const themeSwitch = document.querySelector('.theme-switch');
    const body = document.body;

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    if (themeSwitch) {
        themeSwitch.addEventListener('click', () => {
            body.classList.toggle('light-mode');
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
            
            // Calculate tilt based on mouse position relative to card center
            const rotateX = ((y - centerY) / centerY) * -10; 
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });


    // --- 5. Data Frequency Wave Background (Responsive) ---
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let wave = { y: canvas.height / 2, length: 0.01, amplitude: 100, frequency: 0.01 };
        let increment = wave.frequency;
        let input = { y: canvas.height / 2, active: false };

        window.addEventListener('mousemove', (e) => { input.y = e.clientY; input.active = true; });
        window.addEventListener('touchstart', (e) => { input.y = e.touches[0].clientY; input.active = true; }, {passive: true});
        window.addEventListener('touchmove', (e) => { input.y = e.touches[0].clientY; input.active = true; }, {passive: true});
        window.addEventListener('touchend', () => { input.active = false; });
        window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });

        function animate() {
            requestAnimationFrame(animate);
            
            // Dynamic color selection based on theme
            const isLight = document.body.classList.contains('light-mode');
            const clearColor = isLight ? 'rgba(224, 229, 236, 0.2)' : 'rgba(11, 12, 16, 0.15)';
            const color1 = isLight ? '#2962ff' : '#66fcf1';
            const color2 = isLight ? '#0039cb' : '#45a29e';

            ctx.fillStyle = clearColor; 
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            let targetY = input.active ? input.y : canvas.height / 2;
            wave.y += (targetY - wave.y) * 0.05;

            drawWave(color1, 0);
            drawWave(color2, 200);

            increment += wave.frequency;
        }

        function drawWave(color, offset) {
            ctx.beginPath();
            ctx.moveTo(0, wave.y);
            for (let i = 0; i < canvas.width; i++) {
                let distanceFromCenter = Math.abs(wave.y - (canvas.height/2));
                let dynamicAmp = wave.amplitude + (distanceFromCenter * 0.2);
                let y = wave.y + Math.sin(i * wave.length + increment + offset) * (dynamicAmp * Math.sin(increment));
                
                // Draw dots for "Data" feel
                if (i % 12 === 0) { 
                   ctx.fillStyle = color;
                   let size = 1.5 + Math.sin(i) * 0.5;
                   ctx.fillRect(i, y, size, size); 
                }
            }
        }
        animate();
    }
});
