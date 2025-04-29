'use strict'

import {evaluate, format} from './node_modules/mathjs';
import {Theme, MobileMenu, body, deactivateBtnForTime, toRegularCase} from './general.js'

const theme = new Theme();
const mobileMenu = new MobileMenu();

theme.run();
mobileMenu.run();

/* Variables */
const calculator = body.querySelector('.calculator');

const actionButtons = body.querySelector('.action-buttons');

const input = body.querySelector('.input');

const inputMainPart = input.lastElementChild;
const inputPrevPart = body.querySelector('.input__prev-part').firstElementChild;

const historyBlock = body.querySelector('.history-section__active-part');
const historyPart = body.querySelector('.history-section');

let isOnce = false;

const tempHis = localStorage.getItem('history');
const tempMem = localStorage.getItem('memory');

let history = tempHis === null ? [] : tempHis.split(' | ');
let memory = tempMem === null ? [] : tempMem.split(' | ');

let calcMode = localStorage.getItem('calc-mode') || 'standard';

const validatorRegExp = /^[\.\s\+\/*\^%=]|[a-z\[\]\{\\}\$;,\\]+|[\.\-+=\/]{2,}|(?<=\.\d+)\.|(?<![\d\.])0\d+/gmi;
const replaceBinaryOpsRegEx = /(?<=\s)[\+\-\*\/](?=\s)/gm;

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
function swapXs() {
    const xPowTwo = actionButtons.querySelector('[value="x^2"]');
    const oneDivideX = actionButtons.querySelector('[value="1/x"]');

    xPowTwo.innerHTML = '<sup>1</sup><span>/</span><sub>x</sub>';
    xPowTwo.value = '1/x';
    oneDivideX.innerHTML = '<span>x</span><sup>2</sup>';
    oneDivideX.value = 'x^2';
}

function changeSwitchModeButtons(btn1, btn2, calcMode, prevCalcMode, isRotate = false) {
    btn1.innerHTML = toRegularCase(calcMode) + `<span class="dropdown__caret caret ${isRotate ? 'caret__rotate' : ''}"></span>`;
    btn1.value = calcMode;

    btn2.innerText = toRegularCase(prevCalcMode);
    btn2.value = prevCalcMode;

    localStorage.setItem('calc-mode', calcMode);
}

function onScienceMode() {
    calcMode = 'scientific';
    calculator.classList.add(calcMode);

    const modeBtn = actionButtons.querySelector('[value="%"]');
    const clearElementBtn = actionButtons.querySelector('[value="CE"]');

    if (modeBtn === null) return;

    modeBtn.textContent = 'π';
    modeBtn.value = 'pi';

    clearElementBtn.textContent = 'e';
    clearElementBtn.value = clearElementBtn.textContent;
    clearElementBtn.classList.toggle('unary-operator');
    clearElementBtn.classList.toggle('clear-funcs');
    clearElementBtn.classList.toggle('constant');

    swapXs();
}

function offScienceMode() {
    calcMode = 'standard';
    calculator.classList.remove('scientific');

    const piBtn = actionButtons.querySelector('[value="pi"]');
    const eBtn = actionButtons.querySelector('[value="e"]');

    if (piBtn === null) return;

    piBtn.textContent = '%';
    piBtn.value = piBtn.textContent;

    eBtn.textContent = 'CE';
    eBtn.value = eBtn.textContent;
    eBtn.classList.toggle('unary-operator');
    eBtn.classList.toggle('clear-funcs');
    eBtn.classList.toggle('constant');

    swapXs();
}

function turnScienceMode() {
    const btn = body.querySelector('.current-calc-mode');
    const target = body.querySelector('.mode-switcher__menu');
    let prevCalcMode = '';

    if (calcMode === 'scientific') {
        onScienceMode();
        prevCalcMode = 'standard';
    }
    else {
        offScienceMode();
        prevCalcMode = 'scientific';
    }

    changeSwitchModeButtons(btn, target, calcMode, prevCalcMode);
}

function switchCalcMode(e) {
    if (e.target.tagName !== 'BUTTON' || e.target.classList.contains('current-calc-mode') || !e.target.parentElement.classList.contains('mode-switcher')) return;

    const btn = body.querySelector('.current-calc-mode');
    const prevCalcMode = calcMode;

    if (e.target.value === 'scientific') {
        onScienceMode();
    }
    else {
        offScienceMode(); 
    }

    changeSwitchModeButtons(btn, e.target, calcMode, prevCalcMode, true);
}

turnScienceMode();

document.addEventListener('click', switchCalcMode);

/* Functions for dropdowns */
function keepOpenDropMenu(e) {
    const isDropDownButton = e.target.matches('[data-dropdown-button], [data-dropdown-button] > *');

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

    // content.style.left = `${
    //     content.offsetWidth / buttonPosition.x < buttonPosition.x 
    //         ? !button.textContent.includes('Trigonometry') 
    //             ? Math.round((button.clientWidth / 2) - (content.offsetWidth / 2)) 
    //             : 0
    //         : 0
    // }px`;

    if (content.offsetWidth / buttonPosition.x < buttonPosition.x && !button.textContent.includes('Trigonometry')) {
        content.style.left = `${
            Math.round((button.clientWidth / 2) - (content.offsetWidth / 2)) 
        }px`;
    }
    else {
        content.style.left = `${0}px`;
    }
}

document.addEventListener('click', keepOpenDropMenu);

/* Calculator functionality */
function switchScienceOperators() {
    const buttons = document.querySelectorAll('[data-second-value]');

    buttons.forEach(item => {
        item.classList.toggle('funcs-switched-value');

        if (item.value.includes('log')) {
            item.classList.toggle('binary-operator');
            item.classList.toggle('unary-operator');
        }

        const tempValue = item.value;
        let tempText = '';

        item.value = item.dataset.secondValue;
        item.dataset.secondValue = tempValue;
     
        if (!item.getAttribute('data-inner-code')) {
            tempText = item.textContent;
            item.textContent = item.dataset.textContent;
            item.dataset.textContent = tempText;
        }
        else {
            tempText = item.innerHTML;
            item.innerHTML = item.dataset.innerCode;
            item.dataset.innerCode = tempText;
        }
    });
}

function clickOperatorsSwitcher(e) {
    if (e.target.tagName !== 'BUTTON' || !e.target.classList.contains('funcs-switcher')) return;

    e.target.classList.toggle('active-switcher');
    switchScienceOperators();
}

function switchAFuncs(e) {
    if (e.target.tagName !== 'BUTTON' || !e.target.classList.contains('a-func')) return;

    e.target.classList.toggle('active-switcher');

    document.querySelectorAll('.trigonometry-funcs').forEach(item => {
        const temp = item.textContent;

        if (temp[0] === 'a') {
            item.textContent = temp.replace('a', '');
            item.value = temp.replace('a', '');
        }
        else {
            item.textContent = `a${temp}`;
            item.value = `a${temp}`;
        }
    });
}
function switchHyperbolicFuncs(e) {
    if (e.target.tagName !== 'BUTTON' || !e.target.classList.contains('hyperbolic')) return;

    e.target.classList.toggle('active-switcher');

    document.querySelectorAll('.trigonometry-funcs').forEach(item => {
        const temp = item.textContent;

        if (temp.includes('h')) {
            item.textContent = temp.replace('h', '');
            item.value = temp.replace('h', '');
        }
        else {
            item.textContent = `${temp}h`;
            item.value = `${temp}h`;
        }
    });
}

document.addEventListener('click', switchAFuncs);
document.addEventListener('click', switchHyperbolicFuncs);

document.addEventListener('click', clickOperatorsSwitcher);

function printNumber(e) {
    if (e.target.tagName !== 'BUTTON' || !e.target.classList.contains('num-btn')) return;

    if (e.target.value === '.') { 
        if (inputMainPart.value.length === 0) return;
    }

    if (inputPrevPart.classList.contains('full-expr')) {
        const clear = document.querySelector('.clear-funcs');

        clear.value = 'C';
        clear.textContent = 'C';
        
        clearInput(clear);
    
        inputMainPart.value = e.target.value;
        inputPrevPart.className = 'active-part__expression expression';

        return;
    }

    if (!inputPrevPart.classList.contains('binary-operator-clicked')) {
        inputMainPart.value += e.target.value;
    }
    else {
        inputMainPart.value = e.target.value;
        inputPrevPart.className = 'active-part__expression expression';
        inputPrevPart.classList.add('inputted-same-number');
    }  
    
    validator();
}

document.addEventListener('click', printNumber);

function clearInput(target) {
    if (target.value === 'C') {
        inputMainPart.value = null;
        inputPrevPart.textContent = '';
        inputPrevPart.className = 'active-part__expression expression';
    }
    else if (target.value === 'CE') {
        inputMainPart.value = null;
        
        if (calcMode !== 'standard') {
            target.value = 'C';
            target.textContent = 'C';
        }
    }
    else if (target.value === 'backspace') {
        let temp = inputMainPart.value.slice(0, -1);
        inputMainPart.value = temp;
    }
}

function clearOperators(e) {
    if (e.target.tagName !== 'BUTTON' || !e.target.classList.contains('clear-funcs')) return;

    clearInput(e.target)
}

document.addEventListener('click', clearOperators);

function unaryOperators(e) {
    if (e.target.tagName !== 'BUTTON' || !e.target.classList.contains('unary-operator')) return;

    const mode = calculator.className.match(/\w+(?=-mode)/gm)?.join('');

    let mathExpr;
    const number = format(Number(inputMainPart.value), {notation: mode});
    
    if (e.target.value === 'exp') {
        if (inputMainPart.textContent.includes('exp') || number === '') return;

        inputMainPart.value = `${number},e+0`;

        return;
    }
    else if (/x/.test(e.target.value)) {
        mathExpr = `${e.target.value.replace(/x/, number)}`;
    }
    else if (e.target.classList.contains('trigonometry-funcs')) {
        const angleUnit = document.querySelector('.angle-switcher').value;
        
        mathExpr = `${e.target.value}(${number} ${angleUnit})`;
    }
    else if (e.target.classList.contains('constant')) {
        mathExpr = e.target.value;
    }
    else {
        mathExpr = `${e.target.value}(${number})`;
    }

    inputPrevPart.textContent = mathExpr;
    inputMainPart.value = format(evaluate(mathExpr), {notation: mode});
    inputPrevPart.classList.add('full-expr');

    if (inputPrevPart.classList.contains('full-expr')) addElementInHistory(mathExpr);
}

document.addEventListener('click', unaryOperators);

function auxiliaryOperators(e) {
    if (e.target.tagName !== 'BUTTON' || !e.target.classList.contains('aux-ops')) return;

    const mode = calculator.className.match(/\w+(?=-mode)/gm)?.join('');
    
    let temp;
    const number = format(Number(inputMainPart.value), {notation: mode});

    if (e.target.value === '+-') {
        temp = -number;
    }

    inputMainPart.value = temp;
}

document.addEventListener('click', auxiliaryOperators);

function binaryOperators(e) {
    if (e.target.tagName !== 'BUTTON' || !e.target.classList.contains('binary-operator')) return;
    
    const mode = calculator.className.match(/\w+(?=-mode)/gm)?.join('');
    let temp, mathExpr, prevNumber;
    const number = format(Number(inputMainPart.value), {notation: mode});

    if (/[xy]/.test(e.target.value)) {
        if (inputPrevPart.textContent.length === 0 || inputPrevPart.textContent.includes('=') && inputMainPart.value !== '') {
            temp = number;
            inputPrevPart.textContent = e.target.value.replace(/x/, temp);
        }
        else if (inputPrevPart.textContent.length !== 0) {
            prevNumber = inputPrevPart.textContent[inputPrevPart.textContent.search(/\d+/)];
            mathExpr = inputPrevPart.textContent.replace(/y/, inputMainPart.value);
            temp = format(evaluate(mathExpr), {notation: mode});
            inputPrevPart.textContent = mathExpr;
        }
    }
    else if (!/[xy]/.test(e.target.value) || !/[xy]/.test(inputPrevPart.textContent)) {
        if (inputPrevPart.textContent.length === 0 || inputPrevPart.textContent.includes('=') && inputMainPart.value !== '') {
            temp = number;
        }
        else if (inputPrevPart.textContent.length !== 0) {
            prevNumber = inputPrevPart.textContent.split(' ')[0];
            mathExpr = `${inputPrevPart.textContent}${number}`;
            temp = format(evaluate(mathExpr), {notation: mode});
        }

        if (prevNumber === number && !inputPrevPart.classList.contains('inputted-same-number')) {
            if (replaceBinaryOpsRegEx.test(inputPrevPart.textContent) && !inputPrevPart.textContent.slice(1).includes(e.target.value)) {
                inputPrevPart.textContent = inputPrevPart.textContent.replace(replaceBinaryOpsRegEx, e.target.value);
            }
            return;
        }
    
        inputPrevPart.textContent = `${temp} ${e.target.value} `;
    }

    inputPrevPart.classList.add('binary-operator-clicked');
    inputPrevPart.classList.remove('full-expr');

    inputMainPart.value = temp;

    inputPrevPart.classList.remove('inputted-same-number');

    if (mathExpr !== undefined) addElementInHistory(mathExpr);
}

function equal(e) {
    if (e.target.tagName !== 'BUTTON' || !e.target.classList.contains('equal-sign')) return;

    const mode = calculator.className.match(/\w+(?=-mode)/gm)?.join('');
    let mathExpr;

    if (inputMainPart.value.length !== 0 && !inputPrevPart.textContent.includes('=')) {
        if (/y/.test(inputPrevPart.textContent)) {
            mathExpr = inputPrevPart.textContent.replace(/y/, format(Number(inputMainPart.value), {notation: mode}));
        }
        else {
            mathExpr = inputPrevPart.textContent + format(Number(inputMainPart.value), {notation: mode});
        }

        inputMainPart.value = format(evaluate(mathExpr), {notation: mode});
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
    console.log(match);
    if (/.[\.\-+*=\/]/.test(match)) {
        return match.slice(0, 1);
    }
    else if (/0\d+/.test(match)) {
        return 0;
    }
    else {
        return '';
    }
}

function validator() {
    let inputValue = inputMainPart.value.replace(validatorRegExp, replacer);
    inputMainPart.value = inputValue;
}

// History and memory functionality
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

function openHistory(e) {
    const closestElem = e.target.closest('.calculator__button-show-history');

    if (!closestElem) return;

    const mobileHistoryBtn = closestElem.tagName === 'BUTTON' ? closestElem : closestElem.parentElement;

    historyPart.classList.toggle('active-mobile');
    mobileHistoryBtn.classList.toggle('active-mobile');
    body.classList.toggle('mobile-lock');
}

document.addEventListener('click', openHistory);

function memoryAdd(e) {
    if (e.target.value !== 'memory-add') return;

    const mode = calculator.className.match(/\w+(?=-mode)/gm)?.join('');
    const number = format(Number(inputMainPart.value), {notation: mode});

    if (memory.length > 0 && memory[0] !== '') {
        const tempMemoryItem = document.querySelector('.active-part__memory-item.result');

        tempMemoryItem.textContent = evaluate(`${tempMemoryItem.textContent} + ${number}`);

        memory[memory.length - 1] = `<div class='active-part__item memory-elem'>${tempMemoryItem.closest('.memory-elem').innerHTML}</div>`;
    }
    else memoryStore(number);

    localStorage.setItem('memory', memory.join(' | '));
}

/* function memorySubtractOrAdd(e) {
    if (e.target.value !== 'memory-subtract' || e.target.value !== 'memory-add') return;

    if (memory.length > 0 && memory[0] !== '') {
        const tempMemoryItem = document.querySelector('.active-part__memory-item.result');

        tempMemoryItem.textContent = evaluate(`${tempMemoryItem.textContent} ${e.target.value === 'memory-subtract' ? '-' : '+'} ${inputMainPart.value}`);
        
        memory[memory.length - 1] = `<div class='active-part__item memory-elem'>${tempMemoryItem.closest('.memory-elem').innerHTML}</div>`;
    }
    else e.target.value === 'memory-subtract' ? memoryStore(-inputMainPart.value) : memoryStore(inputMainPart.value);

    localStorage.setItem('memory', memory.join(' | '));
} */

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

    const mode = calculator.className.match(/\w+(?=-mode)/gm)?.join('');
    const number = format(Number(inputMainPart.value), {notation: mode});

    if (memory.length > 0 && memory[0] !== '') {
        const tempMemoryItem = document.querySelector('.active-part__memory-item.result');

        tempMemoryItem.textContent = evaluate(`${tempMemoryItem.textContent} - ${number}`);
        
        memory[memory.length - 1] = `<div class='active-part__item memory-elem'>${tempMemoryItem.closest('.memory-elem').innerHTML}</div>`;
    }
    else memoryStore(-number);

    localStorage.setItem('memory', memory.join(' | '));
}

function memoryReCall(e) {
    if (e.target.value !== 'memory-recall') return;

    inputMainPart.value = document.querySelector('.active-part__memory-item.result').textContent;
}

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

function switchAngleUnit(e) {
    if (e.target.tagName !== 'BUTTON' || !e.target.classList.contains('angle-switcher')) return;
    
    const temp = e.target.value === 'rad' ? 'deg' 
                : e.target.value === 'deg' ? 'grad' 
                : 'rad';
    
    e.target.value = temp
    e.target.textContent = toRegularCase(temp);
}

document.addEventListener('click', switchAngleUnit);

inputMainPart.addEventListener('keydown', (e) => e.preventDefault());

function activeExpMode(e) {
    if (!e.target.classList.contains('mode-changer')) return;

    e.target.classList.toggle('active-mode');
    calculator.classList.toggle(`${e.target.value}-mode`);
}

document.addEventListener('click', activeExpMode);

function changeClearButton(e) {
    if (e.target.tagName !== 'BUTTON' || !e.target.classList.contains('num-btn')) return;

    const clearBtn = document.querySelector('.clear-funcs[value="C"]');

    if (clearBtn === null) return;
    else if (inputMainPart.value.length > 0 && clearBtn.value === 'C' && calcMode !== 'standard') {
        clearBtn.textContent = 'CE';
        clearBtn.value = 'CE';
    }
}

document.addEventListener('click', changeClearButton); 