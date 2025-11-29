let allProblems = [];
let currentProblem = null;
let currentProblemIndex = -1;
let settings = null;

const searchBox = document.getElementById('problem-search');
const searchResults = document.getElementById('search-results');
const editorSection = document.getElementById('editor-section');
const attemptsList = document.getElementById('attempts-list');

// Load all problems and settings on page load
async function loadData() {
    const data = await chrome.storage.local.get(['problems', 'settings']);
    allProblems = data.problems || [];
    settings = data.settings || {
        growthFactor: 2.0,
        maxInterval: 40,
        maxStage: 8,
        baseInterval: 1,
        leechThreshold: 3,
        maxDailyReviews: 15,
        studyDays: [0, 1, 1, 1, 1, 1, 1],
        timeThresholds: {
            easy: { mastered: 5, high: 15, medium: 30 },
            medium: { mastered: 10, high: 25, medium: 45 },
            hard: { mastered: 20, high: 40, medium: 60 }
        }
    };
}

// Search and display results
searchBox.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();

    if (query.length < 2) {
        searchResults.innerHTML = '';
        return;
    }

    // Check if it's a URL
    let urlSlug = null;
    if (query.includes('leetcode.com/problems/')) {
        const match = query.match(/leetcode\.com\/problems\/([^/?#]+)/);
        if (match) {
            urlSlug = match[1];
        }
    }

    const filtered = allProblems.filter(p => {
        if (urlSlug) {
            return p.url.toLowerCase().includes(urlSlug);
        }
        return (p.title || '').toLowerCase().includes(query) ||
               (p.topic || '').toLowerCase().includes(query) ||
               (p.pattern || '').toLowerCase().includes(query);
    });

    displaySearchResults(filtered);
});

function displaySearchResults(results) {
    if (results.length === 0) {
        searchResults.innerHTML = '<div style="padding: 10px; text-align: center; color: #6c757d;">No problems found</div>';
        return;
    }

    searchResults.innerHTML = results.slice(0, 20).map((p, index) => {
        const actualIndex = allProblems.findIndex(prob => prob.url === p.url);
        return `
            <div class="search-result-item" data-index="${actualIndex}">
                <div class="result-title">${escapeHtml(p.title)}</div>
                <div class="result-meta">
                    ${escapeHtml(p.difficulty)} • ${escapeHtml(p.topic)} •
                    Stage ${p.srsStage || 0} •
                    ${p.attempts?.length || 0} attempt(s)
                </div>
            </div>
        `;
    }).join('');

    // Add click handlers
    document.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
            const index = parseInt(item.dataset.index);
            loadProblem(index);
        });
    });
}

function loadProblem(index) {
    currentProblemIndex = index;
    currentProblem = JSON.parse(JSON.stringify(allProblems[index])); // Deep clone

    // Show editor section
    editorSection.classList.add('active');

    // Update header
    document.getElementById('current-problem-title').textContent = currentProblem.title || 'Unknown Problem';
    document.getElementById('current-problem-link').href = currentProblem.url;

    // Update stats (read-only displays)
    updateStatsDisplay();

    // Load attempts
    renderAttempts();

    // Scroll to editor
    editorSection.scrollIntoView({ behavior: 'smooth' });
}

function updateStatsDisplay() {
    document.getElementById('stat-status').textContent = currentProblem.status || 'Not Started';
    document.getElementById('stat-stage').textContent = currentProblem.srsStage || 0;
    document.getElementById('stat-next-review').textContent = currentProblem.nextReviewDate || 'N/A';
    document.getElementById('stat-confidence').textContent = currentProblem.lastConfidence || 'None';
    document.getElementById('stat-lapses').textContent = currentProblem.lapses || 0;
    document.getElementById('stat-attempts').textContent = currentProblem.attempts?.length || 0;
}

