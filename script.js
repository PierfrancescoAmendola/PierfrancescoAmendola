// ===================================
// PIERFRANCESCO AMENDOLA - 3D PORTFOLIO
// Inspired by ladunjexa/reactjs18-3d-portfolio
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initStars();
    initNavigation();
    initScrollAnimations();
    initTiltEffect();
    initTextRotation();
    initProjectTabs();
    initProjectLinks();
    initOverviewAliens();
    initSolarSystem();
    initAstronaut();
    initCoder();
    initEarth();
    initRocket();
});

// ─── STARS CANVAS ────────────────────────────────────────
function initStars() {
    const canvas = document.getElementById('stars-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [];
    const STAR_COUNT = 300;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createStars() {
        stars = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.5 + 0.3,
                alpha: Math.random(),
                delta: (Math.random() - 0.5) * 0.015
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const s of stars) {
            s.alpha += s.delta;
            if (s.alpha <= 0.1 || s.alpha >= 1) s.delta = -s.delta;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha.toFixed(2)})`;
            ctx.fill();
        }
        requestAnimationFrame(draw);
    }

    resize();
    createStars();
    draw();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => { resize(); createStars(); }, 200);
    });
}

// ─── OVERVIEW ALIENS ────────────────────────────────────
function initOverviewAliens() {
    const cards = document.querySelectorAll('.services-grid .service-card');
    if (!cards.length) return;

    cards.forEach(card => {
        if (card.querySelector('.alien-peek')) return;

        const cornerClass = Math.random() > 0.5 ? 'corner-tl' : 'corner-tr';
        const eyesCount = Math.random() > 0.5 ? 3 : 2;

        const alien = document.createElement('div');
        alien.className = `alien-peek ${cornerClass} eyes-${eyesCount}`;

        const head = document.createElement('div');
        head.className = 'alien-head';

        const antenna = document.createElement('div');
        antenna.className = 'alien-antenna';

        const antennaDot = document.createElement('div');
        antennaDot.className = 'alien-antenna-dot';

        const eyesWrap = document.createElement('div');
        eyesWrap.className = 'alien-eyes';

        for (let i = 0; i < eyesCount; i++) {
            const eye = document.createElement('span');
            eye.className = 'alien-eye';
            eyesWrap.appendChild(eye);
        }

        head.appendChild(antenna);
        head.appendChild(antennaDot);
        head.appendChild(eyesWrap);
        alien.appendChild(head);
        card.appendChild(alien);
    });
}

// ─── NAVIGATION ──────────────────────────────────────────
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const toggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    // Scroll class
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile toggle
    if (toggle && mobileMenu) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Active link highlight
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    const linkObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle(
                        'active',
                        link.getAttribute('href') === '#' + entry.target.id
                    );
                });
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(sec => { if (sec.id) linkObserver.observe(sec); });
}

// ─── SCROLL ANIMATIONS ──────────────────────────────────
function initScrollAnimations() {
    const animElements = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    animElements.forEach(el => observer.observe(el));
}

// ─── TILT EFFECT ─────────────────────────────────────────
function initTiltEffect() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

// ─── TEXT ROTATION ───────────────────────────────────────
function initTextRotation() {
    const el = document.getElementById('rotating-text');
    if (!el) return;

    const words = [
        'iOS applications',
        'AI solutions',
        'SwiftUI interfaces',
        'React Native apps',
        'innovative tools'
    ];
    let idx = 0;

    setInterval(() => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(8px)';
        setTimeout(() => {
            idx = (idx + 1) % words.length;
            el.textContent = words[idx];
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 300);
    }, 2500);

    el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
}

// ─── PROJECT TABS ────────────────────────────────────────
function initProjectTabs() {
    const tabs = document.querySelectorAll('.project-tab');
    const grids = document.querySelectorAll('.projects-grid');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const target = tab.dataset.filter;
            grids.forEach(grid => {
                if (grid.id === 'projects-' + target) {
                    grid.classList.remove('hidden');
                    // Re-trigger animations
                    grid.querySelectorAll('[data-animate]').forEach(el => {
                        el.classList.remove('visible');
                        void el.offsetWidth;
                        el.classList.add('visible');
                    });
                } else {
                    grid.classList.add('hidden');
                }
            });
        });
    });
}

// ─── PROJECT LINKS ──────────────────────────────────────
function initProjectLinks() {
    const links = document.querySelectorAll('.project-card-links a[href^="http"]');
    if (!links.length) return;

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const href = link.getAttribute('href');
            if (!href) return;

            const opened = window.open(href, '_blank', 'noopener,noreferrer');
            if (!opened) {
                // Fallback if popup is blocked.
                window.location.href = href;
            }
        });
    });
}

// ─── SOLAR SYSTEM ────────────────────────────────────────
function initSolarSystem() {
    const canvas = document.getElementById('solar-system');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
    }

    resize();
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 200);
    });

    const planets = [
        { name: 'Mercury', orbit: 0.14, size: 3,   color: '#b0b0b0', speed: 4.15 },
        { name: 'Venus',   orbit: 0.20, size: 5,   color: '#e8cda0', speed: 1.62 },
        { name: 'Earth',   orbit: 0.27, size: 5.5, color: '#6ba0d6', speed: 1.0 },
        { name: 'Mars',    orbit: 0.34, size: 4,   color: '#d4734e', speed: 0.53 },
        { name: 'Jupiter', orbit: 0.46, size: 11,  color: '#d4a574', speed: 0.084 },
        { name: 'Saturn',  orbit: 0.58, size: 9,   color: '#e8d5a3', speed: 0.034, ring: true },
        { name: 'Uranus',  orbit: 0.70, size: 7,   color: '#a0d6d6', speed: 0.012 },
        { name: 'Neptune', orbit: 0.82, size: 6.5, color: '#5b7fc7', speed: 0.006 },
    ];

    // Start from a non-zero phase so planets look already in motion on first render.
    let time = Math.random() * Math.PI * 200;
    const orbitSpeedBoost = 1.55;

    function drawGlow(x, y, r, color, glowSize) {
        const grad = ctx.createRadialGradient(x, y, r * 0.5, x, y, r + glowSize);
        grad.addColorStop(0, color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r + glowSize, 0, Math.PI * 2);
        ctx.fill();
    }

    function draw() {
        const w = canvas.width / (window.devicePixelRatio || 1);
        const h = canvas.height / (window.devicePixelRatio || 1);
        ctx.clearRect(0, 0, w, h);

        const cx = w / 2;
        const cy = h / 2;
        const maxR = Math.min(w, h) / 2 - 10;

        // Sun
        drawGlow(cx, cy, 16, 'rgba(255, 180, 50, 0.15)', 30);
        drawGlow(cx, cy, 10, 'rgba(255, 200, 80, 0.3)', 15);
        const sunGrad = ctx.createRadialGradient(cx - 3, cy - 3, 2, cx, cy, 14);
        sunGrad.addColorStop(0, '#fff8e0');
        sunGrad.addColorStop(0.4, '#ffcc33');
        sunGrad.addColorStop(1, '#ff8800');
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 14, 0, Math.PI * 2);
        ctx.fill();

        // Orbits & planets
        for (const p of planets) {
            const orbitR = maxR * p.orbit;

            // Orbit path
            ctx.strokeStyle = 'rgba(145, 94, 255, 0.08)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(cx, cy, orbitR, 0, Math.PI * 2);
            ctx.stroke();

            // Planet position
            const angle = time * p.speed * 0.3 * orbitSpeedBoost;
            const px = cx + Math.cos(angle) * orbitR;
            const py = cy + Math.sin(angle) * orbitR;

            // Planet glow
            const gc = hexToRgba(p.color, 0.15);
            drawGlow(px, py, p.size, gc, p.size * 1.5);

            // Saturn ring
            if (p.ring) {
                ctx.strokeStyle = 'rgba(210, 190, 150, 0.5)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.ellipse(px, py, p.size * 2, p.size * 0.6, -0.4, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Planet body
            const pGrad = ctx.createRadialGradient(px - p.size * 0.3, py - p.size * 0.3, p.size * 0.1, px, py, p.size);
            pGrad.addColorStop(0, '#ffffff');
            pGrad.addColorStop(0.3, p.color);
            pGrad.addColorStop(1, shadeColor(p.color, -40));
            ctx.fillStyle = pGrad;
            ctx.beginPath();
            ctx.arc(px, py, p.size, 0, Math.PI * 2);
            ctx.fill();

            // Earth's moon
            if (p.name === 'Earth') {
                const moonAngle = time * 6;
                const moonDist = p.size + 6;
                const mx = px + Math.cos(moonAngle) * moonDist;
                const my = py + Math.sin(moonAngle) * moonDist;
                ctx.fillStyle = '#ccc';
                ctx.beginPath();
                ctx.arc(mx, my, 1.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        time += 0.012;
        requestAnimationFrame(draw);
    }

    function shadeColor(hex, amt) {
        let r = parseInt(hex.slice(1, 3), 16);
        let g = parseInt(hex.slice(3, 5), 16);
        let b = parseInt(hex.slice(5, 7), 16);
        r = Math.max(0, Math.min(255, r + amt));
        g = Math.max(0, Math.min(255, g + amt));
        b = Math.max(0, Math.min(255, b + amt));
        return `rgb(${r},${g},${b})`;
    }

    function hexToRgba(hex, a) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r},${g},${b},${a})`;
    }

    draw();
}

