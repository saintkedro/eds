const ADMIN_PASSWORD = 'eds-manager-2026';
const AUTH_KEY = 'edsAdminUnlocked';

const { getContent, saveContent, resetContent, readLeads, writeLeads, escapeHtml, iconClass, slugify } = window.EDSStore;

const KNOWN_TAGS = ['webdev', 'testing', 'branding', 'marketing', 'automation', 'training'];

const VIEWS = {
    leads: {
        title: 'Service Tracker Dashboard',
        intro: 'Leads saved in this browser. They are not stored on a server.'
    },
    content: {
        title: 'Site Content',
        intro: 'Edit the text on every public page. Saved changes apply in this browser only.'
    }
};

const PAGE_HEADERS = [
    ['about', 'About'],
    ['services', 'Services'],
    ['process', 'Process'],
    ['work', 'Work'],
    ['insights', 'Insights'],
    ['faq', 'FAQ'],
    ['contact', 'Contact']
];

const SECTIONS = [
    {
        key: 'brand',
        title: 'Brand and contact',
        type: 'object',
        fields: [
            { path: 'name', label: 'Company name' },
            { path: 'logoPrimary', label: 'Header name (first line)' },
            { path: 'logoAccent', label: 'Header name (second line)' },
            { path: 'phone', label: 'Phone' },
            { path: 'email', label: 'Email', input: 'email' },
            { path: 'location', label: 'Location' },
            { path: 'registration', label: 'Registration number' },
            { path: 'description', label: 'Search description', type: 'textarea' },
            { path: 'footerText', label: 'Footer text', type: 'textarea' },
            { path: 'socials.facebook', label: 'Facebook URL', input: 'url', hint: 'Leave empty to hide the icon.' },
            { path: 'socials.instagram', label: 'Instagram URL', input: 'url' },
            { path: 'socials.linkedin', label: 'LinkedIn URL', input: 'url' },
            { path: 'socials.whatsapp', label: 'WhatsApp URL', input: 'url', hint: 'For example https://wa.me/2349167639583' }
        ]
    },
    {
        key: 'home',
        title: 'Home page',
        type: 'object',
        fields: [
            { path: 'badge', label: 'Hero badge' },
            { path: 'title', label: 'Hero title' },
            { path: 'highlight', label: 'Hero highlighted text' },
            { path: 'intro', label: 'Hero intro', type: 'textarea' },
            { path: 'servicesTitle', label: 'Services heading' },
            { path: 'servicesIntro', label: 'Services intro' },
            { path: 'workTitle', label: 'Work heading' },
            { path: 'workIntro', label: 'Work intro' },
            { path: 'insightsTitle', label: 'Insights heading' },
            { path: 'insightsIntro', label: 'Insights intro' },
            { path: 'ctaTitle', label: 'Call to action heading' },
            { path: 'ctaText', label: 'Call to action text', type: 'textarea' },
            { path: 'ctaButton', label: 'Call to action button' }
        ]
    },
    {
        key: 'pages',
        title: 'Page headers',
        type: 'object',
        fields: PAGE_HEADERS.flatMap(([key, name]) => [
            { path: `${key}.eyebrow`, label: `${name}: eyebrow`, group: name },
            { path: `${key}.title`, label: `${name}: title` },
            { path: `${key}.intro`, label: `${name}: intro`, type: 'textarea' }
        ])
    },
    {
        key: 'about',
        title: 'About page',
        type: 'object',
        fields: [
            { path: 'paragraphs', label: 'Story', type: 'paragraphs', hint: 'Separate paragraphs with a blank line.' },
            { path: 'vision', label: 'Vision', type: 'textarea' },
            { path: 'mission', label: 'Mission', type: 'textarea' },
            { path: 'whyTitle', label: '“Why choose us” heading' }
        ]
    },
    {
        key: 'why',
        title: 'Why choose us',
        type: 'list',
        itemLabel: 'Reason',
        titleField: 'title',
        blank: { title: '', text: '' },
        fields: [
            { path: 'title', label: 'Title' },
            { path: 'text', label: 'Text', type: 'textarea' }
        ]
    },
    {
        key: 'services',
        title: 'Services',
        type: 'list',
        itemLabel: 'Service',
        titleField: 'title',
        hasId: true,
        blank: { id: '', title: '', shortTitle: '', icon: 'fa-solid fa-star', badge: '', featured: false, summary: '', description: '', features: [], outcomes: [] },
        fields: [
            { path: 'title', label: 'Title' },
            { path: 'shortTitle', label: 'Short title', hint: 'Used in menus, filters, and the lead tracker.' },
            { path: 'icon', label: 'Icon', hint: 'Font Awesome classes, for example fa-solid fa-code.' },
            { path: 'badge', label: 'Badge', hint: 'Optional. Highlights the card, for example “In Demand”.' },
            { path: 'featured', label: 'Show on the home page', type: 'checkbox' },
            { path: 'summary', label: 'Summary', type: 'textarea' },
            { path: 'description', label: 'Overview', type: 'textarea' },
            { path: 'features', label: 'What we offer', type: 'lines', hint: 'One item per line.' },
            { path: 'outcomes', label: 'What you get', type: 'lines', hint: 'One item per line.' }
        ]
    },
    {
        key: 'process',
        title: 'Process steps',
        type: 'list',
        itemLabel: 'Step',
        titleField: 'title',
        blank: { title: '', text: '' },
        fields: [
            { path: 'title', label: 'Title' },
            { path: 'text', label: 'Text', type: 'textarea' }
        ]
    },
    {
        key: 'testimonials',
        title: 'Testimonials',
        type: 'list',
        itemLabel: 'Testimonial',
        titleField: 'author',
        blank: { quote: '', author: '' },
        fields: [
            { path: 'quote', label: 'Quote', type: 'textarea' },
            { path: 'author', label: 'Author' }
        ]
    },
    {
        key: 'faqs',
        title: 'FAQs',
        type: 'list',
        itemLabel: 'Question',
        titleField: 'question',
        blank: { question: '', answer: '' },
        fields: [
            { path: 'question', label: 'Question' },
            { path: 'answer', label: 'Answer', type: 'textarea' }
        ]
    },
    {
        key: 'projects',
        title: 'Work (projects)',
        type: 'list',
        itemLabel: 'Project',
        titleField: 'title',
        hasId: true,
        blank: { id: '', title: '', serviceId: '', sample: false, summary: '', challenge: '', approach: '', outcome: '', tags: [] },
        fields: [
            { path: 'title', label: 'Title' },
            { path: 'serviceId', label: 'Service', type: 'service' },
            { path: 'sample', label: 'Label as sample project', type: 'checkbox', hint: 'Uncheck once this is a real client case study.' },
            { path: 'summary', label: 'Summary', type: 'textarea' },
            { path: 'challenge', label: 'The challenge', type: 'textarea' },
            { path: 'approach', label: 'Our approach', type: 'textarea' },
            { path: 'outcome', label: 'The outcome', type: 'textarea' },
            { path: 'tags', label: 'Tags', type: 'lines', hint: 'One tag per line.' }
        ]
    },
    {
        key: 'insights',
        title: 'Insights (articles)',
        type: 'list',
        itemLabel: 'Article',
        titleField: 'title',
        hasId: true,
        blank: { id: '', title: '', serviceId: '', sample: false, date: '', readTime: '', summary: '', body: [] },
        fields: [
            { path: 'title', label: 'Title' },
            { path: 'serviceId', label: 'Related service', type: 'service' },
            { path: 'sample', label: 'Label as sample article', type: 'checkbox' },
            { path: 'date', label: 'Date', input: 'date' },
            { path: 'readTime', label: 'Read time', hint: 'For example “4 min read”.' },
            { path: 'summary', label: 'Summary', type: 'textarea' },
            { path: 'body', label: 'Article', type: 'paragraphs', rows: 10, hint: 'Separate paragraphs with a blank line.' }
        ]
    }
];

