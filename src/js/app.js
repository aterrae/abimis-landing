import STRINGS from '../data/strings';

function ready(callbackFunc) {
  if (document.readyState !== 'loading') {
    // Document is already ready
    callbackFunc();
  } else if (document.addEventListener) {
    // Register to DOMContentLoaded (modern browsers)
    document.addEventListener('DOMContentLoaded', callbackFunc);
  } else {
    // Old IE browsers fallback
    document.attachEvent('onreadystatechange', () => {
      if (document.readyState === 'complete') {
        callbackFunc();
      }
    });
  }
}

function getTimeRemaining(endtime) {
  const offset = Date.parse(endtime) - Date.parse(new Date());
  const parsedOffset = {};
  parsedOffset.total = offset;
  parsedOffset.seconds = Math.floor((offset / 1000) % 60);
  parsedOffset.minutes = Math.floor((offset / 1000 / 60) % 60);
  parsedOffset.hours = Math.floor((offset / (1000 * 60 * 60)) % 24);
  parsedOffset.days = Math.floor(offset / (1000 * 60 * 60 * 24));
  return parsedOffset;
}

function initializeClock(id, endtime) {
  const clock = document.getElementById(id);
  const days = clock.querySelector('#cdd');
  const hours = clock.querySelector('#cdh');
  const minutes = clock.querySelector('#cdm');
  const seconds = clock.querySelector('#cds');
  const timeinterval = setInterval(() => {
    const offset = getTimeRemaining(endtime);
    if (days) days.innerHTML = offset.days;
    if (hours) hours.innerHTML = offset.hours;
    if (minutes) minutes.innerHTML = offset.minutes;
    if (seconds) seconds.innerHTML = offset.seconds;
    if (offset.total <= 0) {
      clearInterval(timeinterval);
    }
  }, 1000);
}

ready(() => {
  initializeClock('cd', STRINGS.cover.countdown.deadline);

  const overlayButtons = document.querySelectorAll('#cta-overlay');
  [].forEach.call(overlayButtons, (button) => {
    button.addEventListener('click', () => {
      document.querySelector('.overlay').classList.toggle('overlay--visible');
      document.body.classList.toggle('noscroll');
    });
  });
});
