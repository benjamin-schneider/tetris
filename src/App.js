import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import logo from './logo.svg';
import './App.css';
import { getRandomBlock, getNextOrientedBlock } from './blocks';
import Array2d from './Array2d';
import Grid from './Grid';

const createGridArray = (rows, cols, fillWith = 0) =>
    Array(rows).fill(fillWith).map(() => Array(cols).fill(fillWith));

class App extends Component {
    constructor(props) {
        super(props);
        const randomBlock = getRandomBlock();
        const block = Array2d.create(randomBlock.orientedBlock);
        const viewGrid = Array2d.create(createGridArray(props.rows, props.cols));
        viewGrid.merge(block, 0, 0);
        this.state = {
            row: 0,
            col: 0,
            grid: Array2d.create(createGridArray(props.rows, props.cols)),
            viewGrid,
            direction: null,
            block,
            randomBlock,
        };
    }

    componentDidMount() {
        global.document.addEventListener('keydown', this.onKeyDownHandler.bind(this));
        setInterval(() => this.move('down'), 400);
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
        const { col, block, grid, randomBlock, row, viewGrid } = this.state;
        const nextOrientedBlock = getNextOrientedBlock(randomBlock);
        const canMergeResult = grid.canMerge(Array2d.create(nextOrientedBlock.orientedBlock), row, col);
        if (canMergeResult.success) {
            viewGrid.unmerge(block, row, col);
            this.setState({
                randomBlock: nextOrientedBlock,
                block: Array2d.create(nextOrientedBlock.orientedBlock),
            });
        }
    }

    move(direction) {
        const { block, col, grid, row, viewGrid } = this.state;
        const tryToMove = (mergeParams, nextState) => {
            viewGrid.unmerge(block, row, col);
            const canMergeResult = grid.canMerge(...mergeParams);
            if (canMergeResult.success) {
                viewGrid.merge(...mergeParams);
                this.setState(nextState);
            } else if (direction === 'down') {
                const lastRowMergeParams = [...mergeParams];
                lastRowMergeParams[1] -= 1;
                grid.merge(...lastRowMergeParams);
                const randomBlock = getRandomBlock();
                const newBlock = Array2d.create(randomBlock.orientedBlock);
                this.setState({
                    row: 0,
                    col: 0,
                    block: newBlock,
                    grid,
                    viewGrid,
                    randomBlock,
                });
            }
        };
        switch (direction) {
            case 'down' :
                tryToMove([block, row + 1, col], { row: row + 1, viewGrid });
                break;
            case 'left' :
                tryToMove([block, row, col - 1], { col: col - 1, viewGrid });
                break;
            case 'right' : 
                tryToMove([block, row, col + 1], { col: col + 1, viewGrid });
                break;
            default : break;
        }
    }

    render() {
        const { col, row } = this.state;
        return (
            <div className="game" role="presentation">
                <Grid className="grid--game" grid={this.state.grid} key={`grid${row}x${col}`} />
                <Grid className="grid--current-block" grid={this.state.viewGrid} key={`viewGrid${row}x${col}`} />                
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
