document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Navigation Logic ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // --- 2. Typing Animation ---
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

    if(typedTextSpan) {
        setTimeout(type, newTextDelay + 250);
    }

    // --- 3. "Data Frequency Wave" Animation ---
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let wave = {
            y: canvas.height / 2,
            length: 0.01,
            amplitude: 100,
            frequency: 0.01
        };

        let increment = wave.frequency;
        
        let mouse = { y: canvas.height / 2 };

        window.addEventListener('mousemove', (event) => {
            // Mouse interaction changes wave amplitude slightly
            mouse.y = event.y;
        });

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            wave.y = canvas.height / 2;
        });

        function animate() {
            requestAnimationFrame(animate);
            // Trail effect for fluid motion
            ctx.fillStyle = 'rgba(11, 12, 16, 0.1)'; 
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw 3 overlapping waves
            drawWave(1, '#66fcf1', 0);       // Cyan (Primary)
            drawWave(0.5, '#45a29e', 200);   // Muted Teal (Secondary)
            drawWave(0.3, '#1f2833', 400);   // Dark Blue (Background)

            increment += wave.frequency;
        }

        function drawWave(opacity, color, offset) {
            ctx.beginPath();
            ctx.moveTo(0, canvas.height / 2);

            // Create the sine wave
            for (let i = 0; i < canvas.width; i++) {
                // Formula: y = sin(x)
                // We add mouse interaction to the amplitude
                let y = wave.y + Math.sin(i * wave.length + increment + offset) * (wave.amplitude * Math.sin(increment));
                
                // Draw lines or small dots? Let's do dots for a "Data" feel
                // ctx.lineTo(i, y); // This makes a solid line
                
                // "Data Point" Style:
                if (i % 15 === 0) { // Only draw every 15th point
                   ctx.fillStyle = color;
                   ctx.fillRect(i, y, 2, 2); // Small data pixels
                }
            }
            
            ctx.strokeStyle = color;
            ctx.stroke();
        }

        animate();
    }
});
