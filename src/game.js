import Phaser from 'phaser';
import tiles from './assets/tileset-advance.png';
// import waterTiles from './assets/water-tileset-advance.png';
import tileMap from './assets/pokemap-01.json';
import playerSprite from './assets/main-char.png';

const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 320,
    parent: 'game-container',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
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
let player;
let cursors;

function preload() {
    this.load.image('tiles', tiles);
    // this.load.image('waterTiles', waterTiles);
    this.load.tilemapTiledJSON('map', tileMap);
    this.load.spritesheet('dude', playerSprite, { frameWidth: 16, frameHeight: 16  });
}

function create() {
    cursors = this.input.keyboard.createCursorKeys();
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('poke-tileset-advance', 'tiles');
    // const waterTileset = map.addTilesetImage('water-tileset', 'waterTiles');

    const belowLayer = map.createStaticLayer('belowPlayer', tileset);
    const worldLayer = map.createStaticLayer('worldLayer', tileset);
    const aboveLayer = map.createStaticLayer('abovePlayer', tileset);
    worldLayer.setCollisionByProperty({ Collides: true });
    aboveLayer.setDepth(10);
    // map.createStaticLayer('water', waterTileset);

    // TEST MAP COLLIDER
    // const debugGraphics = this.add.graphics().setAlpha(0.75);
    // worldLayer.renderDebug(debugGraphics, {
    //     tileColor: null, // Color of non-colliding tiles
    //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //     faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    // });

    const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");

    player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'dude', 1);
    this.physics.add.collider(player, worldLayer);

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

function update(time, delta) {
    const speed = 90;
    const prevVelocity = player.body.velocity.clone();
    
    player.body.setVelocity(0);
    
    // Horizontal movement
    if (cursors.left.isDown) {
        player.body.setVelocityX(-speed);
    } else if (cursors.right.isDown) {
        player.body.setVelocityX(speed);
    }
    // Vertical movement
    if (cursors.up.isDown) {
        player.body.setVelocityY(-100);
    } else if (cursors.down.isDown) {
        player.body.setVelocityY(100);
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    player.body.velocity.normalize().scale(speed);

    if (cursors.left.isDown) {
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.anims.play('right', true);
    } else if (cursors.up.isDown) {
        player.anims.play('up', true);
    } else if (cursors.down.isDown) {
        player.anims.play('down', true);
    } else {
        player.anims.stop();
        
        if (prevVelocity.x < 0) player.setTexture('dude', 6);
        else if (prevVelocity.x > 0) player.setTexture('dude', 8);
        else if (prevVelocity.y < 0) player.setTexture('dude', 4);
        else if (prevVelocity.y > 0) player.setTexture('dude', 1);
    }

}