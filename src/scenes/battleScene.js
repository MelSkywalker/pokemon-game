import Phaser from 'phaser';

import battleBG from '../assets/battleBG01.png';

export default class battleScene extends Phaser.Scene {
    constructor(config) {
        super(config)
    }

    preload() {
        this.load.image('battleBG', battleBG);
    }

    create() {
        const bg = this.add.image(0, 0, 'battleBG').setOrigin(0).setScale(2);
    }
}