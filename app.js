// Global variables
let particles = [];
let mouseX = 0;
let mouseY = 0;
let animationId;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize all components
    handleLoadingScreen();
    initParticleBackground();
    initSmoothScrolling();
    initScrollAnimations();
    initNavigation();
    initInteractiveElements();
    initContactHandling();
    
    // Start particle animation
    animateParticles();
}

// Loading Screen Handler
function handleLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Hide loading screen after 3 seconds
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        
        // Remove from DOM after transition
        setTimeout(() => {
            loadingScreen.remove();
            // Trigger entrance animations
            triggerEntranceAnimations();
        }, 1000);
    }, 3000);
}

function triggerEntranceAnimations() {
    // Add entrance animation to hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        heroContent.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
        
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Start typing effect for hero subtitle
    initTypingEffect();
}

// Particle Background System
function initParticleBackground() {
    const canvas = document.getElementById('particle-canvas');
    const particleCount = 120;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.2,
            originalX: 0,
            originalY: 0,
            element: null
        });
    }
    
    // Create DOM elements for particles
    particles.forEach((particle, index) => {
        const element = document.createElement('div');
        element.className = 'particle';
        element.style.cssText = `
            position: absolute;
            width: ${particle.size}px;
            height: ${particle.size}px;
            background: rgba(50, 184, 198, ${particle.opacity});
            border-radius: 50%;
            pointer-events: none;
            box-shadow: 0 0 ${particle.size * 2}px rgba(50, 184, 198, ${particle.opacity * 0.5});
            transition: all 0.3s ease;
        `;
        canvas.appendChild(element);
        particle.element = element;
        particle.originalX = particle.x;
        particle.originalY = particle.y;
    });
    
    // Mouse movement handler
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Resize handler
    window.addEventListener('resize', () => {
        particles.forEach(particle => {
            particle.originalX = Math.random() * window.innerWidth;
            particle.originalY = Math.random() * window.innerHeight;
        });
    });
}

function animateParticles() {
    particles.forEach(particle => {
        // Mouse interaction
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 100;
        
        if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance;
            particle.vx += (dx / distance) * force * 0.02;
            particle.vy += (dy / distance) * force * 0.02;
        }
        
        // Apply velocity
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Return to original position
        particle.vx += (particle.originalX - particle.x) * 0.001;
        particle.vy += (particle.originalY - particle.y) * 0.001;
        
        // Apply friction
        particle.vx *= 0.98;
        particle.vy *= 0.98;
        
        // Boundary check
        if (particle.x < 0 || particle.x > window.innerWidth) {
            particle.originalX = Math.random() * window.innerWidth;
        }
        if (particle.y < 0 || particle.y > window.innerHeight) {
            particle.originalY = Math.random() * window.innerHeight;
        }
        
        // Update DOM element
        if (particle.element) {
            particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
        }
    });
    
    animationId = requestAnimationFrame(animateParticles);
}

// Smooth Scrolling Navigation - Fixed version
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const ctaButton = document.querySelector('.cta-button');
    
    // Function to scroll to target smoothly
    function scrollToTarget(targetId) {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            const navbarHeight = 80; // Fixed navbar height
            const offsetTop = targetSection.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
    
    // Add event listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const targetId = link.getAttribute('href');
            scrollToTarget(targetId);
            
            // Update active navigation
            updateActiveNav(link);
        });
    });
    
    // CTA button scroll to join section
    if (ctaButton) {
        ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            scrollToTarget('#join');
        });
    }
}

function updateActiveNav(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Scroll-triggered Animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.value-card, .platform-card, .leader-card, .initiative-card, .contact-card, .status-card');
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        scrollObserver.observe(element);
    });
    
    // Section titles animation
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        title.style.opacity = '0';
        title.style.transform = 'translateY(20px)';
        title.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
        scrollObserver.observe(title);
    });
    
    // Content text animation
    const contentTexts = document.querySelectorAll('.content-text');
    contentTexts.forEach(text => {
        text.style.opacity = '0';
        text.style.transform = 'translateY(15px)';
        text.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        scrollObserver.observe(text);
    });
}

// Navigation Scroll Effects
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Add scrolled class for styling
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active section based on scroll position
        updateActiveSection();
        
        // Update particle background based on scroll
        updateParticleBackground(currentScrollY);
        
        lastScrollY = currentScrollY;
    });
}

function updateActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    let current = '';
    let currentIndex = -1;
    
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const scrollPosition = window.scrollY + 100; // Offset for navbar
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
            currentIndex = index;
        }
    });
    
    // Update navigation active state
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href');
        if (linkHref === `#${current}`) {
            link.classList.add('active');
        }
    });
}

function updateParticleBackground(scrollY) {
    const scrollPercent = Math.min(scrollY / (document.body.scrollHeight - window.innerHeight), 1);
    const hue = 180 + (scrollPercent * 60); // Shift from cyan to purple
    
    particles.forEach(particle => {
        if (particle.element) {
            const opacity = particle.opacity * (1 - scrollPercent * 0.3);
            particle.element.style.background = `hsla(${hue}, 70%, 60%, ${opacity})`;
            particle.element.style.boxShadow = `0 0 ${particle.size * 2}px hsla(${hue}, 70%, 60%, ${opacity * 0.5})`;
        }
    });
}

// Interactive Elements
function initInteractiveElements() {
    initHoverEffects();
    initClickEffects();
    initCardAnimations();
}

function initHoverEffects() {
    // CTA Button hover effect
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('mouseenter', () => {
            createRippleEffect(ctaButton);
        });
    }
    
    // Card hover effects
    const cards = document.querySelectorAll('.value-card, .platform-card, .leader-card, .initiative-card, .contact-card, .status-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            createGlowEffect(this);
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Navigation link effects
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            createGlowEffect(this);
        });
    });
    
    // Contact links hover effects
    const contactLinks = document.querySelectorAll('.contact-card a');
    contactLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.textShadow = '0 0 10px rgba(50, 184, 198, 0.5)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.textShadow = '';
        });
    });
}

function createRippleEffect(element) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (rect.width - size) / 2 + 'px';
    ripple.style.top = (rect.height - size) / 2 + 'px';
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function createGlowEffect(element) {
    const originalBoxShadow = element.style.boxShadow;
    element.style.boxShadow = '0 0 20px rgba(50, 184, 198, 0.4)';
    
    setTimeout(() => {
        element.style.boxShadow = originalBoxShadow;
    }, 300);
}

function initClickEffects() {
    // Platform cards click effect
    const platformCards = document.querySelectorAll('.platform-card');
    platformCards.forEach(card => {
        card.addEventListener('click', function() {
            const cardTitle = this.querySelector('h3').textContent;
            showPlatformModal(cardTitle, this.querySelector('p').textContent);
        });
    });
    
    // Initiative cards click effect
    const initiativeCards = document.querySelectorAll('.initiative-card');
    initiativeCards.forEach(card => {
        card.addEventListener('click', function() {
            const cardTitle = this.querySelector('h3').textContent;
            showInitiativeModal(cardTitle, this.querySelector('p').textContent);
        });
    });
}

function showPlatformModal(title, description) {
    showModal(title, description, 'Platform Feature');
}

function showInitiativeModal(title, description) {
    showModal(title, description, 'Future Initiative');
}

function showModal(title, description, type) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
        backdrop-filter: blur(10px);
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: rgba(31, 33, 33, 0.95);
        border: 1px solid rgba(50, 184, 198, 0.3);
        border-radius: 12px;
        padding: 32px;
        max-width: 500px;
        width: 90%;
        text-align: center;
        transform: scale(0.8);
        transition: transform 0.3s ease;
        position: relative;
    `;
    
    modalContent.innerHTML = `
        <div style="color: rgba(50, 184, 198, 0.7); font-size: 14px; margin-bottom: 8px;">${type}</div>
        <h3 style="color: var(--color-teal-300); margin-bottom: 16px; font-size: 24px;">${title}</h3>
        <p style="color: var(--color-white); line-height: 1.6; margin-bottom: 24px; opacity: 0.9;">${description}</p>
        <button class="close-modal" style="
            background: linear-gradient(45deg, var(--color-teal-500), var(--color-teal-300));
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            color: var(--color-slate-900);
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        ">Close</button>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Animate in
    setTimeout(() => {
        modal.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
    }, 10);
    
    // Close handlers
    const closeButton = modalContent.querySelector('.close-modal');
    const closeModal = () => {
        modal.style.opacity = '0';
        modalContent.style.transform = 'scale(0.8)';
        setTimeout(() => modal.remove(), 300);
    };
    
    closeButton.addEventListener('click', closeModal);
    closeButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 5px 15px rgba(50, 184, 198, 0.3)';
    });
    
    closeButton.addEventListener('mouseleave', function() {
        this.style.transform = '';
        this.style.boxShadow = '';
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escHandler);
        }
    });
}

