
import blocks from './blocks';
import Array2d from './Array2d';
// npm test -- src/Array2d.spec.js
const createGrid = (rows, cols, fillWith = 0) =>
    Array(rows).fill(fillWith).map(() => Array(cols).fill(0));

const [rows, cols, fillWith] = [20, 10, 0];
const grid = createGrid(rows, cols, fillWith);
const array2d = new Array2d(grid);
const blockT = new Array2d(blocks.T[0]);

describe('Array2d test suite', () => {
    it('should detect boundaries', () => {
        expect(array2d.has(0, 0)).toEqual(true);
        expect(array2d.has(rows - 1, cols - 1)).toEqual(true);
        expect(array2d.has(rows, 0)).toEqual(false);
        expect(array2d.has(0, cols)).toEqual(false);
    });

    it('should get a 2d value', () => {
        expect(array2d.get(0, 0)).toEqual(0);
        expect(array2d.get(rows, cols)).toBeUndefined();
    });

    it('should detect next value', () => {
        expect(array2d.hasNext(0, 0)).toEqual(true);
        expect(array2d.hasNext(rows - 1, cols - 1)).toBeFalsy();
    });

    it('should get next value', () => {
        const test = (row, col, response) => {
            expect(array2d.getNext(row, col)).toEqual({
                hasNext: true,
                value: 0,
                ...response,
            });
        };
        test(0, 0, { row: 0, col: 1, type: 'col' });
        test(0, cols - 2, { row: 0, col: 9, type: 'col' });
        test(0, cols - 1, { row: 1, col: 0, type: 'row' });
    });

    it('shoud detect if merging is possble', () => {
        const test = (row, col, result) => {
            const canMargeResult = array2d.canMerge(blockT, row, col, 0, 0);
            expect(canMargeResult.success).toEqual(result);console.dir(canMargeResult);
        };
        test(0, 0, true);
        test(rows - blockT.getRowLength(), 0, true);
        test(0, cols - blockT.getColLength(), true);
        test(rows, 0, false);
        test(0, cols, false);

console.log( array2d.merge(blockT, 0, 0) );

    });
});
