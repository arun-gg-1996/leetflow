# 🎯 LeetCode Spaced Repetition Tracker

A Chrome extension that helps you master LeetCode problems using **spaced repetition** — a scientifically-proven
learning technique that optimizes long-term retention.

![Extension Preview](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome&logoColor=white)
![Version](https://img.shields.io/badge/version-1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

### 🧠 **Intelligent Spaced Repetition System (SRS)**

- **Exponential scheduling**: Problems are reviewed at increasing intervals based on your confidence
- **Smart load balancing**: Automatically spreads reviews across study days to prevent overload
- **Leech detection**: Identifies problems you're struggling with (🩸 tag)
- **Adaptive stages**: 9 progression stages (0-8) with customizable growth factors

### ⏱️ **Time Tracking & Analytics**

- **On-page timer widget**: Tracks solve time for every problem
- **Draggable widget**: Move anywhere on screen, position saves automatically
- **Adjustable opacity**: 20-100% transparency slider for minimal distraction
- **Auto-confidence suggestions**: Pre-selects confidence level based on your solve time
- **Performance analytics**: View fastest/slowest solves, average times, and trends
- **Submission history**: Complete log of all attempts with timestamps

### 📊 **Progress Dashboard**

- **Visual charts**: See your submission patterns over time (Chart.js)
- **Topic analysis**: Identify strong/weak areas by topic and pattern
- **Review forecast**: See upcoming reviews for today, this week, and this month
- **Daily breakdown**: Detailed calendar view of scheduled reviews

### 🎨 **Customizable Workflow**

- **Phase-based filtering**: Organize problems into learning phases
- **Multi-filter system**: Filter by difficulty, topic, status, and search by name
- **Study schedule**: Choose which days of the week you want to study
- **Configurable thresholds**: Adjust SRS parameters to match your learning style

### 💾 **Data Management**

- **Export/Import**: Backup and restore your progress as JSON files
- **Undo feature**: Reverse accidental submissions (5-minute window)
- **Soft reset**: Reschedule overdue reviews without losing progress
- **Hard reset**: Start fresh while keeping your problem list

---

## 📥 Installation

### **Method 1: Load Unpacked Extension (Recommended for Users)**

1. **Download the extension files**
    - Clone this repository or download as ZIP
   ```bash
   git clone https://github.com/yourusername/leetcode-tracker.git
   ```

2. **Open Chrome Extensions page**
    - Navigate to `chrome://extensions/`
    - Or click **Menu (⋮) → More Tools → Extensions**

3. **Enable Developer Mode**
    - Toggle the **Developer mode** switch in the top-right corner

4. **Load the extension**
    - Click **Load unpacked**
    - Select the `leetcode_extension` folder (the folder containing `manifest.json`)

5. **Verify installation**
    - You should see "My LeetCode Tracker" in your extensions list
    - The extension icon should appear in your Chrome toolbar

6. **Pin the extension** *(Optional but recommended)*
    - Click the puzzle piece icon (🧩) in Chrome toolbar
    - Find "My LeetCode Tracker" and click the pin icon

---

## ⚙️ Initial Setup

### **Step 1: Configure Your Problem List**

The extension pulls problems from a Google Sheet. You have two options:

#### **Option A: Use the Sample Sheet (Recommended for Beginners)**

1. **Open Settings**
    - Click the extension icon → Click **⚙️ Settings**

2. **Access the sample sheet**
    - Click the blue **"sample sheet"** link in the "Problem List Source" section
    - This will
      open: [Sample LeetCode Problem List](https://docs.google.com/spreadsheets/d/1pGW3xFPvF4BU9hV5V2R_G9bLsm9nNlQzLKBCvuHzqKk/edit?usp=sharing)

3. **Make a copy**
    - Click **File → Make a copy**
    - This creates your own editable version

4. **Publish your copy to the web**
    - In your copy, click **File → Share → Publish to web**
    - Under "Link", select **Entire Document**
    - Under "Published content & settings", select **Comma-separated values (.csv)**
    - Click **Publish**
    - Copy the generated URL (it will look like `https://docs.google.com/spreadsheets/d/e/2PACX-...`)

5. **Add URL to extension**
    - Paste the URL into the **Google Sheet URL** field in Settings
    - Click **💾 Save Settings**

6. **Load problems**
    - Click the extension icon
    - Click **🔄 Refresh List**
    - You should now see all problems from your sheet!

#### **Option B: Create Your Own Sheet**

1. **Create a new Google Sheet** with these exact column names (case-insensitive):

   | url | title | difficulty | topic | pattern | phase |
         |-----|-------|------------|-------|---------|-------|
   | https://leetcode.com/problems/two-sum/ | Two Sum | Easy | Array | Basic Operations | PHASE 1 |
   | https://leetcode.com/problems/add-two-numbers/ | Add Two Numbers | Medium | Linked List | Traversal | PHASE 1 |

   **Required columns:**
    - `url`: Full LeetCode problem URL
    - `title`: Problem name
    - `difficulty`: Easy, Medium, or Hard
    - `topic`: Main topic (e.g., "Array", "Graph")
    - `pattern`: Specific pattern (e.g., "Two Pointers", "BFS")
    - `phase`: Learning phase (e.g., "PHASE 1", "PHASE 2")

2. **Follow steps 4-6 from Option A** to publish and connect your sheet

---

### **Step 2: Customize Your Settings**

#### **📚 Spaced Repetition Parameters**

Navigate to **Settings** to configure:

1. **Growth Factor** (how quickly intervals increase)
    - **Conservative (1.5x)**: Review more frequently — better retention
    - **Balanced (1.7x)**: Middle ground
    - **Aggressive (2.0x)**: Review less often — cover more problems faster

   *Example*: Problem intervals with 2.0x growth: 1 day → 2 days → 4 days → 8 days → 16 days

2. **Maximum Review Interval**
    - Longest time between reviews (default: 40 days)
    - Even mastered problems will be reviewed at least once every X days
    - *Recommended: 30-40 days*

3. **Starting Interval**
    - How soon you review after first solving (default: 1 day)
    - *1 day = review tomorrow (best for retention)*
    - *3 days = if you're very confident*

4. **Leech Threshold**
    - Number of "Low" confidence failures before marking as 🩸 Leech
    - *Recommended: 3-5 failures*

5. **Max Reviews Per Day**
    - Prevents overload by spreading reviews across days
    - *Recommended: 10-20 problems*

#### **⏱️ Time-Based Confidence Suggestions**

Set time thresholds (in minutes) for each difficulty level:

| Difficulty | Mastered | High     | Medium   | Low     |
|------------|----------|----------|----------|---------|
| Easy       | < 5 min  | < 15 min | < 30 min | 30+ min |
| Medium     | < 10 min | < 25 min | < 45 min | 45+ min |
| Hard       | < 20 min | < 40 min | < 60 min | 60+ min |

When you submit a problem, the extension will **auto-suggest** a confidence level based on how long you took!

#### **📅 Study Schedule**

- Check the days you want to study
- Reviews will only be scheduled on selected days
- ⚠️ Must select at least one day

---

## 🚀 Usage Guide

### **On LeetCode Problem Pages**

When you open any LeetCode problem, you'll see a **Practice Tracker widget** (default: bottom-right corner):

**Using the Widget:**

1. **Click "Start"** when you begin solving
2. **Timer runs** — you can pause/resume anytime
3. **Click "Submit"** when you finish
4. **Select confidence level**:
    - **Mastered**: Solved easily, no help needed
    - **High**: Solved with minor issues
    - **Medium**: Needed hints or struggled
    - **Low**: Couldn't solve or heavily relied on solutions

**Customizing the Widget:**

- **Move**: Click and drag the header to any position (saves automatically)
- **Adjust opacity**: Use the slider at the bottom (20-100% transparency)
- Both settings persist across pages

The extension will:

- ✅ Save your solve time
- ✅ Update your SRS stage
- ✅ Schedule the next review date
- ✅ Track this attempt in your history

### **In the Extension Popup**

Click the extension icon to:

#### **Filter Problems**

- **By Phase**: Toggle checkboxes to show/hide learning phases
- **By Difficulty**: Select Easy, Medium, Hard, or All
- **By Topic**: Filter by specific topics from your sheet
- **By Status**: Show all, due reviews, not started, or solved
- **By Name**: Search for specific problems

#### **View Problem Details**

Each problem shows:

- 🏷️ **Tags**: Difficulty, Topic > Pattern, Phase
- 🎯 **Stage**: Current SRS stage (0-8)
- 🩸 **Leech**: If you're struggling with it
- 📅 **Review Date**: When it's next due (red if overdue)
- 🔵 **Last Confidence**: Your last submission rating

#### **Quick Actions**

- **Click a problem** → Opens in new background tab
- **⚙️ Settings** → Configure all parameters
- **📊 Dashboard** → View analytics and stats
- **🔄 Refresh List** → Reload problems from Google Sheet

---

### **On the Dashboard**

Access via **📊 Dashboard** button to see:

#### **📈 Submissions Over Time**

- Line chart showing your problem-solving activity
- Tracks submissions by date

#### **💪 Strong Areas**

- Top topics by "Mastered" count
- Top patterns by "Mastered" count

#### **🧠 Weak Areas**

- Topics with most "Low" confidence submissions
- Patterns you're struggling with

#### **📅 Upcoming Reviews**

- **Total Due**: All problems needing review
- **Due Today**: What you should do today
- **Next 7 Days**: This week's workload
- **Next 30 Days**: Monthly overview
- **Daily Breakdown**: Calendar view of scheduled reviews

#### **⏱️ Time Statistics**

- **Average solve times** by difficulty
- **Fastest solves** (your speed records)
- **Slowest solves** (problems that took longest)
- **Monthly trends** (getting faster over time?)
- **Weekly trends** (this week vs last week)

---

## 🔄 Spaced Repetition Logic

### **How Confidence Levels Affect Scheduling**

| Confidence   | Effect                       | Next Review              |
|--------------|------------------------------|--------------------------|
| **Mastered** | ✅ Advance 1 stage            | Longer interval          |
| **High**     | ✅ Advance 1 stage            | Longer interval          |
| **Medium**   | ⏸️ Stay same or drop 1 stage | Similar/shorter interval |
| **Low**      | ⬇️ Reset to stage 1          | Review sooner (1 day)    |

### **Stage Progression Example**

Assuming **2.0x growth factor** and **1 day starting interval**:

| Stage | Interval         | Total Days Since Start |
|-------|------------------|------------------------|
| 0     | New problem      | 0                      |
| 1     | 1 day            | 1                      |
| 2     | 2 days           | 3                      |
| 3     | 4 days           | 7                      |
| 4     | 8 days           | 15                     |
| 5     | 16 days          | 31                     |
| 6     | 32 days          | 63                     |
| 7     | 40 days (capped) | 103                    |
| 8     | 40 days (capped) | 143                    |

### **Leech System**

A problem becomes a **🩸 Leech** when:

- You've submitted "Low" confidence ≥ threshold times (default: 3)
- AND you're still below Stage 3

**Leech forgiveness**: After 3 consecutive "High" or "Mastered" submissions, the leech counter resets!

### **Smart Load Balancing**

When scheduling reviews, the extension:

1. Calculates the ideal review date based on SRS stage
2. Checks if that day already has too many reviews (> max per day)
3. If overloaded, shifts to the next available day
4. Only schedules on your selected study days

This prevents "review avalanches" and keeps your workload manageable!

---

## 📝 Smart Problem Editor

### **What is it?**

The Smart Problem Editor lets you manually update problem progress when the timer widget fails or you need to fix
mistakes. It's **intelligent** — you only edit what matters (time), and everything else is automatically recalculated
using the same SRS algorithm.

### **How to Access**

- From **⚙️ Settings** → Click **📝 Problem Editor** button (top right)
- From **Extension Popup** → Click **📝 Edit** link (header)

### **What You Can Edit**

1. ✅ **Time** for each attempt (in minutes, clearly labeled)
2. ✅ **Date/timestamp** of each attempt
3. ✅ **Delete** individual attempts
4. ✅ **Add** new attempts manually
5. ✅ **Reset** problem to "Not Started" (deletes all progress)

### **What's Auto-Calculated**

When you click **"Save & Recalculate"**, the editor automatically computes:

- ✅ **Confidence level** (based on time + difficulty + your time thresholds)
- ✅ **SRS Stage** (replays all attempts through SRS algorithm)
- ✅ **Next Review Date** (with load balancing)
- ✅ **Lapses** (number of failures)
- ✅ **Consecutive Successes** (for leech forgiveness)
- ✅ **Leech Status** (🩸 tag)

### **Usage Examples**

#### **Scenario 1: Timer Widget Failed**

You started a problem but the timer didn't work properly:

1. Open the editor and search for the problem
2. Click **"+ Add New Attempt"**
3. Enter the time you actually spent (e.g., "25" minutes)
4. Watch the confidence automatically update (e.g., "MEDIUM")
5. Click **"Save & Recalculate"**
6. ✅ Everything recalculated correctly!

#### **Scenario 2: Logged Wrong Time**

You accidentally submitted with the wrong time:

1. Search for the problem
2. Find the attempt with the incorrect time
3. Change "5" to "45" minutes
4. Watch confidence change from "MASTERED" to "LOW" (live preview!)
5. Click **"Save & Recalculate"**
6. ✅ SRS stage, lapses, review date all updated automatically

#### **Scenario 3: Accidental Submission**

You submitted by mistake or want to remove an attempt:

1. Find the problem
2. Click the **✕** button on the wrong attempt
3. Click **"Save & Recalculate"**
4. ✅ Problem recalculated as if that attempt never happened

### **How It Works**

The editor uses **event sourcing** — it treats your attempts as a sequence of events:

1. Takes all your attempts with their times
2. Auto-calculates confidence for each based on time thresholds
3. Replays them **in order** through the SRS algorithm
4. Arrives at the correct final state

This guarantees **100% consistency** between the editor and the timer widget — they use the exact same code!

### **Live Preview**

As you type a time value, the confidence level updates **instantly** so you can see what will happen before you save:

- Type "10" min on an Easy problem → Shows "MASTERED"
- Type "35" min on an Easy problem → Shows "LOW"

No guessing needed!

---

## 💾 Data Management

### **Export Your Progress**

1. Go to **⚙️ Settings → 💾 Data Management**
2. Click **📥 Export Progress**
3. Saves `leetcode-tracker-backup-YYYY-MM-DD.json` to your Downloads

**Export before**:

- Resetting progress
- Switching computers
- Major setting changes
- Reinstalling the extension

### **Import a Backup**

1. Go to **⚙️ Settings → 💾 Data Management**
2. Click **📤 Import Progress**
3. Select your backup JSON file
4. ⚠️ **Warning**: This replaces ALL current data

### **Undo Last Submission**

Made a mistake? Click **↩️ Undo Last Submission** in Settings within **5 minutes** to reverse it!

### **Reschedule Overdue Reviews (Soft Reset)**

If you have too many overdue problems piled up:

1. Go to **⚙️ Settings → 💾 Data Management**
2. Click **🔄 Reschedule All Due Items**
3. Confirms before spreading them over the next 2-3 days
4. ✅ Your progress (stages, stats) stays intact

### **Reset All Progress (Hard Reset)**

**⚠️ NUCLEAR OPTION** — Start completely fresh:

1. Go to **⚙️ Settings → 💾 Data Management**
2. Click **⚠️ Reset All Progress**
3. Click again to confirm (within 5 seconds)
4. Final warning dialog
5. ❌ Erases ALL submissions, stages, and history

**ALWAYS export a backup first!**

---

## 🛠️ Troubleshooting

### **"No problems found" in popup**

**Solution**:

1. Check that your Google Sheet URL is set in Settings
2. Make sure you published the sheet as CSV (not HTML)
3. Click **🔄 Refresh List** in the popup
4. Check browser console for errors (`F12` → Console tab)

### **"Failed to fetch from Google Sheet" error**

**Causes**:

- Sheet URL is incorrect
- Sheet is not published to web
- Sheet columns are missing or misspelled
- Network connection issue

**Solution**:

1. Re-publish your Google Sheet to web as CSV
2. Copy the new URL
3. Update in Settings
4. Click Refresh List

### **Widget not showing on LeetCode**

**Solution**:

1. Make sure you're on a problem page (`leetcode.com/problems/...`)
2. Refresh the LeetCode page
3. Check if the extension is enabled in `chrome://extensions/`
4. Reload the extension

### **Emojis showing as boxes or question marks**

**Solution**:

1. Update Chrome to the latest version
2. The updated `popup.html` includes emoji font fixes
3. Clear browser cache and reload extension

### **Timer keeps resetting**

This happens when navigating between tabs on the same problem (e.g., Description → Solutions). This is intentional to
prevent confusion.

**Workaround**: Stay on one tab while solving.

### **Reviews not scheduling on my study days**

**Check**:

1. Go to Settings → Study Schedule
2. Make sure at least one day is checked
3. If all days are unchecked, the extension defaults to all days

---

## 📂 File Structure

```
leetcode_extension/
├── manifest.json          # Extension configuration
├── srsEngine.js           # Shared SRS calculation logic (NEW)
├── background.js          # Service worker (uses srsEngine.js)
├── contentScript.js       # Timer widget injected on LeetCode pages
├── popup.html             # Extension popup UI
├── popup.js               # Popup logic (filtering, rendering)
├── settings.html          # Settings page UI
├── settings.js            # Settings logic (save/load, reset)
├── editor.html            # Smart problem editor UI (NEW)
├── editor.js              # Editor logic (uses srsEngine.js) (NEW)
├── dashboard.html         # Analytics dashboard UI
├── dashboard.js           # Dashboard logic (charts, stats)
├── style.css              # Unified styles
├── chart.min.js           # Chart.js library (for graphs)
└── icon.png               # Extension icon
```

---

## 🔐 Privacy & Permissions

### **Permissions Required**

- `storage`: Save your progress locally in Chrome
- `https://docs.google.com/*`: Fetch your problem list from Google Sheets
- `https://leetcode.com/problems/*`: Inject timer widget on problem pages

### **Data Storage**

- **All data is stored locally** in your browser's Chrome storage
- **Nothing is sent to external servers** (except fetching your Google Sheet)
- **No tracking or analytics** — your data is 100% private
- **No account required** — works completely offline after initial sheet fetch

---

## 🤝 Contributing

Contributions are welcome! Here are some ideas:

- [ ] Add keyboard shortcuts for confidence selection
- [ ] Dark mode support
- [ ] Sync across devices (using Chrome Sync)
- [ ] Export to Anki flashcards
- [ ] Mobile app version
- [ ] Support for other competitive programming sites (Codeforces, HackerRank)

### **How to Contribute**

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Spaced Repetition Algorithm** inspired by [Anki](https://apps.ankiweb.net/)
- **Chart.js** for beautiful graphs
- **LeetCode** for the amazing platform
- **Google Sheets** for free, easy data hosting

---

## 📧 Support

If you encounter issues:

1. Check the **Troubleshooting** section above
2. Open an issue on GitHub with:
    - Browser version
    - Extension version
    - Steps to reproduce
    - Error messages (from `F12` Console)

---

## 🌟 Star This Project

If this extension helped you ace your coding interviews, please ⭐ star this repository!

---

**Happy coding! 🚀**

*Master LeetCode one spaced repetition at a time.*