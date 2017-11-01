class Array2d {
    constructor(a) {
        this.a = a;
    }

    static create(a) {
        return new Array2d(a);
    }

    reset(fillWith = 0) {
        this.a = Array(this.getRowLength())
            .fill(fillWith)
            .map(() => Array(this.getColLength()).fill(fillWith));
    }

    has(row, col) {
        return row in this.a && col in this.a[row];
    }

    getColLength() {
        return this.a[0].length;
    }

    getRowLength() {
        return this.a.length;
    }

    get(row, col) {
        return this.has(row, col) ? this.a[row][col] : undefined;
    }

    hasNext(row, col) {
        return this.has(row, col + 1) || this.has(row + 1, 0) || false;
    }

    getNext(row, col) {
        let rowCol = {
            hasNext: this.hasNext(row, col),
            value: this.get(row, col),
        };
        if (this.has(row, col + 1)) {
            rowCol = { row, col: col + 1, type: 'col', ...rowCol };
        } else if (this.has(row + 1, 0)) {
            rowCol = { row: row + 1, col: 0, type: 'row', ...rowCol };
        }
        return rowCol;
    }

    canMerge(b, row, col) {
        return b.a.filter((blockRowValue, blockRowKey) => !blockRowValue.every((blockColValue, blockColKey) => {
            const gridRowKey = row + blockRowKey;
            const gridColKey = col + blockColKey;
            return blockColValue === 0 || (this.has(gridRowKey, gridColKey) && this.get(gridRowKey, gridColKey) === 0);
        })).length === 0;
    }

    * loop() {
        let [row, col, next] = [0, 0, ];
        do {
            yield { col, row };
            if (!this.hasNext(row, col)) {
                return { value: undefined, done: true };
            }
            next = this.getNext(row, col);
            row = next.row;
            col = next.col;
        } while (!next.done);
    }

    * loopBlock(b, row, col) {
        const startCol = col;
        let rowCounter = 0;
        let colCounter = 0;
        do {
            yield { row, col, rowCounter, colCounter, source: this };
            const next = b.getNext(rowCounter, colCounter);
            rowCounter = next.row;
            colCounter = next.col;
            if (next.type === 'row') {
                row++;
                col = startCol;
            } else {
                col++;
            }
        } while (b.has(rowCounter, colCounter));
    }

    merge(b, row, col) {
        const onLoop = (it) => {
            const current = it.next();
            if (!current.done) {
                const bValue = b.get(current.value.rowCounter, current.value.colCounter);
                if (bValue !== 0) {
                    this.a[current.value.row][current.value.col] = bValue;
                }
                onLoop(it);
            }
        };
        onLoop(this.loopBlock(b, row, col));
    }


    unmerge(b, row, col) {
        const onLoop = (it) => {
            const current = it.next();
            if (!current.done) {
                const bValue = b.get(current.value.rowCounter, current.value.colCounter);
                if (bValue !== 0) {
                    this.a[current.value.row][current.value.col] = 0;
                }
                onLoop(it);
            }
        };
        onLoop(this.loopBlock(b, row, col));  
    }

    

    // merge(b, row, col) {
    //     const startCol = col;
    //     let rowCounter = 0;
    //     let colCounter = 0;
    //     do {
    //         this.a[row][col] = b.get(rowCounter, colCounter);
    //         const next = b.getNext(rowCounter, colCounter);
    //         rowCounter = next.row;
    //         colCounter = next.col;
    //         if (next.type === 'row') {
    //             row++;
    //             col = startCol;
    //         } else {
    //             col++;
    //         }
    //     } while (b.has(rowCounter, colCounter));
    // }

    // unmerge(b, row, col) {
    //     const startCol = col;
    //     let rowCounter = 0;
    //     let colCounter = 0;
    //     do {
    //         this.a[row][col] = 0;
    //         const next = b.getNext(rowCounter, colCounter);
    //         rowCounter = next.row;
    //         colCounter = next.col;
    //         if (next.type === 'row') {
    //             row++;
    //             col = startCol;
    //         } else {
    //             col++;
    //         }
    //     } while (b.has(rowCounter, colCounter));
    // }
}

export default Array2d;
