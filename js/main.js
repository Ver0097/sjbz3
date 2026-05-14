document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTop = document.getElementById('backToTop');
    const statNums = document.querySelectorAll('.stat-num');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        updateActiveNav(scrollY);
    });

    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        nav.classList.toggle('active');
    });

    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
        });
    });

    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                var offset = header.offsetHeight;
                var targetPos = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        });
    });

    function updateActiveNav(scrollY) {
        sections.forEach(function(section) {
            var top = section.offsetTop - header.offsetHeight - 100;
            var bottom = top + section.offsetHeight;
            var id = section.getAttribute('id');

            if (scrollY >= top && scrollY < bottom) {
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    var statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    var statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    function animateStats() {
        statNums.forEach(function(num) {
            var target = parseInt(num.getAttribute('data-target'));
            var duration = 2000;
            var start = 0;
            var startTime = null;

            function update(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3);
                num.textContent = Math.floor(eased * target);
                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    num.textContent = target;
                }
            }

            requestAnimationFrame(update);
        });
    }

    var fadeElements = document.querySelectorAll('.service-card, .solution-card, .advantage-card, .flow-step, .news-card, .platform-content, .platform-visual, .contact-info, .contact-form-wrap');

    fadeElements.forEach(function(el) {
        el.classList.add('fade-in');
    });

    var fadeObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    fadeElements.forEach(function(el) {
        fadeObserver.observe(el);
    });

    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var formData = new FormData(this);
            var data = {};
            formData.forEach(function(value, key) {
                data[key] = value;
            });
            showToast('提交成功！我们将尽快与您联系。');
            this.reset();
        });
    }

    function showToast(message) {
        var existing = document.querySelector('.toast');
        if (existing) existing.remove();

        var toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = '<div class="toast-content"><span class="toast-icon">✓</span><span>' + message + '</span></div>';
        document.body.appendChild(toast);

        var style = document.createElement('style');
        style.textContent = '.toast{position:fixed;top:100px;left:50%;transform:translateX(-50%) translateY(-20px);z-index:9999;opacity:0;transition:all .3s ease}.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}.toast-content{display:flex;align-items:center;gap:10px;padding:16px 28px;background:#fff;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,.15);font-size:15px;font-weight:600}.toast-icon{width:28px;height:28px;background:#22c55e;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px}';
        document.head.appendChild(style);

        requestAnimationFrame(function() {
            toast.classList.add('show');
        });

        setTimeout(function() {
            toast.classList.remove('show');
            setTimeout(function() { toast.remove(); }, 300);
        }, 3000);
    }

    var particles = document.getElementById('particles');
    if (particles) {
        createParticles(particles);
    }

    function createParticles(container) {
        var canvas = document.createElement('canvas');
        canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
        container.appendChild(canvas);
        var ctx = canvas.getContext('2d');
        var particlesArr = [];
        var particleCount = 50;

        function resize() {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
        }

        resize();
        window.addEventListener('resize', resize);

        function Particle() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        for (var i = 0; i < particleCount; i++) {
            particlesArr.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particlesArr.forEach(function(p) {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,255,255,' + p.opacity + ')';
                ctx.fill();
            });

            for (var i = 0; i < particlesArr.length; i++) {
                for (var j = i + 1; j < particlesArr.length; j++) {
                    var dx = particlesArr[i].x - particlesArr[j].x;
                    var dy = particlesArr[i].y - particlesArr[j].y;
                    var dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particlesArr[i].x, particlesArr[i].y);
                        ctx.lineTo(particlesArr[j].x, particlesArr[j].y);
                        ctx.strokeStyle = 'rgba(255,255,255,' + (0.1 * (1 - dist / 150)) + ')';
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animate);
        }

        animate();
    }

    var platformScreen = document.querySelector('.platform-screen');
    if (platformScreen) {
        var boxes = platformScreen.querySelectorAll('.annotation-box');
        boxes.forEach(function(box) {
            box.style.animation = 'pulse 2s ease-in-out infinite';
        });

        var pulseStyle = document.createElement('style');
        pulseStyle.textContent = '@keyframes pulse{0%,100%{opacity:1}50%{opacity:.7}}';
        document.head.appendChild(pulseStyle);
    }
});
