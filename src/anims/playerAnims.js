import Phaser from 'phaser';

const createPlayerAnims = (anims) => {
    anims.create({
        key: 'left',
        frames: anims.generateFrameNumbers('dude', { start: 6, end: 7, zeroPad: 6 }),
        frameRate: 10,
        repeat: -1
    })
    anims.create({
        key: 'right',
        frames: anims.generateFrameNumbers('dude', { start: 8, end: 9, zeroPad: 8 }),
        frameRate: 10,
        repeat: -1
    })
    anims.create({
        key: 'up',
        frames: anims.generateFrameNumbers('dude', { start: 3, end: 5, zeroPad: 4 }),
        frameRate: 10,
        repeat: -1
    })
    anims.create({
        key: 'down',
        frames: anims.generateFrameNumbers('dude', { start: 0, end: 2, zeroPad: 1 }),
        frameRate: 10,
        repeat: -1
    })
}

export { createPlayerAnims }