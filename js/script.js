document.addEventListener('DOMContentLoaded', () => {

    /* ======================================================
       1. ELITE SMOOTH SCROLL (INERTIA BASED)
    ====================================================== */
    let currentScroll = window.scrollY;
    let targetScroll = currentScroll;
    const ease = 0.08;

    function smoothScroll() {
        targetScroll += (window.scrollY - targetScroll) * ease;
        window.scrollTo(0, targetScroll);
        requestAnimationFrame(smoothScroll);
    }
    smoothScroll();


    /* ======================================================
       2. SCROLL REVEAL ANIMATIONS
    ====================================================== */
    const revealElements = document.querySelectorAll(
        '.section-container, .project-card, .timeline-item, .pub-card, .contact-card'
    );

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-active');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    revealElements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });


    /* ======================================================
       3. DARK / LIGHT MODE TOGGLE
    ====================================================== */
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        const icon = toggleBtn.querySelector('i');

        toggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');

            if (document.body.classList.contains('light-mode')) {
                icon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('theme', 'light');
            } else {
                icon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('theme', 'dark');
            }
        });

        if (localStorage.getItem('theme') === 'light') {
            document.body.classList.add('light-mode');
            icon.classList.replace('fa-moon', 'fa-sun');
        }
    }


    /* ======================================================
       4. NOISE-BASED FLOW FIELD (ELITE BACKGROUND)
    ====================================================== */
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let time = 0;
    const particles = [];
    const PARTICLE_COUNT = 900;
    const SCALE = 0.002;
    const SPEED = 0.35;

    const mouse = { x: null, y: null };

    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    /* -----------------------------
       SIMPLE PERLIN-LIKE NOISE
    ----------------------------- */
    function noise(x, y) {
        return Math.sin(x * 12.9898 + y * 78.233) * 43758.5453 % 1;
    }

    class FlowParticle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.life = Math.random() * 300 + 200;
        }

        update() {
            const angle =
                noise(this.x * SCALE + time, this.y * SCALE + time) * Math.PI * 2;

            const vx = Math.cos(angle) * SPEED;
            const vy = Math.sin(angle) * SPEED;

            this.x += vx;
            this.y += vy;
            this.life--;

            if (
                this.x < 0 || this.x > canvas.width ||
                this.y < 0 || this.y > canvas.height ||
                this.life <= 0
            ) {
                this.reset();
            }

            if (mouse.x && mouse.y) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200) {
                    this.x -= dx * 0.002;
                    this.y -= dy * 0.002;
                }
            }

            this.draw();
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 0.8, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(79,172,254,0.45)';
            ctx.fill();
        }
    }

    function initFlow() {
        particles.length = 0;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new FlowParticle());
        }
    }

    function animateFlow() {
        ctx.fillStyle = 'rgba(0,0,0,0.08)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => p.update());
        time += 0.0008;

        requestAnimationFrame(animateFlow);
    }

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initFlow();
    });

    initFlow();
    animateFlow();
});