function renderAttempts() {
    const attempts = currentProblem.attempts || [];

    if (attempts.length === 0) {
        attemptsList.innerHTML = '<div style="padding: 10px; text-align: center; color: #6c757d;">No attempts yet. Add one to get started!</div>';
        return;
    }

    attemptsList.innerHTML = attempts.map((attempt, index) => {
        const date = new Date(attempt.date);
        const dateStr = date.toISOString().slice(0, 16); // Format for datetime-local input
        const timeMinutes = Math.floor(attempt.time / 60);

        // Calculate what confidence WOULD be based on time
        const suggestedConfidence = SRSEngine.suggestConfidence(
            attempt.time,
            currentProblem.difficulty,
            settings
        );

        // Use existing confidence or suggested
        const displayConfidence = attempt.confidence || suggestedConfidence;

        return `
            <div class="attempt-item" data-index="${index}">
                <input
                    type="datetime-local"
                    class="attempt-date"
                    value="${dateStr}"
                    data-index="${index}"
                >
                <div class="time-input-wrapper">
                    <input
                        type="number"
                        class="attempt-time"
                        value="${timeMinutes}"
                        min="0"
                        placeholder="Minutes"
                        data-index="${index}"
                    >
                    <span>min</span>
                </div>
                <div class="confidence-display confidence-${displayConfidence}">
                    ${displayConfidence.toUpperCase()}
                </div>
                <button class="delete-attempt-btn" data-index="${index}">✕</button>
            </div>
        `;
    }).join('');

    // Add event listeners for time changes (live preview of confidence)
    document.querySelectorAll('.attempt-time').forEach(input => {
        input.addEventListener('input', (e) => {
            const index = parseInt(e.target.dataset.index);
            const timeMinutes = parseInt(e.target.value) || 0;
            const timeSeconds = timeMinutes * 60;

            const newConfidence = SRSEngine.suggestConfidence(
                timeSeconds,
                currentProblem.difficulty,
                settings
            );

            const confidenceDisplay = e.target.closest('.attempt-item').querySelector('.confidence-display');
            confidenceDisplay.textContent = newConfidence.toUpperCase();
            confidenceDisplay.className = `confidence-display confidence-${newConfidence}`;
        });
    });

    // Add delete handlers
    document.querySelectorAll('.delete-attempt-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            deleteAttempt(index);
        });
    });
}

function deleteAttempt(index) {
    if (!confirm('Delete this attempt?')) return;

    currentProblem.attempts.splice(index, 1);
    renderAttempts();

    // Recalculate stats preview
    const recalculated = SRSEngine.recalculateProblem(currentProblem, settings, allProblems);
    currentProblem = recalculated;
    updateStatsDisplay();
}

// Add new attempt
document.getElementById('add-attempt-btn').addEventListener('click', () => {
    if (!currentProblem.attempts) {
        currentProblem.attempts = [];
    }

    const now = new Date();
    currentProblem.attempts.push({
        date: now.toISOString(),
        time: 0, // Will be set by user
        confidence: null, // Will be auto-calculated
        stage: 0,
        interval: 0
    });

    renderAttempts();
    updateStatsDisplay();
});

// Reset to "Not Started"
document.getElementById('reset-btn').addEventListener('click', () => {
    if (!confirm(`⚠️ Reset "${currentProblem.title}" to "Not Started"?\n\nThis will delete all attempts and progress.`)) {
        return;
    }

    currentProblem.status = 'Not Started';
    currentProblem.attempts = [];
    currentProblem.lastConfidence = null;
    currentProblem.nextReviewDate = null;
    currentProblem.srsStage = 0;
    currentProblem.lapses = 0;
    currentProblem.consecutiveSuccesses = 0;
    currentProblem.isLeech = false;

    renderAttempts();
    updateStatsDisplay();
});

// Save changes with full recalculation
document.getElementById('save-btn').addEventListener('click', async () => {
    // Update attempts from form
    const attemptItems = document.querySelectorAll('.attempt-item');
    attemptItems.forEach((item, index) => {
        if (!currentProblem.attempts[index]) return;

        const dateInput = item.querySelector('.attempt-date').value;
        const timeMinutes = parseInt(item.querySelector('.attempt-time').value) || 0;

        currentProblem.attempts[index].date = new Date(dateInput).toISOString();
        currentProblem.attempts[index].time = timeMinutes * 60; // Convert to seconds
        // Confidence will be auto-calculated in recalculation
    });

    // Recalculate entire problem using SRS engine
    const recalculated = SRSEngine.recalculateProblem(currentProblem, settings, allProblems);

    // Update in storage
    allProblems[currentProblemIndex] = recalculated;
    await chrome.storage.local.set({ problems: allProblems });

    alert('✅ Changes saved and recalculated using SRS algorithm!');

    // Reload to show updated stats
    currentProblem = recalculated;
    updateStatsDisplay();
    renderAttempts();
});

// Cancel
document.getElementById('cancel-btn').addEventListener('click', () => {
    if (!confirm('Discard changes?')) return;

    // Reload original data
    if (currentProblemIndex >= 0) {
        loadProblem(currentProblemIndex);
    }
});

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
}

// Initialize
loadData();