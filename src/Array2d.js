class Array2d {
    constructor(a) {
        this.a = a;
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

    canMerge(b, row, col, bRow = 0, bCol = 0, initialRowCol = {}) {
        if (this.has(row, col) && this.get(row, col) === 0) {
            if (!initialRowCol.row && !initialRowCol.col) {
                Object.assign(initialRowCol, { row, col });
            }
            if (!b.hasNext(bRow, bCol)) {
                return {
                    initialRowCol,
                    success: true,
                };
            }
            const next = this.getNext(row, col);
            const nextB = b.getNext(bRow, bCol);
            if (!next.hasNext) {
                return { success: false };
            }
            if (next.type === 'row' && nextB.type === 'col') {
                return { success: false };
            }
            if (nextB.type === 'row') {
                const newRowInitialCol = (col + 1) - b.getColLength();
                if (!this.has(row + 1, newRowInitialCol)) {
                    return { success: false };
                }
                next.col = newRowInitialCol;
            }        
            return this.canMerge(
                b,
                next.row,
                next.col,
                nextB.row,
                nextB.col,
                initialRowCol,
            );
        }
        return { success: false };
    }

    merge(b, row, col) {
        let rowCounter = 0;
        let colCounter = 0;
        while (b.hasNext(rowCounter, colCounter)) {
            this.a[row][col] = b.get(rowCounter, colCounter);
            let next = b.getNext(rowCounter, colCounter);
            rowCounter = next.row;
            colCounter = next.col;
            if (next.type === 'row') {
                row++;
                col = 0;
            } else {
                col++;
            }
        }
        console.log( this.a );
    }
}

export default Array2d;
