// RPG Portfolio Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollAnimations();
    initSkillBars();
    initParticleEffect();
    initContactForm();
    initMobileMenu();
    initHeroButton();
    
    // Add CSS animations and styles
    addDynamicStyles();
});

// Navigation functionality
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.rpg-nav').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                // Use native smooth scrolling with fallback
                if ('scrollBehavior' in document.documentElement.style) {
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                } else {
                    // Fallback for browsers that don't support smooth scrolling
                    smoothScrollTo(targetPosition, 800);
                }
                
                // Close mobile menu if open
                const navMenu = document.querySelector('.nav-menu');
                const navToggle = document.querySelector('.nav-toggle');
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                resetHamburgerIcon();
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', throttle(function() {
        let current = '';
        const scrollPosition = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, 100));
}

// Smooth scroll fallback function
function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

// Hero button functionality
function initHeroButton() {
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                const headerHeight = document.querySelector('.rpg-nav').offsetHeight;
                const targetPosition = aboutSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// Mobile menu functionality
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Animate hamburger lines
            updateHamburgerIcon();
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                resetHamburgerIcon();
            }
        });
    }
}

function updateHamburgerIcon() {
    const navToggle = document.querySelector('.nav-toggle');
    const spans = navToggle.querySelectorAll('span');
    
    if (navToggle.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        resetHamburgerIcon();
    }
}

function resetHamburgerIcon() {
    const spans = document.querySelectorAll('.nav-toggle span');
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Trigger skill bar animations
                if (entry.target.classList.contains('skill-item')) {
                    animateSkillBar(entry.target);
                }
                
                // Trigger quest card animations with stagger
                if (entry.target.classList.contains('quest-card')) {
                    const cards = document.querySelectorAll('.quest-card');
                    const index = Array.from(cards).indexOf(entry.target);
                    setTimeout(() => {
                        entry.target.classList.add('animate-quest');
                    }, index * 200);
                }
                
                // Trigger stat counter animations
                if (entry.target.classList.contains('stat-item') || entry.target.classList.contains('summary-item')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.skill-item, .quest-card, .stat-item, .summary-item, .character-card, .journal-entry');
    animateElements.forEach(el => observer.observe(el));
}

// Skill bar animations
function initSkillBars() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        const progressBar = item.querySelector('.skill-progress');
        if (progressBar) {
            // Reset width for animation
            progressBar.style.width = '0%';
        }
    });
}

function animateSkillBar(skillItem) {
    const progressBar = skillItem.querySelector('.skill-progress');
    const level = skillItem.getAttribute('data-level');
    
    if (progressBar && level) {
        setTimeout(() => {
            progressBar.style.width = level + '%';
            
            // Add glow effect during animation
            progressBar.style.boxShadow = '0 0 15px rgba(212, 175, 55, 0.8)';
            setTimeout(() => {
                progressBar.style.boxShadow = '0 0 5px rgba(212, 175, 55, 0.5)';
            }, 1000);
        }, 300);
    }
}

// Counter animations
function animateCounter(element) {
    const numberElement = element.querySelector('.stat-number, .summary-number');
    if (!numberElement || numberElement.dataset.animated) return;
    
    numberElement.dataset.animated = 'true';
    const finalValue = numberElement.textContent;
    const isNumeric = /^\d+\+?$/.test(finalValue);
    
    if (isNumeric) {
        const targetNumber = parseInt(finalValue.replace('+', ''));
        const hasPlus = finalValue.includes('+');
        let currentNumber = 0;
        const increment = Math.ceil(targetNumber / 30);
        const duration = 1500;
        const stepTime = duration / (targetNumber / increment);
        
        numberElement.textContent = '0' + (hasPlus ? '+' : '');
        
        const timer = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= targetNumber) {
                currentNumber = targetNumber;
                clearInterval(timer);
            }
            numberElement.textContent = currentNumber + (hasPlus ? '+' : '');
        }, stepTime);
    }
}

