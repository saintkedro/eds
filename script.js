const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');

function setMenuOpen(open) {
    navLinks.classList.toggle('active', open);
    mobileMenu.classList.toggle('is-active', open);
    mobileMenu.setAttribute('aria-expanded', String(open));
    mobileMenu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

mobileMenu.addEventListener('click', () => {
    setMenuOpen(!navLinks.classList.contains('active'));
});

navItems.forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        setMenuOpen(false);
    }
});

const faqItems = document.querySelectorAll('.faq-item');

function setFaqOpen(item, open) {
    item.classList.toggle('active', open);
    const question = item.querySelector('.faq-question');
    if (question) {
        question.setAttribute('aria-expanded', String(open));
    }
}

faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach((other) => setFaqOpen(other, false));
        if (!isActive) {
            setFaqOpen(item, true);
        }
    });
});

const sections = document.querySelectorAll('section');
const navTargets = new Set(
    [...navItems]
        .map((item) => item.getAttribute('href'))
        .filter((href) => href && href.startsWith('#'))
);

window.addEventListener('scroll', () => {
    let currentSection = '';

    sections.forEach((section) => {
        const id = section.getAttribute('id');
        if (!id || !navTargets.has(`#${id}`)) {
            return;
        }
        if (window.scrollY >= section.offsetTop - 150) {
            currentSection = id;
        }
    });

    navItems.forEach((item) => {
        item.classList.toggle('active', item.getAttribute('href') === `#${currentSection}`);
    });
}, { passive: true });

const quoteForm = document.getElementById('quote-form');
const formStatus = document.getElementById('form-status');

function readResponses() {
    try {
        const parsed = JSON.parse(localStorage.getItem('formResponses') || '[]');
        return Array.isArray(parsed) ? parsed.filter((item) => item && typeof item === 'object') : [];
    } catch {
        return [];
    }
}

function createId() {
    if (window.crypto && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return `lead-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function setFormStatus(message, type) {
    formStatus.hidden = false;
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
}

quoteForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(quoteForm);
    const entry = {
        id: createId(),
        name: String(data.get('name') || '').trim(),
        email: String(data.get('email') || '').trim(),
        phone: String(data.get('phone') || '').trim(),
        service: String(data.get('service') || '').trim(),
        message: String(data.get('message') || '').trim(),
        createdAt: new Date().toISOString()
    };

    try {
        const responses = readResponses();
        responses.push(entry);
        localStorage.setItem('formResponses', JSON.stringify(responses));
    } catch {
        setFormStatus('This browser blocked local storage, so the request could not be saved. Email hello@everydaydigital.com instead.', 'error');
        return;
    }

    quoteForm.reset();
    setFormStatus('Your quote request is saved on this device. A manager can review it from this browser’s dashboard.', 'success');
});
