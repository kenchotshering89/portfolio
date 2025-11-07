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
// Professional CV Download functionality
function setupCVDownload() {
    const downloadButtons = document.querySelectorAll('a[download]');

    downloadButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            if (this.getAttribute('href').includes('.pdf')) {
                e.preventDefault();

                const cvUrl = this.getAttribute('href');
                const fileName = this.getAttribute('download') || 'Kencho_Tshering_CV.pdf';

                // Add professional loading state
                this.classList.add('btn-loading');
                const originalContent = this.innerHTML;
                this.innerHTML = `
                    <span class="loading-spinner"></span>
                    <span class="loading-text">Preparing CV...</span>
                `;
                this.style.pointerEvents = 'none';

                // Professional download with timeout
                const downloadTimeout = setTimeout(() => {
                    showDownloadMessage('Taking longer than expected...', 'info');
                }, 3000);

                fetch(cvUrl)
                    .then(response => {
                        clearTimeout(downloadTimeout);
                        if (!response.ok) {
                            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                        }
                        return response.blob();
                    })
                    .then(blob => {
                        // Create download with professional handling
                        const blobUrl = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = blobUrl;
                        link.download = fileName;
                        link.style.display = 'none';
                        
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        
                        // Clean up
                        setTimeout(() => {
                            window.URL.revokeObjectURL(blobUrl);
                        }, 1000);

                        showDownloadMessage('CV downloaded successfully!', 'success');
                        
                        // Track download success
                        console.log('CV download completed:', fileName);
                    })
                    .catch(error => {
                        clearTimeout(downloadTimeout);
                        console.error('Download failed:', error);
                        
                        showDownloadMessage('Unable to download CV. Please try again or contact me directly.', 'error');

                        // Professional fallback with delay
                        setTimeout(() => {
                            const contactSection = document.querySelector('#contact');
                            if (contactSection) {
                                contactSection.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'start'
                                });
                            }
                        }, 2500);
                    })
                    .finally(() => {
                        // Professional button reset
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

// Professional download message function
function showDownloadMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.download-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create professional message element
    const messageEl = document.createElement('div');
    messageEl.className = `download-message download-${type}`;
    
    // Icons for different message types
    const icons = {
        success: '✓',
        error: '⚠',
        info: 'ⓘ'
    };
    
    messageEl.innerHTML = `
        <div class="message-content">
            <span class="message-icon">${icons[type] || 'ⓘ'}</span>
            <span class="message-text">${message}</span>
        </div>
        <button class="message-close" onclick="this.parentElement.remove()">×</button>
    `;

    document.body.appendChild(messageEl);

    // Animate in with professional transition
    requestAnimationFrame(() => {
        messageEl.classList.add('message-visible');
    });

    // Auto-remove success/info messages, keep errors longer
    const duration = type === 'error' ? 6000 : type === 'info' ? 4000 : 3500;
    if (type !== 'error') { // Allow manual close for errors
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.classList.remove('message-visible');
                setTimeout(() => {
                    if (messageEl.parentNode) {
                        messageEl.remove();
                    }
                }, 300);
            }
        }, duration);
    }
}

// Add professional styles
function addDownloadStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Professional loading spinner */
        .btn-loading {
            position: relative;
            overflow: hidden;
        }
        
        .btn-loading::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            animation: shimmer 2s infinite;
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
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
        }
        
        /* Professional message styles */
        .download-message {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            color: #1a1a1a;
            padding: 0;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
            z-index: 10000;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 14px;
            font-weight: 500;
            line-height: 1.4;
            transform: translateX(400px) scale(0.95);
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border: 1px solid #e1e5e9;
            overflow: hidden;
            max-width: 380px;
            backdrop-filter: blur(10px);
        }
        
        .download-message.message-visible {
            transform: translateX(0) scale(1);
            opacity: 1;
        }
        
        .message-content {
            display: flex;
            align-items: flex-start;
            padding: 16px 20px;
            gap: 12px;
        }
        
        .message-icon {
            font-size: 16px;
            font-weight: 600;
            flex-shrink: 0;
            margin-top: 1px;
        }
        
        .download-success .message-icon {
            color: #10b981;
        }
        
        .download-error .message-icon {
            color: #ef4444;
        }
        
        .download-info .message-icon {
            color: #3b82f6;
        }
        
        .message-text {
            flex: 1;
            padding-right: 8px;
        }
        
        .message-close {
            background: none;
            border: none;
            font-size: 18px;
            font-weight: 300;
            color: #6b7280;
            cursor: pointer;
            padding: 8px 12px;
            line-height: 1;
            transition: color 0.2s ease;
            align-self: flex-start;
        }
        
        .message-close:hover {
            color: #374151;
            background: #f3f4f6;
        }
        
        /* Type-specific backgrounds with subtle gradients */
        .download-success {
            border-left: 4px solid #10b981;
            background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
        }
        
        .download-error {
            border-left: 4px solid #ef4444;
            background: linear-gradient(135deg, #fef2f2 0%, #ffffff 100%);
        }
        
        .download-info {
            border-left: 4px solid #3b82f6;
            background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);
        }
        
        /* Progress bar for longer operations */
        .download-message::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, #3b82f6, #8b5cf6);
            width: 100%;
            transform: scaleX(0);
            transform-origin: left;
            transition: transform 6s linear;
        }
        
        .download-info::after {
            animation: progress 4s linear;
        }
        
        @keyframes progress {
            from { transform: scaleX(1); }
            to { transform: scaleX(0); }
        }
        
        /* Mobile responsiveness */
        @media (max-width: 768px) {
            .download-message {
                top: 10px;
                right: 10px;
                left: 10px;
                max-width: none;
                transform: translateY(-100px) scale(0.95);
            }
            
            .download-message.message-visible {
                transform: translateY(0) scale(1);
            }
        }
        
        /* Enhanced button states */
        .btn-secondary.downloading {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            color: white;
            cursor: not-allowed;
            transform: scale(0.98);
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    addDownloadStyles();
    setupCVDownload();
});

// Enhanced error handling for network issues
window.addEventListener('online', function() {
    console.log('Network connection restored');
});

window.addEventListener('offline', function() {
    showDownloadMessage('Network connection lost. Please check your internet connection.', 'error');
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