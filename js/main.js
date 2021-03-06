import { html, render } from 'https://unpkg.com/lit-html?module'
import { rolldice, countsuccesses, reroll_once } from './rolldice.js'

let appstate = {
    roll_number: 3,
    min_dice: 1,
    max_dice: 30,
    success: new Set([10, 9, 8, 7]),
    double: new Set([10]),
    selected: new Set([]),
    auto: 0,
    roll: rolldice(10),
    select_mode: "multiple",
    roll_in: new Set([]),
    display_successes: false,
    counted_successes: 0,
    history: [],
    display_history: false
}

function mod(mod_fn) {
    return function() {
        mod_fn()
        render_page()
    }
}

function add_to_history(appstate) {
    appstate.history.unshift({
        success: new Set(appstate.success),
        double: new Set(appstate.double),
        auto: appstate.auto,
        counted_successes: appstate.counted_successes,
        roll: JSON.parse(JSON.stringify(appstate.roll)),
        roll_number: appstate.roll.size
    })
    return appstate
}

function roll_the_dice(appstate) {
    return function() {
        add_to_history(appstate);
        console.log(appstate.history);
        let the_roll = rolldice(appstate.roll_number);
        appstate.roll = the_roll
        appstate.roll_in = new Set(the_roll.keys());
        render_page();
    }
}

function set_roll_number(appstate, new_number) {
    new_number =  Math.max(appstate.min_dice, new_number);
    appstate.roll_number = new_number;
    render_page();
}

function set_auto_number(appstate, new_number) {
    appstate.auto = Math.max(new_number, 0)
    render_page();
}

function toggle_appstate_set(the_set, questioned_member) {
    if (the_set.has(questioned_member)) {
        the_set.delete(questioned_member);
    } else {
        the_set.add(questioned_member)
    }
    render_page();
}

let roll_line = (rollobj) => html`
<p>${rollobj.timestamp.getHours()}:${rollobj.timestamp.getMinutes()}:${rollobj.timestamp.getSeconds()}
    || ${rollobj.successes} successes rolling ${rollobj.rolls.join(', ')}, with double ${rollobj.double} rerolling ${rollobj.reroll}</p>
`

let checked_string = "checked"
let empty_string = ""

function make_checkbox(selected_set, numbah) {
    if (selected_set.has(numbah + 1)) {
        return html`<input type="checkbox" id="reroll-${numbah + 1}" @change='${() => toggle_appstate_set(selected_set, numbah + 1)}' checked>`
    } else {
        return html`<input type="checkbox" id="reroll-${numbah + 1}"  @change='${() => toggle_appstate_set(selected_set, numbah + 1)}'>`
    }
}

let dice_list = (selector_name, selected_set) =>
    [...Array(10).keys()].map((numbah) =>  html`
    <li>
        <label for="reroll-${numbah + 1}">${numbah + 1}</label>
        ${make_checkbox(selected_set, numbah)}
    </li>
    `)

let dice_number_selector = (selector_name, selected_set) => html`
<ul id="${selector_name}-list" class="dice-number-selector">
    ${dice_list(selector_name, selected_set)}
</ul>
`
function make_selected_flag(appstate, roll_index) {
    let dieSelected = appstate.selected.has(roll_index);
    let modeIsMultiple = appstate.select_mode == "multiple";
    let selected_number = new Set()
    for (let r of appstate.selected) {
        selected_number.add(appstate.roll[r])
    }
    let isMemberOfMultiple = selected_number.has(appstate.roll[roll_index]);
    let isSelected = dieSelected || (modeIsMultiple && isMemberOfMultiple);
    return isSelected ? "selected" : "";
}

function make_result_flag(appstate, roll_index) {
    let isSuccess = appstate.success.has(appstate.roll[roll_index]);
    let isDouble = appstate.double.has(appstate.roll[roll_index]);
    let successflag = isSuccess ? "success" : "";
    let doubleflag = isDouble ? "double" : "";
    return successflag + " " + doubleflag
}

function toggle_selected_die(appstate, roll_index) {
    return function () {
        let directlySelected = appstate.selected.has(roll_index);
        let modeIsMultiple = appstate.select_mode == "multiple";
        if (modeIsMultiple && !directlySelected) {
            let thisvalue = appstate.roll[roll_index];
            for (let x of appstate.selected) {
                if (appstate.roll[x] === thisvalue) {
                    appstate.selected.delete(x);
                    directlySelected = true;
                }                
            }
            appstate.selected.add(roll_index);
        } 
        if (directlySelected) {
            appstate.selected.delete(roll_index);
        } else {
            appstate.selected.add(roll_index);
        }
        render_page();
    }
}

let make_die_li_fn = (appstate) => (roll_index) => html`
<li><button id="${Math.random()}" class="${!appstate.roll_in.has(roll_index) ? 'die' : 'shadowdie'}
 ${make_selected_flag(appstate, roll_index)} ${make_result_flag(appstate, roll_index)}" type="button" @click='${toggle_selected_die(appstate, roll_index)}'>
        <p>${appstate.roll[roll_index]}</p>
    </button>
</li>
`

let make_dicelist = (appstate) => html`
<ul id="dicelist">
    ${[...Array(appstate.roll.length).keys()].map(make_die_li_fn(appstate))}
</ul>
`

