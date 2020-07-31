import Phaser from 'phaser';
import worldScene from './scenes/worldScene';

const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 320,
    parent: 'game-container',
    scene: [worldScene],
    scale: {
        zoom: 2
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    }
}

const game = new Phaser.Game(config);