// Particle effect for hero section
function initParticleEffect() {
    const heroSection = document.querySelector('.hero');
    const particlesContainer = document.querySelector('.hero-particles');
    
    if (!particlesContainer) return;
    
    // Create floating particles
    for (let i = 0; i < 15; i++) {
        setTimeout(() => createParticle(particlesContainer), i * 500);
    }
    
    function createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.innerHTML = Math.random() > 0.5 ? '✦' : '✧';
        
        // Random position and properties
        const size = Math.random() * 8 + 4;
        const x = Math.random() * window.innerWidth;
        const animationDuration = Math.random() * 8 + 6;
        const delay = Math.random() * 3;
        
        particle.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: 100vh;
            font-size: ${size}px;
            color: rgba(212, 175, 55, ${Math.random() * 0.6 + 0.2});
            pointer-events: none;
            animation: float ${animationDuration}s ${delay}s infinite linear;
            z-index: 1;
        `;
        
        container.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
                createParticle(container); // Create new particle
            }
        }, (animationDuration + delay) * 1000);
    }
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name').trim(),
                email: formData.get('email').trim(),
                project: formData.get('project'),
                message: formData.get('message').trim()
            };
            
            // Validate form
            if (!data.name || !data.email || !data.message) {
                showNotification('Please fill in all required fields (Name, Email, and Message)', 'error');
                return;
            }
            
            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate form submission
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.disabled = true;
            submitButton.textContent = 'Sending Quest Request...';
            submitButton.style.opacity = '0.7';
            
            // Simulate API call delay
            setTimeout(() => {
                showNotification('Quest request sent successfully! I\'ll respond within 24 hours.', 'success');
                contactForm.reset();
                submitButton.disabled = false;
                submitButton.textContent = originalText;
                submitButton.style.opacity = '1';
            }, 2000);
        });
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" type="button">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Force reflow
    notification.offsetHeight;
    notification.classList.add('show');
    
    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Auto remove after 6 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            closeNotification(notification);
        }
    }, 6000);
}

function closeNotification(notification) {
    notification.classList.remove('show');
    notification.classList.add('hide');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 300);
}

// Add dynamic styles
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% {
                transform: translateY(100vh) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100px) rotate(360deg);
                opacity: 0;
            }
        }
        
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(30, 42, 58, 0.95);
            color: var(--rpg-light-gold);
            padding: 16px 20px;
            border-radius: 8px;
            border: 2px solid var(--rpg-gold);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
            z-index: 10000;
            max-width: 400px;
            backdrop-filter: blur(10px);
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s ease-out;
        }
        
        .notification.show {
            transform: translateX(0);
            opacity: 1;
        }
        
        .notification.hide {
            transform: translateX(100%);
            opacity: 0;
        }
        
        .notification--success {
            background: rgba(0, 139, 69, 0.9);
            border-color: #4ade80;
        }
        
        .notification--error {
            background: rgba(139, 0, 0, 0.9);
            border-color: #ff6b6b;
        }
        
        .notification-content {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 12px;
        }
        
        .notification-message {
            flex: 1;
            line-height: 1.4;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: var(--rpg-gold);
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background-color 0.2s;
            flex-shrink: 0;
        }
        
        .notification-close:hover {
            background-color: rgba(212, 175, 55, 0.2);
        }
        
        .animate-in {
            animation: fadeInUp 0.8s ease-out;
        }
        
        .animate-quest {
            animation: questAppear 0.6s ease-out;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes questAppear {
            from {
                opacity: 0;
                transform: translateY(20px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        /* Mobile menu styles */
        @media (max-width: 768px) {
            .nav-toggle {
                display: flex !important;
            }
            
            .nav-menu {
                position: fixed;
                top: 70px;
                left: -100%;
                width: 100%;
                height: calc(100vh - 70px);
                background: linear-gradient(180deg, rgba(15, 15, 15, 0.98) 0%, rgba(26, 26, 26, 0.95) 100%);
                backdrop-filter: blur(10px);
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
                padding-top: 50px;
                transition: left 0.3s ease-in-out;
                z-index: 999;
                border-right: 2px solid var(--rpg-gold);
            }
            
            .nav-menu.active {
                left: 0;
            }
            
            .nav-menu li {
                margin: 20px 0;
                opacity: 0;
                transform: translateX(-20px);
                transition: all 0.3s ease;
            }
            
            .nav-menu.active li {
                opacity: 1;
                transform: translateX(0);
            }
            
            .nav-menu.active li:nth-child(1) { transition-delay: 0.1s; }
            .nav-menu.active li:nth-child(2) { transition-delay: 0.2s; }
            .nav-menu.active li:nth-child(3) { transition-delay: 0.3s; }
            .nav-menu.active li:nth-child(4) { transition-delay: 0.4s; }
            .nav-menu.active li:nth-child(5) { transition-delay: 0.5s; }
            .nav-menu.active li:nth-child(6) { transition-delay: 0.6s; }
            
            .nav-link {
                font-size: 18px;
                padding: 15px 30px;
                width: 200px;
                text-align: center;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Performance optimization: throttle function
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add scroll-based header background change
window.addEventListener('scroll', throttle(function() {
    const nav = document.querySelector('.rpg-nav');
    if (window.scrollY > 50) {
        nav.style.background = 'linear-gradient(180deg, rgba(15, 15, 15, 0.98) 0%, rgba(26, 26, 26, 0.95) 100%)';
    } else {
        nav.style.background = 'linear-gradient(180deg, rgba(15, 15, 15, 0.95) 0%, rgba(26, 26, 26, 0.9) 100%)';
    }
}, 100));

// Add typing effect to hero subtitle
function initTypingEffect() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;
    
    const text = subtitle.textContent;
    subtitle.textContent = '';
    subtitle.style.borderRight = '2px solid var(--rpg-gold)';
    
    let i = 0;
    const typeInterval = setInterval(() => {
        subtitle.textContent += text.charAt(i);
        i++;
        if (i >= text.length) {
            clearInterval(typeInterval);
            setTimeout(() => {
                subtitle.style.borderRight = 'none';
            }, 500);
        }
    }, 100);
}

// Initialize typing effect after a delay
setTimeout(initTypingEffect, 1000);

// Add parallax effect to hero background
window.addEventListener('scroll', throttle(function() {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.3;
    
    if (hero && scrolled < hero.offsetHeight) {
        hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }
}, 16));