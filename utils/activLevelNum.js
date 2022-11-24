module.exports = (value) => {
    switch (value) {
        case 'extrmely active':
            return 1.9
        case 'very active':
            return 1.725
        case 'moderate active':
            return 1.55
        case 'lightly active':
            return 1.375
        default:
            return 1.2
    }
}
