function formatMacros(array) {
    const macros = { cals: 0, carbs: 0, fat: 0, protein: 0 }

    for (let i = 0; i < array.length; i++) {
        const macro = array[i]
        if (macro.name.toLowerCase() === 'fat') {
            macros.fat = macro.amount
        } else if (macro.name.toLowerCase() === 'protein') {
            macros.fat = macro.amount
        } else if (macro.name.toLowerCase() === 'calories') {
            macros.cals = macro.amount
        } else if (macro.name.toLowerCase() === 'carbohydrates') {
            macros.carbs = macro.amount
        }
    }
    return macros
}
