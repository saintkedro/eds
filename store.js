(function () {
    const CONTENT_KEY = 'siteContent';
    const LEADS_KEY = 'formResponses';
    const OBJECT_SECTIONS = ['brand', 'home', 'pages', 'about'];
    const LIST_SECTIONS = ['why', 'services', 'process', 'testimonials', 'faqs', 'projects', 'insights'];

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function isPlainObject(value) {
        return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
    }

    function mergeObject(defaults, saved) {
        if (!isPlainObject(saved)) {
            return clone(defaults);
        }
        const result = { ...clone(defaults) };
        Object.keys(saved).forEach((key) => {
            if (isPlainObject(defaults[key]) && isPlainObject(saved[key])) {
                result[key] = mergeObject(defaults[key], saved[key]);
            } else if (saved[key] !== undefined) {
                result[key] = saved[key];
            }
        });
        return result;
    }

    function getDefaults() {
        return clone(window.SITE_DEFAULTS);
    }

    function getContent() {
        const defaults = getDefaults();
        let saved;
        try {
            saved = JSON.parse(localStorage.getItem(CONTENT_KEY) || 'null');
        } catch {
            return defaults;
        }
        if (!isPlainObject(saved)) {
            return defaults;
        }

        const content = { ...defaults };
        OBJECT_SECTIONS.forEach((key) => {
            content[key] = mergeObject(defaults[key], saved[key]);
        });
        LIST_SECTIONS.forEach((key) => {
            if (Array.isArray(saved[key])) {
                content[key] = saved[key].filter(isPlainObject);
            }
        });
        return content;
    }

    function saveContent(content) {
        try {
            localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
            return true;
        } catch {
            return false;
        }
    }

    function resetContent() {
        localStorage.removeItem(CONTENT_KEY);
    }

    function createId() {
        if (window.crypto && typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID();
        }
        return `lead-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }

    function readLeads() {
        try {
            const parsed = JSON.parse(localStorage.getItem(LEADS_KEY) || '[]');
            if (!Array.isArray(parsed)) {
                return [];
            }
            let changed = false;
            const leads = parsed.filter(isPlainObject).map((lead) => {
                if (lead.id) {
                    return lead;
                }
                changed = true;
                return { ...lead, id: createId() };
            });
            if (changed) {
                writeLeads(leads);
            }
            return leads;
        } catch {
            return [];
        }
    }

    function writeLeads(leads) {
        localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
    }

    function addLead(lead) {
        const leads = readLeads();
        leads.push({ ...lead, id: createId(), createdAt: new Date().toISOString() });
        writeLeads(leads);
    }

    function escapeHtml(text) {
        return String(text ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function safeUrl(value) {
        const url = String(value ?? '').trim();
        return /^https?:\/\//i.test(url) ? url : '';
    }

    function iconClass(value) {
        const cleaned = String(value ?? '').replace(/[^a-z0-9 -]/gi, '').trim();
        return cleaned || 'fa-solid fa-circle';
    }

    function slugify(value) {
        return String(value ?? '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 60);
    }

    window.EDSStore = {
        getDefaults,
        getContent,
        saveContent,
        resetContent,
        readLeads,
        writeLeads,
        addLead,
        escapeHtml,
        safeUrl,
        iconClass,
        slugify
    };
})();
