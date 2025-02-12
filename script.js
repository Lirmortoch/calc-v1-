'use strict'

import {evaluate} from './node_modules/mathjs';

/* Variables */
const body = document.querySelector('body');

const calculator = body.querySelector('.calculator');

const themeSwitcherIcon = document.getElementById('switcher-mask');

const input = body.querySelector('.input');

const inputMainPart = input.lastElementChild;
const inputPrevPart = body.querySelector('.input__prev-part').firstElementChild;

const historyBlock = body.querySelector('.history-section__active-part');
const historyPart = body.querySelector('.history-section');

let isOnce = false;

const themeSwitcherIcons = [
    '<circle cx="12" cy="12" r="5"/><line x1="12" x2="12" y1="1" y2="3"/><line x1="12" x2="12" y1="21" y2="23"/><line x1="4.22" x2="5.64" y1="4.22" y2="5.64"/><line x1="18.36" x2="19.78" y1="18.36" y2="19.78"/><line x1="1" x2="3" y1="12" y2="12"/><line x1="21" x2="23" y1="12" y2="12"/><line x1="4.22" x2="5.64" y1="19.78" y2="18.36"/><line x1="18.36" x2="19.78" y1="5.64" y2="4.22"/>', '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'
];

const scientificMainButtons = [['2','nd'], 'π', 'e', '|x|', 'exp', 'mod', 'n!', ['x', 'y'], ['10', 'x'], 'log', 'ln'];

/* 
    УЛУЧШЕНИЕ?
    const tempHistory = localStorage.getItem('history')?.split(' | ');
    const tempMemory = localStorage.getItem('memory')?.split(' | ');

    const history = tempHistory === undefined ? [] : tempHistory;
    const memory = tempMemory === undefined ? [] : tempMemory;
*/

let history = localStorage.getItem('history') === null ? [] : localStorage.getItem('history').split(' | ');
let memory = localStorage.getItem('memory') === null ? [] : localStorage.getItem('memory').split(' | ');

let currentTheme = localStorage.getItem('theme');
let calcMode = 'standard';

