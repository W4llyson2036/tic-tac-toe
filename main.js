let ICON = {
    currentIcon: false,
    displayIcon: 'x',

    switchIcon(){ 
        let resultNewIcon = this.currentIcon ? ['x', true] : ['o', false];
        this.displayIcon = resultNewIcon[0];
        this.currentIcon = resultNewIcon[1] ? false : true;
    }, 
    
    get switchIconBgColor(){
        return this.currentIcon ? (this.colorBg = 'x-bg') : (this.colorBg = 'o-bg');
    }
}

let roundAccount = 0; 
let squareElements = document.querySelectorAll('.square');
let table = ['-', '-', '-', '-', '-', '-', '-', '-', ''];

squareElements.forEach((squareDivHTML, squareIndex) => {
    squareDivHTML.addEventListener('click', () => {
        let isSquareAvailable = checkingSquareAvailability(squareDivHTML);
        
        if (isSquareAvailable) {
            table[squareIndex] = squareDivHTML;
            roundAccount++;

            addIconImageInsideSquare(squareDivHTML);
            markSquareAsUnavailable(squareDivHTML);
            switchIcon(squareDivHTML);

            if (roundAccount >= 5) { 
                checkingWhoWon();
            }
        } 
    });
})

function switchIcon(divHTML) {
    ICON.switchIcon();
    divHTML.classList.add(`${ICON.switchIconBgColor}`);
}

function addIconImageInsideSquare(divHTML) {
    const IMG_ELEMENT = divHTML.querySelector('img');
    IMG_ELEMENT.setAttribute('src', `public/${ICON.displayIcon}.png`);
}

function markSquareAsUnavailable(divHTML) {
    divHTML.classList.add('marked', `icon-${ICON.displayIcon}`);
}

function checkingSquareAvailability(divHTML) {
    let isNotAvailable = ![...divHTML.classList].includes('marked');

    if (!isNotAvailable) {
        divHTML.classList.add('unavailable');
        setTimeout(() => {divHTML.classList.remove('unavailable')}, 520);
    }

    return isNotAvailable;
}

let SCORE = {
    playerX: 0,
    playerO: document.querySelector('score-o'),
}

function checkingWhoWon() {
    let xWon = false;
    let oWon = false;
    let isTie = roundAccount;

    const WINNING_COMBINATION_TABLE = [
        [table[0], table[1], table[2]], // H
        [table[3], table[4], table[5]], // H 
        [table[6], table[7], table[8]], // H
        [table[0], table[4], table[8]], // D
        [table[2], table[4], table[6]], // D
        [table[0], table[3], table[6]], // V
        [table[1], table[4], table[7]], // V
        [table[2], table[5], table[8]], // V 
    ]

    for (let combination of WINNING_COMBINATION_TABLE) {
        xWon = combination.every(div => {
            if (div instanceof HTMLElement && div.classList.contains('icon-x')) {
                return true;
            } 
        });

        oWon = combination.every(div => {
            if (div instanceof HTMLElement && div.classList.contains('icon-o')) {
                return true;
            } 
        })

        if (xWon) { 
            document.querySelector('.score-x').textContent = ++SCORE.playerX; 
            highlightTheTrueCombination(combination); 
            return; 
        }
        
        if (oWon) { 
            document.querySelector('.score-o').textContent = ++SCORE.playerO; 
            highlightTheTrueCombination(combination); 
            return; 
        }
    }  
    
    if (isTie == 9 && !xWon && !oWon) {
        squareElements.forEach(div => {
            div.classList.add('tie-bg');
        })
        
        return setTimeout(() => { resetGame() }, 1040);
    }

    function highlightTheTrueCombination(combination) {
        combination.forEach(div => {
            div.classList.add('highlight-the-true-combination');
        })
        squareElements.forEach(div => div.classList.add('bg-gray'));
        setTimeout(() => { resetGame() }, 740);
    }
}

function resetGame() {
    squareElements.forEach(div => {
        div.classList.remove('marked', 'icon-x', 'x-bg', 'icon-o', 'o-bg', 'bg-gray', 'highlight-the-true-combination', 'tie-bg');
        div.querySelector('img').removeAttribute('src');
    });

    table = [];
    roundAccount = 0;
    ICON.displayIcon = 'x';
    ICON.currentIcon = false;
}