// ─── FLOATING ASTRONAUT ──────────────────────────────────
function initAstronaut() {
    const canvas = document.getElementById('astronaut-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
    }
    resize();
    let resizeTimer;
    window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 200); });

    const W = () => canvas.width / (window.devicePixelRatio || 1);
    const H = () => canvas.height / (window.devicePixelRatio || 1);

    // Floating particles
    const particles = [];
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random(), y: Math.random(),
            r: Math.random() * 2 + 0.5,
            speed: Math.random() * 0.15 + 0.05,
            alpha: Math.random() * 0.6 + 0.2,
            phase: Math.random() * Math.PI * 2
        });
    }

    function drawAstronaut(cx, cy, scale, t) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(scale, scale);

        // Subtle rotation
        ctx.rotate(Math.sin(t * 0.4) * 0.08);

        // Jetpack
        ctx.fillStyle = '#3a3a5c';
        roundRect(-22, -18, 8, 36, 3);
        roundRect(14, -18, 8, 36, 3);

        // Jetpack flames
        const flicker = Math.sin(t * 8) * 2;
        const grad1 = ctx.createLinearGradient(-18, 18, -18, 30 + flicker);
        grad1.addColorStop(0, 'rgba(145, 94, 255, 0.8)');
        grad1.addColorStop(0.5, 'rgba(99, 102, 241, 0.4)');
        grad1.addColorStop(1, 'rgba(99, 102, 241, 0)');
        ctx.fillStyle = grad1;
        ctx.beginPath();
        ctx.moveTo(-22, 18); ctx.lineTo(-14, 18);
        ctx.lineTo(-16, 30 + flicker); ctx.lineTo(-20, 30 + flicker);
        ctx.closePath(); ctx.fill();

        const grad2 = ctx.createLinearGradient(18, 18, 18, 30 + flicker);
        grad2.addColorStop(0, 'rgba(145, 94, 255, 0.8)');
        grad2.addColorStop(0.5, 'rgba(99, 102, 241, 0.4)');
        grad2.addColorStop(1, 'rgba(99, 102, 241, 0)');
        ctx.fillStyle = grad2;
        ctx.beginPath();
        ctx.moveTo(14, 18); ctx.lineTo(22, 18);
        ctx.lineTo(20, 30 + flicker); ctx.lineTo(16, 30 + flicker);
        ctx.closePath(); ctx.fill();

        // Body
        ctx.fillStyle = '#e8e8f0';
        roundRect(-16, -12, 32, 40, 8);

        // Chest panel
        ctx.fillStyle = '#c0c0d8';
        roundRect(-8, -4, 16, 12, 3);
        ctx.fillStyle = '#915EFF';
        ctx.fillRect(-5, -1, 4, 3);
        ctx.fillStyle = '#6366f1';
        ctx.fillRect(1, -1, 4, 3);
        ctx.fillStyle = '#10b981';
        ctx.fillRect(-5, 4, 4, 3);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(1, 4, 4, 3);

        // Belt
        ctx.fillStyle = '#6366f1';
        roundRect(-16, 20, 32, 4, 1);

        // Legs
        ctx.fillStyle = '#d0d0e0';
        const legSwing = Math.sin(t * 0.7) * 4;
        roundRect(-12, 28, 10, 20 + legSwing, 4);
        roundRect(2, 28, 10, 20 - legSwing, 4);

        // Boots
        ctx.fillStyle = '#4a4a6a';
        roundRect(-14, 46 + legSwing, 14, 6, 3);
        roundRect(0, 46 - legSwing, 14, 6, 3);

        // Arms
        ctx.fillStyle = '#d8d8ec';
        const armSwing = Math.sin(t * 0.5) * 6;
        // Left arm — waving
        ctx.save();
        ctx.translate(-16, -6);
        ctx.rotate(-0.4 + Math.sin(t * 1.2) * 0.25);
        roundRect(-12, -3, 12, 7, 3);
        // Glove
        ctx.fillStyle = '#4a4a6a';
        ctx.beginPath(); ctx.arc(-12, 0, 4, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // Right arm
        ctx.save();
        ctx.fillStyle = '#d8d8ec';
        ctx.translate(16, -6);
        ctx.rotate(0.3 + Math.sin(t * 0.6 + 1) * 0.15);
        roundRect(0, -3, 12, 7, 3);
        ctx.fillStyle = '#4a4a6a';
        ctx.beginPath(); ctx.arc(12, 0, 4, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // Helmet
        ctx.fillStyle = '#e8e8f0';
        ctx.beginPath();
        ctx.arc(0, -26, 20, 0, Math.PI * 2);
        ctx.fill();

        // Visor
        const visorGrad = ctx.createLinearGradient(-14, -38, 14, -18);
        visorGrad.addColorStop(0, '#1a1040');
        visorGrad.addColorStop(0.3, '#2d1b69');
        visorGrad.addColorStop(0.7, '#915EFF');
        visorGrad.addColorStop(1, '#4a2c8a');
        ctx.fillStyle = visorGrad;
        ctx.beginPath();
        ctx.arc(0, -26, 16, 0, Math.PI * 2);
        ctx.fill();

        // Visor reflection
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.beginPath();
        ctx.ellipse(-5, -32, 6, 3, -0.4, 0, Math.PI * 2);
        ctx.fill();

        // Visor stars reflection
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath(); ctx.arc(6, -30, 1.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(-8, -22, 0.8, 0, Math.PI * 2); ctx.fill();

        // Antenna
        ctx.strokeStyle = '#c0c0d8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(8, -44);
        ctx.lineTo(12, -54);
        ctx.stroke();
        ctx.fillStyle = '#915EFF';
        ctx.beginPath(); ctx.arc(12, -55, 3, 0, Math.PI * 2); ctx.fill();

        // Antenna glow
        const antennaGlow = (Math.sin(t * 3) + 1) / 2;
        ctx.fillStyle = `rgba(145, 94, 255, ${0.3 * antennaGlow})`;
        ctx.beginPath(); ctx.arc(12, -55, 7, 0, Math.PI * 2); ctx.fill();

        // Tether line
        ctx.strokeStyle = 'rgba(145, 94, 255, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(16, 6);
        const tetherX = 60 + Math.sin(t * 0.3) * 10;
        const tetherY = 60 + Math.cos(t * 0.4) * 5;
        ctx.quadraticCurveTo(40, 40, tetherX, tetherY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.restore();
    }

    function roundRect(x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();
    }

    function draw() {
        const w = W(), h = H();
        ctx.clearRect(0, 0, w, h);
        const t = performance.now() / 1000;

        // floating particles
        particles.forEach(p => {
            const px = p.x * w;
            let py = (p.y * h - p.speed * t * 20) % h;
            if (py < 0) py += h;
            const pulse = 0.5 + 0.5 * Math.sin(t * 2 + p.phase);
            ctx.globalAlpha = p.alpha * (0.6 + 0.4 * pulse);
            ctx.fillStyle = '#915EFF';
            ctx.beginPath();
            ctx.arc(px, py, p.r, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;

        // Astronaut floating motion
        const floatY = Math.sin(t * 0.8) * 12;
        const floatX = Math.cos(t * 0.5) * 6;
        const cx = w * 0.5 + floatX;
        const cy = h * 0.48 + floatY;
        const sc = Math.min(w, h) / 180;

        drawAstronaut(cx, cy, sc, t);

        requestAnimationFrame(draw);
    }

    draw();
}

// ─── CODER AT DESK ───────────────────────────────────────
function initCoder() {
    const canvas = document.getElementById('coder-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
    }
    resize();
    let resizeTimer;
    window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 200); });

    const W = () => canvas.width / (window.devicePixelRatio || 1);
    const H = () => canvas.height / (window.devicePixelRatio || 1);

    // Code lines for the screen
    const codeLines = [];
    for (let i = 0; i < 12; i++) {
        const indent = Math.floor(Math.random() * 3);
        const widthFrac = Math.random() * 0.5 + 0.2;
        const colors = ['#915EFF', '#6366f1', '#818cf8', '#c084fc', '#34d399', '#fbbf24', '#e8e8f0'];
        codeLines.push({
            indent,
            width: widthFrac,
            color: colors[Math.floor(Math.random() * colors.length)],
            delay: i * 0.3,
            visible: false
        });
    }

    // Floating particles
    const particles = [];
    for (let i = 0; i < 30; i++) {
        particles.push({
            x: Math.random(), y: Math.random(),
            r: Math.random() * 1.5 + 0.5,
            speed: Math.random() * 0.08 + 0.02,
            alpha: Math.random() * 0.4 + 0.15,
            phase: Math.random() * Math.PI * 2
        });
    }

    function roundRect(x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();
    }

    function drawScene(t) {
        const w = W(), h = H();
        ctx.clearRect(0, 0, w, h);
        const sc = Math.min(w, h) / 320;

        // Center everything
        const cx = w * 0.5;
        const baseY = h * 0.65;

        ctx.save();
        ctx.translate(cx, baseY);
        ctx.scale(sc, sc);

        // ── DESK ──
        // Desktop surface
        ctx.fillStyle = '#1a1a2e';
        roundRect(-120, 0, 240, 10, 3);
        // Desk front panel
        ctx.fillStyle = '#151528';
        roundRect(-110, 10, 220, 50, 2);
        // Desk edge highlight
        ctx.fillStyle = 'rgba(145, 94, 255, 0.1)';
        ctx.fillRect(-120, 0, 240, 2);

        // ── MONITOR ──
        // Monitor stand
        ctx.fillStyle = '#2a2a3e';
        roundRect(-5, -8, 10, 12, 2);

        // Monitor base
        ctx.fillStyle = '#2a2a3e';
        roundRect(-20, -2, 40, 5, 2);

        // Monitor body
        ctx.fillStyle = '#1e1e30';
        roundRect(-80, -120, 160, 112, 6);

        // Screen border
        ctx.fillStyle = '#2a2a40';
        roundRect(-76, -116, 152, 104, 4);

        // Screen
        const screenGrad = ctx.createLinearGradient(-72, -112, -72, -16);
        screenGrad.addColorStop(0, '#0a0a1a');
        screenGrad.addColorStop(1, '#0d0d20');
        ctx.fillStyle = screenGrad;
        roundRect(-72, -112, 144, 96, 3);

        // Screen glow on face
        ctx.fillStyle = 'rgba(99, 102, 241, 0.03)';
        roundRect(-72, -112, 144, 96, 3);

        // Code lines on screen
        const lineH = 5;
        const lineGap = 2.5;
        const screenLeft = -64;
        const screenTop = -104;
        const screenW = 128;
        const typingLine = Math.floor((t * 1.5) % (codeLines.length + 3));

        codeLines.forEach((line, i) => {
            if (i > typingLine) return;
            const indentPx = line.indent * 10;
            const lineW = line.width * (screenW - indentPx - 10);
            const ly = screenTop + i * (lineH + lineGap);

            ctx.globalAlpha = i === typingLine ? 0.5 + 0.5 * Math.sin(t * 6) : 0.7;
            ctx.fillStyle = line.color;
            roundRect(screenLeft + indentPx, ly, lineW, lineH, 1.5);
        });
        ctx.globalAlpha = 1;

        // Cursor blink
        if (typingLine < codeLines.length) {
            const cl = codeLines[typingLine];
            const cursorX = screenLeft + cl.indent * 10 + cl.width * (screenW - cl.indent * 10 - 10) * ((t * 2) % 1);
            if (Math.sin(t * 6) > 0) {
                ctx.fillStyle = '#e8e8f0';
                ctx.fillRect(cursorX, screenTop + typingLine * (lineH + lineGap), 2, lineH);
            }
        }

        // Monitor LED
        const ledPulse = (Math.sin(t * 2) + 1) / 2;
        ctx.fillStyle = `rgba(145, 94, 255, ${0.5 + 0.5 * ledPulse})`;
        ctx.beginPath(); ctx.arc(0, -12, 2, 0, Math.PI * 2); ctx.fill();

        // Screen glow effect (ambient)
        const glowGrad = ctx.createRadialGradient(0, -65, 20, 0, -65, 120);
        glowGrad.addColorStop(0, 'rgba(99, 102, 241, 0.06)');
        glowGrad.addColorStop(1, 'rgba(99, 102, 241, 0)');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(-150, -180, 300, 250);

        // ── KEYBOARD ──
        ctx.fillStyle = '#222238';
        roundRect(-45, 6, 60, 14, 3);
        // Keys
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 10; c++) {
                const kx = -40 + c * 5.2;
                const ky = 8 + r * 4;
                const keyBright = (Math.sin(t * 8 + c * 0.7 + r * 1.3) + 1) / 2;
                ctx.fillStyle = `rgba(145, 94, 255, ${0.08 + 0.15 * keyBright})`;
                ctx.fillRect(kx, ky, 4, 2.8);
            }
        }

        // ── COFFEE MUG ──
        ctx.fillStyle = '#2a2a40';
        roundRect(90, -18, 18, 20, 3);
        // Handle
        ctx.strokeStyle = '#2a2a40';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(110, -10, 6, -Math.PI * 0.4, Math.PI * 0.4);
        ctx.stroke();
        // Coffee
        ctx.fillStyle = '#4a2c1a';
        roundRect(92, -14, 14, 8, 2);
        // Steam
        for (let s = 0; s < 3; s++) {
            const sx = 96 + s * 4;
            const sy = -22 - Math.sin(t * 2 + s) * 4;
            const steamAlpha = 0.15 + 0.1 * Math.sin(t * 1.5 + s * 1.2);
            ctx.strokeStyle = `rgba(200, 200, 220, ${steamAlpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(sx, -18);
            ctx.quadraticCurveTo(sx + Math.sin(t + s) * 3, sy - 4, sx + 1, sy - 8);
            ctx.stroke();
        }

        // ── PERSON (you!) ──
        // Body
        ctx.fillStyle = '#151530';
        roundRect(-25, 30, 50, 35, 8);

        // Hoodie details
        ctx.fillStyle = 'rgba(145, 94, 255, 0.12)';
        roundRect(-18, 36, 36, 4, 2);

        // Shoulders
        ctx.fillStyle = '#1a1a35';
        ctx.beginPath();
        ctx.ellipse(-25, 36, 10, 14, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(25, 36, 10, 14, -0.2, 0, Math.PI * 2);
        ctx.fill();

        // Arms (typing)
        const lArmAngle = Math.sin(t * 4) * 0.06;
        const rArmAngle = Math.sin(t * 4 + Math.PI) * 0.06;

        ctx.fillStyle = '#151530';
        // Left arm
        ctx.save();
        ctx.translate(-28, 42);
        ctx.rotate(-0.7 + lArmAngle);
        roundRect(0, -3, 30, 7, 3);
        ctx.restore();
        // Right arm
        ctx.save();
        ctx.translate(28, 42);
        ctx.rotate(0.7 + rArmAngle);
        roundRect(-30, -3, 30, 7, 3);
        ctx.restore();

        // Hands — on keyboard area
        ctx.fillStyle = '#c8a882';
        const lhx = -20 + Math.sin(t * 4) * 2;
        const rhx = 12 + Math.sin(t * 4 + Math.PI) * 2;
        ctx.beginPath(); ctx.arc(lhx, 10, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(rhx, 10, 4, 0, Math.PI * 2); ctx.fill();

        // Neck
        ctx.fillStyle = '#c8a882';
        roundRect(-6, 22, 12, 10, 3);

        // Head
        ctx.fillStyle = '#c8a882';
        ctx.beginPath();
        ctx.ellipse(0, 10, 16, 18, 0, 0, Math.PI * 2);
        ctx.fill();

        // Hair
        ctx.fillStyle = '#1a1a2e';
        ctx.beginPath();
        ctx.ellipse(0, 1, 17, 12, 0, Math.PI, Math.PI * 2);
        ctx.fill();
        // Hair sides
        ctx.beginPath();
        ctx.ellipse(-15, 6, 5, 10, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(15, 6, 5, 10, -0.2, 0, Math.PI * 2);
        ctx.fill();

        // Eyes (looking at screen)
        ctx.fillStyle = '#e8e8f0';
        ctx.beginPath(); ctx.ellipse(-6, 8, 3.5, 2.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(6, 8, 3.5, 2.5, 0, 0, Math.PI * 2); ctx.fill();
        // Pupils
        ctx.fillStyle = '#1a1a2e';
        ctx.beginPath(); ctx.arc(-5, 8.5, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(7, 8.5, 1.5, 0, Math.PI * 2); ctx.fill();

        // Glasses (purple frame!)
        ctx.strokeStyle = 'rgba(145, 94, 255, 0.7)';
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.ellipse(-6, 8, 5, 4, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(6, 8, 5, 4, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(1, 8); ctx.lineTo(-1, 8); ctx.stroke();

        // Mouth — subtle smile
        ctx.strokeStyle = '#a08070';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 14, 4, 0.1, Math.PI - 0.1);
        ctx.stroke();

        // Headphones
        ctx.strokeStyle = '#3a3a5c';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 2, 18, Math.PI + 0.3, -0.3);
        ctx.stroke();
        // Ear cups
        ctx.fillStyle = '#3a3a5c';
        roundRect(-20, 2, 8, 12, 4);
        roundRect(12, 2, 8, 12, 4);
        // Purple accent on cups
        ctx.fillStyle = 'rgba(145, 94, 255, 0.3)';
        roundRect(-18, 4, 4, 8, 2);
        roundRect(14, 4, 4, 8, 2);

        ctx.restore();

        // Floating particles
        particles.forEach(p => {
            const px = p.x * w;
            let py = (p.y * h + p.speed * t * 15) % h;
            const pulse = 0.5 + 0.5 * Math.sin(t * 1.5 + p.phase);
            ctx.globalAlpha = p.alpha * (0.5 + 0.5 * pulse);
            ctx.fillStyle = Math.random() > 0.5 ? '#915EFF' : '#6366f1';
            ctx.beginPath(); ctx.arc(px, py, p.r, 0, Math.PI * 2); ctx.fill();
        });
        ctx.globalAlpha = 1;
    }

    function draw() {
        const t = performance.now() / 1000;
        drawScene(t);
        requestAnimationFrame(draw);
    }

    draw();
}

// ─── ROTATING EARTH (Three.js) ───────────────────────────
function initEarth() {
    const container = document.getElementById('earth-container');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.z = 3.5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.minDistance = 1.8;
    controls.maxDistance = 6;
    controls.enableZoom = false;

    const textureLoader = new THREE.TextureLoader();

    // Earth
    const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
    const earthMaterial = new THREE.MeshStandardMaterial({
        map: textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg'),
        roughness: 0.7,
        metalness: 0.1
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // Naples pin marker (40.8518 N, 14.2681 E)
    const naplesPinGeometry = new THREE.SphereGeometry(0.03, 24, 24);
    const naplesPinMaterial = new THREE.MeshBasicMaterial({ color: 0x39ff66 });
    const naplesPin = new THREE.Mesh(naplesPinGeometry, naplesPinMaterial);

    const naplesGlowGeometry = new THREE.SphereGeometry(0.05, 24, 24);
    const naplesGlowMaterial = new THREE.MeshBasicMaterial({
        color: 0x7dff8f,
        transparent: true,
        opacity: 0.35
    });
    const naplesGlow = new THREE.Mesh(naplesGlowGeometry, naplesGlowMaterial);

    function latLonToVector3(lat, lon, radius) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const z = radius * Math.sin(phi) * Math.sin(theta);
        const y = radius * Math.cos(phi);
        return new THREE.Vector3(x, y, z);
    }

    const naplesPos = latLonToVector3(40.8518, 14.2681, 1.01);
    naplesPin.position.copy(naplesPos);
    naplesGlow.position.copy(naplesPos.clone().multiplyScalar(1.002));

    earth.add(naplesGlow);
    earth.add(naplesPin);

    // Clouds
    const cloudsGeometry = new THREE.SphereGeometry(1.015, 64, 64);
    const cloudsMaterial = new THREE.MeshStandardMaterial({
        map: textureLoader.load('https://threejs.org/examples/textures/planets/earth_clouds_1024.png'),
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    scene.add(clouds);

    // Atmospheric glow
    const glowGeometry = new THREE.SphereGeometry(1.08, 64, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x4fc3f7,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);

    // Lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x05080e, 0.6);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(5, 3, 3);
    scene.add(sunLight);

    // Resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const r = container.getBoundingClientRect();
            renderer.setSize(r.width, r.height);
            camera.aspect = r.width / r.height;
            camera.updateProjectionMatrix();
        }, 200);
    });

    // Animation
    function animate() {
        requestAnimationFrame(animate);
        earth.rotation.y += 0.0008;
        naplesGlow.scale.setScalar(1 + Math.sin(performance.now() * 0.004) * 0.08);
        clouds.rotation.y += 0.0012;
        clouds.rotation.z += 0.0002;
        glow.rotation.y += 0.0008;
        controls.update();
        renderer.render(scene, camera);
    }

    animate();
}

// ─── ROCKET BACK TO TOP ──────────────────────────────────
function initRocket() {
    const btn = document.getElementById('rocket-btn');
    const trailCanvas = document.getElementById('rocket-trail-canvas');
    if (!btn || !trailCanvas) return;

    const ctx = trailCanvas.getContext('2d');
    let particles = [];
    let animating = false;
    let rocketY = 0;
    let rocketX = 0;

    function resizeCanvas() {
        trailCanvas.width = window.innerWidth;
        trailCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Show/hide button on scroll
    window.addEventListener('scroll', () => {
        if (animating) return;
        if (window.scrollY > 600) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        if (animating) return;
        animating = true;

        // Get rocket position
        const rect = btn.getBoundingClientRect();
        rocketX = rect.left + rect.width / 2;
        rocketY = rect.top + rect.height * 0.7;

        // Start launch
        btn.classList.add('launched');

        // Spawn trail particles continuously during launch
        const trailDuration = 1400;
        const startTime = performance.now();
        let scrollStarted = false;

        function spawnTrailParticles(currentRocketY) {
            const count = 4 + Math.floor(Math.random() * 3);
            for (let i = 0; i < count; i++) {
                const angle = (Math.random() - 0.5) * 0.8 + Math.PI / 2;
                const speed = Math.random() * 3 + 1.5;
                const size = Math.random() * 4 + 2;
                // Flame colors: white core -> yellow -> orange -> purple
                const colorRoll = Math.random();
                let color;
                if (colorRoll < 0.15) {
                    color = { r: 255, g: 248, b: 224 }; // white-yellow
                } else if (colorRoll < 0.35) {
                    color = { r: 251, g: 191, b: 36 }; // yellow
                } else if (colorRoll < 0.55) {
                    color = { r: 245, g: 158, b: 11 }; // orange
                } else if (colorRoll < 0.75) {
                    color = { r: 232, g: 121, b: 249 }; // pink
                } else {
                    color = { r: 145, g: 94, b: 255 }; // purple
                }
                particles.push({
                    x: rocketX + (Math.random() - 0.5) * 12,
                    y: currentRocketY,
                    vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
                    vy: Math.sin(angle) * speed,
                    size: size,
                    life: 1,
                    decay: Math.random() * 0.015 + 0.012,
                    color: color,
                    type: 'fire'
                });
            }
            // Smoke particles
            for (let i = 0; i < 2; i++) {
                particles.push({
                    x: rocketX + (Math.random() - 0.5) * 18,
                    y: currentRocketY + Math.random() * 8,
                    vx: (Math.random() - 0.5) * 2,
                    vy: Math.random() * 1.5 + 0.5,
                    size: Math.random() * 8 + 5,
                    life: 1,
                    decay: Math.random() * 0.008 + 0.005,
                    color: { r: 160, g: 160, b: 180 },
                    type: 'smoke'
                });
            }
        }

        function animateTrail() {
            const elapsed = performance.now() - startTime;
            const progress = Math.min(elapsed / trailDuration, 1);

            // Eased rocket Y position (matches CSS cubic-bezier roughly)
            const eased = 1 - Math.pow(1 - progress, 3);
            const currentRocketY = rocketY - eased * (window.innerHeight + 200);

            // Spawn new particles at the rocket's current position
            if (progress < 0.9) {
                spawnTrailParticles(currentRocketY);
            }

            // Start scrolling at ~20% of the animation
            if (!scrollStarted && progress > 0.2) {
                scrollStarted = true;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            // Update & draw particles
            ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

            particles = particles.filter(p => p.life > 0);

            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.03; // slight gravity
                p.vx *= 0.99; // air resistance
                p.life -= p.decay;
                p.size *= 0.997;

                if (p.life <= 0) continue;

                ctx.save();
                if (p.type === 'fire') {
                    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
                    gradient.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.life * 0.9})`);
                    gradient.addColorStop(1, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0)`);
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    // Smoke - larger, fading
                    ctx.globalAlpha = p.life * 0.3;
                    ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.life * 0.25})`;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            }

            if (progress < 1 || particles.length > 0) {
                requestAnimationFrame(animateTrail);
            } else {
                // Cleanup
                ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
                btn.classList.remove('launched');
                btn.classList.remove('visible');
                animating = false;
                particles = [];
            }
        }

        requestAnimationFrame(animateTrail);
    });
}
