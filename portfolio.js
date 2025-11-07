// Theme functionality
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');

// Check for saved theme or prefer color scheme
const savedTheme = localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

// Apply the saved theme
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

// Theme toggle event
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
}

// Mobile menu functionality
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');

        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.offsetTop - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'var(--nav-bg)';
        navbar.style.backdropFilter = 'blur(20px)';
    } else {
        navbar.style.background = 'var(--nav-bg)';
        navbar.style.backdropFilter = 'blur(10px)';
    }
});

// Simplified CV Download functionality
// Professional CV Download functionality with centered messages
function setupCVDownload() {
    const downloadButtons = document.querySelectorAll('a[download]');

    downloadButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            if (this.getAttribute('href').includes('.pdf')) {
                e.preventDefault();

                const cvUrl = this.getAttribute('href');
                const fileName = this.getAttribute('download') || 'Kencho_Tshering_CV.pdf';

                // Professional loading state
                this.classList.add('btn-loading');
                const originalContent = this.innerHTML;
                this.innerHTML = `
                    <span class="loading-spinner"></span>
                    <span class="loading-text">Preparing Download...</span>
                `;
                this.style.pointerEvents = 'none';

                // Download with timeout
                const downloadTimeout = setTimeout(() => {
                    showDownloadMessage('Processing your request...', 'info');
                }, 2500);

                fetch(cvUrl)
                    .then(response => {
                        clearTimeout(downloadTimeout);
                        if (!response.ok) {
                            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                        }
                        return response.blob();
                    })
                    .then(blob => {
                        const blobUrl = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = blobUrl;
                        link.download = fileName;
                        link.style.display = 'none';
                        
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        
                        setTimeout(() => {
                            window.URL.revokeObjectURL(blobUrl);
                        }, 1000);

                        showDownloadSuccess('CV Downloaded Successfully!');
                        
                        console.log('CV download completed:', fileName);
                    })
                    .catch(error => {
                        clearTimeout(downloadTimeout);
                        console.error('Download failed:', error);
                        
                        showDownloadMessage('Download failed. Please try again or contact me.', 'error');
                    })
                    .finally(() => {
                        setTimeout(() => {
                            this.innerHTML = originalContent;
                            this.classList.remove('btn-loading');
                            this.style.pointerEvents = 'auto';
                        }, 800);
                    });
            }
        });
    });
}

// Professional success message with panda animation
function showDownloadSuccess(message) {
    // Remove existing messages
    const existingMessage = document.querySelector('.download-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create centered message element
    const messageEl = document.createElement('div');
    messageEl.className = 'download-message download-success';
    
    messageEl.innerHTML = `
        <div class="message-container">
            <div class="panda-animation">
                <div class="panda-head">
                    <div class="panda-ear left-ear"></div>
                    <div class="panda-ear right-ear"></div>
                    <div class="panda-face">
                        <div class="panda-eye left-eye"></div>
                        <div class="panda-eye right-eye"></div>
                        <div class="panda-nose"></div>
                        <div class="panda-mouth"></div>
                    </div>
                </div>
                <div class="panda-body">
                    <div class="panda-arm left-arm"></div>
                    <div class="panda-arm right-arm thumbs-up"></div>
                </div>
            </div>
            <div class="message-content">
                <h3 class="message-title">Success!</h3>
                <p class="message-text">${message}</p>
            </div>
            <button class="message-close" onclick="this.parentElement.parentElement.remove()">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
        </div>
    `;

    document.body.appendChild(messageEl);

    // Animate in
    requestAnimationFrame(() => {
        messageEl.classList.add('message-visible');
        
        // Trigger thumbs-up animation after a delay
        setTimeout(() => {
            const thumbsUp = messageEl.querySelector('.thumbs-up');
            if (thumbsUp) {
                thumbsUp.classList.add('animate-thumbs-up');
            }
        }, 600);
    });

    // Auto-remove after delay
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.classList.remove('message-visible');
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.remove();
                }
            }, 400);
        }
    }, 4000);
}

// Regular message function for errors/info
function showDownloadMessage(message, type) {
    const existingMessage = document.querySelector('.download-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageEl = document.createElement('div');
    messageEl.className = `download-message download-${type}`;
    
    const icons = {
        error: '⚠',
        info: 'ⓘ'
    };
    
    messageEl.innerHTML = `
        <div class="message-container">
            <div class="message-icon">${icons[type]}</div>
            <div class="message-content">
                <p class="message-text">${message}</p>
            </div>
            <button class="message-close" onclick="this.parentElement.parentElement.remove()">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
        </div>
    `;

    document.body.appendChild(messageEl);

    requestAnimationFrame(() => {
        messageEl.classList.add('message-visible');
    });

    setTimeout(() => {
        if (messageEl.parentNode && type !== 'error') {
            messageEl.classList.remove('message-visible');
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.remove();
                }
            }, 300);
        }
    }, type === 'error' ? 5000 : 3500);
}

