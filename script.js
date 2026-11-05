// Scroll to Top functionality
function initializeScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (scrollToTopBtn) {
        // Show/hide scroll to top button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });
        
        // Smooth scroll to top when button is clicked
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

function clearActiveNavState() {
    document.querySelectorAll('.nav-link, .nav-link-button, .submenu-link').forEach(link => {
        link.classList.remove('active');
    });
}

function setActiveNavState(target, parentTarget = null) {
    clearActiveNavState();

    if (target) {
        document.querySelectorAll(`[data-nav-target="${target}"]`).forEach(link => {
            link.classList.add('active');
        });
    }

    if (parentTarget) {
        document.querySelectorAll(`[data-nav-target="${parentTarget}"]`).forEach(link => {
            link.classList.add('active');
        });
    } else if (target) {
        const activeSubmenuLink = document.querySelector(`.submenu-link[data-nav-target="${target}"]`);
        const parentLink = activeSubmenuLink?.closest('.has-submenu')?.querySelector('.nav-link, .nav-link-button');
        parentLink?.classList.add('active');
    }
}

function initializeNavigation() {
    const navList = document.querySelector('.nav-list');
    const dropdownItems = document.querySelectorAll('.has-submenu');
    const submenuToggles = document.querySelectorAll('.submenu-toggle');

    const closeAllSubmenus = () => {
        dropdownItems.forEach(item => {
            item.classList.remove('open');
        });

        submenuToggles.forEach(toggle => {
            toggle.setAttribute('aria-expanded', 'false');
        });
    };

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            if (!targetId || targetId === '#') {
                e.preventDefault();
                return;
            }

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();

                const target = this.dataset.navTarget;
                const parentTarget = this.dataset.parentTarget || null;
                if (target) {
                    setActiveNavState(target, parentTarget);
                }

                closeAllSubmenus();
                navList?.classList.remove('active');

                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const parentItem = this.closest('.has-submenu');
            const isOpen = parentItem.classList.contains('open');

            if (window.innerWidth <= 768) {
                closeAllSubmenus();
                if (!isOpen) {
                    parentItem.classList.add('open');
                    this.setAttribute('aria-expanded', 'true');
                }
            } else {
                parentItem.classList.toggle('open');
                this.setAttribute('aria-expanded', parentItem.classList.contains('open') ? 'true' : 'false');
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.has-submenu')) {
            closeAllSubmenus();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeAllSubmenus();
            navList?.classList.remove('active');
        }
    });

    const sectionMap = [
        { id: 'about', target: 'about' },
        { id: 'benefits', target: 'benefits', parentTarget: 'about' },
        { id: 'features', target: 'features', parentTarget: 'about' },
        { id: 'testimonials', target: 'testimonials', parentTarget: 'about' },
        { id: 'pricing', target: 'pricing' },
        { id: 'faq', target: 'faq', parentTarget: 'resources' },
        { id: 'contact', target: 'contact' }
    ].map(item => ({
        ...item,
        element: document.getElementById(item.id)
    })).filter(item => item.element);

    const updateActiveSection = () => {
        const scrollPosition = window.scrollY + 140;
        let currentSection = null;

        sectionMap.forEach(section => {
            if (section.element.offsetTop <= scrollPosition) {
                currentSection = section;
            }
        });

        if (currentSection) {
            setActiveNavState(currentSection.target, currentSection.parentTarget || null);
        } else {
            clearActiveNavState();
        }
    };

    window.addEventListener('scroll', updateActiveSection);
    updateActiveSection();

    return { navList, closeAllSubmenus };
}

// Sticky header
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Animation for feature cards when they come into view
const featureCards = document.querySelectorAll('.feature-card');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

featureCards.forEach(card => {
    card.style.opacity = 0;
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

function initializeMobileMenu(navList, closeAllSubmenus) {
    const headerContainer = document.querySelector('.header .container');
    const mobileMenuButton = document.createElement('button');
    mobileMenuButton.innerHTML = '<span class="mobile-menu-line"></span><span class="mobile-menu-line"></span><span class="mobile-menu-line"></span>';
    mobileMenuButton.className = 'mobile-menu-button';
    mobileMenuButton.setAttribute('aria-label', 'Toggle navigation');
    mobileMenuButton.setAttribute('aria-expanded', 'false');
    headerContainer.appendChild(mobileMenuButton);

    const syncMenuState = () => {
        const isActive = navList.classList.contains('active');
        mobileMenuButton.classList.toggle('open', isActive);
        mobileMenuButton.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        headerContainer?.classList.toggle('menu-open', isActive);
        document.body.classList.toggle('mobile-menu-open', isActive);
    };

    mobileMenuButton.addEventListener('click', function() {
        navList.classList.toggle('active');
        if (!navList.classList.contains('active')) {
            closeAllSubmenus();
        }
        syncMenuState();
    });

    document.querySelectorAll('.nav-list a, .header-cta').forEach(link => {
        link.addEventListener('click', function() {
            navList.classList.remove('active');
            closeAllSubmenus();
            syncMenuState();
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navList.classList.remove('active');
            closeAllSubmenus();
            syncMenuState();
        }
    });

    syncMenuState();
}

// Contact Form Configuration
// Easily toggle between 'whatsapp' or 'email'
const CONTACT_FORM_CONFIG = {
    // Mode options: 'whatsapp' (instant WhatsApp chat) or 'email'
    mode: 'whatsapp',

    // Your WhatsApp Business number (international format without '+' or dashes)
    // Default: +234 814 196 7200
    whatsappNumber: '2348141967200',

    // Target recipient email (for 'email' mode)
    emailRecipient: 'support@ogalabms.com',

    // Optional Formspree endpoint (e.g. 'https://formspree.io/f/your_form_id')
    // If filled, emails send cleanly in the background without opening the user's mail app
    formspreeEndpoint: ''
};

// Initialize any tooltips (if we add them)
function initializeTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', function() {
            // Tooltip logic would go here
        });
    });
}

