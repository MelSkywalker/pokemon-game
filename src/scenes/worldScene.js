import Phaser from 'phaser';

import { createPlayerAnims } from '../anims/playerAnims';
import { createNPCAnims } from '../anims/npcAnims';

import tileMap from '../assets/pokemap-01.json';
import tiles from '../assets/tileset-advance.png';
import playerSprite from '../assets/main-char.png';
import npcGirl from '../assets/npc01.png';

export default class worldScene extends Phaser.Scene {
    constructor(config) {
        super(config)
    }

    preload() {
        this.load.image('tiles', tiles);
        this.load.tilemapTiledJSON('map', tileMap);
        this.load.spritesheet('dude', playerSprite, { frameWidth: 16, frameHeight: 16  });
        this.load.spritesheet('girl', npcGirl, { frameWidth: 16, frameHeight: 16  });
    }

    create() {
        this.cursors = this.input.keyboard.createCursorKeys();
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('poke-tileset-advance', 'tiles');

        // Map
        const belowLayer = map.createStaticLayer('belowPlayer', tileset);
        const worldLayer = map.createStaticLayer('worldLayer', tileset);
        const aboveLayer = map.createStaticLayer('abovePlayer', tileset);
        worldLayer.setCollisionByProperty({ Collides: true });
        aboveLayer.setDepth(10);

        // Player
        const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");
        this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'dude', 1);
        this.physics.add.collider(this.player, worldLayer);
        createPlayerAnims(this.anims);

        // NPC
        const NPCGirlSpawnPoint = map.findObject("Objects", obj => obj.name === "NPC Girl Spawn Point");
        const npcGirl = this.physics.add.sprite(NPCGirlSpawnPoint.x, NPCGirlSpawnPoint.y, 'girl', 0);
        createNPCAnims(this.anims);
        npcGirl.anims.play('npc-idle');
    }
    
    update() {
        const speed = 90;
        const prevVelocity = this.player.body.velocity.clone();
        
        this.player.body.setVelocity(0);

        // player movement
        if (this.cursors.left.isDown) {
            this.player.anims.play('left', true);
            this.player.body.setVelocityX(-speed);
        }
        else if (this.cursors.right.isDown) {
            this.player.anims.play('right', true);
            this.player.body.setVelocityX(speed);
        }
        else if (this.cursors.up.isDown) {
            this.player.anims.play('up', true);
            this.player.body.setVelocityY(-100);
        }
        else if (this.cursors.down.isDown) {
            this.player.anims.play('down', true);
            this.player.body.setVelocityY(100);
        }
        else {
            this.player.anims.stop();
            if (prevVelocity.x < 0) this.player.setTexture('dude', 6);
            else if (prevVelocity.x > 0) this.player.setTexture('dude', 8);
            else if (prevVelocity.y < 0) this.player.setTexture('dude', 4);
            else if (prevVelocity.y > 0) this.player.setTexture('dude', 1);
        }

        this.player.body.velocity.normalize().scale(speed);
    }
}