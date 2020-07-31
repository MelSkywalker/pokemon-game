import Phaser from 'phaser';
import tiles from './assets/tileset-advance.png';
// import waterTiles from './assets/water-tileset-advance.png';
import tileMap from './assets/pokemap-01.json';
import playerSprite from './assets/player01.png';

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
    this.load.spritesheet('dude', playerSprite, { frameWidth: 14, frameHeight: 21  });
}

function create() {
    cursors = this.input.keyboard.createCursorKeys();
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('poke-tileset-advance', 'tiles');
    // const waterTileset = map.addTilesetImage('water-tileset', 'waterTiles');

    const belowLayer = map.createStaticLayer('belowPlayer', tileset);
    const worldLayer = map.createStaticLayer('worldLayer', tileset);
    const abovePlayer = map.createStaticLayer('abovePlayer', tileset);
    worldLayer.setCollisionByProperty({ Collides: true });
    // map.createStaticLayer('water', waterTileset);

    // TEST MAP COLLIDER
    const debugGraphics = this.add.graphics().setAlpha(0.75);
    worldLayer.renderDebug(debugGraphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });

    const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");

    player = this.physics.add
        .sprite(spawnPoint.x, spawnPoint.y, 'dude')
        .collider(player, worldLayer);

}

function update(time, delta) {
    const speed = 100;
    const prevVelocity = player.body.velocity.clone();
    
    player.body.setVelocity(0);
    
    // Horizontal movement
    if (cursors.left.isDown) {
        player.body.setVelocityX(-100);
    } else if (cursors.right.isDown) {
        player.body.setVelocityX(100);
    }

    // Vertical movement
    if (cursors.up.isDown) {
        player.body.setVelocityY(-100);
    } else if (cursors.down.isDown) {
            player.body.setVelocityY(100);
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    player.body.velocity.normalize().scale(speed);
}