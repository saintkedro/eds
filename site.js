(function () {
    const { getContent, addLead, escapeHtml: esc, safeUrl, iconClass } = window.EDSStore;

    const content = getContent();
    const brand = content.brand;
    const pages = content.pages;
    const page = document.body.dataset.page || 'home';
    const params = new URLSearchParams(window.location.search);

    const NAV = [
        { page: 'home', href: 'index.html', label: 'Home' },
        { page: 'about', href: 'about.html', label: 'About' },
        { page: 'services', href: 'services.html', label: 'Services' },
        { page: 'process', href: 'process.html', label: 'Process' },
        { page: 'work', href: 'work.html', label: 'Work' },
        { page: 'insights', href: 'insights.html', label: 'Insights' },
        { page: 'faq', href: 'faq.html', label: 'FAQ' }
    ];
    const PARENT_PAGE = { service: 'services', project: 'work', insight: 'insights' };
    const SOCIALS = [
        { key: 'facebook', icon: 'fa-brands fa-facebook', label: 'Facebook' },
        { key: 'instagram', icon: 'fa-brands fa-instagram', label: 'Instagram' },
        { key: 'linkedin', icon: 'fa-brands fa-linkedin', label: 'LinkedIn' },
        { key: 'whatsapp', icon: 'fa-brands fa-whatsapp', label: 'WhatsApp' }
    ];

    const list = (value) => (Array.isArray(value) ? value : []);
    const services = list(content.services);
    const projects = list(content.projects);
    const insights = list(content.insights);

    const findService = (id) => services.find((item) => item.id === id);
    const serviceName = (id) => findService(id)?.shortTitle || findService(id)?.title || '';
    const serviceUrl = (id) => `service.html?id=${encodeURIComponent(id)}`;
    const projectUrl = (id) => `project.html?id=${encodeURIComponent(id)}`;
    const insightUrl = (id) => `insight.html?id=${encodeURIComponent(id)}`;
    const quoteUrl = (id) => `contact.html?service=${encodeURIComponent(id)}`;
    const telHref = (phone) => `tel:${String(phone || '').replace(/[^\d+]/g, '')}`;

    function formatDate(value) {
        const date = new Date(`${value}T00:00:00`);
        if (Number.isNaN(date.getTime())) {
            return esc(value);
        }
        return esc(date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }));
    }

    function setMeta(title, description) {
        document.title = title ? `${title} | ${brand.name}` : `${brand.name} | Smart Digital Solutions`;
        const meta = document.querySelector('meta[name="description"]');
        if (meta) {
            meta.setAttribute('content', description || brand.description || '');
        }
    }

    function renderHeader() {
        const active = PARENT_PAGE[page] || page;
        const current = (name) => (name === active ? ' aria-current="page"' : '');
        const links = NAV.map((item) => `
            <li><a href="${item.href}" class="${item.page === active ? 'active' : ''}"${current(item.page)}>${item.label}</a></li>
        `).join('');

        document.getElementById('site-header').innerHTML = `
            <nav class="navbar" aria-label="Main">
                <div class="nav-container">
                    <a href="index.html" class="logo">
                        <img src="images/eds-mark.png" alt="" width="269" height="160">
                        <span class="logo-text">
                            <span class="logo-primary">${esc(brand.logoPrimary)}</span>
                            <span class="logo-accent">${esc(brand.logoAccent)}</span>
                        </span>
                    </a>
                    <ul class="nav-links" id="primary-nav">
                        ${links}
                        <li><a href="contact.html" class="nav-btn${active === 'contact' ? ' active' : ''}"${current('contact')}>Start a Project</a></li>
                    </ul>
                    <button class="menu-toggle" id="mobile-menu" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="primary-nav">
                        <span class="bar"></span>
                        <span class="bar"></span>
                        <span class="bar"></span>
                    </button>
                </div>
            </nav>
        `;
    }

    function socialLinks() {
        const socials = brand.socials || {};
        return SOCIALS.map((item) => {
            const url = safeUrl(socials[item.key]);
            return url
                ? `<a href="${esc(url)}" target="_blank" rel="noopener" aria-label="${item.label}"><i class="${item.icon}" aria-hidden="true"></i></a>`
                : '';
        }).join('');
    }

    function renderFooter() {
        const socials = socialLinks();
        document.getElementById('site-footer').innerHTML = `
            <div class="container footer-grid">
                <div>
                    <a href="index.html" class="footer-logo"><img src="images/eds-logo.png" alt="${esc(brand.name)}" width="386" height="240" loading="lazy"></a>
                    <p>${esc(brand.footerText)}</p>
                    ${socials ? `<div class="social-icons footer-social">${socials}</div>` : ''}
                </div>
                <div>
                    <h4>Company</h4>
                    <ul class="footer-links">
                        <li><a href="about.html">About</a></li>
                        <li><a href="process.html">Process</a></li>
                        <li><a href="work.html">Work</a></li>
                        <li><a href="insights.html">Insights</a></li>
                        <li><a href="faq.html">FAQ</a></li>
                        <li><a href="contact.html">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <h4>Services</h4>
                    <ul class="footer-links">
                        ${services.map((item) => `<li><a href="${serviceUrl(item.id)}">${esc(item.shortTitle || item.title)}</a></li>`).join('')}
                    </ul>
                </div>
                <div>
                    <h4>Contact</h4>
                    <ul class="footer-links">
                        <li><a href="${esc(telHref(brand.phone))}">${esc(brand.phone)}</a></li>
                        <li><a href="mailto:${esc(brand.email)}">${esc(brand.email)}</a></li>
                        <li>${esc(brand.location)}</li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; ${new Date().getFullYear()} ${esc(brand.name)}${brand.registration ? ` (${esc(brand.registration)})` : ''}. All Rights Reserved.</p>
            </div>
        `;
    }

    function pageHero(info, extra = '') {
        return `
            <section class="page-hero">
                <div class="container">
                    ${info.eyebrow ? `<p class="eyebrow">${esc(info.eyebrow)}</p>` : ''}
                    <h1>${esc(info.title)}</h1>
                    ${info.intro ? `<p class="page-intro">${esc(info.intro)}</p>` : ''}
                    ${extra}
                </div>
            </section>
        `;
    }

    function sectionHeading(title, intro) {
        return `
            <div class="center-title">
                <h2 class="section-title">${esc(title)}</h2>
                ${intro ? `<p class="section-desc">${esc(intro)}</p>` : ''}
            </div>
        `;
    }

    function checkList(items) {
        return `<ul class="service-list">${list(items).map((item) => `<li><i class="fa-solid fa-check" aria-hidden="true"></i> ${esc(item)}</li>`).join('')}</ul>`;
    }

    function serviceCard(item) {
        return `
            <article class="service-card${item.badge ? ' highlight' : ''}">
                <div class="service-icon"><i class="${iconClass(item.icon)}" aria-hidden="true"></i></div>
                ${item.badge ? `<div class="badge">${esc(item.badge)}</div>` : ''}
                <h3><a href="${serviceUrl(item.id)}">${esc(item.title)}</a></h3>
                <p>${esc(item.summary)}</p>
                ${checkList(item.features)}
                <a class="text-link" href="${serviceUrl(item.id)}">Learn more <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
            </article>
        `;
    }

    function pills(serviceId, sample, sampleLabel) {
        const name = serviceName(serviceId);
        return `
            <div class="pill-row">
                ${name ? `<a class="service-pill" href="${serviceUrl(serviceId)}">${esc(name)}</a>` : ''}
                ${sample ? `<span class="sample-pill">${sampleLabel}</span>` : ''}
            </div>
        `;
    }

    function projectCard(item) {
        return `
            <article class="project-card" data-service="${esc(item.serviceId)}">
                ${pills(item.serviceId, item.sample, 'Sample project')}
                <h3><a href="${projectUrl(item.id)}">${esc(item.title)}</a></h3>
                <p>${esc(item.summary)}</p>
                ${list(item.tags).length ? `<div class="tag-row">${list(item.tags).map((tag) => `<span class="tag">${esc(tag)}</span>`).join('')}</div>` : ''}
                <a class="text-link" href="${projectUrl(item.id)}">View case study <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
            </article>
        `;
    }

    function insightCard(item) {
        return `
            <article class="insight-card">
                ${pills(item.serviceId, item.sample, 'Sample article')}
                <p class="meta">${formatDate(item.date)}${item.readTime ? ` · ${esc(item.readTime)}` : ''}</p>
                <h3><a href="${insightUrl(item.id)}">${esc(item.title)}</a></h3>
                <p>${esc(item.summary)}</p>
                <a class="text-link" href="${insightUrl(item.id)}">Read article <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
            </article>
        `;
    }

    function whySection(title) {
        return `
            <section class="why-section">
                <div class="container">
                    ${sectionHeading(title)}
                    <div class="why-grid">
                        ${list(content.why).map((item) => `<div class="why-card"><h4>${esc(item.title)}</h4><p>${esc(item.text)}</p></div>`).join('')}
                    </div>
                </div>
            </section>
        `;
    }

    function processTimeline() {
        return `
            <div class="process-timeline">
                ${list(content.process).map((step, index) => `
                    <div class="step-card">
                        <div class="step-num">${String(index + 1).padStart(2, '0')}</div>
                        <h3>${esc(step.title)}</h3>
                        <p>${esc(step.text)}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function testimonialsSection() {
        const items = list(content.testimonials);
        if (!items.length) {
            return '';
        }
        return `
            <section class="testimonials-section">
                <div class="container">
                    ${sectionHeading('What Our Clients Say')}
                    <div class="testimonials-grid">
                        ${items.map((item) => `
                            <figure class="test-card">
                                <blockquote><p>“${esc(item.quote)}”</p></blockquote>
                                <figcaption>— ${esc(item.author)}</figcaption>
                            </figure>
                        `).join('')}
                    </div>
                </div>
            </section>
        `;
    }

    function faqList(items) {
        return `
            <div class="faq-wrapper">
                ${items.map((item, index) => `
                    <div class="faq-item">
                        <button class="faq-question" type="button" aria-expanded="false" aria-controls="faq-answer-${index}">
                            ${esc(item.question)} <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
                        </button>
                        <div class="faq-answer" id="faq-answer-${index}"><p>${esc(item.answer)}</p></div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function ctaBanner(title, text, button, href = 'contact.html') {
        return `
            <section class="cta-banner">
                <h2>${esc(title)}</h2>
                <p>${esc(text)}</p>
                <a href="${esc(href)}" class="btn btn-primary">${esc(button)}</a>
            </section>
        `;
    }

    function defaultCta() {
        const home = content.home;
        return ctaBanner(home.ctaTitle, home.ctaText, home.ctaButton);
    }

    function notFound(kind, backHref, backLabel) {
        setMeta(`${kind} not found`);
        return `
            <section class="page-hero not-found">
                <div class="container">
                    <p class="eyebrow">Not found</p>
                    <h1>We couldn’t find that ${esc(kind.toLowerCase())}</h1>
                    <p class="page-intro">It may have been renamed or removed.</p>
                    <a class="btn btn-primary" href="${backHref}">Back to ${esc(backLabel)}</a>
                </div>
            </section>
        `;
    }

    function renderHome() {
        const home = content.home;
        const featured = services.filter((item) => item.featured);
        const shown = featured.length ? featured : services.slice(0, 3);
        setMeta('');

        return `
            <section class="hero-section">
                <div class="hero-container">
                    ${home.badge ? `<div class="hero-badge">${esc(home.badge)}</div>` : ''}
                    <h1>${esc(home.title)} <span class="text-gradient">${esc(home.highlight)}</span></h1>
                    <p>${esc(home.intro)}</p>
                    <div class="hero-ctas">
                        <a href="contact.html" class="btn btn-primary">Get Started <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
                        <a href="services.html" class="btn btn-secondary">Explore Services</a>
                    </div>
                </div>
            </section>

            <section class="services-section">
                <div class="container">
                    ${sectionHeading(home.servicesTitle, home.servicesIntro)}
                    <div class="services-grid">${shown.map(serviceCard).join('')}</div>
                    <div class="section-actions"><a class="btn btn-secondary" href="services.html">View all services</a></div>
                </div>
            </section>

            ${whySection(content.about.whyTitle)}

            ${projects.length ? `
                <section class="work-section">
                    <div class="container">
                        ${sectionHeading(home.workTitle, home.workIntro)}
                        <div class="card-grid">${projects.slice(0, 3).map(projectCard).join('')}</div>
                        <div class="section-actions"><a class="btn btn-secondary" href="work.html">See all work</a></div>
                    </div>
                </section>
            ` : ''}

            ${testimonialsSection()}

            ${insights.length ? `
                <section class="insights-section">
                    <div class="container">
                        ${sectionHeading(home.insightsTitle, home.insightsIntro)}
                        <div class="card-grid">${insights.slice(0, 3).map(insightCard).join('')}</div>
                        <div class="section-actions"><a class="btn btn-secondary" href="insights.html">Read all insights</a></div>
                    </div>
                </section>
            ` : ''}

            ${defaultCta()}
        `;
    }

    function renderAbout() {
        const about = content.about;
        setMeta('About', pages.about.intro);
        return `
            ${pageHero(pages.about)}
            <section class="about-section">
                <div class="container">
                    <div class="about-grid">
                        <div class="about-left">
                            ${list(about.paragraphs).map((text) => `<p class="section-desc">${esc(text)}</p>`).join('')}
                        </div>
                        <div class="about-right">
                            <div class="vision-mission-card">
                                <div class="vm-box">
                                    <div class="icon-wrap"><i class="fa-solid fa-eye" aria-hidden="true"></i></div>
                                    <h3>Our Vision</h3>
                                    <p>${esc(about.vision)}</p>
                                </div>
                                <div class="vm-box">
                                    <div class="icon-wrap"><i class="fa-solid fa-rocket" aria-hidden="true"></i></div>
                                    <h3>Our Mission</h3>
                                    <p>${esc(about.mission)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            ${whySection(about.whyTitle)}
            ${testimonialsSection()}
            ${defaultCta()}
        `;
    }

    function renderServices() {
        setMeta('Services', pages.services.intro);
        return `
            ${pageHero(pages.services)}
            <section class="services-section">
                <div class="container">
                    <div class="services-grid">${services.map(serviceCard).join('')}</div>
                </div>
            </section>
            <section class="process-section">
                <div class="container">
                    ${sectionHeading(pages.process.title, pages.process.intro)}
                    ${processTimeline()}
                    <div class="section-actions"><a class="btn btn-secondary" href="process.html">How we work</a></div>
                </div>
            </section>
            ${defaultCta()}
        `;
    }

    function relatedCards(title, items, renderCard) {
        if (!items.length) {
            return '';
        }
        return `
            <section class="related-section">
                <div class="container">
                    ${sectionHeading(title)}
                    <div class="card-grid">${items.map(renderCard).join('')}</div>
                </div>
            </section>
        `;
    }

    function renderService() {
        const item = findService(params.get('id'));
        if (!item) {
            return notFound('Service', 'services.html', 'services');
        }
        setMeta(item.title, item.summary);
        const hero = pageHero({ eyebrow: 'Service', title: item.title, intro: item.summary },
            item.badge ? `<span class="badge hero-inline-badge">${esc(item.badge)}</span>` : '');

        return `
            ${hero}
            <section class="detail-section">
                <div class="container detail-grid">
                    <div class="detail-main">
                        <div class="service-icon"><i class="${iconClass(item.icon)}" aria-hidden="true"></i></div>
                        ${item.description ? `<h2>Overview</h2><p>${esc(item.description)}</p>` : ''}
                        ${list(item.features).length ? `<h2>What we offer</h2>${checkList(item.features)}` : ''}
                        ${list(item.outcomes).length ? `<h2>What you get</h2>${checkList(item.outcomes)}` : ''}
                    </div>
                    <aside class="detail-aside">
                        <div class="aside-card">
                            <h3>Start a ${esc(item.shortTitle || item.title)} project</h3>
                            <p>Tell us what you need and we will reply with next steps and a free quote.</p>
                            <a class="btn btn-primary full-width" href="${quoteUrl(item.id)}">Request a quote</a>
                        </div>
                        <div class="aside-card">
                            <h3>Other services</h3>
                            <ul class="aside-links">
                                ${services.filter((other) => other.id !== item.id).map((other) => `<li><a href="${serviceUrl(other.id)}">${esc(other.title)}</a></li>`).join('')}
                            </ul>
                        </div>
                    </aside>
                </div>
            </section>
            ${relatedCards('Related work', projects.filter((project) => project.serviceId === item.id), projectCard)}
            ${relatedCards('Related insights', insights.filter((insight) => insight.serviceId === item.id), insightCard)}
        `;
    }

    function renderProcess() {
        setMeta('Process', pages.process.intro);
        const faqs = list(content.faqs).slice(0, 3);
        return `
            ${pageHero(pages.process)}
            <section class="process-section">
                <div class="container">${processTimeline()}</div>
            </section>
            ${faqs.length ? `
                <section class="faq-section">
                    <div class="container">
                        ${sectionHeading('Common questions')}
                        ${faqList(faqs)}
                        <div class="section-actions"><a class="btn btn-secondary" href="faq.html">All FAQs</a></div>
                    </div>
                </section>
            ` : ''}
            ${defaultCta()}
        `;
    }

    function renderWork() {
        setMeta('Work', pages.work.intro);
        const serviceIds = [...new Set(projects.map((item) => item.serviceId))].filter(findService);
        const filters = serviceIds.length > 1 ? `
            <div class="filter-bar" role="group" aria-label="Filter projects by service">
                <button type="button" class="filter-btn active" data-filter="all" aria-pressed="true">All</button>
                ${serviceIds.map((id) => `<button type="button" class="filter-btn" data-filter="${esc(id)}" aria-pressed="false">${esc(serviceName(id))}</button>`).join('')}
            </div>
        ` : '';

        return `
            ${pageHero(pages.work)}
            <section class="work-section">
                <div class="container">
                    ${filters}
                    ${projects.length
                        ? `<div class="card-grid" id="project-grid">${projects.map(projectCard).join('')}</div>`
                        : '<p class="empty-note">Projects will appear here soon.</p>'}
                </div>
            </section>
            ${defaultCta()}
        `;
    }

    function detailBlocks(blocks) {
        return blocks.filter(([, text]) => text).map(([title, text]) => `<h2>${title}</h2><p>${esc(text)}</p>`).join('');
    }

    function renderProject() {
        const item = projects.find((project) => project.id === params.get('id'));
        if (!item) {
            return notFound('Project', 'work.html', 'work');
        }
        setMeta(item.title, item.summary);
        const service = findService(item.serviceId);

        return `
            ${pageHero({ eyebrow: 'Case study', title: item.title, intro: item.summary }, pills(item.serviceId, item.sample, 'Sample project'))}
            <section class="detail-section">
                <div class="container detail-grid">
                    <div class="detail-main">
                        ${detailBlocks([['The challenge', item.challenge], ['Our approach', item.approach], ['The outcome', item.outcome]])}
                        ${list(item.tags).length ? `<div class="tag-row">${list(item.tags).map((tag) => `<span class="tag">${esc(tag)}</span>`).join('')}</div>` : ''}
                    </div>
                    <aside class="detail-aside">
                        <div class="aside-card">
                            <h3>Need something similar?</h3>
                            <p>Tell us about your project and we will suggest the right approach.</p>
                            <a class="btn btn-primary full-width" href="${service ? quoteUrl(service.id) : 'contact.html'}">Start a project</a>
                        </div>
                        ${service ? `
                            <div class="aside-card">
                                <h3>Service</h3>
                                <p><a class="text-link" href="${serviceUrl(service.id)}">${esc(service.title)} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a></p>
                            </div>
                        ` : ''}
                    </aside>
                </div>
            </section>
            ${relatedCards('More work', projects.filter((other) => other.id !== item.id).slice(0, 3), projectCard)}
        `;
    }

    function renderInsights() {
        setMeta('Insights', pages.insights.intro);
        return `
            ${pageHero(pages.insights)}
            <section class="insights-section">
                <div class="container">
                    ${insights.length
                        ? `<div class="card-grid">${insights.map(insightCard).join('')}</div>`
                        : '<p class="empty-note">Articles will appear here soon.</p>'}
                </div>
            </section>
            ${defaultCta()}
        `;
    }

    function renderInsight() {
        const item = insights.find((insight) => insight.id === params.get('id'));
        if (!item) {
            return notFound('Article', 'insights.html', 'insights');
        }
        setMeta(item.title, item.summary);
        const service = findService(item.serviceId);
        const meta = `<p class="meta article-meta">${formatDate(item.date)}${item.readTime ? ` · ${esc(item.readTime)}` : ''}</p>`;

        return `
            ${pageHero({ eyebrow: 'Insight', title: item.title, intro: item.summary }, pills(item.serviceId, item.sample, 'Sample article') + meta)}
            <section class="detail-section">
                <div class="container detail-grid">
                    <article class="detail-main article-body">
                        ${list(item.body).map((text) => `<p>${esc(text)}</p>`).join('')}
                    </article>
                    <aside class="detail-aside">
                        ${service ? `
                            <div class="aside-card">
                                <h3>${esc(service.title)}</h3>
                                <p>${esc(service.summary)}</p>
                                <a class="btn btn-primary full-width" href="${quoteUrl(service.id)}">Request a quote</a>
                                <a class="text-link aside-secondary" href="${serviceUrl(service.id)}">About this service <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
                            </div>
                        ` : `
                            <div class="aside-card">
                                <h3>Talk to us</h3>
                                <p>Have a question about this topic? We are happy to help.</p>
                                <a class="btn btn-primary full-width" href="contact.html">Contact us</a>
                            </div>
                        `}
                    </aside>
                </div>
            </section>
            ${relatedCards('More insights', insights.filter((other) => other.id !== item.id).slice(0, 3), insightCard)}
        `;
    }

    function renderFaq() {
        setMeta('FAQ', pages.faq.intro);
        return `
            ${pageHero(pages.faq)}
            <section class="faq-section">
                <div class="container">${faqList(list(content.faqs))}</div>
            </section>
            ${ctaBanner('Still have questions?', 'Send us a message and we will get back to you.', 'Contact us')}
        `;
    }

    function renderContact() {
        setMeta('Contact', pages.contact.intro);
        const selected = params.get('service');
        const socials = socialLinks();
        const options = services.map((item) => `
            <option value="${esc(item.id)}"${item.id === selected ? ' selected' : ''}>${esc(item.title)}</option>
        `).join('');
        const hasSelected = services.some((item) => item.id === selected);

        return `
            ${pageHero(pages.contact)}
            <section class="contact-section">
                <div class="container">
                    <div class="contact-grid">
                        <div class="contact-info">
                            <h2 class="section-title">Get in touch</h2>
                            <p>Fill out the form or reach us directly.</p>
                            <div class="info-links">
                                <p><i class="fa-solid fa-phone text-accent" aria-hidden="true"></i> <a href="${esc(telHref(brand.phone))}">${esc(brand.phone)}</a></p>
                                <p><i class="fa-solid fa-envelope text-accent" aria-hidden="true"></i> <a href="mailto:${esc(brand.email)}">${esc(brand.email)}</a></p>
                                <p><i class="fa-solid fa-location-dot text-accent" aria-hidden="true"></i> ${esc(brand.location)}</p>
                            </div>
                            ${socials ? `<div class="social-icons">${socials}</div>` : ''}
                        </div>
                        <div class="contact-form-container">
                            <form class="contact-form" id="quote-form">
                                <label for="full-name">Full Name</label>
                                <input id="full-name" name="name" type="text" autocomplete="name" required>
                                <label for="email">Email Address</label>
                                <input id="email" name="email" type="email" autocomplete="email" required>
                                <label for="phone">Phone Number</label>
                                <input id="phone" name="phone" type="tel" autocomplete="tel">
                                <label for="service">Service Needed</label>
                                <select id="service" name="service" required>
                                    <option value="" disabled${hasSelected ? '' : ' selected'}>Select a service</option>
                                    ${options}
                                </select>
                                <label for="message">Project Details</label>
                                <textarea id="message" name="message" rows="5" required></textarea>
                                <p class="form-status" id="form-status" role="status" aria-live="polite" hidden></p>
                                <button type="submit" class="btn btn-primary full-width">Request a Free Quote</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    const RENDERERS = {
        home: renderHome,
        about: renderAbout,
        services: renderServices,
        service: renderService,
        process: renderProcess,
        work: renderWork,
        project: renderProject,
        insights: renderInsights,
        insight: renderInsight,
        faq: renderFaq,
        contact: renderContact
    };

    function bindMenu() {
        const toggle = document.getElementById('mobile-menu');
        const nav = document.getElementById('primary-nav');

        function setOpen(open) {
            nav.classList.toggle('active', open);
            toggle.classList.toggle('is-active', open);
            toggle.setAttribute('aria-expanded', String(open));
            toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        }

        toggle.addEventListener('click', () => setOpen(!nav.classList.contains('active')));
        nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        });
    }

    function bindFaq() {
        const items = document.querySelectorAll('.faq-item');
        items.forEach((item) => {
            item.querySelector('.faq-question').addEventListener('click', () => {
                const wasOpen = item.classList.contains('active');
                items.forEach((other) => {
                    other.classList.remove('active');
                    other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                });
                if (!wasOpen) {
                    item.classList.add('active');
                    item.querySelector('.faq-question').setAttribute('aria-expanded', 'true');
                }
            });
        });
    }

    function bindWorkFilters() {
        const buttons = document.querySelectorAll('.filter-btn');
        const cards = document.querySelectorAll('#project-grid .project-card');
        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                buttons.forEach((other) => {
                    const active = other === button;
                    other.classList.toggle('active', active);
                    other.setAttribute('aria-pressed', String(active));
                });
                cards.forEach((card) => {
                    card.hidden = filter !== 'all' && card.dataset.service !== filter;
                });
            });
        });
    }

    function bindQuoteForm() {
        const form = document.getElementById('quote-form');
        if (!form) {
            return;
        }
        const status = document.getElementById('form-status');

        function showStatus(message, type) {
            status.hidden = false;
            status.textContent = message;
            status.className = `form-status ${type}`;
        }

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const data = new FormData(form);
            const field = (name) => String(data.get(name) || '').trim();

            try {
                addLead({
                    name: field('name'),
                    email: field('email'),
                    phone: field('phone'),
                    service: field('service'),
                    message: field('message')
                });
            } catch {
                showStatus(`This browser blocked local storage, so the request could not be saved. Email ${brand.email} instead.`, 'error');
                return;
            }

            form.reset();
            showStatus('Your quote request is saved on this device. A manager can review it from this browser’s dashboard.', 'success');
        });
    }

    renderHeader();
    renderFooter();
    document.getElementById('main').innerHTML = (RENDERERS[page] || renderHome)();
    bindMenu();
    bindFaq();
    bindWorkFilters();
    bindQuoteForm();
})();
