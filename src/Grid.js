import React from 'react';
import PropTypes from 'prop-types';
import Array2d from './Array2d';

class Grid extends React.PureComponent {
    render() {        
        const { className, defaultColor, grid } = this.props;
        const style = {
            display: 'grid',
            gridTemplateRows: `repeat(${grid.getRowLength()}, 1fr)`,
            gridTemplateColumns: `repeat(${grid.getColLength()}, 1fr)`,
        };
        return (
            <div className={`grid ${className}`} style={style}>
                {
                    //perf? Array.prototype.concat(...grid.a).map((value, key) => (
                    grid.a.map(row => row.map((value, key) => (
                        <div
                            key={key}
                            className={`grid__element ${value !== 0 ? 'grid-element--visible' : ''}`}
                            style={{ backgroundColor: value !== 0 ? value.color : defaultColor }}
                        />
                    )))
                }
            </div>
        );
    }
}

Grid.propTypes = {
    className: PropTypes.string,
    defaultColor: PropTypes.string,
    grid: PropTypes.instanceOf(Array2d),
};

Grid.defaultProps = {
    className: '',
    defaultColor: 'transparent',
    grid: Array2d.create([[]]),
};

export default Grid;