let draft = getContent();
let dirty = false;
const openSections = new Set();

document.addEventListener('DOMContentLoaded', () => {
    const gate = document.getElementById('admin-gate');
    const dashboard = document.getElementById('dashboard');
    const loginForm = document.getElementById('admin-login');
    const gateError = document.getElementById('gate-error');

    function showDashboard() {
        gate.hidden = true;
        dashboard.hidden = false;
        renderLeads();
        renderEditor();
        showView(window.location.hash === '#content' ? 'content' : 'leads');
    }

    if (sessionStorage.getItem(AUTH_KEY) === '1') {
        showDashboard();
    }

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const password = new FormData(loginForm).get('password');
        if (password !== ADMIN_PASSWORD) {
            gateError.hidden = false;
            return;
        }
        gateError.hidden = true;
        sessionStorage.setItem(AUTH_KEY, '1');
        loginForm.reset();
        showDashboard();
    });

    document.querySelectorAll('.view-tab').forEach((tab) => {
        tab.addEventListener('click', () => showView(tab.dataset.view));
    });

    document.getElementById('clear-all-btn').addEventListener('click', () => {
        if (confirm('Clear every quote request saved in this browser?')) {
            writeLeads([]);
            renderLeads();
        }
    });

    document.getElementById('table-body').addEventListener('click', (event) => {
        const button = event.target.closest('[data-delete-id]');
        if (!button) {
            return;
        }
        writeLeads(readLeads().filter((lead) => lead.id !== button.dataset.deleteId));
        renderLeads();
    });

    const contentForm = document.getElementById('content-form');
    contentForm.addEventListener('input', handleFieldChange);
    contentForm.addEventListener('change', handleFieldChange);
    contentForm.addEventListener('click', handleListAction);
    contentForm.addEventListener('submit', (event) => {
        event.preventDefault();
        saveDraft();
    });

    document.getElementById('reset-content-btn').addEventListener('click', () => {
        if (!confirm('Replace all site content with the original defaults? Saved leads are not affected.')) {
            return;
        }
        resetContent();
        draft = getContent();
        setDirty(false, 'Content reset to the original defaults.');
        renderEditor();
        renderLeads();
    });

    window.addEventListener('beforeunload', (event) => {
        if (dirty) {
            event.preventDefault();
            event.returnValue = '';
        }
    });
});

