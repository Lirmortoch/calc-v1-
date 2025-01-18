'use strict'

import {evaluate} from './node_modules/mathjs';

/* Variables */
const body = document.querySelector('body');

const calculator = body.querySelector('.calculator');

const themeSwitcherIcon = document.getElementById('switcher-mask');

const input = body.querySelector('.input');

const inputMainPart = input.lastElementChild;
const inputPrevPart = body.querySelector('.input__prev-part').firstElementChild;

const historyActivePart = body.querySelector('.active-part');

const themeSwitcherIcons = [
    '<circle cx="12" cy="12" r="5"/><line x1="12" x2="12" y1="1" y2="3"/><line x1="12" x2="12" y1="21" y2="23"/><line x1="4.22" x2="5.64" y1="4.22" y2="5.64"/><line x1="18.36" x2="19.78" y1="18.36" y2="19.78"/><line x1="1" x2="3" y1="12" y2="12"/><line x1="21" x2="23" y1="12" y2="12"/><line x1="4.22" x2="5.64" y1="19.78" y2="18.36"/><line x1="18.36" x2="19.78" y1="5.64" y2="4.22"/>', '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'
];

const scientificMainButtons = [['2','nd'], 'π', 'e', '|x|', 'exp', 'mod', 'n!', ['x', 'y'], ['10', 'x'], 'log', 'ln'];
 
const history = [];
const memory = [];

let currentTheme = localStorage.getItem('theme');
let calcMode = 'standard';
let currentHistoryMode = localStorage.getItem('history-mode');

