export class XMLComponent {
    constructor() {}

    set seq(seq) {
        this._seq = seq
        this.generateContainer()
    }

    get seq() {
        return this._seq
    }

    set fullComponent(fullComponent) {
        this._fullComponent = fullComponent
    }

    get fullComponent() {
        return this._fullComponent
    }

    generateContainer() {
        return this.fullComponent
    }

    valueChanged(e) {
        this[e.target.name] = e.target.value
    }

    findSession(session) {
        if (Array.isArray(session)) {
            for (let object of session) {
                const result = this.findSession(object, this.name)
                if (result) {
                    result.parent = object
                    return result
                }
            }
        } else if (typeof session === 'object') {
            for (let key in session) {
                if (session[key] === this.name && key === 'value') {
                    return session
                } else {
                    if (key === 'database' || key === 'form' || key === 'nodes') {
                        const result = this.findSession(session[key], this.name)
                        if (result) {
                            if (!result.parent) result.parent = session[key]
                            return result
                        }
                    }
                }
            }
        }
    }
}