// Dark Souls Portfolio - Interactive JavaScript
class UnkindledPortfolio {
  constructor() {
    this.isLoaded = false;
    this.currentSection = 'home';
    this.sections = ['home', 'about', 'skills', 'projects', 'contact'];
    this.skillsAnimated = false;
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.handleLoading();
    this.createParticles();
    this.initIntersectionObserver();
    this.animateOnScroll();
    this.initProjectCards();
  }

  setupEventListeners() {
    // Window events
    window.addEventListener('load', () => this.hideLoadingScreen());
    window.addEventListener('scroll', () => this.handleScroll());
    window.addEventListener('resize', () => this.handleResize());
    
    // Navigation events
    this.setupNavigation();
    
    // Contact form
    this.setupContactForm();
    
    // Smooth scrolling for navigation links
    this.setupSmoothScrolling();
  }

  setupNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle) {
      navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('nav-open');
      });
    }

    // Navigation link clicks
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = link.getAttribute('data-section');
        this.navigateToSection(targetSection);
        
        // Close mobile menu if open
        if (navMenu.classList.contains('active')) {
          navToggle.classList.remove('active');
          navMenu.classList.remove('active');
          document.body.classList.remove('nav-open');
        }
      });
    });
  }

  setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const targetElement = document.querySelector(href);
        
        if (targetElement) {
          const offsetTop = targetElement.offsetTop - 70; // Account for fixed header
          
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  navigateToSection(sectionId) {
    const targetElement = document.getElementById(sectionId);
    if (!targetElement) return;

    const offsetTop = targetElement.offsetTop - 70;
    
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  }

  handleLoading() {
    // Simulate loading time for dramatic effect
    setTimeout(() => {
      this.hideLoadingScreen();
    }, 2500);
  }

  hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500);
    }
    
    this.isLoaded = true;
    this.startInitialAnimations();
  }

  startInitialAnimations() {
    // Animate hero elements
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroDescription = document.querySelector('.hero-description');
    const heroActions = document.querySelector('.hero-actions');

    if (heroTitle) {
      setTimeout(() => heroTitle.classList.add('animate-in'), 300);
    }
    if (heroSubtitle) {
      setTimeout(() => heroSubtitle.classList.add('animate-in'), 600);
    }
    if (heroDescription) {
      setTimeout(() => heroDescription.classList.add('animate-in'), 900);
    }
    if (heroActions) {
      setTimeout(() => heroActions.classList.add('animate-in'), 1200);
    }
  }

  createParticles() {
    const particlesContainer = document.getElementById('hero-particles');
    if (!particlesContainer) return;

    // Create floating ember particles
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        this.createParticle(particlesContainer);
      }, i * 200);
    }

    // Continue creating particles periodically
    setInterval(() => {
      if (document.visibilityState === 'visible') {
        this.createParticle(particlesContainer);
      }
    }, 3000);
  }

  createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'ember-particle';
    
    // Random position and properties
    const startX = Math.random() * window.innerWidth;
    const startY = window.innerHeight + 20;
    const size = Math.random() * 4 + 2;
    const duration = Math.random() * 10 + 8;
    const opacity = Math.random() * 0.7 + 0.3;
    
    particle.style.cssText = `
      position: absolute;
      left: ${startX}px;
      top: ${startY}px;
      width: ${size}px;
      height: ${size}px;
      background: radial-gradient(circle, #ff6b35, #ffa726);
      border-radius: 50%;
      opacity: ${opacity};
      pointer-events: none;
      z-index: 1;
      box-shadow: 0 0 10px rgba(255, 107, 53, 0.8);
    `;
    
    container.appendChild(particle);
    
    // Animate particle
    let currentY = startY;
    let currentX = startX;
    let currentOpacity = opacity;
    const xDirection = (Math.random() - 0.5) * 2;
    const animationSpeed = 60 / duration;
    
    const animateParticle = () => {
      currentY -= animationSpeed;
      currentX += xDirection * 0.5;
      currentOpacity -= opacity / (duration * 60);
      
      particle.style.top = `${currentY}px`;
      particle.style.left = `${currentX}px`;
      particle.style.opacity = currentOpacity;
      
      if (currentY < -20 || currentOpacity <= 0) {
        particle.remove();
      } else {
        requestAnimationFrame(animateParticle);
      }
    };
    
    requestAnimationFrame(animateParticle);
  }

  initIntersectionObserver() {
    const options = {
      threshold: 0.3,
      rootMargin: '-70px 0px 0px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          this.updateActiveNavigation(sectionId);
          this.handleSectionEnter(entry.target);
        }
      });
    }, options);

    // Observe all sections
    this.sections.forEach(sectionId => {
      const section = document.getElementById(sectionId);
      if (section) {
        observer.observe(section);
      }
    });
  }

  updateActiveNavigation(sectionId) {
    if (this.currentSection === sectionId) return;
    
    this.currentSection = sectionId;
    
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === sectionId) {
        link.classList.add('active');
      }
    });
  }

  handleSectionEnter(section) {
    const sectionId = section.id;
    
    // Trigger specific animations based on section
    switch (sectionId) {
      case 'skills':
        if (!this.skillsAnimated) {
          this.animateSkillBars();
          this.skillsAnimated = true;
        }
        break;
      case 'about':
        this.animateAboutSection();
        break;
      case 'projects':
        this.animateProjectsSection();
        break;
      case 'contact':
        this.animateContactSection();
        break;
    }
  }

  animateSkillBars() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('animate-in');
        
        // Animate skill bar progress
        const progressBar = item.querySelector('.skill-progress');
        if (progressBar) {
          const level = item.getAttribute('data-level');
          progressBar.style.width = '0%';
          
          setTimeout(() => {
            progressBar.style.width = `${level}%`;
          }, 300);
        }
      }, index * 100);
    });
  }

  animateAboutSection() {
    const aboutText = document.querySelector('.about-text');
    const aboutImage = document.querySelector('.about-image');
    const statItems = document.querySelectorAll('.stat-item');
    
    if (aboutText && !aboutText.classList.contains('animate-left')) {
      aboutText.classList.add('animate-left');
    }
    
    if (aboutImage && !aboutImage.classList.contains('animate-right')) {
      aboutImage.classList.add('animate-right');
    }
    
    statItems.forEach((item, index) => {
      setTimeout(() => {
        if (!item.classList.contains('animate-in')) {
          item.classList.add('animate-in');
        }
      }, index * 200);
    });
  }

  animateProjectsSection() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach((card, index) => {
      setTimeout(() => {
        if (!card.classList.contains('animate-in')) {
          card.classList.add('animate-in');
        }
      }, index * 150);
    });
  }

  animateContactSection() {
    const contactInfo = document.querySelector('.contact-info');
    const contactForm = document.querySelector('.contact-form');
    
    if (contactInfo && !contactInfo.classList.contains('animate-left')) {
      contactInfo.classList.add('animate-left');
    }
    
    if (contactForm && !contactForm.classList.contains('animate-right')) {
      contactForm.classList.add('animate-right');
    }
  }

  initProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
      const cardInner = card.querySelector('.project-card-inner');
      let isFlipped = false;
      
      card.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          // On mobile, use click to flip
          isFlipped = !isFlipped;
          cardInner.style.transform = isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
        }
      });
      
      // Add touch support for mobile
      card.addEventListener('touchstart', (e) => {
        e.preventDefault();
        card.click();
      });
    });
  }

  setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleContactSubmit(contactForm);
    });

    // Add focus effects to form inputs
    const formInputs = contactForm.querySelectorAll('.form-control');
    formInputs.forEach(input => {
      input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
      });
      
      input.addEventListener('blur', () => {
        if (!input.value) {
          input.parentElement.classList.remove('focused');
        }
      });
    });
  }

  handleContactSubmit(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Sending Message...';
    submitBtn.disabled = true;
    
    // Get form data
    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message')
    };
    
    // Simulate form submission (replace with actual form handling)
    setTimeout(() => {
      this.showNotification('Message sent! The bonfire has been lit.', 'success');
      form.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 2000);
    
    // Log form data for development
    console.log('Form submitted:', data);
  }

  showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${type === 'success' ? '🔥' : '⚡'}</span>
        <span class="notification-message">${message}</span>
      </div>
    `;
    
    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${type === 'success' ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      z-index: 10000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      font-family: var(--font-cinzel);
      font-weight: 600;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 4000);
  }

  handleScroll() {
    if (!this.isLoaded) return;
    
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    
    // Update navigation background opacity
    const nav = document.getElementById('nav-header');
    if (nav) {
      const opacity = Math.min(scrollY / 100, 0.95);
      nav.style.background = `rgba(27, 26, 23, ${opacity})`;
    }
    
    // Parallax effect for hero bonfire
    const heroBonfire = document.querySelector('.hero-bonfire');
    if (heroBonfire && scrollY < windowHeight) {
      const parallaxSpeed = scrollY * 0.5;
      heroBonfire.style.transform = `translateY(${parallaxSpeed}px)`;
    }
    
    // Animate elements on scroll
    this.animateOnScroll();
  }

  animateOnScroll() {
    const elements = document.querySelectorAll('[data-animate]');
    
    elements.forEach(element => {
      const elementTop = element.offsetTop;
      const elementHeight = element.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;
      
      if (scrollY + windowHeight > elementTop + elementHeight * 0.1) {
        element.classList.add('animate-in');
      }
    });
  }

  handleResize() {
    // Handle responsive changes
    if (window.innerWidth > 968) {
      const navMenu = document.getElementById('nav-menu');
      const navToggle = document.getElementById('nav-toggle');
      
      if (navMenu) navMenu.classList.remove('active');
      if (navToggle) navToggle.classList.remove('active');
      document.body.classList.remove('nav-open');
    }
    
    // Recreate particles on resize
    if (this.isLoaded) {
      const particlesContainer = document.getElementById('hero-particles');
      if (particlesContainer) {
        // Clear existing particles
        particlesContainer.innerHTML = '';
        // Recreate with new dimensions
        setTimeout(() => this.createParticles(), 100);
      }
    }
  }

  // Utility method for smooth animations
  animateValue(element, start, end, duration, suffix = '') {
    const startTime = performance.now();
    const range = end - start;
    
    const updateValue = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = start + (range * easeProgress);
      
      element.textContent = Math.round(current) + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(updateValue);
      }
    };
    
    requestAnimationFrame(updateValue);
  }

  // Konami code easter egg for Dark Souls fans
  initKonamiCode() {
    const konamiCode = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'KeyB', 'KeyA'
    ];
    let userInput = [];
    
    document.addEventListener('keydown', (e) => {
      userInput.push(e.code);
      
      if (userInput.length > konamiCode.length) {
        userInput.shift();
      }
      
      if (userInput.join(',') === konamiCode.join(',')) {
        this.triggerEasterEgg();
        userInput = [];
      }
    });
  }

  triggerEasterEgg() {
    // Secret Dark Souls easter egg
    this.showNotification('You Died... Just kidding! 🔥', 'success');
    
    // Add temporary visual effect
    document.body.style.filter = 'sepia(1) hue-rotate(30deg)';
    setTimeout(() => {
      document.body.style.filter = 'none';
    }, 2000);
    
    // Play some visual fireworks
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        this.createParticle(document.body);
      }, i * 50);
    }
  }
}

// Initialize the portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const portfolio = new UnkindledPortfolio();
  
  // Make portfolio globally accessible for debugging
  window.unkindledPortfolio = portfolio;
  
  // Add some console flair
  console.log(`
    🔥 The Unkindled Developer Portfolio 🔥
    =====================================
    
    May the code compile on first try.
    
    Built with vanilla JavaScript, CSS3, and HTML5
    Optimized for GitHub Pages deployment
    
    GitHub: https://github.com/yourusername/portfolio
  `);
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UnkindledPortfolio;
}