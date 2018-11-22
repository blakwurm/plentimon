import { html, render } from 'https://unpkg.com/lit-html@0.7.1/lit-html.js'

let current_rolls = [
    {successes: 4, rolls: [10, 9, 4, 6, 2], reroll: [1], double: [10, 9], timestamp: new Date('1995-12-17T03:24:00')}
]

function makeappstate(the_rolls) {
    return {rolls: the_rolls}
}

let roll_line = (rollobj) => html`
<p>${rollobj.timestamp.getHours()}:${rollobj.timestamp.getMinutes()}:${rollobj.timestamp.getSeconds()}
    || ${rollobj.successes} successes rolling ${rollobj.rolls.join(', ')}, with double ${rollobj.double} rerolling ${rollobj.reroll}</p>
`


let the_console = (appstate) => html`
<div id="console">
    ${appstate.rolls.map(roll_line)}
</div>
`

let mainpage = (appstate) => html`
<div id="dicereadout">
    <ul id="dicelist">
        <li><button class="die" type="button"><p>6</p></button></li>
        <li><button class="die" type="button"><p>10</p></button></li>
        <li><button class="die" type="button"><p>10</p></button></li>
        <li><button class="die" type="button"><p>10</p></button></li>
        <li><button class="die" type="button"><p>10</p></button></li>
        <li><button class="die" type="button"><p>10</p></button></li>
        <li><button class="die" type="button"><p>10</p></button></li>
        <li><button class="die" type="button"><p>10</p></button></li>
        <li><button class="die" type="button"><p>10</p></button></li>
        <li><button class="die" type="button"><p>10</p></button></li>
        <li><button class="die" type="button"><p>10</p></button></li>
        <li><button class="die" type="button"><p>10</p></button></li>
        <li><button class="die" type="button"><p>10</p></button></li>
        <li><button class="die" type="button"><p>10</p></button></li>
        <li><button class="die" type="button"><p>10</p></button></li>
        <li><button class="die" type="button"><p>10</p></button></li>
        <li><button class="die" type="button"><p>10</p></button></li>
        <li><button class="die" type="button"><p>10</p></button></li>
        <li><button class="die" type="button"><p>10</p></button></li>
        <li><button class="die" type="button"><p>10</p></button></li>
        <li><button class="die" type="button"><p>6</p></button></li>
        <li><button class="die" type="button"><p>6</p></button></li>
        <li><button class="die" type="button"><p>6</p></button></li>
        <li><button class="die" type="button"><p>6</p></button></li>
        <li><button class="die" type="button"><p>6</p></button></li>
        <li><button class="die" type="button"><p>6</p></button></li>
        <li><button class="die" type="button"><p>6</p></button></li>
        <li><button class="die" type="button"><p>6</p></button></li>
        <li><button class="die" type="button"><p>6</p></button></li>
        <li><button class="die" type="button"><p>6</p></button></li>
    
    </ul>
</div>
<div id="input">
    <div class="segment">
        <button id="rollbutton">ROLL</button>
    </div>
    <div class="segment" id="d-quantity">
        <label>Dice to Roll</label>
        <input class="direct-input" type="number" min=1 max=30 value=1>
        <div class="acceso-range">
            <button class="incdec" type="button">-</button>
            <input type="range" min=1 max=30 value=1>
            <button class="incdec" type="button">+</button>
        </div>
    </div>
    <div class="segment">
        <label>Select Mode</label>
        <ul id="select-mode-picker">
            <li>
                <label for="select-mode-single">Single Die</label>
                <input type="radio" name="select-mode" id="select-mode-single">
            </li>
            <li>
                <label for="select-mode-all">All of Number</label>
                <input type="radio" name="select-mode" id="select-mode-all" checked>
            </li>
        </ul>
    </div>
    <div class="segment">
        <label>Reroll</label>
        <ul id="reroll-list">
            <li>
                <label>10</label>
                <input type="checkbox" id="reroll-10">
            </li>
            <li>
                <label>9</label>
                <input type="checkbox" id="reroll-9">
            </li>
            <li>
                <label>8</label>
                <input type="checkbox" id="reroll-8">
            </li>
            <li>
                <label>7</label>
                <input type="checkbox" id="reroll-7">
            </li>
            <li>
                <label>6</label>
                <input type="checkbox" id="reroll-6">
            </li>
            <li>
                <label>5</label>
                <input type="checkbox" id="reroll-5">
            </li>
            <li>
                <label>4</label>
                <input type="checkbox" id="reroll-4">
            </li>
            <li>
                <label>3</label>
                <input type="checkbox" id="reroll-3">
            </li>
            <li>
                <label>2</label>
                <input type="checkbox" id="reroll-2">
            </li>
            <li>
                <label>1</label>
                <input type="checkbox" id="reroll-1">
            </li>
        </ul>
    </div>
    <div class="segment">
        <label>Dice Tricks (With Selected Dice)</label>
        <ul id="tricklist">
            <li>
                <button class="trick">Reroll X's</button>
            </li>
            <li>
                <button class="trick">Reroll X's Until Gone</button>
            </li>
        </ul>
    </div>
</div>
</div>
`


render(mainpage(makeappstate(current_rolls)), document.querySelector("#pagecontent"))
