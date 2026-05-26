document.addEventListener('DOMContentLoaded', () => {
    calculateAnalyticsAndRender();

    document.getElementById('clear-all-btn').addEventListener('click', () => {
        if(confirm('Are you sure you want to clear your entire responses tracking database?')) {
            localStorage.setItem('formResponses', JSON.stringify([]));
            calculateAnalyticsAndRender();
        }
    });
});

function calculateAnalyticsAndRender() {
    const responses = JSON.parse(localStorage.getItem('formResponses')) || [];
    
    const tbody = document.getElementById('table-body');
    const emptyState = document.getElementById('empty-state-msg');
    
    // Clear display structures
    tbody.innerHTML = '';
    
    // Core Service Counters Definition Block
    const counts = {
        webdev: 0,
        testing: 0,
        branding: 0,
        marketing: 0,
        automation: 0
    };

    // Populate service counters dynamically
    responses.forEach(resp => {
        if (counts.hasOwnProperty(resp.service)) {
            counts[resp.service]++;
        }
    });

    // Update Dashboard Global Metric Displays
    document.getElementById('total-count').textContent = responses.length;
    
    let activePipelinesCount = 0;
    Object.keys(counts).forEach(key => {
        if(counts[key] > 0) activePipelinesCount++;
    });
    document.getElementById('active-pipelines').textContent = `${activePipelinesCount} / 5`;

    // Render individual micro counts and performance fills
    updateServiceVisuals(counts, responses.length);

    if (responses.length === 0) {
        emptyState.style.display = 'block';
        return;
    } else {
        emptyState.style.display = 'none';
    }

    // Build data tables dynamically
    responses.forEach((resp, index) => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td><strong>${escapeHtml(resp.name)}</strong></td>
            <td>${escapeHtml(resp.email)}</td>
            <td>${escapeHtml(resp.phone || 'N/A')}</td>
            <td><span class="service-tag tag-${resp.service}">${getServiceLabel(resp.service)}</span></td>
            <td title="${escapeHtml(resp.message)}">${escapeHtml(resp.message)}</td>
            <td><button class="btn-delete" onclick="deleteResponse(${index})"><i class="fa-solid fa-trash"></i></button></td>
        `;
        tbody.appendChild(tr);
    });
}

function updateServiceVisuals(counts, total) {
    Object.keys(counts).forEach(service => {
        const countElement = document.getElementById(`count-${service}`);
        const barElement = document.getElementById(`bar-${service}`);
        
        if (countElement && barElement) {
            countElement.textContent = counts[service];
            
            // Calculate proportional metric percentages
            const percentage = total > 0 ? (counts[service] / total) * 100 : 0;
            barElement.style.width = `${percentage}%`;
        }
    });
}

function getServiceLabel(value) {
    const services = {
        'webdev': 'Web Design & Dev',
        'testing': 'Software Testing & QA',
        'branding': 'Branding & Graphics',
        'marketing': 'Digital Marketing',
        'automation': 'Business Automation'
    };
    return services[value] || value;
}

window.deleteResponse = function(index) {
    let responses = JSON.parse(localStorage.getItem('formResponses')) || [];
    responses.splice(index, 1);
    localStorage.setItem('formResponses', JSON.stringify(responses));
    calculateAnalyticsAndRender();
};

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}