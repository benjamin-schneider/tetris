
import blocks from './blocks';
import Array2d from './Array2d';
// npm test -- src/Array2d.spec.js
const createGridArray = (rows, cols, fillWith = 0) =>
    Array(rows).fill(fillWith).map(() => Array(cols).fill(fillWith));

const [rows, cols, fillWith] = [20, 10, 0];

const grid = Array2d.create(createGridArray(rows, cols, fillWith));
const viewGrid = Array2d.create(createGridArray(rows, cols, fillWith));
const blockT = Array2d.create(blocks.T[0]);

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

    it('shoud detect if merging is possble', (done) => {
        const test = (row, col, result) => {
            const canMergeResult = grid.canMerge(blockT, row, col);
            expect(canMergeResult.success).toEqual(result);
        };
        test(0, 0, true);
        test(rows - blockT.getRowLength(), 0, true);
        test(0, cols - blockT.getColLength(), true);
        test(rows, 0, false);
        test(0, cols, false);

        
        const getRandomBlock = () => {
            const keys = Object.keys(blocks);
            const randomKey = keys[Math.floor(Math.random() * keys.length)];
            return blocks[randomKey];
        };
        const loop = (row, col) => {
            const block = Array2d.create(getRandomBlock()[0]); 
            const framesInterval = setInterval(() => {
                const canMergeResult = grid.canMerge(block, row, col);
                if (canMergeResult.success) {
                    if (row > 0) {
                        viewGrid.unmerge(block, row - 1, col);    
                    }
                    viewGrid.merge(block, row, col);
                    console.log(viewGrid.a);
                    row++;
                } else {
                    grid.merge(block, row - 1, col);
                    viewGrid.merge(block, row - 1, col);
                    console.log(grid.a);
                    clearInterval(framesInterval); 
                    
                }    
            }, 100);
        };

        setTimeout(() => loop(0, 0), 0);  
        setTimeout(() => loop(0, 5), 2000);
        setTimeout(() => loop(0, 2), 4000);

        setTimeout(() => done(), 9000);
        

    });

    it('shoud merge', () => {
        grid.merge(Array2d.create(blocks.I[0]), 0, 0);
        expect(grid.a[0]).toEqual([1, 1, 1, 1, 0, 0, 0, 0, 0, 0]);
    });

    it('shoud unmerge', () => {
        grid.unmerge(Array2d.create(blocks.I[0]), 0, 0);
        expect(grid.a[0]).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

        // const it = grid.loopBlock(Array2d.create(blocks.I[0]), 0, 0);
        // console.log(it);
        // console.log(it.next())
        // console.log(it.next())
        // console.log(it.next());
        // console.log(it.next());
        // console.log(it.next());
        // console.log(it.next());
        // console.log(it.next());
        // console.log(it.next());
        
    });

});
