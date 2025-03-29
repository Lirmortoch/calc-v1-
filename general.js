const body = document.querySelector('body');

const themeSwitcherIcon = document.getElementById('switcher-mask');

const themeSwitcherIcons = [
    '<circle cx="12" cy="12" r="5"/><line x1="12" x2="12" y1="1" y2="3"/><line x1="12" x2="12" y1="21" y2="23"/><line x1="4.22" x2="5.64" y1="4.22" y2="5.64"/><line x1="18.36" x2="19.78" y1="18.36" y2="19.78"/><line x1="1" x2="3" y1="12" y2="12"/><line x1="21" x2="23" y1="12" y2="12"/><line x1="4.22" x2="5.64" y1="19.78" y2="18.36"/><line x1="18.36" x2="19.78" y1="5.64" y2="4.22"/>', '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'
];

let currentTheme = localStorage.getItem('theme') || 'main';

/* Theme switch */
function switchToLightMode(btn = '') {
    body.classList.add('light-theme');
    localStorage.setItem('theme', 'light');
    themeSwitcherIcon.innerHTML = themeSwitcherIcons[1];

    if (btn !== '') deactivateBtnForTime(btn);
}

function switchToMainMode(btn) {
    body.classList.remove('light-theme');
    localStorage.setItem('theme', 'main');
    themeSwitcherIcon.innerHTML = themeSwitcherIcons[0];

    deactivateBtnForTime(btn);
}

function switchTheme(e) {
    const closestElem = e.target.closest('.header__theme-switcher');

    if (!closestElem) return;

    currentTheme = localStorage.getItem('theme');
    currentTheme !== 'light' ? switchToLightMode(closestElem) : switchToMainMode(closestElem);
}

if (currentTheme === 'light') {
    switchToLightMode();
}

document.addEventListener('click', switchTheme);

// mobile menu 
function openCloseMobileMenu(e) {
    const closestElem = e.target.closest('.menu-button-toggler');

    if (!closestElem) return;

    const navBody = body.querySelector('.nav__body');
    const mobileNavIcon = closestElem.tagName === 'BUTTON' ? closestElem : closestElem.parentElement;

    navBody.classList.toggle('active-mobile');
    mobileNavIcon.classList.toggle('active-mobile');
    body.classList.toggle('mobile-lock');
}

document.addEventListener('click', openCloseMobileMenu);