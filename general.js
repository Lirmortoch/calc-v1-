/* Variables */
const body = document.querySelector('body');

/* Functions */
function deactivateBtnForTime(btn) {
    btn.setAttribute("disabled", "");

    setTimeout(() => {
        btn.removeAttribute("disabled", "");
    }, '2000');
}

let toRegularCase = str => str[0].toUpperCase() + str.slice(1);

/* Theme switch */
class Theme {
    static #themeSwitcherIcon = body.querySelector('#switcher-mask');
    static #themeSwitcherIcons = [
    '<circle cx="12" cy="12" r="5"/><line x1="12" x2="12" y1="1" y2="3"/><line x1="12" x2="12" y1="21" y2="23"/><line x1="4.22" x2="5.64" y1="4.22" y2="5.64"/><line x1="18.36" x2="19.78" y1="18.36" y2="19.78"/><line x1="1" x2="3" y1="12" y2="12"/><line x1="21" x2="23" y1="12" y2="12"/><line x1="4.22" x2="5.64" y1="19.78" y2="18.36"/><line x1="18.36" x2="19.78" y1="5.64" y2="4.22"/>', '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'
    ];

    static #switchToLightMode(btn = '') {
        body.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
        Theme.#themeSwitcherIcon.innerHTML = Theme.#themeSwitcherIcons[1];
    
        if (btn !== '') deactivateBtnForTime(btn);
    }
    
    static #switchToMainMode(btn) {
        body.classList.remove('light-theme');
        localStorage.setItem('theme', 'main');
        Theme.#themeSwitcherIcon.innerHTML = Theme.#themeSwitcherIcons[0];
    
        deactivateBtnForTime(btn);
    }

    #switchTheme(e) {
        const closestElem = e.target.closest('.header__theme-switcher');
        const currentTheme = localStorage.getItem('theme') || 'main';
    
        if (!closestElem) return;
    
        currentTheme !== 'light' ? Theme.#switchToLightMode(closestElem) : Theme.#switchToMainMode(closestElem);
    }

    run() {
        const currentTheme = localStorage.getItem('theme') || 'main';

        if (currentTheme === 'light') {
            Theme.#switchToLightMode();
        }
        
        document.addEventListener('click', this.#switchTheme);
    }
}

// mobile menu 
class MobileMenu {
    #openCloseMobileMenu(e) {
        const closestElem = e.target.closest('.menu-button-toggler');
    
        if (!closestElem) return;
    
        const navBody = body.querySelector('.nav__body');
        const mobileNavIcon = closestElem.tagName === 'BUTTON' ? closestElem : closestElem.parentElement;
    
        navBody.classList.toggle('active-mobile');
        mobileNavIcon.classList.toggle('active-mobile');
        body.classList.toggle('mobile-lock');
    }
    run() {
        document.addEventListener('click', this.#openCloseMobileMenu);
    }
}

export {Theme, MobileMenu, body, deactivateBtnForTime, toRegularCase}