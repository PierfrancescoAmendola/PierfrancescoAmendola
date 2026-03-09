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

    // Improved continent data with sub-regions for more realistic shapes
    const landRegions = [
        // North America
        { lat: 50, lng: -100, r: 22 },
        { lat: 42, lng: -90, r: 18 },
        { lat: 55, lng: -115, r: 16 },
        { lat: 60, lng: -100, r: 14 },
        { lat: 35, lng: -85, r: 10 },
        { lat: 48, lng: -75, r: 12 },
        { lat: 62, lng: -130, r: 12 },
        { lat: 30, lng: -98, r: 12 },
        // Central America
        { lat: 22, lng: -100, r: 8 },
        { lat: 16, lng: -90, r: 7 },
        { lat: 12, lng: -84, r: 5 },
        // South America
        { lat: -3, lng: -60, r: 20 },
        { lat: -12, lng: -52, r: 18 },
        { lat: -22, lng: -48, r: 14 },
        { lat: -32, lng: -62, r: 12 },
        { lat: 4, lng: -72, r: 10 },
        { lat: -8, lng: -38, r: 10 },
        { lat: -44, lng: -68, r: 8 },
        // Europe
        { lat: 48, lng: 5, r: 14 },
        { lat: 52, lng: 12, r: 10 },
        { lat: 45, lng: -5, r: 8 },
        { lat: 40, lng: 0, r: 7 },
        { lat: 42, lng: 13, r: 8 },
        { lat: 56, lng: 10, r: 8 },
        { lat: 60, lng: 20, r: 10 },
        { lat: 65, lng: 16, r: 8 },
        { lat: 38, lng: 24, r: 7 },
        { lat: 55, lng: -5, r: 7 },
        // Africa
        { lat: 30, lng: 10, r: 14 },
        { lat: 18, lng: 15, r: 18 },
        { lat: 5, lng: 20, r: 16 },
        { lat: -5, lng: 28, r: 14 },
        { lat: -18, lng: 30, r: 12 },
        { lat: -28, lng: 26, r: 10 },
        { lat: 10, lng: 40, r: 10 },
        { lat: 0, lng: 10, r: 10 },
        // Russia/Asia
        { lat: 58, lng: 40, r: 16 },
        { lat: 56, lng: 65, r: 18 },
        { lat: 55, lng: 90, r: 16 },
        { lat: 58, lng: 110, r: 14 },
        { lat: 54, lng: 130, r: 12 },
        { lat: 62, lng: 130, r: 10 },
        { lat: 64, lng: 160, r: 10 },
        // China / East Asia
        { lat: 40, lng: 105, r: 16 },
        { lat: 32, lng: 110, r: 14 },
        { lat: 35, lng: 118, r: 10 },
        { lat: 28, lng: 100, r: 10 },
        { lat: 45, lng: 90, r: 10 },
        // India
        { lat: 22, lng: 78, r: 14 },
        { lat: 28, lng: 80, r: 10 },
        { lat: 14, lng: 78, r: 8 },
        { lat: 10, lng: 76, r: 6 },
        // Southeast Asia
        { lat: 15, lng: 105, r: 10 },
        { lat: 5, lng: 105, r: 8 },
        { lat: 0, lng: 115, r: 10 },
        { lat: -5, lng: 120, r: 8 },
        // Japan/Korea
        { lat: 36, lng: 138, r: 6 },
        { lat: 40, lng: 140, r: 5 },
        { lat: 33, lng: 132, r: 5 },
        { lat: 37, lng: 127, r: 5 },
        // Middle East
        { lat: 26, lng: 46, r: 12 },
        { lat: 32, lng: 44, r: 8 },
        { lat: 34, lng: 36, r: 6 },
        { lat: 22, lng: 56, r: 8 },
        // Australia
        { lat: -24, lng: 134, r: 18 },
        { lat: -30, lng: 140, r: 14 },
        { lat: -18, lng: 130, r: 12 },
        { lat: -32, lng: 148, r: 10 },
        { lat: -20, lng: 145, r: 10 },
        // Greenland
        { lat: 72, lng: -42, r: 12 },
        { lat: 68, lng: -50, r: 10 },
        // Ice caps hint
        { lat: -78, lng: 0, r: 18 },
        { lat: -75, lng: 60, r: 14 },
        { lat: -75, lng: -60, r: 14 },
    ];

    // Pre-generate noise map for terrain detail
    const noiseSize = 256;
    const noiseMap = new Float32Array(noiseSize * noiseSize);
    // Simple value noise
    function seedNoise() {
        const grid = 16;
        const base = new Float32Array(grid * grid);
        for (let i = 0; i < base.length; i++) base[i] = Math.random();
        for (let y = 0; y < noiseSize; y++) {
            for (let x = 0; x < noiseSize; x++) {
                const gx = (x / noiseSize) * grid;
                const gy = (y / noiseSize) * grid;
                const ix = Math.floor(gx);
                const iy = Math.floor(gy);
                const fx = gx - ix;
                const fy = gy - iy;
                const sf = (t) => t * t * (3 - 2 * t);
                const a = base[(iy % grid) * grid + (ix % grid)];
                const b = base[(iy % grid) * grid + ((ix + 1) % grid)];
                const c = base[((iy + 1) % grid) * grid + (ix % grid)];
                const d = base[((iy + 1) % grid) * grid + ((ix + 1) % grid)];
                const top = a + sf(fx) * (b - a);
                const bot = c + sf(fx) * (d - c);
                noiseMap[y * noiseSize + x] = top + sf(fy) * (bot - top);
            }
        }
    }
    seedNoise();

    function getNoise(u, v) {
        const x = ((u % 1) + 1) % 1 * (noiseSize - 1);
        const y = ((v % 1) + 1) % 1 * (noiseSize - 1);
        const ix = Math.floor(x);
        const iy = Math.floor(y);
        return noiseMap[iy * noiseSize + ix] || 0;
    }

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

    function isLand(lat, lng) {
        for (const r of landRegions) {
            const dlat = lat - r.lat;
            const dlng = lng - r.lng;
            const d = Math.sqrt(dlat * dlat + dlng * dlng);
            if (d < r.r) return true;
        }
        return false;
    }

    // Pre-render the earth sphere to an offscreen canvas for performance
    let offscreen = null;
    let offCtx = null;
    let lastR = 0;
    let frameCount = 0;

    function renderSphere(cx, cy, earthR) {
        const size = Math.ceil(earthR * 2) + 4;
        if (!offscreen || offscreen.width !== size) {
            offscreen = document.createElement('canvas');
            offscreen.width = size;
            offscreen.height = size;
            offCtx = offscreen.getContext('2d');
        }
        offCtx.clearRect(0, 0, size, size);

        const oc = earthR + 2;
        const step = 2; // pixel density — 2px steps for good quality

        for (let py = -earthR; py <= earthR; py += step) {
            for (let px = -earthR; px <= earthR; px += step) {
                const dist = Math.sqrt(px * px + py * py);
                if (dist > earthR) continue;

                // Map pixel to sphere coordinates
                const pz = Math.sqrt(earthR * earthR - px * px - py * py);
                const lat = Math.asin(-py / earthR) * 180 / Math.PI;
                const lng = Math.atan2(px, pz) * 180 / Math.PI - rotation;
                const normLng = ((lng % 360) + 360) % 360 - 180;

                const depthFactor = pz / earthR;
                const nVal = getNoise((normLng + 180) / 360, (lat + 90) / 180);

                let r, g, b;

                if (isLand(lat, normLng)) {
                    // Land with varied terrain
                    const latAbs = Math.abs(lat);
                    if (latAbs > 65) {
                        // Snow/ice caps
                        r = 210 + nVal * 30;
                        g = 220 + nVal * 25;
                        b = 230 + nVal * 20;
                    } else if (latAbs < 15) {
                        // Tropical green
                        r = 30 + nVal * 40;
                        g = 100 + nVal * 60;
                        b = 25 + nVal * 30;
                    } else if (latAbs < 35) {
                        // Temperate / desert blend
                        const desertChance = nVal;
                        if (desertChance > 0.6) {
                            r = 170 + nVal * 40;
                            g = 150 + nVal * 30;
                            b = 90 + nVal * 20;
                        } else {
                            r = 50 + nVal * 40;
                            g = 110 + nVal * 50;
                            b = 35 + nVal * 25;
                        }
                    } else {
                        // Boreal/temperate
                        r = 40 + nVal * 35;
                        g = 85 + nVal * 50;
                        b = 35 + nVal * 25;
                    }
                } else {
                    // Ocean with depth variation
                    const depth = 0.4 + nVal * 0.3;
                    r = 10 + depth * 30;
                    g = 40 + depth * 60 + depthFactor * 20;
                    b = 100 + depth * 80 + depthFactor * 40;
                }

                // Apply lighting (sun from upper-left)
                const lightX = -0.4, lightY = -0.5, lightZ = 0.76;
                const nx = px / earthR, ny = -py / earthR, nz = pz / earthR;
                const diffuse = Math.max(0, nx * lightX + ny * lightY + nz * lightZ);
                const ambient = 0.3;
                const light = ambient + (1 - ambient) * diffuse;

                r = Math.min(255, Math.floor(r * light));
                g = Math.min(255, Math.floor(g * light));
                b = Math.min(255, Math.floor(b * light));

                offCtx.fillStyle = `rgb(${r},${g},${b})`;
                offCtx.fillRect(oc + px - step / 2, oc + py - step / 2, step + 0.5, step + 0.5);
            }
        }

        // Cloud layer on the offscreen canvas
        offCtx.save();
        offCtx.beginPath();
        offCtx.arc(oc, oc, earthR, 0, Math.PI * 2);
        offCtx.clip();

        const cloudSpeed = rotation * 0.12;
        const cloudPatterns = [
            { lat: 45, lng: 20, r: 24 }, { lat: -8, lng: -40, r: 28 },
            { lat: 20, lng: 100, r: 22 }, { lat: -35, lng: 70, r: 20 },
            { lat: 55, lng: -70, r: 22 }, { lat: -5, lng: 150, r: 18 },
            { lat: 30, lng: -130, r: 24 }, { lat: 10, lng: 60, r: 16 },
            { lat: -45, lng: -20, r: 18 }, { lat: 60, lng: 80, r: 16 },
        ];
        for (const cl of cloudPatterns) {
            for (let dlat = -cl.r; dlat <= cl.r; dlat += 8) {
                for (let dlng = -cl.r; dlng <= cl.r; dlng += 8) {
                    const d = Math.sqrt(dlat * dlat + dlng * dlng);
                    if (d > cl.r) continue;
                    const edgeFade = 1 - (d / cl.r);
                    const p = latLngTo3D(cl.lat + dlat, cl.lng + dlng + cloudSpeed, earthR + 2);
                    if (p.z < earthR * 0.1) continue;
                    const sx = oc + p.x;
                    const sy = oc - p.y;
                    const df = p.z / earthR;
                    const alpha = df * edgeFade * 0.2;
                    offCtx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
                    offCtx.beginPath();
                    offCtx.arc(sx, sy, 5 * df, 0, Math.PI * 2);
                    offCtx.fill();
                }
            }
        }
        offCtx.restore();

        return { size, oc };
    }

    function draw() {
        const w = canvas.width / (window.devicePixelRatio || 1);
        const h = canvas.height / (window.devicePixelRatio || 1);
        ctx.clearRect(0, 0, w, h);

        const cx = w / 2;
        const cy = h / 2;
        const earthR = Math.min(w, h) / 2 - 30;

        // Outer atmosphere glow
        const atmo1 = ctx.createRadialGradient(cx, cy, earthR, cx, cy, earthR + 40);
        atmo1.addColorStop(0, 'rgba(80, 160, 255, 0.12)');
        atmo1.addColorStop(0.5, 'rgba(60, 140, 255, 0.05)');
        atmo1.addColorStop(1, 'transparent');
        ctx.fillStyle = atmo1;
        ctx.beginPath();
        ctx.arc(cx, cy, earthR + 40, 0, Math.PI * 2);
        ctx.fill();

        // Render sphere
        const { size, oc } = renderSphere(cx, cy, earthR);

        // Clip sphere and draw the offscreen result
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, earthR, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(offscreen, cx - oc, cy - oc);
        ctx.restore();

        // Specular highlight
        const specGrad = ctx.createRadialGradient(
            cx - earthR * 0.35, cy - earthR * 0.35, 0,
            cx - earthR * 0.1, cy - earthR * 0.1, earthR * 0.8
        );
        specGrad.addColorStop(0, 'rgba(255, 255, 255, 0.18)');
        specGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.03)');
        specGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = specGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, earthR, 0, Math.PI * 2);
        ctx.fill();

        // Terminator shadow (dark side)
        const shadowGrad = ctx.createRadialGradient(
            cx + earthR * 0.5, cy + earthR * 0.4, earthR * 0.2,
            cx, cy, earthR
        );
        shadowGrad.addColorStop(0, 'rgba(0, 0, 20, 0.35)');
        shadowGrad.addColorStop(0.6, 'rgba(0, 0, 20, 0.1)');
        shadowGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = shadowGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, earthR, 0, Math.PI * 2);
        ctx.fill();

        // Fresnel rim light
        ctx.strokeStyle = 'rgba(100, 180, 255, 0.25)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, earthR, 0, Math.PI * 2);
        ctx.stroke();

        // Inner bright rim on the lit side
        const rimGrad = ctx.createRadialGradient(
            cx - earthR * 0.4, cy - earthR * 0.3, earthR * 0.7,
            cx, cy, earthR
        );
        rimGrad.addColorStop(0, 'transparent');
        rimGrad.addColorStop(0.9, 'transparent');
        rimGrad.addColorStop(1, 'rgba(120, 190, 255, 0.15)');
        ctx.fillStyle = rimGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, earthR, 0, Math.PI * 2);
        ctx.fill();

        rotation += 0.12;
        requestAnimationFrame(draw);
    }

    draw();
}