// Add professional centered styles
function addDownloadStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Professional loading spinner */
        .btn-loading {
            position: relative;
            overflow: hidden;
        }
        
        .loading-spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid transparent;
            border-top: 2px solid currentColor;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin-right: 8px;
            vertical-align: middle;
        }
        
        .loading-text {
            vertical-align: middle;
            font-weight: 500;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* Centered message overlay */
        .download-message {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.8);
            background: white;
            color: #1a1a1a;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05);
            z-index: 10000;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border: 1px solid rgba(0, 0, 0, 0.1);
            overflow: hidden;
            max-width: 400px;
            width: 90%;
            backdrop-filter: blur(20px);
        }
        
        .download-message.message-visible {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        
        .message-container {
            padding: 30px;
            text-align: center;
            position: relative;
        }
        
        /* Panda Animation Styles */
        .panda-animation {
            width: 120px;
            height: 140px;
            margin: 0 auto 20px;
            position: relative;
        }
        
        .panda-head {
            width: 80px;
            height: 80px;
            background: #000;
            border-radius: 50%;
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            z-index: 2;
        }
        
        .panda-ear {
            width: 30px;
            height: 30px;
            background: #000;
            border-radius: 50%;
            position: absolute;
            top: -10px;
        }
        
        .panda-ear.left-ear {
            left: -5px;
        }
        
        .panda-ear.right-ear {
            right: -5px;
        }
        
        .panda-face {
            position: relative;
            width: 100%;
            height: 100%;
        }
        
        .panda-eye {
            width: 20px;
            height: 25px;
            background: #fff;
            border-radius: 50%;
            position: absolute;
            top: 25px;
        }
        
        .panda-eye.left-eye {
            left: 15px;
            transform: rotate(-5deg);
        }
        
        .panda-eye.right-eye {
            right: 15px;
            transform: rotate(5deg);
        }
        
        .panda-eye::after {
            content: '';
            width: 8px;
            height: 8px;
            background: #000;
            border-radius: 50%;
            position: absolute;
            bottom: 5px;
            left: 6px;
        }
        
        .panda-nose {
            width: 15px;
            height: 8px;
            background: #000;
            border-radius: 50%;
            position: absolute;
            top: 45px;
            left: 50%;
            transform: translateX(-50%);
        }
        
        .panda-mouth {
            width: 20px;
            height: 5px;
            border-bottom: 2px solid #fff;
            border-radius: 0 0 10px 10px;
            position: absolute;
            top: 55px;
            left: 50%;
            transform: translateX(-50%);
        }
        
        .panda-body {
            width: 70px;
            height: 70px;
            background: #000;
            border-radius: 35px 35px 30px 30px;
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1;
        }
        
        .panda-arm {
            width: 25px;
            height: 40px;
            background: #000;
            border-radius: 12px;
            position: absolute;
            bottom: 50px;
            transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .panda-arm.left-arm {
            left: -15px;
            transform: rotate(30deg);
        }
        
        .panda-arm.right-arm {
            right: -15px;
            transform: rotate(-30deg);
        }
        
        .panda-arm.thumbs-up.animate-thumbs-up {
            transform: rotate(-120deg) translateY(-10px);
            animation: thumbsUpBounce 1s ease-in-out;
        }
        
        @keyframes thumbsUpBounce {
            0%, 100% { transform: rotate(-120deg) translateY(-10px); }
            50% { transform: rotate(-120deg) translateY(-15px); }
        }
        
        /* Message content */
        .message-content {
            margin-top: 10px;
        }
        
        .message-title {
            font-size: 1.5rem;
            font-weight: 700;
            margin: 0 0 8px 0;
            color: #000;
        }
        
        .message-text {
            font-size: 1rem;
            color: #666;
            margin: 0;
            line-height: 1.5;
            font-weight: 500;
        }
        
        /* Close button */
        .message-close {
            position: absolute;
            top: 15px;
            right: 15px;
            background: rgba(0, 0, 0, 0.05);
            border: none;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: #666;
            transition: all 0.2s ease;
        }
        
        .message-close:hover {
            background: rgba(0, 0, 0, 0.1);
            color: #000;
        }
        
        /* Error and Info states */
        .download-error {
            border-left: 4px solid #ef4444;
        }
        
        .download-info {
            border-left: 4px solid #3b82f6;
        }
        
        .download-error .message-icon,
        .download-info .message-icon {
            font-size: 3rem;
            margin-bottom: 15px;
            display: block;
        }
        
        /* Backdrop overlay */
        .download-message::before {
            content: '';
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.5);
            z-index: -1;
            opacity: 0;
            transition: opacity 0.4s ease;
        }
        
        .download-message.message-visible::before {
            opacity: 1;
        }
        
        /* Mobile responsiveness */
        @media (max-width: 480px) {
            .download-message {
                max-width: 320px;
            }
            
            .message-container {
                padding: 25px 20px;
            }
            
            .panda-animation {
                width: 100px;
                height: 120px;
            }
            
            .panda-head {
                width: 70px;
                height: 70px;
            }
            
            .panda-body {
                width: 60px;
                height: 60px;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    addDownloadStyles();
    setupCVDownload();
});

// Animate skill bars when section comes into view
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    const aboutSection = document.querySelector('.about');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillBars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    setTimeout(() => {
                        bar.style.width = width + '%';
                    }, 200);
                });
            }
        });
    }, { threshold: 0.5 });

    if (aboutSection) {
        observer.observe(aboutSection);
    }
}

