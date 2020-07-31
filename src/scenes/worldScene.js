import Phaser from 'phaser';
import tiles from '../assets/tileset-advance.png';
import tileMap from '../assets/pokemap-01.json';
import playerSprite from '../assets/main-char.png';

export default class worldScene extends Phaser.Scene {
    constructor(config) {
        super(config)
    }

    preload() {
        this.load.image('tiles', tiles);
        this.load.tilemapTiledJSON('map', tileMap);
        this.load.spritesheet('dude', playerSprite, { frameWidth: 16, frameHeight: 16  });
    }

    create() {
        this.cursors = this.input.keyboard.createCursorKeys();
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('poke-tileset-advance', 'tiles');

        const belowLayer = map.createStaticLayer('belowPlayer', tileset);
        const worldLayer = map.createStaticLayer('worldLayer', tileset);
        const aboveLayer = map.createStaticLayer('abovePlayer', tileset);
        worldLayer.setCollisionByProperty({ Collides: true });
        aboveLayer.setDepth(10);

        const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");

        this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'dude', 1);
        this.physics.add.collider(this.player, worldLayer);

        const anims = this.anims;
        anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 6, end: 7, zeroPad: 6 }),
            frameRate: 10,
            repeat: -1
        })
        anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 8, end: 9, zeroPad: 8 }),
            frameRate: 10,
            repeat: -1
        })
        anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('dude', { start: 3, end: 5, zeroPad: 4 }),
            frameRate: 10,
            repeat: -1
        })
        anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 2, zeroPad: 1 }),
            frameRate: 10,
            repeat: -1
        })
    }
    
    update() {
        const speed = 90;
        const prevVelocity = this.player.body.velocity.clone();
        
        this.player.body.setVelocity(0);
        
        // Horizontal movement
        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(speed);
        }
        // Vertical movement
        if (this.cursors.up.isDown) {
            this.player.body.setVelocityY(-100);
        } else if (this.cursors.down.isDown) {
            this.player.body.setVelocityY(100);
        }

        this.player.body.velocity.normalize().scale(speed);

        if (this.cursors.left.isDown) {
            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.anims.play('right', true);
        } else if (this.cursors.up.isDown) {
            this.player.anims.play('up', true);
        } else if (this.cursors.down.isDown) {
            this.player.anims.play('down', true);
        } else {
            this.player.anims.stop();
            
            if (prevVelocity.x < 0) this.player.setTexture('dude', 6);
            else if (prevVelocity.x > 0) this.player.setTexture('dude', 8);
            else if (prevVelocity.y < 0) this.player.setTexture('dude', 4);
            else if (prevVelocity.y > 0) this.player.setTexture('dude', 1);
        }
    }
}