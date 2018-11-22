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
    <ul>
        <li><button class="die"><p>6</p></button></li>
        <li><button class="die"><p>10</p></button></li>
    
    </ul>
</div>
<div id="input">
    <label>Range</label><input type="range" min="1" max="30">
</div>
`


render(mainpage(makeappstate(current_rolls)), document.querySelector("#pagecontent"))
