const gameContainer = document.getElementById('game-container');
const restartButton = document.getElementById('restart');

let events = [];
let currentIndex = 0;
let gameOver = false;

async function fetchEventData() {
    const response = await fetch('eventData.json');
    return await response.json();
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createEventButton(event, year) {
    const button = document.createElement('button');
    button.classList.add('event-button');
    button.textContent = event;
    button.onclick = async function () {
        if (gameOver) return;

        console.log('Clicked:', event, year); // Log the clicked event and year
        console.log('Expected:', events[currentIndex].event, events[currentIndex].year); // Log the expected event and year

        if (parseInt(year) === parseInt(events[currentIndex].year)) {
            button.style.backgroundColor = 'green';
            currentIndex++;
            if (currentIndex === events.length) {
                alert('You won!');
                await restartGame();
            }
        } else {
            button.style.backgroundColor = 'red';
            alert(`Game over! The correct answer was ${events[currentIndex].event} (${events[currentIndex].year})`);
            gameOver = true;
        }
    };
    return button;
}

function pickRandomEvents(eventData, count) {
    shuffle(eventData);
    return eventData.slice(0, count);
}

async function restartGame() {
    gameContainer.innerHTML = '';
    currentIndex = 0;
    gameOver = false;
    const allEventData = await fetchEventData();
    events = pickRandomEvents(allEventData, 6);
    events.sort((a, b) => parseInt(a.year) - parseInt(b.year));

    console.log('Events:', events.map(e => `${e.event} (${e.year})`)); // Log the events with their years

    const firstEventButton = createEventButton(events[0].event, events[0].year);
    firstEventButton.style.backgroundColor = 'green';
    firstEventButton.textContent += ` (${events[0].year})`;
    firstEventButton.disabled = true;

    const displayEvents = events.slice(1);
    shuffle(displayEvents);
    displayEvents.forEach(event => {
        const button = createEventButton(event.event, event.year);
        gameContainer.appendChild(button);
    });

    gameContainer.prepend(firstEventButton);
    currentIndex++;
}

restartButton.onclick = async function() {
    await restartGame();
};

restartGame();
