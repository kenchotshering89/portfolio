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
function setupCVDownload() {
    const downloadButtons = document.querySelectorAll('a[download]');

    downloadButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            if (this.getAttribute('href').includes('.pdf')) {
                e.preventDefault();

                const cvUrl = this.getAttribute('href');
                const fileName = this.getAttribute('download') || 'Kencho_Tshering_CV.pdf';

                // Show loading state
                const originalText = this.textContent;
                this.innerHTML = '<span class="loading-spinner">⏳</span> Downloading...';
                this.style.pointerEvents = 'none';

                // Simple download attempt
                fetch(cvUrl)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('File not found');
                        }
                        return response.blob();
                    })
                    .then(blob => {
                        const blobUrl = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = blobUrl;
                        link.download = fileName;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        window.URL.revokeObjectURL(blobUrl);

                        showDownloadMessage('CV downloaded successfully!', 'success');
                    })
                    .catch(error => {
                        console.error('Download failed:', error);
                        showDownloadMessage('CV file not found. Please contact me directly.', 'error');

                        // Fallback: Open contact section
                        setTimeout(() => {
                            document.querySelector('#contact').scrollIntoView({
                                behavior: 'smooth'
                            });
                        }, 2000);
                    })
                    .finally(() => {
                        // Reset button
                        setTimeout(() => {
                            this.textContent = originalText;
                            this.style.pointerEvents = 'auto';
                        }, 1000);
                    });
            }
        });
    });
}

// Download message function
function showDownloadMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.download-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `download-message download-${type}`;
    messageEl.textContent = message;

    // Add styles
    messageEl.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--accent-primary)' :
            type === 'error' ? '#e74c3c' : '#f39c12'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        font-weight: 500;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;

    document.body.appendChild(messageEl);

    // Animate in
    setTimeout(() => {
        messageEl.style.transform = 'translateX(0)';
    }, 100);

    // Remove after appropriate time
    const duration = type === 'error' ? 5000 : 3000;
    setTimeout(() => {
        messageEl.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 300);
    }, duration);
}

// Add loading spinner styles
function addDownloadStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .loading-spinner {
            display: inline-block;
            animation: spin 1s linear infinite;
            margin-right: 0.5rem;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .download-message {
            font-family: 'Inter', sans-serif;
        }
        
        /* Enhanced button states for download */
        .btn-secondary.downloading {
            background: var(--accent-primary);
            color: white;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(style);
}

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