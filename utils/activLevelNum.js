module.exports = (value) => {
    switch (value) {
        case 'extrmely_active':
            return 1.9
        case 'very_active':
            return 1.725
        case 'moderate_active':
            return 1.55
        case 'lightly_active':
            return 1.375
        default:
            return 1.2
    }
}
