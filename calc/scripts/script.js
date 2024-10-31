'use strict'

import math from '/node_modules/mathjs';

const body = document.querySelector('body');

/* Main functionality */
const input = body.querySelector('.input');

const inputPrev = input.firstElementChild;
const inputMainPart = input.lastElementChild;

const buttons = body.querySelector('.action-buttons');

const calcMode = 'standard';
const buttonsMainOps = ['%', 'CE', 'C', '⌫', '⅟x', 'x²', '²√x', '÷', ''];
const scientificButtons = [];
const scientificTopButtons = ['Trigonometry', 'Functions'];

const history = [];
const memory = [];

function initCalc() {

}

/* Theme switch */
const themeSwitcherIcons = ['<circle cx="12" cy="12" r="5"/><line x1="12" x2="12" y1="1" y2="3"/><line x1="12" x2="12" y1="21" y2="23"/><line x1="4.22" x2="5.64" y1="4.22" y2="5.64"/><line x1="18.36" x2="19.78" y1="18.36" y2="19.78"/><line x1="1" x2="3" y1="12" y2="12"/><line x1="21" x2="23" y1="12" y2="12"/><line x1="4.22" x2="5.64" y1="19.78" y2="18.36"/><line x1="18.36" x2="19.78" y1="5.64" y2="4.22"/>', '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'];

const themeSwitcher = document.querySelector('.header__theme-switcher');
const themeSwitcherIcon = document.getElementById('switcher-mask');
const themeSwitcherGradient = document.getElementById('switcher-gradient');

let currentTheme = localStorage.getItem('theme');

function deactivateBtnForTime() {
    themeSwitcher.setAttribute("disabled", "");

    setTimeout(() => {
        themeSwitcher.removeAttribute("disabled", "");
    }, '2000');
}

function switchToLightMode() {
    body.classList.add('light-theme');
    localStorage.setItem('theme', 'light');
    themeSwitcherIcon.innerHTML = themeSwitcherIcons[1];
    themeSwitcherGradient.style.fill = 'url(#linear-gradient-2)';
    themeSwitcherGradient.style.stroke = 'url(#linear-gradient-2)';

    deactivateBtnForTime();
}

function switchToMainMode() {
    body.classList.remove('light-theme');
    localStorage.setItem('theme', 'main');
    themeSwitcherIcon.innerHTML = themeSwitcherIcons[0];
    themeSwitcherGradient.style.fill = 'url(#linear-gradient-1)';
    themeSwitcherGradient.style.stroke = 'url(#linear-gradient-1)';

    deactivateBtnForTime();
}

function switchTheme() {
    currentTheme = localStorage.getItem('theme');
    currentTheme !== 'light' ? switchToLightMode() : switchToMainMode();
}

if (currentTheme === 'light') {
    switchToLightMode();
}

themeSwitcher.addEventListener('click', switchTheme);

/* History switch */
const historyBlock = document.querySelector('.history-section');
const historyActivePart = historyBlock.querySelector('.active-part');

let currentHistoryMode = localStorage.getItem('history-mode');

function switchHistoryMode(event) {
    if (event.target.tagName !== 'BUTTON') return;
    
    const prevBtn = historyBlock.querySelector('.current-history-mode');
    if (prevBtn) prevBtn.classList.remove('current-history-mode');

    event.target.classList.add('current-history-mode');
    localStorage.setItem('history-mode', event.target.value);

    historyActivePart.style.display = 'block';
}

function turnOnHistoryMode(currentMode) {
    const element = historyBlock.querySelector(`button[value=${currentMode}]`);
    element.classList.add('current-history-mode');

    historyActivePart.style.display = 'block';
}

if (currentHistoryMode !== null) turnOnHistoryMode(currentHistoryMode);

historyBlock.addEventListener('click', switchHistoryMode);