function initCardAnimations() {
    // Add staggered animation delays
    const valueCards = document.querySelectorAll('.value-card');
    valueCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    const platformCards = document.querySelectorAll('.platform-card');
    platformCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    const initiativeCards = document.querySelectorAll('.initiative-card');
    initiativeCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// Contact Handling
function initContactHandling() {
    const contactLinks = document.querySelectorAll('a[href^="mailto:"], a[href^="tel:"]');
    
    contactLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// Typing Effect
function initTypingEffect() {
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const text = heroSubtitle.textContent;
        heroSubtitle.textContent = '';
        heroSubtitle.style.opacity = '1';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroSubtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 80);
            } else {
                // Add cursor blink effect
                const cursor = document.createElement('span');
                cursor.textContent = '|';
                cursor.style.animation = 'blink 1s infinite';
                heroSubtitle.appendChild(cursor);
                
                setTimeout(() => {
                    cursor.remove();
                }, 3000);
            }
        };
        
        setTimeout(typeWriter, 1000); // Start after 1 second
    }
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }
    
    .modal-overlay {
        backdrop-filter: blur(10px);
    }
    
    .particle {
        will-change: transform;
    }
    
    .nav-link.active {
        color: var(--color-teal-300) !important;
        background: rgba(50, 184, 198, 0.1) !important;
    }
    
    .nav-link.active .binary-icon {
        background: rgba(50, 184, 198, 0.3) !important;
    }
    
    /* Scroll indicator */
    .scroll-indicator {
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--color-teal-300), var(--color-teal-400));
        z-index: 10001;
        transform-origin: left;
        transition: transform 0.3s ease;
        width: 100%;
    }
`;
document.head.appendChild(style);

// Add scroll progress indicator
function addScrollIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    document.body.appendChild(indicator);
    
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        indicator.style.transform = `scaleX(${Math.min(scrollPercent / 100, 1)})`;
    });
}

// Initialize scroll indicator
addScrollIndicator();

// Performance optimizations
function optimizePerformance() {
    // Reduce particle count on mobile devices
    if (window.innerWidth < 768) {
        const mobileParticleCount = 60;
        while (particles.length > mobileParticleCount) {
            const particle = particles.pop();
            if (particle.element) {
                particle.element.remove();
            }
        }
    }
    
    // Use requestAnimationFrame for smooth animations
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                // Scroll-based updates here
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Handle visibility change for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        cancelAnimationFrame(animationId);
    } else {
        animateParticles();
    }
});

// Initialize performance optimizations
optimizePerformance();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(animationId);
});

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.length === konamiSequence.length && 
        konamiCode.every((key, index) => key === konamiSequence[index])) {
        activateQuantumMode();
        konamiCode = [];
    }
});

function activateQuantumMode() {
    // Special quantum animation mode
    particles.forEach(particle => {
        if (particle.element) {
            particle.element.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
            particle.element.style.animation = 'quantum-dance 2s ease-in-out infinite';
        }
    });
    
    // Add quantum dance animation
    const quantumStyle = document.createElement('style');
    quantumStyle.textContent = `
        @keyframes quantum-dance {
            0%, 100% { transform: scale(1) rotate(0deg); }
            25% { transform: scale(1.5) rotate(90deg); }
            50% { transform: scale(0.5) rotate(180deg); }
            75% { transform: scale(1.2) rotate(270deg); }
        }
    `;
    document.head.appendChild(quantumStyle);
    
    // Show quantum message
    showModal(
        'Quantum Mode Activated!', 
        'You\'ve discovered the hidden quantum realm! The particles are now dancing in quantum superposition.', 
        'Easter Egg'
    );
    
    // Reset after 10 seconds
    setTimeout(() => {
        quantumStyle.remove();
        particles.forEach(particle => {
            if (particle.element) {
                particle.element.style.animation = '';
                particle.element.style.background = `rgba(50, 184, 198, ${particle.opacity})`;
            }
        });
    }, 10000);
}