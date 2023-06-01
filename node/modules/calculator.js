class Calculator {
    constructor(n1, n2) {
        this.n1 = parseInt(n1);
        this.n2 = parseInt(n2);
    }

    add() {
        return this.n1 + this.n2;
    }

    subtract() {
        return this.n1 - this.n2;
    }

    multiply() {
        return this.n1 * this.n2;
    }

    divide() {
        return this.n1 / this.n2;
    }
}

module.exports = Calculator;