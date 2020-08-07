import Phaser from 'phaser';

import { createPlayerAnims } from '../anims/playerAnims';
import { createNPCAnims } from '../anims/npcAnims';

import tileMap from '../assets/pokemap-01.json';

import tiles from '../assets/tileset-advance.png';
import playerSprite from '../assets/main-char.png';
import npcGirl from '../assets/npc01.png';
import pokeball from '../assets/pokeball.png';

export default class worldScene extends Phaser.Scene {
    constructor(config) {
        super(config)
    }

    preload() {
        this.load.image('tiles', tiles);
        this.load.tilemapTiledJSON('map', tileMap);
        this.load.spritesheet('dude', playerSprite, { frameWidth: 16, frameHeight: 16  });
        this.load.spritesheet('girl', npcGirl, { frameWidth: 16, frameHeight: 16  });
        this.load.image('pokeball', pokeball);
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
        
         // TEST MAP COLLIDER
        const debugGraphics = this.add.graphics().setAlpha(0.75);
        worldLayer.renderDebug(debugGraphics, {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        });

        // Player
        const spawnPoint = map.findObject('Objects', obj => obj.name === 'Spawn Point');
        this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'dude', 1);
        this.player.body.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, worldLayer);
        createPlayerAnims(this.anims);
        
        // NPC
        const NPCGirlSpawnPoint = map.findObject('Objects', obj => obj.name === 'NPC Girl Spawn Point');
        this.npcGirl = this.physics.add.sprite(NPCGirlSpawnPoint.x, NPCGirlSpawnPoint.y, 'girl', 0);
        // this.npcGirl = this.add.sprite(50, 270, 'girl', 0); // TEST
        this.npcGirl.body.immovable = true;
        createNPCAnims(this.anims);
        this.npcGirl.anims.play('npc-idle');
        
        this.physics.add.collider(this.player, this.npcGirl);
        
        // NPC zone
        this.npcView = this.add.zone(NPCGirlSpawnPoint.x, NPCGirlSpawnPoint.y).setSize(64, 64);
        // this.npcView = this.add.zone(50, 270).setSize(64, 64);
        this.physics.world.enable(this.npcView);
        this.physics.add.overlap(this.player, this.npcView);
        
        // Items
        this.pokeball = this.physics.add.image(200, 312, 'pokeball');
        this.pokeball.body.immovable = true;
        this.pokeball.exists = true;
        this.pokeball.isActive = false;
        this.physics.add.collider(this.player, this.pokeball, getItem, undefined, null);

        function getItem (obj1, obj2) {
            // console.log(obj1);
            // console.log(obj2);
            obj2.isActive = true;
        }

    }
    
    update() {
        const speed = 90;
        const prevVelocity = this.player.body.velocity.clone();
        
        this.player.body.setVelocity(0);

        // Player movement
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

        // Anim zone
        // switch (this.npcGirl.anims.currentFrame.index) {
        //     case 0:
        //         console.log('left');
        //         break;
        //     case 1:
        //         console.log('down');
        //         break;
        //     case 2:
        //         console.log('right');
        //         break;
        //     case 3:
        //         console.log('up');
        //         break;
        // }

        // Get items
        // ------------------------ TODO:
        // - Show text to ask player to press SPACE key
        if (this.pokeball.exists && this.pokeball.isActive && this.cursors.space.isDown) {
            this.pokeball.exists = false;
            this.pokeball.destroy();
            alert('holi');
        }

        // Encounter player vs npc
        if (this.npcView.body.embedded) this.npcView.body.touching.none = false;

        const touching = !this.npcView.body.touching.none;
        const wasTouching = !this.npcView.body.wasTouching.none;

        if (touching && !wasTouching) console.log("overlapstart");
        else if (!touching && wasTouching) console.log("overlapend");
    }
}