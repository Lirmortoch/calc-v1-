'use strict'

const body = document.querySelector('body');



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

class Calculator { 
    #init() {
        
    }

    run() {

        this.#init();
    }
}

// class Calculator { 
//     #body = document.querySelector('body');

//     #themeSwitcherIcons = [
//         '<circle cx="12" cy="12" r="5"/><line x1="12" x2="12" y1="1" y2="3"/><line x1="12" x2="12" y1="21" y2="23"/><line x1="4.22" x2="5.64" y1="4.22" y2="5.64"/><line x1="18.36" x2="19.78" y1="18.36" y2="19.78"/><line x1="1" x2="3" y1="12" y2="12"/><line x1="21" x2="23" y1="12" y2="12"/><line x1="4.22" x2="5.64" y1="19.78" y2="18.36"/><line x1="18.36" x2="19.78" y1="5.64" y2="4.22"/>', 
//         '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'
//     ];
//     #themeSwitcher = document.querySelector('.header__theme-switcher');
//     #themeSwitcherIcon = document.getElementById('switcher-mask');
//     #themeSwitcherGradient = document.getElementById('switcher-gradient');
    
//     #currentTheme = localStorage.getItem('theme');

//     #deactivateBtnForTime() {
//         this.#themeSwitcher.setAttribute("disabled", "");
    
//         setTimeout(() => {
//             this.#themeSwitcher.removeAttribute("disabled", "");
//         }, '2000');
//     }
    
//     #switchToLightMode() {
//         this.#body.classList.add('light-theme');
//         localStorage.setItem('theme', 'light');
//         this.#themeSwitcherIcon.innerHTML = this.#themeSwitcherIcons[1];
//         this.#themeSwitcherGradient.style.fill = 'url(#linear-gradient-2)';
//         this.#themeSwitcherGradient.style.stroke = 'url(#linear-gradient-2)';
    
//         this.#deactivateBtnForTime();
//     }
    
//     #switchToMainMode() {
//         this.#body.classList.remove('light-theme');
//         localStorage.setItem('theme', 'main');
//         this.#themeSwitcherIcon.innerHTML = this.#themeSwitcherIcons[0];
//         this.#themeSwitcherGradient.style.fill = 'url(#linear-gradient-1)';
//         this.#themeSwitcherGradient.style.stroke = 'url(#linear-gradient-1)';
    
//         this.#deactivateBtnForTime();
//     }
    
//     #init() {
//         if (this.#currentTheme === 'light') {
//             this.#switchToLightMode();
//             this.#themeSwitcher.removeAttribute("disabled", "");
//         }

//         this.#themeSwitcher.addEventListener('click', () => {
//             this.#currentTheme = localStorage.getItem('theme');
//             this.#currentTheme !== 'light' ? this.#switchToLightMode() : this.#switchToMainMode();
//         });
//     }

//     run() {
//         this.#init();
//     }
// }

const calc = new Calculator();

calc.run();