function showView(view) {
    const name = VIEWS[view] ? view : 'leads';
    document.querySelectorAll('.view-tab').forEach((tab) => {
        const active = tab.dataset.view === name;
        tab.classList.toggle('active', active);
        tab.setAttribute('aria-pressed', String(active));
    });
    document.getElementById('view-leads').hidden = name !== 'leads';
    document.getElementById('view-content').hidden = name !== 'content';
    document.getElementById('view-title').textContent = VIEWS[name].title;
    document.getElementById('view-intro').textContent = VIEWS[name].intro;
    history.replaceState(null, '', name === 'content' ? '#content' : '#leads');
}

function savedServices() {
    const services = getContent().services;
    return Array.isArray(services) ? services : [];
}

function serviceLabel(services, id) {
    const service = services.find((item) => item.id === id);
    return service ? service.shortTitle || service.title : id || 'Unknown';
}

function renderLeads() {
    const services = savedServices();
    const leads = readLeads();
    const counts = Object.fromEntries(services.map((item) => [item.id, 0]));

    leads.forEach((lead) => {
        if (Object.hasOwn(counts, lead.service)) {
            counts[lead.service]++;
        }
    });

    document.getElementById('total-count').textContent = leads.length;
    const active = Object.values(counts).filter((count) => count > 0).length;
    document.getElementById('active-pipelines').textContent = `${active} / ${services.length}`;

    document.getElementById('tracker-grid').innerHTML = services.map((item) => {
        const percentage = leads.length ? (counts[item.id] / leads.length) * 100 : 0;
        return `
            <div class="track-card${item.badge ? ' highlight-testing' : ''}">
                <div class="track-header">
                    <span class="track-icon"><i class="${iconClass(item.icon)}" aria-hidden="true"></i></span>
                    <span class="track-count">${counts[item.id]}</span>
                </div>
                <h4>${escapeHtml(item.shortTitle || item.title)}</h4>
                <div class="progress-bar-container">
                    <div class="progress-fill${item.badge ? ' neon-fill' : ''}" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    }).join('');

    const tbody = document.getElementById('table-body');
    const emptyState = document.getElementById('empty-state-msg');
    emptyState.style.display = leads.length ? 'none' : 'block';

    tbody.innerHTML = leads.map((lead) => {
        const tagClass = KNOWN_TAGS.includes(lead.service) ? `service-tag tag-${lead.service}` : 'service-tag';
        return `
            <tr>
                <td><strong>${escapeHtml(lead.name)}</strong></td>
                <td>${escapeHtml(lead.email)}</td>
                <td>${escapeHtml(lead.phone || 'N/A')}</td>
                <td><span class="${tagClass}">${escapeHtml(serviceLabel(services, lead.service))}</span></td>
                <td title="${escapeHtml(lead.message)}">${escapeHtml(lead.message)}</td>
                <td><button class="btn-delete" type="button" data-delete-id="${escapeHtml(lead.id)}" aria-label="Delete request from ${escapeHtml(lead.name)}"><i class="fa-solid fa-trash" aria-hidden="true"></i></button></td>
            </tr>
        `;
    }).join('');
}

function getPath(target, path) {
    return path.split('.').reduce((value, key) => (value == null ? undefined : value[key]), target);
}

function setPath(target, path, value) {
    const keys = path.split('.');
    const last = keys.pop();
    const parent = keys.reduce((node, key) => {
        if (!node[key] || typeof node[key] !== 'object') {
            node[key] = {};
        }
        return node[key];
    }, target);
    parent[last] = value;
}

function toFieldText(field, value) {
    if (field.type === 'lines') {
        return Array.isArray(value) ? value.join('\n') : '';
    }
    if (field.type === 'paragraphs') {
        return Array.isArray(value) ? value.join('\n\n') : '';
    }
    return value ?? '';
}

function fromFieldInput(field, input) {
    if (field.type === 'checkbox') {
        return input.checked;
    }
    if (field.type === 'lines') {
        return input.value.split('\n').map((line) => line.trim()).filter(Boolean);
    }
    if (field.type === 'paragraphs') {
        return input.value.split(/\n\s*\n/).map((text) => text.trim()).filter(Boolean);
    }
    return input.value;
}

function renderField(section, field, source, index) {
    const idBase = `f-${section.key}-${index ?? 'x'}-${field.path.replace(/\./g, '-')}`;
    const data = `data-section="${section.key}" data-path="${field.path}"${index !== undefined ? ` data-index="${index}"` : ''}`;
    const value = getPath(source, field.path);
    const hint = field.hint ? `<small class="field-hint" id="${idBase}-hint">${escapeHtml(field.hint)}</small>` : '';
    const describedBy = field.hint ? ` aria-describedby="${idBase}-hint"` : '';
    const group = field.group ? `<h4 class="field-group">${escapeHtml(field.group)}</h4>` : '';

    if (field.type === 'checkbox') {
        return `
            ${group}
            <div class="field field-checkbox">
                <label for="${idBase}"><input id="${idBase}" type="checkbox" ${data}${value ? ' checked' : ''}${describedBy}> ${escapeHtml(field.label)}</label>
                ${hint}
            </div>
        `;
    }

    let control;
    if (field.type === 'service') {
        const options = draft.services.filter((item) => item.id).map((item) => `
            <option value="${escapeHtml(item.id)}"${item.id === value ? ' selected' : ''}>${escapeHtml(item.title || item.id)}</option>
        `).join('');
        control = `<select id="${idBase}" ${data}${describedBy}><option value="">None</option>${options}</select>`;
    } else if (['textarea', 'lines', 'paragraphs'].includes(field.type)) {
        const rows = field.rows || (field.type === 'paragraphs' ? 6 : field.type === 'lines' ? 4 : 3);
        control = `<textarea id="${idBase}" rows="${rows}" ${data}${describedBy}>${escapeHtml(toFieldText(field, value))}</textarea>`;
    } else {
        control = `<input id="${idBase}" type="${field.input || 'text'}" value="${escapeHtml(value ?? '')}" ${data}${describedBy}>`;
    }

    return `
        ${group}
        <div class="field${['textarea', 'lines', 'paragraphs'].includes(field.type) ? ' field-wide' : ''}">
            <label for="${idBase}">${escapeHtml(field.label)}</label>
            ${control}
            ${hint}
        </div>
    `;
}

function itemTitle(section, item, index) {
    return String(item[section.titleField] || '').trim() || `New ${section.itemLabel.toLowerCase()} ${index + 1}`;
}

function renderListSection(section) {
    const items = Array.isArray(draft[section.key]) ? draft[section.key] : [];
    const rows = items.map((item, index) => `
        <div class="editor-item">
            <div class="editor-item-head">
                <h4 data-title-for="${section.key}-${index}">${escapeHtml(itemTitle(section, item, index))}</h4>
                <div class="item-actions">
                    <button type="button" class="icon-btn" data-action="up" data-section="${section.key}" data-index="${index}" aria-label="Move up"${index === 0 ? ' disabled' : ''}><i class="fa-solid fa-arrow-up" aria-hidden="true"></i></button>
                    <button type="button" class="icon-btn" data-action="down" data-section="${section.key}" data-index="${index}" aria-label="Move down"${index === items.length - 1 ? ' disabled' : ''}><i class="fa-solid fa-arrow-down" aria-hidden="true"></i></button>
                    <button type="button" class="icon-btn danger" data-action="remove" data-section="${section.key}" data-index="${index}" aria-label="Remove ${escapeHtml(section.itemLabel.toLowerCase())}"><i class="fa-solid fa-trash" aria-hidden="true"></i></button>
                </div>
            </div>
            ${section.hasId ? `<p class="item-id">${item.id ? `Page address id: <code>${escapeHtml(item.id)}</code>` : 'The page address id is created from the title when you save.'}</p>` : ''}
            <div class="field-grid">
                ${section.fields.map((field) => renderField(section, field, item, index)).join('')}
            </div>
        </div>
    `).join('');

    return `
        ${rows || `<p class="editor-empty">No ${section.title.toLowerCase()} yet.</p>`}
        <button type="button" class="btn-add" data-action="add" data-section="${section.key}"><i class="fa-solid fa-plus" aria-hidden="true"></i> Add ${escapeHtml(section.itemLabel.toLowerCase())}</button>
    `;
}

function renderEditor() {
    const container = document.getElementById('content-editor');
    container.innerHTML = SECTIONS.map((section) => {
        const count = section.type === 'list' && Array.isArray(draft[section.key]) ? ` <span class="section-count">${draft[section.key].length}</span>` : '';
        const body = section.type === 'list'
            ? renderListSection(section)
            : `<div class="field-grid">${section.fields.map((field) => renderField(section, field, draft[section.key] || {})).join('')}</div>`;
        return `
            <details class="editor-section" data-key="${section.key}"${openSections.has(section.key) ? ' open' : ''}>
                <summary>${escapeHtml(section.title)}${count}</summary>
                <div class="editor-body">${body}</div>
            </details>
        `;
    }).join('');

    container.querySelectorAll('.editor-section').forEach((details) => {
        details.addEventListener('toggle', () => {
            if (details.open) {
                openSections.add(details.dataset.key);
            } else {
                openSections.delete(details.dataset.key);
            }
        });
    });
}

function findSection(key) {
    return SECTIONS.find((section) => section.key === key);
}

function handleFieldChange(event) {
    const input = event.target;
    if (!input.dataset || !input.dataset.path) {
        return;
    }
    const section = findSection(input.dataset.section);
    const field = section.fields.find((item) => item.path === input.dataset.path);
    const value = fromFieldInput(field, input);

    if (section.type === 'list') {
        const index = Number(input.dataset.index);
        setPath(draft[section.key][index], field.path, value);
        if (field.path === section.titleField) {
            const heading = document.querySelector(`[data-title-for="${section.key}-${index}"]`);
            if (heading) {
                heading.textContent = itemTitle(section, draft[section.key][index], index);
            }
        }
    } else {
        draft[section.key] = draft[section.key] || {};
        setPath(draft[section.key], field.path, value);
    }
    setDirty(true);
}

function handleListAction(event) {
    const button = event.target.closest('[data-action]');
    if (!button) {
        return;
    }
    const section = findSection(button.dataset.section);
    const items = Array.isArray(draft[section.key]) ? draft[section.key] : (draft[section.key] = []);
    const index = Number(button.dataset.index);

    if (button.dataset.action === 'add') {
        items.push(JSON.parse(JSON.stringify(section.blank)));
    } else if (button.dataset.action === 'remove') {
        const warning = section.key === 'services'
            ? 'Remove this service? Projects, articles, and leads linked to it will no longer show its name.'
            : `Remove this ${section.itemLabel.toLowerCase()}?`;
        if (!confirm(warning)) {
            return;
        }
        items.splice(index, 1);
    } else if (button.dataset.action === 'up' && index > 0) {
        [items[index - 1], items[index]] = [items[index], items[index - 1]];
    } else if (button.dataset.action === 'down' && index < items.length - 1) {
        [items[index + 1], items[index]] = [items[index], items[index + 1]];
    } else {
        return;
    }

    openSections.add(section.key);
    setDirty(true);
    renderEditor();
}

function assignIds(key) {
    const items = draft[key];
    const used = new Set(items.map((item) => item.id).filter(Boolean));
    items.forEach((item) => {
        if (item.id) {
            return;
        }
        const base = slugify(item.title) || `${key}-item`;
        let id = base;
        let suffix = 2;
        while (used.has(id)) {
            id = `${base}-${suffix++}`;
        }
        item.id = id;
        used.add(id);
    });
}

function saveDraft() {
    const missing = SECTIONS.filter((section) => section.hasId)
        .find((section) => draft[section.key].some((item) => !String(item.title || '').trim()));
    if (missing) {
        openSections.add(missing.key);
        renderEditor();
        setStatus(`Every item in “${missing.title}” needs a title before saving.`, 'error');
        const index = draft[missing.key].findIndex((item) => !String(item.title || '').trim());
        const input = document.querySelector(`[data-section="${missing.key}"][data-path="title"][data-index="${index}"]`);
        if (input) input.focus();
        return;
    }

    SECTIONS.filter((section) => section.hasId).forEach((section) => assignIds(section.key));

    if (!saveContent(draft)) {
        setStatus('This browser could not save the changes. Storage may be full or blocked.', 'error');
        return;
    }

    draft = getContent();
    setDirty(false, 'Saved. Public pages show the changes the next time they load in this browser.');
    renderEditor();
    renderLeads();
}

function setStatus(message, type) {
    const status = document.getElementById('editor-status');
    status.textContent = message;
    status.className = `editor-status${type ? ` ${type}` : ''}`;
}

function setDirty(value, message) {
    dirty = value;
    if (value) {
        setStatus('You have unsaved changes.', 'pending');
    } else {
        setStatus(message || 'All changes saved.', 'success');
    }
}
