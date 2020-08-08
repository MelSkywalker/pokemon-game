import Phaser from 'phaser';
import worldScene from './scenes/worldScene';
import battleScene from './scenes/battleScene';

const config = {
    type: Phaser.AUTO,
    width: 480,
    height: 320,
    parent: 'game-container',
    scene: [battleScene],
    scale: {
        zoom: 2
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true,
            debugVelocityColor: 0xeb4034
        }
    }
}

const game = new Phaser.Game(config);