// Animate service cards when they come into view
function animateServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    const servicesSection = document.querySelector('.services');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });
    }, { threshold: 0.1 });

    // Set initial state for animation
    serviceCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });

    if (servicesSection) {
        observer.observe(servicesSection);
    }
}

// Animate portfolio cards when they come into view
function animatePortfolioCards() {
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    const portfolioSection = document.querySelector('.portfolio');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });
    }, { threshold: 0.1 });

    // Set initial state for animation
    portfolioCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });

    if (portfolioSection) {
        observer.observe(portfolioSection);
    }
}

// Form submission with mailto fallback
// function handleFormSubmission() {
//     const contactForm = document.querySelector('.contact-form .form');

//     if (contactForm) {
//         contactForm.addEventListener('submit', function (e) {
//             e.preventDefault();

//             // Get form values
//             // const nameInput = this.querySelector('input[type="text"]');
//             // const emailInput = this.querySelector('input[type="email"]');
//             // const subjectInput = this.querySelector('input[placeholder="Subject"]');
//             const messageInput = this.querySelector('textarea');

//             // const name = nameInput.value;
//             // const email = emailInput.value;
//             // const subject = subjectInput.value;
//             const message = messageInput.value;

//             // Basic validation
//             if ( !message) {
//                 showDownloadMessage('Please fill in all fields', 'error');
//                 return;
//             }

//             // Create mailto link
//             // const mailtoLink = `mailto:developer89365@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}%0AEmail: ${email}%0A%0AMessage: ${message}`)}`;
//             const mailtoLink = `mailto:developer89365@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`%0A%0AMessage: ${message}`)}`;
//             // Open email client
//             window.location.href = mailtoLink;

//             // Show confirmation
//             showDownloadMessage('Opening email client...', 'success');

//             // Optional: Clear form after a delay
//             setTimeout(() => {
//                 this.reset();
//             }, 1000);
//         });
//     }
// }

function handleFormSubmission() {
    const contactForm = document.querySelector('.contact-form-wrapper .form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get only the message
            const messageInput = this.querySelector('textarea');
            const message = messageInput.value;

            // Basic validation
            if (!message) {
                showDownloadMessage('Please enter a message', 'error');
                return;
            }

            // Create mailto link with only message
            const mailtoLink = `mailto:developer89365@gmail.com?subject=Portfolio%20Inquiry&body=${encodeURIComponent(message)}`;
            
            // Open email client
            window.location.href = mailtoLink;

            // Show confirmation
            showDownloadMessage('Opening email client...', 'success');

            // Clear form after a delay
            setTimeout(() => {
                this.reset();
            }, 1000);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('Portfolio loaded successfully');

    // Add download styles
    addDownloadStyles();

    // Initialize CV download functionality
    setupCVDownload();

    // Initialize animations
    animateSkillBars();
    animateServiceCards();
    animatePortfolioCards();

    // Initialize form handling
    handleFormSubmission();
});

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        updateThemeIcon(newTheme);
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-menu') && !e.target.closest('.hamburger') && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});