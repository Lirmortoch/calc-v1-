/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./script.js":
/*!*******************!*\
  !*** ./script.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n\r\n\r\n;\r\n\r\nconst body = document.querySelector('body');\r\n\r\n/* Main functionality */\r\nconst input = body.querySelector('.input');\r\n\r\nconst inputPrev = input.firstElementChild;\r\nconst inputMainPart = input.lastElementChild;\r\n\r\nconst buttons = body.querySelector('.action-buttons');\r\n\r\nconst calcMode = 'standard';\r\nconst buttonsMainOps = ['%', 'CE', 'C', '⌫', '⅟x', 'x²', '²√x', '÷', 'X', '-', '+'];\r\nconst scientificButtons = [['2','nd'], 'π', 'e', '|x|', 'exp', 'mod', 'n!', ['x', 'y'], ['10', 'x'], 'log', 'ln'];\r\nconst numberButtons = [];\r\nconst scientificTopButtons = ['Trigonometry', 'Functions'];\r\n\r\nconst history = [];\r\nconst memory = [];\r\n\r\n/* Theme switch */\r\nconst themeSwitcherIcons = ['<circle cx=\"12\" cy=\"12\" r=\"5\"/><line x1=\"12\" x2=\"12\" y1=\"1\" y2=\"3\"/><line x1=\"12\" x2=\"12\" y1=\"21\" y2=\"23\"/><line x1=\"4.22\" x2=\"5.64\" y1=\"4.22\" y2=\"5.64\"/><line x1=\"18.36\" x2=\"19.78\" y1=\"18.36\" y2=\"19.78\"/><line x1=\"1\" x2=\"3\" y1=\"12\" y2=\"12\"/><line x1=\"21\" x2=\"23\" y1=\"12\" y2=\"12\"/><line x1=\"4.22\" x2=\"5.64\" y1=\"19.78\" y2=\"18.36\"/><line x1=\"18.36\" x2=\"19.78\" y1=\"5.64\" y2=\"4.22\"/>', '<path d=\"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z\"/>'];\r\n\r\nconst themeSwitcher = document.querySelector('.header__theme-switcher');\r\nconst themeSwitcherIcon = document.getElementById('switcher-mask');\r\nconst themeSwitcherGradient = document.getElementById('switcher-gradient');\r\n\r\nlet currentTheme = localStorage.getItem('theme');\r\n\r\nfunction deactivateBtnForTime() {\r\n    themeSwitcher.setAttribute(\"disabled\", \"\");\r\n\r\n    setTimeout(() => {\r\n        themeSwitcher.removeAttribute(\"disabled\", \"\");\r\n    }, '2000');\r\n}\r\n\r\nfunction switchToLightMode() {\r\n    body.classList.add('light-theme');\r\n    localStorage.setItem('theme', 'light');\r\n    themeSwitcherIcon.innerHTML = themeSwitcherIcons[1];\r\n    themeSwitcherGradient.style.fill = 'url(#linear-gradient-2)';\r\n    themeSwitcherGradient.style.stroke = 'url(#linear-gradient-2)';\r\n\r\n    deactivateBtnForTime();\r\n}\r\n\r\nfunction switchToMainMode() {\r\n    body.classList.remove('light-theme');\r\n    localStorage.setItem('theme', 'main');\r\n    themeSwitcherIcon.innerHTML = themeSwitcherIcons[0];\r\n    themeSwitcherGradient.style.fill = 'url(#linear-gradient-1)';\r\n    themeSwitcherGradient.style.stroke = 'url(#linear-gradient-1)';\r\n\r\n    deactivateBtnForTime();\r\n}\r\n\r\nfunction switchTheme() {\r\n    currentTheme = localStorage.getItem('theme');\r\n    currentTheme !== 'light' ? switchToLightMode() : switchToMainMode();\r\n}\r\n\r\nif (currentTheme === 'light') {\r\n    switchToLightMode();\r\n}\r\n\r\nthemeSwitcher.addEventListener('click', switchTheme);\r\n\r\n/* History switch */\r\nconst historyBlock = document.querySelector('.history-section');\r\nconst historyActivePart = historyBlock.querySelector('.active-part');\r\n\r\nlet currentHistoryMode = localStorage.getItem('history-mode');\r\n\r\nfunction switchHistoryMode(event) {\r\n    if (event.target.tagName !== 'BUTTON') return;\r\n    \r\n    const prevBtn = historyBlock.querySelector('.current-history-mode');\r\n    if (prevBtn) prevBtn.classList.remove('current-history-mode');\r\n\r\n    event.target.classList.add('current-history-mode');\r\n    localStorage.setItem('history-mode', event.target.value);\r\n\r\n    historyActivePart.style.display = 'block';\r\n}\r\n\r\nfunction turnOnHistoryMode(currentMode) {\r\n    const element = historyBlock.querySelector(`button[value=${currentMode}]`);\r\n    element.classList.add('current-history-mode');\r\n\r\n    historyActivePart.style.display = 'block';\r\n}\r\n\r\nif (currentHistoryMode !== null) turnOnHistoryMode(currentHistoryMode);\r\n\r\nhistoryBlock.addEventListener('click', switchHistoryMode);\r\n\r\nfunction initCalc() {\r\n    \r\n}\r\n\r\ninitCalc();\r\n\n\n//# sourceURL=webpack://calc/./script.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./script.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;