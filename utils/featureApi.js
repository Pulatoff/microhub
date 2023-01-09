class featureApi {
    constructor(clientQuery, databaseQuery) {
        this.clientQuery = clientQuery
        this.databaseQuery = databaseQuery
    }
    filter() {}
    sort() {}
    field() {
        const fieldQuery = this.clientQuery.field.split(',')
        this.databaseQuery
    }
    pagination() {}
}
