// Theme functionality
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

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

                // Store original button state
                const originalContent = this.innerHTML;

                // Show loading state
                this.innerHTML = `
                    <span class="loading-spinner"></span>
                    <span class="loading-text">Preparing Download...</span>
                `;
                this.style.pointerEvents = 'none';
                this.classList.add('btn-loading');

                fetch(cvUrl)
                    .then(response => {
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

                        // Show success message
                        showDownloadMessage('CV downloaded successfully!', 'success');

                        // Reset button immediately after download
                        resetDownloadButton(this, originalContent);
                    })
                    .catch(error => {
                        console.error('Download failed:', error);
                        showDownloadMessage('Download failed. Please try again.', 'error');

                        // Reset button on error too
                        resetDownloadButton(this, originalContent);
                    });
            }
        });
    });
}

// Function to reset download button
function resetDownloadButton(button, originalContent) {
    button.innerHTML = originalContent;
    button.style.pointerEvents = 'auto';
    button.classList.remove('btn-loading');
}

// Professional message function
function showDownloadMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.download-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageEl = document.createElement('div');
    messageEl.className = `download-message download-${type}`;

    const icons = {
        success: '✓',
        error: '⚠',
        info: 'ⓘ'
    };

    messageEl.innerHTML = `
        <div class="message-container">
            <div class="message-icon">${icons[type]}</div>
            <div class="message-content">
                <h3 class="message-title">${type === 'success' ? 'Success!' : type === 'error' ? 'Error' : 'Info'}</h3>
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
    });

    // Auto-remove after delay
    const duration = type === 'error' ? 5000 : 3000;
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

// Add professional styles
function addDownloadStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Professional loading spinner */
        .btn-loading {
            position: relative;
            cursor: not-allowed;
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
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border: 1px solid rgba(0, 0, 0, 0.1);
            overflow: hidden;
            max-width: 350px;
            width: 90%;
        }
        
        .download-message.message-visible {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        
        .message-container {
            padding: 24px;
            text-align: center;
            position: relative;
        }
        
        .message-icon {
            font-size: 2.5rem;
            margin-bottom: 16px;
            display: block;
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
        
        .message-content {
            margin-bottom: 10px;
        }
        
        .message-title {
            font-size: 1.25rem;
            font-weight: 700;
            margin: 0 0 8px 0;
            color: #000;
        }
        
        .message-text {
            font-size: 0.95rem;
            color: #666;
            margin: 0;
            line-height: 1.5;
            font-weight: 500;
        }
        
        /* Close button */
        .message-close {
            position: absolute;
            top: 12px;
            right: 12px;
            background: rgba(0, 0, 0, 0.05);
            border: none;
            border-radius: 50%;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: #666;
            transition: all 0.2s ease;
            font-size: 16px;
        }
        
        .message-close:hover {
            background: rgba(0, 0, 0, 0.1);
            color: #000;
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
            transition: opacity 0.3s ease;
        }
        
        .download-message.message-visible::before {
            opacity: 1;
        }
        
        /* Mobile responsiveness */
        @media (max-width: 480px) {
            .download-message {
                max-width: 280px;
            }
            
            .message-container {
                padding: 20px;
            }
            
            .message-icon {
                font-size: 2rem;
                margin-bottom: 12px;
            }
            
            .message-title {
                font-size: 1.1rem;
            }
            
            .message-text {
                font-size: 0.9rem;
            }
        }
    `;
    document.head.appendChild(style);
}

// Animation functions
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

// Form submission
function handleFormSubmission() {
    const contactForm = document.querySelector('.contact-form-wrapper .form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const messageInput = this.querySelector('textarea');
            const message = messageInput.value;

            if (!message) {
                showDownloadMessage('Please enter a message', 'error');
                return;
            }

            const mailtoLink = `mailto:developer89365@gmail.com?subject=Portfolio%20Inquiry&body=${encodeURIComponent(message)}`;
            window.location.href = mailtoLink;

            showDownloadMessage('Opening email client...', 'success');

            setTimeout(() => {
                this.reset();
            }, 1000);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('Portfolio loaded successfully');

    addDownloadStyles();
    setupCVDownload();
    animateSkillBars();
    animateServiceCards();
    animatePortfolioCards();
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