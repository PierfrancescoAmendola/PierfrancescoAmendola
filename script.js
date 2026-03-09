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
    initSolarSystem();
    initEarth();
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

    let time = 0;

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
            const angle = time * p.speed * 0.3;
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

        time += 0.008;
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

// ─── ROTATING EARTH ──────────────────────────────────────
function initEarth() {
    const canvas = document.getElementById('earth-canvas');
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

    // Generate land masses as procedural patches on a sphere
    // We use a seeded set of "continent" blobs defined by lat/lng and size
    const continents = [
        // Roughly inspired by real positions
        { lat: 48, lng: -10, r: 28, name: 'Europe' },
        { lat: 35, lng: 20, r: 22, name: 'Middle East' },
        { lat: 10, lng: 20, r: 35, name: 'Africa' },
        { lat: 55, lng: 90, r: 40, name: 'Asia' },
        { lat: 25, lng: 80, r: 25, name: 'India' },
        { lat: 45, lng: -100, r: 30, name: 'North America' },
        { lat: 30, lng: -90, r: 18, name: 'Central America' },
        { lat: -15, lng: -55, r: 32, name: 'South America' },
        { lat: -25, lng: 135, r: 26, name: 'Australia' },
        { lat: 40, lng: 130, r: 15, name: 'Japan/Korea' },
        { lat: 65, lng: -50, r: 18, name: 'Greenland' },
        { lat: 60, lng: 60, r: 20, name: 'Russia West' },
        { lat: 60, lng: 120, r: 25, name: 'Russia East' },
        { lat: 5, lng: 110, r: 18, name: 'Southeast Asia' },
    ];

    let rotation = 0;

    function latLngTo3D(lat, lng, r) {
        const phi = (90 - lat) * Math.PI / 180;
        const theta = (lng + rotation) * Math.PI / 180;
        return {
            x: r * Math.sin(phi) * Math.cos(theta),
            y: r * Math.cos(phi),
            z: r * Math.sin(phi) * Math.sin(theta)
        };
    }

    function draw() {
        const w = canvas.width / (window.devicePixelRatio || 1);
        const h = canvas.height / (window.devicePixelRatio || 1);
        ctx.clearRect(0, 0, w, h);

        const cx = w / 2;
        const cy = h / 2;
        const earthR = Math.min(w, h) / 2 - 30;

        // Atmosphere glow
        const atmoGrad = ctx.createRadialGradient(cx, cy, earthR * 0.9, cx, cy, earthR + 35);
        atmoGrad.addColorStop(0, 'rgba(100, 180, 255, 0.0)');
        atmoGrad.addColorStop(0.5, 'rgba(80, 160, 255, 0.08)');
        atmoGrad.addColorStop(0.8, 'rgba(60, 140, 255, 0.04)');
        atmoGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = atmoGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, earthR + 35, 0, Math.PI * 2);
        ctx.fill();

        // Ocean base
        const oceanGrad = ctx.createRadialGradient(cx - earthR * 0.3, cy - earthR * 0.3, earthR * 0.1, cx, cy, earthR);
        oceanGrad.addColorStop(0, '#4a90d9');
        oceanGrad.addColorStop(0.4, '#2a6ab5');
        oceanGrad.addColorStop(0.8, '#1a4a85');
        oceanGrad.addColorStop(1, '#0d2d5a');
        ctx.fillStyle = oceanGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, earthR, 0, Math.PI * 2);
        ctx.fill();

        // Clip to sphere for land
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, earthR, 0, Math.PI * 2);
        ctx.clip();

        // Draw continents
        for (const c of continents) {
            // Generate multiple dots per continent for organic shape
            const steps = 12;
            for (let dlat = -c.r; dlat <= c.r; dlat += steps) {
                for (let dlng = -c.r; dlng <= c.r; dlng += steps) {
                    const dist = Math.sqrt(dlat * dlat + dlng * dlng);
                    if (dist > c.r) continue;

                    const p = latLngTo3D(c.lat + dlat, c.lng + dlng, earthR);
                    // Only draw if facing us (z > 0)
                    if (p.z < 0) continue;

                    const screenX = cx + p.x;
                    const screenY = cy - p.y;

                    // Size varies with depth
                    const depthFactor = (p.z / earthR);
                    const dotSize = (steps * 0.7) * depthFactor;

                    // Color varies slightly
                    const brightness = 0.3 + depthFactor * 0.7;
                    const g1 = Math.floor(120 + brightness * 80);
                    const g2 = Math.floor(80 + brightness * 60);
                    ctx.fillStyle = `rgb(${g2}, ${g1}, ${g2 - 20})`;
                    ctx.beginPath();
                    ctx.arc(screenX, screenY, Math.max(dotSize, 2), 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        // Cloud layer - subtle white patches
        const cloudSeeds = [
            { lat: 40, lng: 30, r: 20 },
            { lat: -10, lng: -30, r: 25 },
            { lat: 20, lng: 100, r: 22 },
            { lat: -30, lng: 70, r: 18 },
            { lat: 50, lng: -60, r: 20 },
            { lat: -5, lng: 150, r: 16 },
            { lat: 30, lng: -120, r: 22 },
        ];
        for (const cl of cloudSeeds) {
            const cloudLng = cl.lng + rotation * 0.15; // clouds move slightly slower
            for (let dlat = -cl.r; dlat <= cl.r; dlat += 15) {
                for (let dlng = -cl.r; dlng <= cl.r; dlng += 15) {
                    if (Math.sqrt(dlat * dlat + dlng * dlng) > cl.r) continue;
                    const p = latLngTo3D(cl.lat + dlat, cloudLng + dlng, earthR + 1);
                    if (p.z < earthR * 0.2) continue;
                    const sx = cx + p.x;
                    const sy = cy - p.y;
                    const df = p.z / earthR;
                    ctx.fillStyle = `rgba(255, 255, 255, ${(df * 0.15).toFixed(2)})`;
                    ctx.beginPath();
                    ctx.arc(sx, sy, 6 * df, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        ctx.restore();

        // Specular highlight
        const specGrad = ctx.createRadialGradient(cx - earthR * 0.35, cy - earthR * 0.35, 0, cx, cy, earthR);
        specGrad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
        specGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.04)');
        specGrad.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
        ctx.fillStyle = specGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, earthR, 0, Math.PI * 2);
        ctx.fill();

        // Edge rim light
        ctx.strokeStyle = 'rgba(120, 180, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, earthR, 0, Math.PI * 2);
        ctx.stroke();

        rotation += 0.15;
        requestAnimationFrame(draw);
    }

    draw();
}