// Contact form handling with validation and multi-channel dispatch (WhatsApp / Email)
function handleContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('contactFormStatus');
    const submitBtn = document.getElementById('contactSubmitBtn');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const nameInput = contactForm.querySelector('[name="name"]');
        const emailInput = contactForm.querySelector('[name="email"]');
        const subjectInput = contactForm.querySelector('[name="subject"]');
        const messageInput = contactForm.querySelector('[name="message"]');

        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const subject = subjectInput && subjectInput.value.trim() ? subjectInput.value.trim() : 'General Inquiry';
        const message = messageInput ? messageInput.value.trim() : '';

        // Basic client validation
        if (!name || !email || !message) {
            if (formStatus) {
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Please fill out all required fields (Name, Email, Message).';
            }
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            if (formStatus) {
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Please enter a valid email address.';
            }
            return;
        }

        // WhatsApp Mode
        if (CONTACT_FORM_CONFIG.mode === 'whatsapp') {
            const formattedMessage =
                `*New Inquiry - Ogalab Medical Lab System*\n` +
                `━━━━━━━━━━━━━━━━━━━━\n` +
                `*Name:* ${name}\n` +
                `*Email:* ${email}\n` +
                `*Subject:* ${subject}\n\n` +
                `*Message:*\n${message}\n` +
                `━━━━━━━━━━━━━━━━━━━━`;

            const encodedMessage = encodeURIComponent(formattedMessage);
            const whatsappUrl = `https://wa.me/${CONTACT_FORM_CONFIG.whatsappNumber}?text=${encodedMessage}`;

            if (formStatus) {
                formStatus.className = 'form-status success';
                formStatus.textContent = 'Opening WhatsApp to send your inquiry...';
            }

            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
            contactForm.reset();
            return;
        }

        // Email Mode
        if (CONTACT_FORM_CONFIG.mode === 'email') {
            if (CONTACT_FORM_CONFIG.formspreeEndpoint) {
                if (formStatus) {
                    formStatus.className = 'form-status';
                    formStatus.textContent = 'Sending message...';
                }
                if (submitBtn) submitBtn.disabled = true;

                fetch(CONTACT_FORM_CONFIG.formspreeEndpoint, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, subject, message })
                })
                    .then(response => {
                        if (response.ok) {
                            if (formStatus) {
                                formStatus.className = 'form-status success';
                                formStatus.textContent = 'Thank you! Your message has been sent successfully.';
                            }
                            contactForm.reset();
                        } else {
                            throw new Error('Network response not ok');
                        }
                    })
                    .catch(() => {
                        if (formStatus) {
                            formStatus.className = 'form-status error';
                            formStatus.textContent = 'Could not send message. Please reach us via WhatsApp or call us directly.';
                        }
                    })
                    .finally(() => {
                        if (submitBtn) submitBtn.disabled = false;
                    });
            } else {
                // Fallback to mailto link
                const mailtoUrl = `mailto:${CONTACT_FORM_CONFIG.emailRecipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
                window.location.href = mailtoUrl;

                if (formStatus) {
                    formStatus.className = 'form-status success';
                    formStatus.textContent = 'Opening your email client...';
                }
                contactForm.reset();
            }
        }
    });
}

// FAQ accordion functionality
function initializeFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isActive = this.classList.contains('active');
            
            // Close all FAQ items
            document.querySelectorAll('.faq-question').forEach(q => {
                q.classList.remove('active');
            });
            document.querySelectorAll('.faq-answer').forEach(a => {
                a.classList.remove('active');
            });
            
            // If clicked question wasn't active, activate it
            if (!isActive) {
                this.classList.add('active');
                answer.classList.add('active');
            }
        });
    });
}

// See More functionality for pricing cards
function initializeSeeMore() {
    const seeMoreButtons = document.querySelectorAll('.see-more-btn');

    seeMoreButtons.forEach(button => {
        button.addEventListener('click', () => {
            const featuresList = button.previousElementSibling;
            if (featuresList && featuresList.classList.contains('pricing-features')) {
                featuresList.classList.toggle('expanded');
                if (featuresList.classList.contains('expanded')) {
                    button.textContent = 'See less';
                } else {
                    button.textContent = 'See all features';
                }
            }
        });
    });
}

// Call initialization functions when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const navigation = initializeNavigation();
    if (navigation?.navList) {
        initializeMobileMenu(navigation.navList, navigation.closeAllSubmenus);
    }
    initializeTooltips();
    handleContactForm();
    initializeFAQ();
    initializeScrollToTop();
    initializeSeeMore();
});
