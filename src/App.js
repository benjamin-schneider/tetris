import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import logo from './logo.svg';
import './App.css';
import blocks from './blocks';
import Array2d from './Array2d';
import Grid from './Grid';

const getRandomBlock = () => {
    const keys = Object.keys(blocks);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const randomOrientation = Math.floor(Math.random() * blocks[randomKey].length);
    return blocks[randomKey][randomOrientation];
};
const createGridArray = (rows, cols, fillWith = 0) =>
    Array(rows).fill(fillWith).map(() => Array(cols).fill(fillWith));

class App extends Component {
    constructor(props) {
        super(props);
        const block = Array2d.create(getRandomBlock());
        const viewGrid = Array2d.create(createGridArray(props.rows, props.cols));
        viewGrid.merge(block, 0, 0);
        this.state = {
            row: 0,
            col: 0,
            grid: Array2d.create(createGridArray(props.rows, props.cols)),
            viewGrid,
            direction: null,
            block,
        };
    }

    componentDidMount() {
        global.document.addEventListener('keydown', this.onKeyDownHandler.bind(this));
        setInterval(() => this.moveDown(), 1000);
    }

    onKeyDownHandler(event) {
        event.preventDefault();
        const { key } = event;
        switch (key) {
            case 'ArrowLeft' : this.moveLeft(); break;
            case 'ArrowRight' : this.moveRight(); break;
            default : break;
        }
    }

    moveDown() {
        const { block, col, row, viewGrid } = this.state;
        viewGrid.unmerge(block, row, col);
        const canMergeResult = viewGrid.canMerge(block, row + 1, col);
        if (canMergeResult.success) {
            viewGrid.merge(block, row + 1, col);
            this.setState({ row: row + 1, viewGrid });
        }
    }

    moveLeft() {
        const { block, col, row, viewGrid } = this.state;
        viewGrid.unmerge(block, row, col);
        const canMergeResult = viewGrid.canMerge(block, row, col - 1);
        if (canMergeResult.success) {
            viewGrid.merge(block, row, col - 1);
            this.setState({ col: col - 1, viewGrid });
        }
    }

    moveRight() {
        const { block, col, row, viewGrid } = this.state;
        viewGrid.unmerge(block, row, col);
        const canMergeResult = viewGrid.canMerge(block, row, col + 1);
        if (canMergeResult.success) {
            viewGrid.merge(block, row, col + 1);
            this.setState({ col: col + 1, viewGrid });
        }
    }

    render() {
        const { col, row } = this.state;
        return (
            <div className="game" role="presentation">
                <Grid grid={this.state.viewGrid} key={`${row}x${col}`} />
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
