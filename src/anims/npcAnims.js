import Phaser from 'phaser';

const createNPCAnims = (anims) => {
    anims.create({
        key: 'npc-idle',
        frames: anims.generateFrameNames('girl', { start: 0, end: 3, zeroPad: 0 }),
        frameRate: 0.7,
        repeat: -1
    })
}

export { createNPCAnims }