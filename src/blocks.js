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
};

export const getRandomBlock = () => {
    const keys = Object.keys(blocks);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const randomOrientation = Math.floor(Math.random() * blocks[randomKey].length);
    return {
        block: blocks[randomKey],
        orientedBlock: blocks[randomKey][randomOrientation],
        randomOrientation,
    };
};

export const getNextOrientedBlock = (randomBlock) => {
    const { block, randomOrientation } = randomBlock;
    const blockLength = block.length;
    if (randomOrientation + 1 < blockLength) {
        return {
            block,
            orientedBlock: block[randomOrientation + 1],
            randomOrientation: randomOrientation + 1,
        };
    }
    return {
        block,
        orientedBlock: block[0],
        randomOrientation: 0,
    };
};

export default blocks;
