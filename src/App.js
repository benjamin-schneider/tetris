import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './App.css';
import { getRandomBlock, getNextOrientedBlock } from './blocks';
import Array2d from './Array2d';
import Grid from './Grid';

const createGridArray = (rows, cols, fillWith = 0) =>
    Array(rows).fill(fillWith).map(() => Array(cols).fill(fillWith));

class App extends Component {
    constructor(props) {
        super(props);
        const block = getRandomBlock();
        const viewGrid = Array2d.create(createGridArray(props.rows, props.cols));
        this.gameInterval = null;
        const col = Math.floor(props.cols / 2 - block.orientedBlock[0].length / 2);
        viewGrid.merge(Array2d.create(block.orientedBlock), 0, col);
        this.state = {
            row: 0,
            col,
            grid: Array2d.create(createGridArray(props.rows, props.cols)),
            viewGrid,
            direction: null,
            block,
            nextBlock: getRandomBlock(),
        };
    }

    componentDidMount() {
        global.document.addEventListener('keydown', this.onKeyDownHandler.bind(this));
        this.gameInterval = setInterval(() => this.move('down'), 400);
    }

    onKeyDownHandler(event) {
        const { code } = event;
        switch (code) {
            case 'Space' : this.rotate(); break;
            case 'ArrowLeft' : this.move('left'); break;
            case 'ArrowRight' : this.move('right'); break;
            case 'ArrowDown' : this.move('down'); break;
            default : break;
        }
        event.preventDefault();
    }

    rotate() {
        const { col, block, grid, row, viewGrid } = this.state;
        const nextOrientedBlock = getNextOrientedBlock(block);
        const canMergeResult = grid.canMerge(Array2d.create(nextOrientedBlock.orientedBlock), row, col);
        if (canMergeResult) {
            viewGrid.unmerge(Array2d.create(block.orientedBlock), row, col);
            this.setState({
                block: nextOrientedBlock,
                viewGrid,
            });
        }
    }

    move(direction) {
        const { block, col, grid, row, viewGrid } = this.state;
        const tryToMove = (mergeParams, nextState) => {
            viewGrid.unmerge(Array2d.create(block.orientedBlock), row, col);
            const canMergeResult = grid.canMerge(...mergeParams);
            if (canMergeResult) {
                viewGrid.merge(...mergeParams);
                this.setState(nextState);
            } else if (direction === 'down') {
                if (row === 0 && !canMergeResult) {
                    clearInterval(this.gameInterval);
                    return;
                }
                const lastRowMergeParams = [...mergeParams];
                lastRowMergeParams[1] -= 1;
                grid.merge(...lastRowMergeParams);
                const centerCol = Math.floor(this.props.cols / 2 - this.state.nextBlock.orientedBlock[0].length / 2);
                const state = {
                    row: 0,
                    col: centerCol,
                    block: this.state.nextBlock,
                    nextBlock: getRandomBlock(),
                    grid,
                    viewGrid,
                };
                const clearedLines = Array2d.create(this.state.grid.a.filter(row => !row.every(col => col !== 0)));
                if (clearedLines.getRowLength() !== this.state.grid.getRowLength()) {
                    while (clearedLines.getRowLength() !== this.state.grid.getRowLength()) {
                        clearedLines.a.unshift(Array(this.state.grid.getColLength()).fill(0));
                    }
                    state.grid = clearedLines;
                }

                this.setState(state);
            }
        };
        switch (direction) {
            case 'down' :
                tryToMove([Array2d.create(block.orientedBlock), row + 1, col], { row: row + 1, viewGrid });
                break;
            case 'left' :
                tryToMove([Array2d.create(block.orientedBlock), row, col - 1], { col: col - 1, viewGrid });
                break;
            case 'right' : 
                tryToMove([Array2d.create(block.orientedBlock), row, col + 1], { col: col + 1, viewGrid });
                break;
            default : break;
        }
    }

    render() {
        const { col, row } = this.state;
        return (
            <div className="game" role="presentation">
                <Grid className="grid--game" grid={this.state.grid} key={`grid${row}x${col}`} />
                <Grid className="grid--current-block" color={this.state.block.color} grid={this.state.viewGrid} key={`viewGrid${row}x${col}`} />
                <Grid className="grid--next-block"grid={Array2d.create(this.state.nextBlock.orientedBlock)} key={`nextBlock${row}x${col}`} />
            </div>
        );
    }
}

App.propTypes = {
    cols: PropTypes.number,
    rows: PropTypes.number,
};

App.defaultProps = {
    cols: 10,
    rows: 20,
};

export default App;
