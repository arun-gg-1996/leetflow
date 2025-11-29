// Shared SRS calculation engine
// Used by both background.js and editor.js to ensure consistent behavior

const SRSEngine = {
    // Calculate confidence based on time and difficulty
    suggestConfidence(timeSeconds, difficulty, settings) {
        if (!settings?.timeThresholds) return 'medium';

        const diff = difficulty.toLowerCase();
        const timeMin = timeSeconds / 60;
        const th = settings.timeThresholds[diff];

        if (!th) return 'medium';

        if (timeMin < th.mastered) return 'mastered';
        if (timeMin < th.high) return 'high';
        if (timeMin < th.medium) return 'medium';
        return 'low';
    },

    // Calculate new SRS stage based on confidence
    calculateNewStage(currentStage, confidence, settings) {
        let newStage = currentStage || 0;

        if (confidence === 'low') {
            newStage = 1;
        } else if (confidence === 'medium') {
            if (newStage === 0) {
                newStage = 1;
            } else if (newStage >= 2) {
                newStage = newStage - 1;
            }
        } else { // high or mastered
            newStage = Math.min(newStage + 1, settings.maxStage);
        }

        return newStage;
    },

    // Get next review date on a study day
    getNextReviewDate(daysFromNow, studyDays) {
        const hasStudyDays = studyDays.some(day => day === 1);

        if (!hasStudyDays) {
            studyDays = [1, 1, 1, 1, 1, 1, 1];
        }

        let date = new Date();
        date.setDate(date.getDate() + daysFromNow);

        let attempts = 0;
        while (!studyDays[date.getDay()] && attempts < 14) {
            date.setDate(date.getDate() + 1);
            attempts++;
        }

        return date.toISOString().split('T')[0];
    },

    // Find next available review date with load balancing
    findAvailableReviewDate(intervalDays, studyDays, allProblems, currentProblemUrl, maxDailyReviews) {
        const normalizeUrl = (url) => url.replace(/\/$/, '');
        let attempts = 0;
        let foundSlot = false;
        let candidateDate = null;

        while (attempts < 14 && !foundSlot) {
            candidateDate = this.getNextReviewDate(intervalDays + attempts, studyDays);

            const candidateDayOfWeek = new Date(candidateDate + 'T00:00:00').getDay();
            if (!studyDays[candidateDayOfWeek]) {
                attempts++;
                continue;
            }

            const reviewsOnDate = allProblems.filter(p =>
                p.nextReviewDate === candidateDate &&
                normalizeUrl(p.url) !== normalizeUrl(currentProblemUrl)
            ).length;

            if (reviewsOnDate < maxDailyReviews) {
                foundSlot = true;
            } else {
                attempts++;
            }
        }

        if (!foundSlot) {
            candidateDate = this.getNextReviewDate(
                intervalDays + Math.floor(Math.random() * 3),
                studyDays
            );
        }

        return candidateDate;
    },

    // Process a single attempt and return updated problem state
    processAttempt(problem, attempt, settings, allProblems) {
        const confidence = attempt.confidence;

        // Update status
        problem.status = 'Solved';

        // Calculate new stage
        const oldStage = problem.srsStage || 0;
        const newStage = this.calculateNewStage(oldStage, confidence, settings);

        // Update lapses and consecutive successes
        if (confidence === 'low') {
            if (problem.attempts && problem.attempts.length > 0) {
                problem.lapses = (problem.lapses || 0) + 1;
            }
            problem.consecutiveSuccesses = 0;
        } else if (confidence === 'medium') {
            problem.consecutiveSuccesses = 0;
        } else { // high or mastered
            problem.consecutiveSuccesses = (problem.consecutiveSuccesses || 0) + 1;

            if (problem.consecutiveSuccesses >= 3) {
                problem.lapses = 0;
                problem.consecutiveSuccesses = 0;
            }
        }

        // Calculate interval
        const exponentialInterval = settings.baseInterval * Math.pow(settings.growthFactor, newStage);
        const cappedInterval = Math.min(exponentialInterval, settings.maxInterval);
        const intervalDays = Math.round(cappedInterval);

        // Find available review date
        const nextDate = this.findAvailableReviewDate(
            intervalDays,
            settings.studyDays,
            allProblems,
            problem.url,
            settings.maxDailyReviews || 15
        );

        // Update problem
        problem.srsStage = newStage;
        problem.nextReviewDate = nextDate;
        problem.lastConfidence = confidence;
        problem.isLeech = (problem.lapses >= settings.leechThreshold && problem.srsStage < 3);

        // Update attempt with calculated values
        attempt.stage = newStage;
        attempt.interval = intervalDays;

        return problem;
    },

    // Recalculate entire problem from scratch by replaying all attempts
    recalculateProblem(problem, settings, allProblems) {
        // Reset to clean state
        const cleanProblem = {
            ...problem,
            status: 'Not Started',
            srsStage: 0,
            lapses: 0,
            consecutiveSuccesses: 0,
            isLeech: false,
            lastConfidence: null,
            nextReviewDate: null
        };

        // Replay each attempt in order
        const attempts = problem.attempts || [];
        for (let i = 0; i < attempts.length; i++) {
            const attempt = attempts[i];

            // Auto-calculate confidence from time if not set
            if (!attempt.confidence && attempt.time !== undefined && problem.difficulty) {
                attempt.confidence = this.suggestConfidence(
                    attempt.time,
                    problem.difficulty,
                    settings
                );
            }

            // Process this attempt
            this.processAttempt(cleanProblem, attempt, settings, allProblems);
        }

        return cleanProblem;
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SRSEngine;
}