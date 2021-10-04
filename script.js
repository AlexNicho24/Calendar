'use strict';

///////////////////////////////////
// Model Window
const overlay = document.querySelector('.overlay');
const model = document.querySelector('.schedule__modal');
const btnCloseModel = document.querySelector('.schedule__modal--close');
const submitBtn = document.querySelector('.btn');
const dateField = document.getElementById('dateField');

let today = new Date();
let dd = today.getDate();
let mm = today.getMonth() + 1;
const yyyy = today.getFullYear();

if (dd < 10) {
  dd = '0' + dd;
}

if (mm < 10) {
  mm = '0' + mm;
}

today = yyyy + '-' + mm + '-' + dd;
document.getElementById('dateField').setAttribute('max', today);
/////////////////////////////////
// Calendar App
let monthNumID = 0;
let dateSubmitted = null;
const calendar = document.getElementById('calendar__app');
const prevButton = document.querySelector('.prev__button');
const nextButton = document.querySelector('.next__button');
const todayButton = document.querySelector('.button4');
const monthSelector = document.getElementById('month');
const inputEquipment = document.querySelector('.inputEquipment');
const inputModelID = document.querySelector('.inputModelID');
const inputDateAcquired = document.querySelector('.inputDateAcquired');
const inputWeekly = document.querySelector('.inputWeekly');
const inputMonthly = document.querySelector('.inputMonthly');
const inputYearly = document.querySelector('.inputYearly');

const weekdays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

class App {
  #schedules = [];

  constructor() {
    // Gets Data from local Storage
    this._getLocalStorage();
    // Creates Calender
    this._createCalender();

    submitBtn.addEventListener('click', this._createSchedule.bind(this));
    prevButton.addEventListener('click', this._prevMonth.bind(this));
    nextButton.addEventListener('click', this._nextMonth.bind(this));
    todayButton.addEventListener;
    btnCloseModel.addEventListener('click', this._closeModel);
    overlay.addEventListener('click', this._closeModel);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !model.classList.contains('hidden')) {
        this._closeModel();
      }
    });
  }

  _createCalender() {
    const dt = new Date();

    if (monthNumID != 0) dt.setMonth(new Date().getMonth() + monthNumID);

    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
      weekday: 'long',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
    const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

    document.getElementById(
      'monthDisplay'
    ).innerText = `${dt.toLocaleDateString('en-us', {
      month: 'long',
    })} ${year}`;

    calendar.innerHTML = '';

    for (let i = 1; i <= paddingDays + daysInMonth; i++) {
      const daySquare = document.createElement('div');
      daySquare.classList.add('day');

      //Try to find the day of the week and make it equal to the event day
      const currentDay = `${year}/${month + 1}/${i - paddingDays}`;

      if (i > paddingDays) {
        daySquare.innerText = i - paddingDays;

        if (i - paddingDays === day && monthNumID === 0) {
          daySquare.id = 'currentDay';
        }

        const scheduleForDay = this.#schedules.find(
          (e) => e.dateSubmitted === currentDay
        );

        if (scheduleForDay) {
          const event = document.createElement('div');
          event.classList.add('scheduled__event');
          event.innerText = `Equipment: ${scheduleForDay.equipment}
             Model #: ${scheduleForDay.modelID}
             DateAccepted: ${scheduleForDay.dateAquired}`;
          daySquare.appendChild(event);
        }

        // Clicking on the day opens the event modal and passes the inside the modal
        daySquare.addEventListener(
          'click',
          this._showmodal.bind(this, currentDay)
        );
      } else daySquare.classList.add('padding');

      calendar.appendChild(daySquare);
    }

    document.querySelector('.scheduled__event').addEventListener('click');

    todayButton.addEventListener('click', () => {
      monthNumID = 0;
      this._createCalender();
    });
  }

  // Shows modal for submiting events and adds clicked day date to datesubmitted
  _showmodal(date) {
    dateSubmitted = date;
    model.classList.remove('hidden');
    overlay.classList.remove('hidden');
  }

  // Creates an event once submit button is pressed
  _createSchedule(e, scheduledDay) {
    e.preventDefault();
    const id = Math.random().toString(16).slice(2);
    const equipment = inputEquipment.value;
    const modelID = +inputModelID.value;
    const dateAquired = inputDateAcquired.value;
    // let selectedEvent;
    let schedule;
    /*
      if (document.getElementById('weekly_Schedule').checked)
        selectedEvent = inputWeekly.value;

      if (document.getElementById('monthly_Schedule').checked)
        selectedEvent = inputMonthly.value;

      if (document.getElementById('yearly_Schedule').checked)
        selectedEvent = inputYearly.value;
    */
    if (this.#schedules.find((schedule) => schedule.modelID === modelID))
      return alert(
        'Not a valid submission entry can not be 2 of the same modelIDs'
      );

    schedule = {
      id,
      dateSubmitted,
      equipment,
      modelID,
      dateAquired,
      // selectedEvent,
    };

    this.#schedules.push(schedule);
    this._setLocalStorage();
    this._closeModel();
    this._createCalender();
  }

  // Moves calendar to previous month
  _prevMonth() {
    monthNumID--;
    this._createCalender();
  }

  // Moves calendar to next month
  _nextMonth() {
    monthNumID++;
    this._createCalender();
  }

  // Clicking on the close button, overlay or pressing escape closes modal
  _closeModel() {
    model.classList.add('hidden');
    overlay.classList.add('hidden');
  }

  // adds object to local storage
  _setLocalStorage() {
    localStorage.setItem('schedules', JSON.stringify(this.#schedules));
  }

  // gathers data from local storage
  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('schedules'));

    if (!data) return;

    this.#schedules = data;
  }
}

const app = new App();
