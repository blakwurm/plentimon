let roll_a_d10 = () => Math.floor(Math.random() * Math.floor(10)) + 1

function rolldice(number_of_dice) {
    let ret = []
    for (let x of (Array(number_of_dice).keys())) {
        ret.push(roll_a_d10())
    }
    ret.sort((x, y) => y - x)
    return ret
}

export {rolldice}