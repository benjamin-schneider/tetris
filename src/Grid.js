import React from 'react';
import PropTypes from 'prop-types';
import Array2d from './Array2d';
class Grid extends React.PureComponent {
    render() {        
        const { className, grid } = this.props;
        const style = {
            display: 'grid',
            gridTemplateRows: `repeat(${grid.getRowLength()}, 1fr)`,
            gridTemplateColumns: `repeat(${grid.getColLength()}, 1fr)`,
        };
        return (
            <div className={`grid ${className}`} style={style}>
                {
                    Array.prototype.concat(...grid.a).map((value, key) => (
                        <div
                            className="grid__element"
                            style={{ backgroundColor: value === 1 ? 'gray' : 'transparent' }}
                        />
                    ))
                }
            </div>
        );
    }
}

Grid.propTypes = {
    className: PropTypes.string,
    grid: PropTypes.instanceOf(Array2d),
};

Grid.defaultProps = {
    className: '',
    grid: Array2d.create([[]]),
};

export default Grid;