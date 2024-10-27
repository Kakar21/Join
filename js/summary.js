let summaryData = {};


/**
 * Initializes the summary.html
 */
async function initSummary() {
    if (window.matchMedia("(max-width: 1000px)").matches) {
        await playGreetingAni();
    }
    await getSummaryData();
    renderSummaryBoard();
    renderSummaryGreeting();
}


/**
 * Replaces the numbers and "urgent"/deadline box
 */
function renderSummaryBoard() {
    document.getElementById('toDoNum').innerHTML = summaryData['todo_count'];
    document.getElementById('doneNum').innerHTML = summaryData['done_count'];
    document.getElementById('urgentNum').innerHTML = summaryData['urgent_count'];
    document.getElementById('deadlineDate').innerHTML = summaryData['next_deadline'] || 'No upcoming deadlines';
    document.getElementById('tasksNum').innerHTML = summaryData['tasks_count'];
    document.getElementById('inProgressNum').innerHTML = summaryData['in_progress_count'];
    document.getElementById('awaitFeedbackNum').innerHTML = summaryData['awaiting_feedback_count'];
}


/**
 * Gets the daytime and displays a daytime specific greeting with the username or guest
 */
function renderSummaryGreeting() {
    let greet = document.getElementById('greeting');

    let time = new Date();
    time = time.getHours();

    if (time < 12 && time > 4) {
        greet.firstElementChild.innerHTML = 'Good morning,';
    } else if (time < 18 && time > 12) {
        greet.firstElementChild.innerHTML = 'Good afternoon,';
    } else if (time < 24 || time < 4) {
        greet.firstElementChild.innerHTML = 'Good evening,';
    };
    loadUserGreeting(greet);
}


/**
 * Displays the name of the registered user in the greeting or leaves it blank
 * 
 * @param {element} greet - Greeting DOM HTML Element
 */
async function loadUserGreeting(greet) {
    let nameElement = greet.lastElementChild;
    let timeElement = greet.firstElementChild;
    try {
        if (!currentUser['username']) {
            nameElement.remove();
            timeElement.innerHTML = timeElement.innerHTML.slice(0, -1);
        } else {
            nameElement.innerHTML = currentUser['username'];
        };
    } catch (e) {
        console.error("Loading error:", e);
    };
}


/**
 * Plays the greeting animations and then disappears
 */
async function playGreetingAni() {
    let animationPlayed = await localStorage.getItem("greetingAniPlayed");
    let greeting = document.getElementById('greeting').parentNode;
    if (!animationPlayed) {
        greeting.firstElementChild.firstElementChild.innerHTML = 'Good day';
        greeting.classList.remove('d-none');
        setTimeout(function () {
            greeting.classList.add('d-none');
        }, 1600);
        localStorage.setItem("greetingAniPlayed", "true");
    } else {
        greeting.classList.add('d-none');
    };
}


/**
 * Sorts Dates from closest to farthest and formats it in 'month DD, YYYY'
 * 
 * @param {array} dates - Array with all dates of tasks seperated
 * @returns - formatted closest date to today
 */
function sortDates(dates) {
    dates.sort((a, b) => convertToDate(a) - convertToDate(b));

    let options = { month: 'long', day: 'numeric', year: 'numeric' };
    return convertToDate(dates[0]).toLocaleDateString('en-US', options);
}


/**
 * Formats date to be compatible with javascript date methods
 * 
 * @param {string} dateString - date as a string
 * @returns formatted date
 */
function convertToDate(dateString) {
    let [day, month, year] = dateString.split('/');
    return new Date(`${year}-${month}-${day}`);
}