let roll_a_d10 = () => Math.floor(Math.random() * Math.floor(10)) + 1

function rolldice(number_of_dice) {
    let ret = []
    for (let x of (Array(number_of_dice).keys())) {
        ret.push(roll_a_d10())
    }
    ret.sort((x, y) => y - x)
    return ret
}

function countsuccesses(success_set, double_set, roll_vec) {
    function countroll (roll) {
        let as_success = success_set.has(roll) ? 1 : 0;
        let as_double = double_set.has(roll) ? 2 : 1;
        return as_success * as_double;
    }
    return roll_vec.map(countroll).reduce((a, b) => a + b)
}

function reroll_once(selected_set, roll_vec) {
    let new_rolls = roll_vec.map((roll, ind) => selected_set.has(ind) ? roll_a_d10() : roll)
    new_rolls.sort((x, y) => y - x);
    return new_rolls
}

export {rolldice, countsuccesses, reroll_once}