const serviceSelect = document.querySelector('#service');
const datePicker = document.querySelector('#date-picker');
const timePicker = document.querySelector('#time-picker');
const monthLabel = document.querySelector('#month-label');
const summaryService = document.querySelector('#summary-service');
const summaryDate = document.querySelector('#summary-date');
const summaryTime = document.querySelector('#summary-time');

const weekdayNames = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const sampleTimes = ['10:00', '11:30', '14:00', '15:30', '17:00'];
let selectedDate;
let selectedTime = '14:00';

function makeLocalDate(daysAhead) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + daysAhead);
  return date;
}

function formatDate(date) {
  return `${date.getDate()} de ${monthNames[date.getMonth()]}`;
}

function updateSummary() {
  summaryService.textContent = serviceSelect.value;
  summaryDate.textContent = formatDate(selectedDate);
  summaryTime.textContent = `${selectedTime} hs`;
}

function renderDates() {
  const dates = Array.from({ length: 7 }, (_, index) => makeLocalDate(index + 1));
  monthLabel.textContent = `${monthNames[dates[0].getMonth()]} ${dates[0].getFullYear()}`;
  datePicker.replaceChildren();

  dates.forEach((date) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'date-button';
    button.setAttribute('aria-pressed', 'false');
    button.innerHTML = `<span class="day-name">${weekdayNames[date.getDay()]}</span><span class="day-number">${date.getDate()}</span>`;
    button.addEventListener('click', () => {
      selectedDate = date;
      datePicker.querySelectorAll('.date-button').forEach((item) => {
        const active = item === button;
        item.classList.toggle('selected', active);
        item.setAttribute('aria-pressed', String(active));
      });
      updateSummary();
    });
    datePicker.append(button);
  });

  selectedDate = dates[0];
  datePicker.querySelector('.date-button')?.classList.add('selected');
  datePicker.querySelector('.date-button')?.setAttribute('aria-pressed', 'true');
}

function renderTimes() {
  timePicker.replaceChildren();
  sampleTimes.forEach((time) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `time-button${time === selectedTime ? ' selected' : ''}`;
    button.textContent = time;
    button.setAttribute('aria-pressed', String(time === selectedTime));
    button.addEventListener('click', () => {
      selectedTime = time;
      timePicker.querySelectorAll('.time-button').forEach((item) => {
        const active = item === button;
        item.classList.toggle('selected', active);
        item.setAttribute('aria-pressed', String(active));
      });
      updateSummary();
    });
    timePicker.append(button);
  });
}

serviceSelect.addEventListener('change', updateSummary);
document.querySelectorAll('[data-service-link]').forEach((link) => {
  link.addEventListener('click', () => {
    const requestedService = link.getAttribute('data-service-link');
    const matchingOption = Array.from(serviceSelect.options).find((option) => option.text === requestedService);
    if (matchingOption) serviceSelect.value = matchingOption.value;
    updateSummary();
  });
});

renderDates();
renderTimes();
updateSummary();
