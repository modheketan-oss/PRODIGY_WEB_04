const hoursDisplay = document.getElementById('hours');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const millisecondsDisplay = document.getElementById('milliseconds');

const startBtn = document.getElementById('startBtn');
const lapBtn = document.getElementById('lapBtn');
const resetBtn = document.getElementById('resetBtn');

const lapsContainer = document.getElementById('lapsContainer');
const lapsList = document.getElementById('lapsList');

let isRunning = false;
let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let laps = [];
let lastLapTime = 0;

function formatTime(ms) {
    let hours = Math.floor(ms / 3600000);
    let minutes = Math.floor((ms % 3600000) / 60000);
    let seconds = Math.floor((ms % 60000) / 1000);
    let milliseconds = Math.floor((ms % 1000) / 10);

    return {
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0'),
        milliseconds: milliseconds.toString().padStart(2, '0')
    };
}

function updateDisplay() {
    let time = formatTime(elapsedTime);
    hoursDisplay.textContent = time.hours;
    minutesDisplay.textContent = time.minutes;
    secondsDisplay.textContent = time.seconds;
    millisecondsDisplay.textContent = time.milliseconds;
}

function startTimer() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(function () {
        elapsedTime = Date.now() - startTime;
        updateDisplay();
    }, 10);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function toggleStartPause() {
    if (isRunning) {
        stopTimer();
        startBtn.textContent = 'Start';
        startBtn.classList.remove('running');
        lapBtn.disabled = true;
    } else {
        startTimer();
        startBtn.textContent = 'Pause';
        startBtn.classList.add('running');
        lapBtn.disabled = false;
        resetBtn.disabled = false;
    }
    isRunning = !isRunning;
}

function reset() {
    stopTimer();
    isRunning = false;
    elapsedTime = 0;
    lastLapTime = 0;
    laps = [];

    updateDisplay();

    startBtn.textContent = 'Start';
    startBtn.classList.remove('running');
    lapBtn.disabled = true;
    resetBtn.disabled = true;

    lapsList.innerHTML = '';
    lapsContainer.classList.remove('show');
}

function recordLap() {
    if (!isRunning) return;

    let lapTime = elapsedTime;
    let lapDiff = lapTime - lastLapTime;
    lastLapTime = lapTime;

    laps.push({
        number: laps.length + 1,
        time: lapTime,
        diff: lapDiff
    });

    updateLapsList();
    lapsContainer.classList.add('show');
}

function updateLapsList() {
    lapsList.innerHTML = '';

    let fastestIndex = -1;
    let slowestIndex = -1;

    if (laps.length > 1) {
        let minDiff = Infinity;
        let maxDiff = 0;

        laps.forEach(function (lap, index) {
            if (lap.diff < minDiff) {
                minDiff = lap.diff;
                fastestIndex = index;
            }
            if (lap.diff > maxDiff) {
                maxDiff = lap.diff;
                slowestIndex = index;
            }
        });
    }

    for (let i = laps.length - 1; i >= 0; i--) {
        let lap = laps[i];
        let li = document.createElement('li');

        if (laps.length > 1) {
            if (i === fastestIndex) {
                li.classList.add('fastest');
            } else if (i === slowestIndex) {
                li.classList.add('slowest');
            }
        }

        let lapTimeFormatted = formatTimeString(lap.time);
        let lapDiffFormatted = formatTimeString(lap.diff);

        li.innerHTML =
            '<span class="lap-number">Lap ' + lap.number + '</span>' +
            '<span class="lap-diff">+' + lapDiffFormatted + '</span>' +
            '<span class="lap-time">' + lapTimeFormatted + '</span>';

        lapsList.appendChild(li);
    }
}

function formatTimeString(ms) {
    let time = formatTime(ms);

    if (parseInt(time.hours) > 0) {
        return time.hours + ':' + time.minutes + ':' + time.seconds + '.' + time.milliseconds;
    } else if (parseInt(time.minutes) > 0) {
        return time.minutes + ':' + time.seconds + '.' + time.milliseconds;
    } else {
        return time.seconds + '.' + time.milliseconds;
    }
}

startBtn.addEventListener('click', toggleStartPause);
lapBtn.addEventListener('click', recordLap);
resetBtn.addEventListener('click', reset);

document.addEventListener('keydown', function (e) {
    if (e.code === 'Space') {
        e.preventDefault();
        toggleStartPause();
    } else if (e.code === 'KeyL') {
        if (isRunning) {
            recordLap();
        }
    } else if (e.code === 'KeyR') {
        reset();
    }
});

updateDisplay();