const validatorRegExp = /^[\.\s\+\/*\^%=]|[a-z\[\]\{\\}\$;,\\]+|[\.\-+=\/]{2,}|(?<=\.\d+)\./gmi;
const mathExpressionRegExp = /^(\d+\.\d+|\d+)(\s|)[+\/\-\*\^](\s|)(\d+\.\d+|\d+)(\s|)(=|)|\w+\(\s(\d+\.\d+|\d+)\s\)/gmi;
const replaceBinaryOpsRegEx = /[\+\-\*\/]/gm;

//inputMainPart.pattern = validatorRegExp.toString(10).replace(/^\/|\/[a-z]+$/gmi, '');

/* Functions */
let toRegularCase = str => str[0].toUpperCase() + str.slice(1);

function deactivateBtnForTime(btn) {
    btn.setAttribute("disabled", "");

    setTimeout(() => {
        btn.removeAttribute("disabled", "");
    }, '2000');
}

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

/* History switch */
function switchHistoryMode(e) {
    if (e.target.tagName !== 'BUTTON' || !e.target.parentElement.classList.contains('history-buttons')) return;
    
    const prevBtn = body.querySelector('.current-history-mode');
    if (prevBtn) prevBtn.classList.remove('current-history-mode');

    e.target.classList.add('current-history-mode');
    localStorage.setItem('history-mode', e.target.value);

    historyActivePart.style.display = 'block';
}

function turnOnHistoryMode(currentMode) {
    const element = body.querySelector(`button[value=${currentMode}]`);
    element.classList.add('current-history-mode');

    historyActivePart.style.display = 'block';
}

if (currentHistoryMode !== null) turnOnHistoryMode(currentHistoryMode);

document.addEventListener('click', switchHistoryMode);

/* Mode switch */
function turnOnScienceMode(memoryControl) {
    const upperButtons = body.querySelector('.upper-buttons');

    upperButtons.firstElementChild.insertAdjacentHTML('afterbegin', '<button class="upper-buttons__angle-value button science-functions scientific">Deg</button><button class="upper-buttons__f-e button science-functions scientific">F-e</button>');

    upperButtons.insertAdjacentHTML('afterend', '');

    memoryControl.forEach(elem => elem.style.gridRow = '2');
}

function turnOffScienceMode(memoryControl) {
    const scientificFuncs = body.querySelectorAll('.scientific');

    scientificFuncs.forEach(elem => elem.remove());
    memoryControl.forEach(elem => elem.style = '');
}

function switchCalcMode(e) {
    if (e.target.tagName !== 'BUTTON' || e.target.classList.contains('current-calc-mode') || !e.target.parentElement.classList.contains('mode-switcher')) return;

    const memoryControl = body.querySelectorAll('.memory-control');
    const btn = e.target.parentElement.querySelector('.current-calc-mode');

    localStorage.setItem('prev-calc-mode', calcMode);

    if (e.target.value === 'scientific') {
        calcMode = 'scientific';
        calculator.classList.add(calcMode);
        turnOnScienceMode(memoryControl);
    }
    else {
        calcMode = 'standard';
        calculator.classList.remove('scientific');
        turnOffScienceMode(memoryControl); 
    }

    const prevCalcMode = localStorage.getItem('prev-calc-mode');

    btn.innerHTML = toRegularCase(calcMode) + '<span class="dropdown__caret caret caret__rotate"></span>';
    btn.value = calcMode;

    e.target.innerText = toRegularCase(prevCalcMode);
    e.target.value = prevCalcMode;

    localStorage.setItem('calc-mode', calcMode);
}

document.addEventListener('click', switchCalcMode);

/* Functions for dropdowns */
function keepOpenDropMenu(e) {
    const isDropDownButton = e.target.matches('[data-dropdown-button]');

    if (!isDropDownButton && e.target.closest('[data-dropdown]') != null) return;

    let currentDropDown;

    if (isDropDownButton) {
        currentDropDown = e.target.closest('[data-dropdown]');
        currentDropDown.classList.toggle('active');
        currentDropDown.querySelector('.caret').classList.toggle('caret__rotate');

        dropContentOnMiddle(currentDropDown);
    }

    document.querySelectorAll('[data-dropdown].active').forEach(dropDown => {
        if (dropDown === currentDropDown) return;
        dropDown.classList.remove('active');
        dropDown.querySelector('.caret').classList.toggle('caret__rotate');
    });

}

function dropContentOnMiddle(currentDropDown) {
    //Drop down elements
    const button = currentDropDown.querySelector('[data-dropdown-button]');
    const content = currentDropDown.querySelector('.dropdown-content');
    
    const buttonPosition = button.getBoundingClientRect();

    content.style.left = `${
        content.offsetWidth / buttonPosition.x < buttonPosition.x 
            ? Math.round((button.clientWidth / 2) - (content.offsetWidth / 2)) 
            : 0
    }px`;
}

document.addEventListener('click', keepOpenDropMenu);

/* Calculator functionality */
function clickedTrinogometrySwitcher(e) {
    if (e.target.tagName !== 'BUTTON' || !e.target.classList.contains('others-funcs__switcher')) return;

    e.target.classList.toggle('active-switcher');
}

document.addEventListener('click', clickedTrinogometrySwitcher);

function printNumber(e) {
    if (e.target.tagName !== 'BUTTON' || !e.target.classList.contains('num-btn')) return;

    if (e.target.value === '.') { 
        if (inputMainPart.value.length === 0) return;
    }

    if (inputPrevPart.classList.contains('full-expr')) {
        inputPrevPart.className = 'active-part__expression expression';
        clearInput('C');
    }

    if (!inputPrevPart.classList.contains('binary-operator-clicked')) {
        inputMainPart.value += e.target.value;
    }
    else {
        inputMainPart.value = e.target.value;
        inputPrevPart.className = 'active-part__expression expression';
        inputPrevPart.classList.add('inputted-same-number');
    }    
}

document.addEventListener('click', printNumber);

function clearInput(value) {
    if (value === 'C') {
        inputMainPart.value = null;
        inputPrevPart.textContent = '';
        inputPrevPart.className = 'active-part__expression expression';
    }
    else if (value === 'CE') {
        inputMainPart.value = null;
    }
    else if (value === 'backspace') {
        let temp = inputMainPart.value.slice(0, -1);
        inputMainPart.value = temp;
    }
}

function clearOperators(e) {
    if (e.target.tagName !== 'BUTTON' || !e.target.classList.contains('clear-funcs')) return;

    clearInput(e.target.value)
}

document.addEventListener('click', clearOperators);

function unaryOperators(e) {
    if (e.target.tagName !== 'BUTTON' || !e.target.classList.contains('unary-operator')) return;

    let temp, mathExpr;
    let number = inputMainPart.value;

    // Можно улучшить внешний вид выражения в прев парт 
    if (/x/.test(e.target.value)) {
        mathExpr = `${e.target.value.replace(/x/, number)}`;
    }
    else {
        mathExpr = `${e.target.value}( ${number} )`;
    }

    // РЕФАКТОРИНГ 1
    temp = evaluate(mathExpr);
    inputPrevPart.textContent = mathExpr;
    inputMainPart.value = temp;
    inputPrevPart.classList.add('full-expr');

    if (inputPrevPart.classList.contains('full-expr')) addElementInHistory(mathExpr);
}

document.addEventListener('click', unaryOperators);

function auxiliaryOperators(e) {
    if (e.target.tagName !== 'BUTTON' || !e.target.classList.contains('aux-ops')) return;

    let temp;
    let number = inputMainPart.value;

    if (e.target.value === '+-') {
        inputPrevPart.textContent = `negate${number}`
        temp = -number;
    }

    inputMainPart.value = temp;
}

document.addEventListener('click', auxiliaryOperators);

function binaryOperators(e) {
    if (e.target.tagName !== 'BUTTON' || !e.target.classList.contains('binary-operator')) return;
    
    let temp, mathExpr, prevNumber;
    let number = inputMainPart.value;

    if (inputPrevPart.textContent.length === 0 || inputPrevPart.textContent.includes('=') && inputMainPart.value !== '') {
        temp = number;
    }
    else if (inputPrevPart.textContent.length !== 0) {
        prevNumber = inputPrevPart.textContent.split(' ')[0];
        mathExpr = `${inputPrevPart.textContent}${number}`;
        temp = evaluate(mathExpr);
    }

    if (prevNumber === number && !inputPrevPart.classList.contains('inputted-same-number')) {
        if (replaceBinaryOpsRegEx.test(inputPrevPart.textContent) && !inputPrevPart.textContent.includes(e.target.value)) {
            inputPrevPart.textContent = inputPrevPart.textContent.replace(replaceBinaryOpsRegEx, e.target.value);
            // alert('AVE CAESAR!');
        }
        return;
    }
    
    if (mathExpr !== undefined) addElementInHistory(mathExpr);

    // РЕФАКТОРИНГ 1
    // Можно сделать функцию для кнопки ровно переиспользуемой
    inputPrevPart.classList.add('binary-operator-clicked');
    inputPrevPart.classList.remove('full-expr');

    inputPrevPart.textContent = `${temp} ${e.target.value} `;
    inputMainPart.value = temp;

    inputPrevPart.classList.remove('inputted-same-number');
}

// РЕФАКТОРИНГ 1: equalClick and equal
function equal(e) {
    if (e.target.tagName !== 'BUTTON' || !e.target.classList.contains('equal-sign')) return;

    if (inputMainPart.value.length !== 0 && !inputPrevPart.textContent.includes('=')) {
        let mathExpr = inputPrevPart.textContent + inputMainPart.value;
        let temp = evaluate(mathExpr);

        inputMainPart.value = temp;
        inputPrevPart.textContent = mathExpr + ' = ';

        inputPrevPart.classList.add('full-expr');

        inputPrevPart.classList.remove('inputted-same-number');

        addElementInHistory(mathExpr);
    }
}

document.addEventListener('click', equal);

document.addEventListener('click', binaryOperators);

// validate input;
function replacer(match, p1, p2, p3, offset, string) {
    if (/.[\.\-+*=\/]/.test(match)) {
        return match.slice(0, 1);
    }
    else {
        return '';
    }
}

function validator(e) {
    let inputValue = inputMainPart.value.replace(validatorRegExp, replacer);
    inputMainPart.value = inputValue;
}

inputMainPart.addEventListener('input', validator);

// mobile menu 
function openCloseMobileMenu(e) {
    const closestElem = e.target.closest('.menu-button-toggler');

    if (!closestElem) return;

    const navBody = document.querySelector('.nav__body');
    const mobileNavIcon = closestElem.tagName === 'BUTTON' ? closestElem : closestElem.parentElement;

    navBody.classList.toggle('active-mobile');
    mobileNavIcon.classList.toggle('active-mobile');
    body.classList.toggle('mobile-lock');
}

document.addEventListener('click', openCloseMobileMenu);

// History and memory functionality
function addElementInHistory(mathExpr) {
    const historyBlock = document.querySelector('.history-section__active-part');

    let historyElem;

    historyElem = `<div class="active-part__item"><span class="active-part__expression expression">${mathExpr + ' = '}</span> <br> <span class="active-part__result result">${inputMainPart.value}</span></div>`;

    history.push(historyElem);
    localStorage.setItem('history', history);
    historyBlock.insertAdjacentHTML('afterbegin', historyElem);    
}

function restoreHistoryElem(e) {
    if (!e.target.classList.contains('active-part__item')) return;

    inputMainPart.value = e.target.lastElementChild.textContent;
    inputPrevPart.textContent = e.target.firstElementChild.textContent;
}

document.addEventListener('click', restoreHistoryElem);