const validatorRegExp = /^[\.\s\+\/*\^%=]|[a-z\[\]\{\\}\$;,\\]+|[\.\-+=\/]{2,}|(?<=\.\d+)\./gmi;
// const mathExpressionRegExp = /^(\d+\.\d+|\d+)(\s|)[+\/\-\*\^](\s|)(\d+\.\d+|\d+)(\s|)(=|)|\w+\(\s(\d+\.\d+|\d+)\s\)/gmi;
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

    if (prevBtn) {
        historyBlock.classList.remove(`${prevBtn.value}-mode`);
        prevBtn.classList.remove('current-history-mode');
    }


    e.target.classList.add('current-history-mode');
    localStorage.setItem('history-mode', e.target.value);
    historyBlock.classList.add(`${e.target.value}-mode`);

    if (!isOnce) showHistoryBlock();

    showPrevOperations();
}

function turnOnHistoryMode(currentMode) {
    const element = body.querySelector(`button[value=${currentMode}]`);

    element.classList.add('current-history-mode');
    historyBlock.classList.add(`${currentMode}-mode`);

    if (!isOnce) showHistoryBlock();
}

function showHistoryBlock() {
    const clearBtn = body.querySelector('.history-section__clear-button');

    historyBlock.style.display = 'block';
    clearBtn.style.display = 'block';

    isOnce = true;
}

if (localStorage.getItem('history-mode') !== null) turnOnHistoryMode(localStorage.getItem('history-mode'));

document.addEventListener('click', switchHistoryMode);

/* Mode switch */
function turnOnScienceMode() {
    // actionButtons.innerHTML = '';
}

function turnOffScienceMode() {
    // actionButtons.innerHTML = '';
}

function switchCalcMode(e) {
    if (e.target.tagName !== 'BUTTON' || e.target.classList.contains('current-calc-mode') || !e.target.parentElement.classList.contains('mode-switcher')) return;

    const btn = e.target.parentElement.querySelector('.current-calc-mode');

    localStorage.setItem('prev-calc-mode', calcMode);

    if (e.target.value === 'scientific') {
        calcMode = 'scientific';
        calculator.classList.add(calcMode);
        turnOnScienceMode();
    }
    else {
        calcMode = 'standard';
        calculator.classList.remove('scientific');
        turnOffScienceMode(); 
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

    if (!isDropDownButton && e.target.closest('[data-dropdown]') !== null) return;

    let currentDropDown;

    if (isDropDownButton) {
        currentDropDown = e.target.closest('[data-dropdown]');
        currentDropDown.classList.toggle('active');
        currentDropDown.querySelector('.caret').classList.toggle('caret__rotate');

        dropContentOnMiddle(currentDropDown);
    }

    body.querySelectorAll('[data-dropdown].active').forEach(dropDown => {
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

    // РЕФАКТОРИНГ 2: ввод цифр - проверка main and prev part
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
function replacer(match) {
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

    const navBody = body.querySelector('.nav__body');
    const mobileNavIcon = closestElem.tagName === 'BUTTON' ? closestElem : closestElem.parentElement;

    navBody.classList.toggle('active-mobile');
    mobileNavIcon.classList.toggle('active-mobile');
    body.classList.toggle('mobile-lock');
}

document.addEventListener('click', openCloseMobileMenu);

// History and memory functionality
/* УЛУЧШЕНИЕ? Сделать класс Calc со всеми переменными + сделать объект, который содержит все переменные? (хотя это не нужно, просто использовать this[value]?) */
function addElementInHistory(mathExpr) {
    if (historyBlock.textContent.includes('There\'s no') && historyBlock.classList.contains('history-mode')) historyBlock.textContent = '';

    let historyElem = `<div class="active-part__item history-elem"><span class="active-part__expression expression">${mathExpr + ' = '}</span> <br> <span class="active-part__result result">${inputMainPart.value}</span></div>`;

    history.push(historyElem);

    if (historyBlock.classList.contains('history-mode')) historyBlock.insertAdjacentHTML('afterbegin', historyElem);  

    localStorage.setItem('history', history.join(' | '));
}

function restoreHistoryElem(e) {
    if (!e.target.classList.contains('active-part__item')) return;

    inputMainPart.value = e.target.querySelector('.result').textContent;

    if (e.target.classList.contains('history-elem')) inputPrevPart.textContent = e.target.firstElementChild.textContent;

    if (historyPart.classList.contains('active-mobile')) {
        historyPart.classList.remove('active-mobile');
    }
}

/* УЛУЧШЕНИЕ 1: Историю можно сделать как два блока div. каждый появляется при нажатии переключателя, но тогда придётся добавлять ещё один блок и делать для него стили. Всё это улучшит визуальную составляющую и взаимодействие с юзером */

function showEmptyBlock(historyMode) {
    historyBlock.textContent = historyMode === 'history' ? 'There\'s no history yet' : "There's nothing saved in memory";
    historyBlock.style.padding = '10px'
}

function showPrevOperations() {
    const historyMode = localStorage.getItem('history-mode');
    let storedItems = localStorage.getItem(historyMode);

    historyBlock.innerHTML = '';

    if (storedItems !== null && storedItems !== '') {
        historyBlock.insertAdjacentHTML('afterbegin', storedItems.split(' | ').reverse().join(' | ').replaceAll(' | ', ''));
        historyBlock.style.padding = '0px'
    }
    else showEmptyBlock(historyMode);
}

showPrevOperations();

document.addEventListener('click', restoreHistoryElem);

function clearHistory() {
    const historyMode = localStorage.getItem('history-mode');

    showEmptyBlock(historyMode);

    localStorage.removeItem(historyMode);

    if (historyMode === 'history') history = [];
    else memory = [];
}

function clearHistoryClick(e) {
    const closestElem = e.target.closest('.history-section__clear-button');

    if (!closestElem) return;

    clearHistory();
}

document.addEventListener('click', clearHistoryClick);

/* РЕФАКТОРИНГ 3: сделать один скрипт для дропдаунов и менюшек. Добавить dataset атрибут для кнопок и блоков, затем сделать скрипт который будет открывать менюшку и закрывать остальные */
/* УЛУЧШЕНИЕ: Добавить обёртку для блока, чтобы не было прозрачного пространства между кнопкой очистки блока и самим блоком */
function openHistory(e) {
    const closestElem = e.target.closest('.calculator__button-show-history');

    if (!closestElem) return;

    const mobileHistoryBtn = closestElem.tagName === 'BUTTON' ? closestElem : closestElem.parentElement;

    historyPart.classList.toggle('active-mobile');
    mobileHistoryBtn.classList.toggle('active-mobile');
    body.classList.toggle('mobile-lock');
}

document.addEventListener('click', openHistory);

// РЕФАКТОРИНГ 5: Уменьшение кода в add & subtract? (add + subtract)?
// РЕФАКТОРИНГ 6: Где-то в коде в memory пушиться пустая строка. Надо найти и убрать
function memoryAdd(e) {
    if (e.target.value !== 'memory-add') return;

    if (memory.length > 0 && memory[0] !== '') {
        const tempMemoryItem = document.querySelector('.active-part__memory-item.result');

        tempMemoryItem.textContent = evaluate(`${tempMemoryItem.textContent} + ${inputMainPart.value}`);

        memory[memory.length - 1] = `<div class='active-part__item memory-elem'>${tempMemoryItem.closest('.memory-elem').innerHTML}</div>`;
    }
    else memoryStore(inputMainPart.value);

    localStorage.setItem('memory', memory.join(' | '));
}

// РЕФАКТОРИНГ 4: одна функция добавления в историю и память. Убрать нестрогое сравнение?
// УЛУЧШЕНИЕ: один класс Calc со всеми нужными приватными переменными и доступ через this[value]. Подсказка над кнопками с операциями (память)
function memoryStore(value) {
    if (value == false) return;

    if (historyBlock.textContent.includes('There\'s no') && historyBlock.classList.contains('memory-mode')) historyBlock.textContent = '';

    let memoryElem = `<div class="active-part__item memory-elem"><span class="active-part__memory-item result">${value}</span><div><button class="upper-buttons__clearAll button" value="memory-clear">mc</button><button class="upper-buttons__add button" value="memory-add">m+</button><button class="upper-buttons__subtract button" value="memory-subtract">m-</button></div></div>`;

    memory.push(memoryElem);

    if (historyBlock.classList.contains('memory-mode')) historyBlock.insertAdjacentHTML('afterbegin', memoryElem); 

    localStorage.setItem('memory', memory.join(' | '));
}

function memoryStoreClick(e) {
    if (e.target.value !== 'memory-store' || inputMainPart.value === '') return;

    memoryStore(inputMainPart.value);
}

function memorySubtract(e) {
    if (e.target.value !== 'memory-subtract') return;

    if (memory.length > 0 && memory[0] !== '') {
        const tempMemoryItem = document.querySelector('.active-part__memory-item.result');

        tempMemoryItem.textContent = evaluate(`${tempMemoryItem.textContent} - ${inputMainPart.value}`);
        
        memory[memory.length - 1] = `<div class='active-part__item memory-elem'>${tempMemoryItem.closest('.memory-elem').innerHTML}</div>`;
    }
    else memoryStore(-inputMainPart.value);

    localStorage.setItem('memory', memory.join(' | '));
}

function memoryReCall(e) {
    if (e.target.value !== 'memory-recall') return;

    inputMainPart.value = document.querySelector('.active-part__memory-item.result').textContent;
}

// РЕФАКТОРИНГ: привести к норм виду. Лишние ветвления. Сделать функцию clearHistory более юзабельной (в функцию кидать текущий мод и внутри проверять его, чтобы не удалить элементы из другого блока)?
function memoryClear(e) {
    if (e.target.value !== 'memory-clear') return;

    if (!e.target.closest('.memory-elem')) {
        if (localStorage.getItem('history-mode') === 'memory') showEmptyBlock('memory');

        localStorage.removeItem('memory');
        memory = [];
    }
    else {
        const elem = e.target.closest('.memory-elem');
        const index = memory.indexOf(elem.innerHTML);

        memory.splice(index, 1);
        localStorage.setItem('memory', memory);
        
        elem.remove();

        if (historyBlock.innerHTML.length === 0) showEmptyBlock('memory');
    }
}

document.addEventListener('click', memoryStoreClick);
document.addEventListener('click', memoryClear);
document.addEventListener('click', memoryAdd);
document.addEventListener('click', memorySubtract);
document.addEventListener('click', memoryReCall);