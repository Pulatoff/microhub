function countClientStats(array) {
    let await_meals = 0
    let active = 0
    let inactive = 0
    for (let i = 0; i < array.length; i++) {
        if (array[i].statusClient === 'active') {
            active++
        } else if (array[i].statusClient === 'inactive') {
            inactive++
        } else if (array[i].statusClient === 'awaiting meals') {
            await_meals++
        } else {
            continue
        }
    }
    return { active: active, inactive: inactive, awaitingMeals: await_meals }
}

module.exports = countClientStats
