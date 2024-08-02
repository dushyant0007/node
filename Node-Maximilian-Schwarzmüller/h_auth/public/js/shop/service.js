const calendar = document.getElementById('calendar');
const bookingForm = document.getElementById('booking-form');
const selectedDatesList = document.getElementById('selected-dates');
const currentMonthYearElement = document.getElementById('current-month-year');
const prevMonthButton = document.getElementById('prev-month');
const nextMonthButton = document.getElementById('next-month');
const resetButton = document.createElement('button');
resetButton.textContent = 'Reset to Current Month';
resetButton.id = 'reset-month';
document.querySelector('#calendar-container').insertBefore(resetButton, calendar);

let currentDate = new Date();
let displayedMonth = currentDate.getMonth();
let displayedYear = currentDate.getFullYear();
let selectedDates = [];
let bookedDates = [];
let busyDates = [];
let serviceId = '';

async function fetchDates() {
    try {
        serviceId = document.querySelector('[name="serviceId"]').value
        const response = await fetch(`/shop/services/${serviceId}/dates`);
        const data = await response.json();
        bookedDates = data.booked || [];
        busyDates = data.busy || [];
    } catch (error) {
        console.error('Error fetching dates:', error);
    }
}

async function generateCalendar() {
    await fetchDates();

    calendar.innerHTML = '';
    const firstDay = new Date(displayedYear, displayedMonth, 1).getDay();
    const daysInMonth = new Date(displayedYear, displayedMonth + 1, 0).getDate();

    currentMonthYearElement.textContent = `${new Date(displayedYear, displayedMonth).toLocaleString('default', { month: 'long' })} ${displayedYear}`;

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        calendar.appendChild(emptyDay);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        dayElement.textContent = i;

        const currentDateObj = new Date(displayedYear, displayedMonth, i);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const sixMonthsLater = new Date(currentDate);
        sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

        const dateString = currentDateObj.toISOString().split('T')[0];

        if (currentDateObj < today) {
            dayElement.classList.add('past');
        } else if (currentDateObj >= sixMonthsLater) {
            dayElement.classList.add('future');
        } else {
            dayElement.onclick = () => toggleDateSelection(i);

            if (bookedDates.includes(dateString)) {
                dayElement.classList.add('booked');
            } else if (busyDates.includes(dateString)) {
                dayElement.classList.add('busy');
            } else {
                dayElement.classList.add('available');
            }
        }

        calendar.appendChild(dayElement);
    }

    updateButtonStates();
}

function toggleDateSelection(day) {
    const dayElement = event.target;
    if (dayElement.classList.contains('booked') || dayElement.classList.contains('busy') || dayElement.classList.contains('past') || dayElement.classList.contains('future')) {
        return; // Cannot select booked, busy, past, or future dates
    }

    const selectedDate = new Date(displayedYear, displayedMonth, day);
    const dateString = selectedDate.toISOString().split('T')[0];
    const index = selectedDates.indexOf(dateString);

    if (index > -1) {
        selectedDates.splice(index, 1);
        dayElement.classList.remove('selected');
    } else {
        selectedDates.push(dateString);
        dayElement.classList.add('selected');
    }

    updateSelectedDates();
}

function updateSelectedDates() {
    selectedDatesList.innerHTML = '';
    selectedDates.sort().forEach(date => {
        const li = document.createElement('li');
        li.textContent = date;
        selectedDatesList.appendChild(li);
    });

    bookingForm.style.display = selectedDates.length > 0 ? 'block' : 'none';
}

function bookDates() {

    fetch('/shop/services/book', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ serviceId, dates: selectedDates }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        selectedDates = [];
        updateSelectedDates();
        generateCalendar();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while booking.');
    });
}

function changeMonth(delta) {
    const newDate = new Date(displayedYear, displayedMonth + delta, 1);
    const sixMonthsLater = new Date(currentDate);
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 5);

    if (newDate >= currentDate && newDate <= sixMonthsLater) {
        displayedMonth += delta;
        if (displayedMonth > 11) {
            displayedMonth = 0;
            displayedYear++;
        } else if (displayedMonth < 0) {
            displayedMonth = 11;
            displayedYear--;
        }
        generateCalendar();
    }
}

function resetToCurrentMonth() {
    displayedMonth = currentDate.getMonth();
    displayedYear = currentDate.getFullYear();
    generateCalendar();
}

function updateButtonStates() {
    const currentDisplayDate = new Date(displayedYear, displayedMonth, 1);
    const sixMonthsLater = new Date(currentDate);
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 5);

    prevMonthButton.disabled = currentDisplayDate <= currentDate;
    nextMonthButton.disabled = currentDisplayDate >= sixMonthsLater;
}

prevMonthButton.addEventListener('click', () => changeMonth(-1));
nextMonthButton.addEventListener('click', () => changeMonth(1));
resetButton.addEventListener('click', resetToCurrentMonth);

generateCalendar();



// --------------------------------------------------------------

function showOverlay(imageUrl) {
    const overlay = document.getElementById('overlay');
    const overlayImage = document.getElementById('overlayImage');
    overlayImage.src = imageUrl;
    overlay.style.display = 'flex';
}

function hideOverlay() {
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'none';
}