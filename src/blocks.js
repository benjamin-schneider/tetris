const blocks = {
    I: [
        [
            [1, 1, 1, 1],
        ],
        [
            [1],
            [1],
            [1],
            [1],
        ],
    ],
    O: [
        [
            [1, 1], 
            [1, 1],
        ]
    ],
    T: [
        [
            [1, 1, 1], 
            [0, 1, 0],
        ],
        [
            [0, 1], 
            [1, 1],
            [0, 1],
        ],
        [
            [0, 1, 0], 
            [1, 1, 1],
        ],
        [
            [1, 0], 
            [1, 1],
            [1, 0],
        ]
    ],
    Z: [
        [
            [1, 1, 0],
            [0, 1, 1],
        ],
        [
            [0, 1],
            [1, 1],
            [1, 0],
        ],
    ],
    S: [
        [
            [0, 1, 1],
            [1, 1, 0],
        ],
        [
            [1, 0],
            [1, 1],
            [0, 1],
        ],
    ],
    L: [
        [
            [1, 1, 1],
            [1, 0, 0],
        ],
        [
            [1, 1],
            [0, 1],
            [0, 1],
        ],
        [
            [0, 0, 1],
            [1, 1, 1],
        ],
        [
            [1, 0],
            [1, 0],
            [1, 1],
        ],
    ],
    J: [
        [
            [1, 1, 1],
            [0, 0, 1],
        ],
        [
            [0, 1],
            [0, 1],
            [1, 1],
        ],
        [
            [1, 0, 0],
            [1, 1, 1],
        ],
        [
            [1, 1],
            [1, 0],
            [1, 0],
        ],
    ]
};

const colors = [
    'red',
    'green',
    'blue',
    'yellow',
    'orange',
    'black',
    'pink',
];

export const getRandomBlock = () => {
    const keys = Object.keys(blocks);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const randomOrientation = Math.floor(Math.random() * blocks[randomKey].length);
    const color = colors[Math.floor(Math.random() * colors.length)];
    const orientedBlock = blocks[randomKey][randomOrientation].map(row => row.map((col) => {
        return col !== 0 ? { color } : 0;
    }));
    return {
        block: blocks[randomKey],
        orientedBlock,
        randomOrientation,
        color,
    };
};

export const getNextOrientedBlock = (randomBlock) => {
    const { block, color, randomOrientation } = randomBlock;
    const blockLength = block.length;
    const nextRandomOrientation = (randomOrientation + 1 < blockLength) ? randomOrientation + 1 : 0;
    const orientedBlock = block[nextRandomOrientation].map(row => row.map((col) => {
        return col !== 0 ? { color: randomBlock.color } : 0;
    }));
    return {
        block,
        color,
        orientedBlock,
        randomOrientation: nextRandomOrientation,
    };
};

export default blocks;
