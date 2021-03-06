import blocks from './blocks';
import Array2d from './Array2d';
// npm test -- src/Array2d.spec.js
const createGridArray = (rows, cols, fillWith = 0) =>
    Array(rows).fill(fillWith).map(() => Array(cols).fill(fillWith));

const [rows, cols, fillWith] = [20, 10, 0];

const grid = Array2d.create(createGridArray(rows, cols, fillWith));
const viewGrid = Array2d.create(createGridArray(rows, cols, fillWith));
const blockT = Array2d.create(blocks.T[0]);

const getRandomBlock = () => {
    const keys = Object.keys(blocks);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return blocks[randomKey];
};
/* global jasmine */
jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

describe('Array2d test suite', () => {
    it('should detect boundaries', () => {
        expect(grid.has(0, 0)).toEqual(true);
        expect(grid.has(rows - 1, cols - 1)).toEqual(true);
        expect(grid.has(rows, 0)).toEqual(false);
        expect(grid.has(0, cols)).toEqual(false);
    });

    it('should get a 2d value', () => {
        expect(grid.get(0, 0)).toEqual(0);
        expect(grid.get(rows, cols)).toBeUndefined();
    });

    it('should detect next value', () => {
        expect(grid.hasNext(0, 0)).toEqual(true);
        expect(grid.hasNext(rows - 1, cols - 1)).toBeFalsy();
    });

    it('should get next value', () => {
        const test = (row, col, response) => {
            expect(grid.getNext(row, col)).toEqual({
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
            const canMergeResult = grid.canMerge(blockT, row, col);
            expect(canMergeResult).toEqual(result);
        };
        test(0, 0, true);
        test(rows - blockT.getRowLength(), 0, true);
        test(0, cols - blockT.getColLength(), true);
        test(rows, 0, false);
        test(0, cols, false);


        const g = Array2d.create([
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [1, 1, 1, 0],
        ]);

        const b = Array2d.create([
            [0, 1],
            [1, 1],
            [0, 1],
        ]);
        //console.log( g.canMerge(b, 2, 2) );

        const canMerge = (block, parentRow, parentCol) => {
            return block.a.filter((blockRowValue, blockRowKey) => !blockRowValue.every((blockColValue, blockColKey) => {
                const gridRowKey = parentRow + blockRowKey;
                const gridColKey = parentCol + blockColKey;
                return blockColValue === 0 || (g.has(gridRowKey, gridColKey) && g.get(gridRowKey, gridColKey) === 0);
            })).length === 0;
        };
        //console.log( canMerge(b, 2, 2) );

    });

    it('should merge', () => {
        grid.merge(Array2d.create(blocks.I[0]), 0, 0);
        expect(grid.a[0]).toEqual([1, 1, 1, 1, 0, 0, 0, 0, 0, 0]);
    });

    it('should unmerge', () => {
        grid.unmerge(Array2d.create(blocks.I[0]), 0, 0);
        expect(grid.a[0]).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    });
});
