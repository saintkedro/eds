const ADMIN_PASSWORD = 'eds-manager-2026';
const AUTH_KEY = 'edsAdminUnlocked';

const SERVICE_LABELS = {
    webdev: 'Web Design & Dev',
    testing: 'Software Testing & QA',
    branding: 'Branding & Graphics',
    marketing: 'Digital Marketing',
    automation: 'Business Automation',
    training: 'ICT Training'
};

document.addEventListener('DOMContentLoaded', () => {
    const gate = document.getElementById('admin-gate');
    const dashboard = document.getElementById('dashboard');
    const loginForm = document.getElementById('admin-login');
    const gateError = document.getElementById('gate-error');

    function showDashboard() {
        gate.hidden = true;
        dashboard.hidden = false;
        calculateAnalyticsAndRender();
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

    document.getElementById('clear-all-btn').addEventListener('click', () => {
        if (confirm('Clear every quote request saved in this browser?')) {
            localStorage.setItem('formResponses', JSON.stringify([]));
            calculateAnalyticsAndRender();
        }
    });

    document.getElementById('table-body').addEventListener('click', (event) => {
        const button = event.target.closest('[data-delete-id]');
        if (!button) {
            return;
        }
        const responses = readResponses().filter((item) => item.id !== button.dataset.deleteId);
        localStorage.setItem('formResponses', JSON.stringify(responses));
        calculateAnalyticsAndRender();
    });
});

function readResponses() {
    try {
        const parsed = JSON.parse(localStorage.getItem('formResponses') || '[]');
        if (!Array.isArray(parsed)) {
            return [];
        }

        let changed = false;
        const normalized = parsed.filter((item) => item && typeof item === 'object').map((item) => {
            if (item.id) {
                return item;
            }
            changed = true;
            return { ...item, id: createId() };
        });

        if (changed) {
            localStorage.setItem('formResponses', JSON.stringify(normalized));
        }
        return normalized;
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

function calculateAnalyticsAndRender() {
    const responses = readResponses();
    const tbody = document.getElementById('table-body');
    const emptyState = document.getElementById('empty-state-msg');

    tbody.innerHTML = '';

    const counts = {
        webdev: 0,
        testing: 0,
        branding: 0,
        marketing: 0,
        automation: 0,
        training: 0
    };

    responses.forEach((resp) => {
        if (Object.hasOwn(counts, resp.service)) {
            counts[resp.service]++;
        }
    });

    document.getElementById('total-count').textContent = responses.length;

    const activePipelinesCount = Object.values(counts).filter((count) => count > 0).length;
    document.getElementById('active-pipelines').textContent = `${activePipelinesCount} / ${Object.keys(counts).length}`;

    updateServiceVisuals(counts, responses.length);

    if (responses.length === 0) {
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    responses.forEach((resp) => {
        const tr = document.createElement('tr');
        const serviceKey = Object.hasOwn(SERVICE_LABELS, resp.service) ? resp.service : '';
        const tagClass = serviceKey ? `service-tag tag-${serviceKey}` : 'service-tag';

        tr.innerHTML = `
            <td><strong>${escapeHtml(resp.name)}</strong></td>
            <td>${escapeHtml(resp.email)}</td>
            <td>${escapeHtml(resp.phone || 'N/A')}</td>
            <td><span class="${tagClass}">${escapeHtml(getServiceLabel(resp.service))}</span></td>
            <td title="${escapeHtml(resp.message)}">${escapeHtml(resp.message)}</td>
            <td><button class="btn-delete" type="button" data-delete-id="${escapeHtml(resp.id)}" aria-label="Delete request from ${escapeHtml(resp.name)}"><i class="fa-solid fa-trash" aria-hidden="true"></i></button></td>
        `;
        tbody.appendChild(tr);
    });
}

function updateServiceVisuals(counts, total) {
    Object.keys(counts).forEach((service) => {
        const countElement = document.getElementById(`count-${service}`);
        const barElement = document.getElementById(`bar-${service}`);

        if (countElement && barElement) {
            countElement.textContent = counts[service];
            const percentage = total > 0 ? (counts[service] / total) * 100 : 0;
            barElement.style.width = `${percentage}%`;
        }
    });
}

function getServiceLabel(value) {
    return SERVICE_LABELS[value] || value || 'Unknown';
}

function escapeHtml(text) {
    return String(text ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
