document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Inject HTML5 Fluid Aurora Canvas ---
    // The entire atmospheric motion is now rendered via an ultra-smooth, unified canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'aesthetic-canvas';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    let mouse = { x: undefined, y: undefined, active: false };
    let blobs = [];
    let animationFrameId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initBlobs();
    }

    // Dynamic Cursor Tracking for the "Interactive Flow" Blob
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    });

    window.addEventListener('mouseleave', () => {
        mouse.active = false;
    });

    class FluidBlob {
        constructor(color, baseRadiusFactor) {
            this.color = color;
            this.baseRadiusFactor = baseRadiusFactor;
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            
            // Natural slow angular movement
            this.angle = Math.random() * Math.PI * 2;
            this.speed = Math.random() * 0.3 + 0.15; // Extremely serene drift
            this.radius = Math.min(canvas.width, canvas.height) * this.baseRadiusFactor;
            
            // Individual pulse frequency
            this.pulse = Math.random() * Math.PI;
            this.pulseSpeed = Math.random() * 0.002 + 0.001;
        }

        update(isMouseBlob = false) {
            if (isMouseBlob && mouse.active) {
                // Smooth easing/interpolation toward the mouse
                const targetX = mouse.x;
                const targetY = mouse.y;
                this.x += (targetX - this.x) * 0.04;
                this.y += (targetY - this.y) * 0.04;
            } else {
                // Slow fluid drift physics
                this.angle += (Math.random() - 0.5) * 0.02; // Gentle curve shifts
                this.x += Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed;

                // Soft bouncing logic off borders with overlap margin
                const margin = this.radius * 0.5;
                if (this.x < -margin || this.x > canvas.width + margin) {
                    this.angle = Math.PI - this.angle;
                }
                if (this.y < -margin || this.y > canvas.height + margin) {
                    this.angle = -this.angle;
                }
            }

            // Subtle, rhythmic breathing expansion & contraction
            this.pulse += this.pulseSpeed;
            this.currentRadius = this.radius * (1 + Math.sin(this.pulse) * 0.12);
        }

        draw() {
            ctx.save();
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.currentRadius);
            
            // High-dispersion soft gradient fade-out
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(0.4, this.color.replace('1)', '0.5)'));
            gradient.addColorStop(1, this.color.replace('1)', '0)'));
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            ctx.restore();
        }
    }

    function initBlobs() {
        // Re-calculate size constants
        const maxDim = Math.max(canvas.width, canvas.height);
        
        blobs = [
            // 1. Soothing Lavender Cloud
            new FluidBlob('rgba(165, 180, 252, 1)', 0.65), 
            // 2. Sweet Rose Cloud
            new FluidBlob('rgba(253, 164, 175, 1)', 0.7),
            // 3. Calm Sky Cloud
            new FluidBlob('rgba(186, 230, 253, 1)', 0.55),
            // 4. Deep Luminous Iris Cloud (Slow back-flow)
            new FluidBlob('rgba(221, 214, 254, 1)', 0.6)
        ];

        // Special Interactive Cursor Blob (Gently follows user)
        const mouseBlob = new FluidBlob('rgba(244, 114, 182, 1)', 0.4); // Follower Pink
        mouseBlob.speed = 0; 
        blobs.push(mouseBlob);
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Extremely subtle overlap blending configuration
        ctx.globalCompositeOperation = 'normal';
        ctx.globalAlpha = 0.42; // Total ethereal transparency

        blobs.forEach((blob, index) => {
            const isMouseBlob = index === blobs.length - 1;
            blob.update(isMouseBlob);
            blob.draw();
        });

        animationFrameId = requestAnimationFrame(animate);
    }

    // Initialize & Listeners
    window.addEventListener('resize', () => {
        cancelAnimationFrame(animationFrameId);
        resizeCanvas();
        animate();
    });

    resizeCanvas();
    animate();


    // --- 2. Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }

    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = hamburger.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }
        });
    });

    // --- 3. Elegant Staggered Content Reveal Engine ---
    const revealTargets = [
        '.section-title', '.section-subtitle', '.project-card', 
        '.skill-category', '.pub-card', '.timeline-item', 
        '.cert-list li', '.contact-card', '.about-content p'
    ];
    
    revealTargets.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('reveal');
        });
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, index * 80);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

});