function reroll_button_press(appstate) {
    return function () {
        let actual_selected = appstate.selected;
        let selected_rolls = new Set([...appstate.selected].map((select_ind) => appstate.roll[select_ind]));
        if (appstate.select_mode === "multiple") {
            actual_selected = new Set(appstate.selected);
            for (let ind of appstate.roll.keys()) {
                let roll = appstate.roll[ind];
                if (selected_rolls.has(roll)) {
                    actual_selected.add(ind);
                }
            }
        }
        console.log(actual_selected);
        console.log(appstate.roll);
        appstate.roll = reroll_once(actual_selected, appstate.roll);
        appstate.selected.clear();
        appstate.roll_in = new Set(actual_selected);
        render_page();
        return appstate;
    }
}

let history_line = (history_node) => html`
<li>
    <div>
        ${history_node.counted_successes + history_node.auto}
        (${history_node.counted_successes} + ${history_node.auto})
    </div>
    <div>
        ${JSON.stringify([...history_node.success])}
    </div>
    <div>
        ${JSON.stringify([...history_node.double])}
    </div>
    <div>
        ${JSON.stringify(history_node.roll)}
    </div>
</li>
`

function set_display_history (appstate, new_showing) {
    appstate.display_history = new_showing;
    console.log('this happens');
    render_page();
    return ''
}
let history_readout = (appstate) => html`
<div id="historyreadout">
    <ul>
        <li class="legend">
            <div>Successes</div>
            <div>Targets</div>
            <div>Double</div>
            <div>Raw Roll</div>
        </li>
        ${appstate.history.map(history_line)}
    </ul>
    <button class="closebutton" @click='${() => set_display_history(appstate, false)}'>Close</button>
</div>
`

let mainpage = (appstate) => html`
${appstate.display_history ? history_readout(appstate) : ''}
${appstate.display_successes || appstate.roll_in.size === 0 ? html`
    <div id="successesreadout">
        <div>Roll: ${appstate.counted_successes}</div>
        <div>Auto: ${appstate.auto}</div>
        <div id="numbah">
            ${appstate.counted_successes + appstate.auto}
        </div>
        <div>Total Successes</div>
    </div>
    ` : ''}

<button id="historybutton" @click='${() => set_display_history(appstate, true)}'>History</button>

<div id="dicereadout">
    ${make_dicelist(appstate)}
</div>
<div id="input">
    <ul id="inputlist">
        <li>
            <div class="segment">
                <button @click=${roll_the_dice(appstate)} id="rollbutton">ROLL</button>
                <button @click=${reroll_button_press(appstate)} id="rerollbutton">REROLL selected</button>
            </div>
        </li>
        <li>
    <div class="segment" id="d-quantity">
        <label>Dice to Roll</label>
        <input class="direct-input" type="number" min=1 max=99 value="${appstate.roll_number}" @input='${(e) => set_roll_number(appstate, e.target.value)}'>
        <div class="acceso-range">
            <button class="incdec" type="button" @click='${() => set_roll_number(appstate, appstate.roll_number - 1)}'>-</button>
            <input type="range" min='${appstate.min_dice}' max='${appstate.max_dice}' value="${appstate.roll_number}" @input='${(e) => set_roll_number(appstate, e.target.value)}'>
            <button class="incdec" type="button" @click='${() => set_roll_number(appstate, appstate.roll_number + 1)}'>+</button>
        </div>
    </div>
        </li>
        <li>
    <div class="segment" id="auto-successes-selector">
        <label>Auto Successes</label>
        <button class="incdec" type="button" @click='${() => set_auto_number(appstate, appstate.auto - 1)}'>-</button>
        <input class="direct-input" type="number" min=1 max=99 value="${appstate.auto}" @input='${(e) => set_auto_number(appstate, e.target.value)}'>
        <button class="incdec" type="button" @click='${() => set_auto_number(appstate, appstate.auto + 1)}'>+</button>
    </div>
        </li>
        <li>
    <div class="segment">
        <label>Target</label>
        ${dice_number_selector('target', appstate.success)}
    </div>
        </li>
        <li>
    <div class="segment">
        <label>Double</label>
        ${dice_number_selector('double', appstate.double)}
    </div>
        </li>
        <li>
    <div class="segment">
        <label>Select Mode</label>
        <ul id="select-mode-picker" class="boolean-mode-picker">
            <li>
                <label for="select-mode-single">Single Die</label>
                <input type="radio" name="select-mode" id="select-mode-single" @input='${mod(() => appstate.select_mode = "single")}'>
            </li>
            <li>
                <label for="select-mode-all">All of Number</label>
                <input type="radio" name="select-mode" id="select-mode-all" checked @input='${mod(() => appstate.select_mode = "multiple")}' >
            </li>
        </ul>
    </div>
        </li>
    <div class="segment">
        <label>Display Successes</label>
        <ul id="success_mode_picker" class="boolean-mode-picker">
            <li>
                <label for="display-mode-yes">Show</label>
                <input type="radio" name="display-mode" id="display-mode-yes" @input='${mod(() => appstate.display_successes = true)}'>
            </li>
            <li>
                <label for="display-mode-no">Hide During Rollout</label>
                <input type="radio" name="display-mode" id="display-mode-no" checked @input='${mod(() => appstate.display_successes = false)}' >
            </li>
        </ul>
    </div>
        </li>
    </ul>
</div>
</div>
`
let roll_a_dx = (x) => Math.floor(Math.random() * Math.floor(x))

async function roll_in_dice(appstate) {
    if (appstate.roll_in.size != 0) {
        setTimeout(function () {
            appstate.roll_in.delete([...appstate.roll_in.values()][roll_a_dx(appstate.roll_in.size)]);
            render_page();
        }, 
        (100));
    }
}

async function render_page() {
    appstate.counted_successes = countsuccesses(appstate.success, appstate.double, appstate.roll);
    render(mainpage(appstate), document.querySelector("#pagecontent"));
    roll_in_dice(appstate);
}

roll_the_dice(appstate)();