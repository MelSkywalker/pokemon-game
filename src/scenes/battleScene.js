import Phaser from 'phaser';
import { trainers } from "../data/characters";
import pokemon from "../data/pokemon.json";
import moves from "../data/moves.json";

import battleFont from '../assets/font/battle-font-g.png';
import battleFontMeta from '../assets/font/battle-font.json';

import battleBG from '../assets/battleBG01.png';
import pokemonFront from '../assets/pokemon-front.png';
import pokemonBack from '../assets/pokemon-back.png';
import battleMenu01 from '../assets/menu/battle-white-01.png';
import battleMenu02 from '../assets/menu/battle-white-02.png';
import battleButtons from '../assets/menu/battle-buttons.png';

let round = 0;
let phase = 'entrance';

export default class battleScene extends Phaser.Scene {
    constructor(config) {
        super(config);
        this.pokemonA;
        this.pokemonB;
        this.currentA;
        this.currentB;
        this.playerPokemonArray;
        this.npcPokemonArray;
        this.player;
        this.ppText;
        this.typeText;
        this.attack;
    }

    preload() {
        this.load.image('battleBG', battleBG);
        this.load.image('battleMenu', battleMenu01);
        this.load.image('fightMenu', battleMenu02);
        this.load.spritesheet('battleButtons', battleButtons, { frameWidth: 46, frameHeight: 13});
        this.load.image('battleFont', battleFont);
        this.load.json('battle-font-json', battleFontMeta);

        this.load.spritesheet('pokemonFront', pokemonFront, { frameWidth: 64, frameHeight: 64  });
        this.load.spritesheet('pokemonBack', pokemonBack, { frameWidth: 64, frameHeight: 64  });
    }

    create() {
        const bg = this.add.image(0, 0, 'battleBG').setOrigin(0).setScale(2);
        let fontConfig = this.cache.json.get('battle-font-json');
        this.cache.bitmapFont.add('battleFont', Phaser.GameObjects.RetroFont.Parse(this, fontConfig));
        
        // Battle menu
        this.battleMenu = this.add.image(240, 225, 'battleMenu').setOrigin(0).setScale(2).setDepth(0).setVisible(true);
        this.fightBtn = this.add.sprite(270, 245, 'battleButtons', 0).setOrigin(0).setScale(2).setDepth(1).setVisible(true).setInteractive();
        this.bagBtn = this.add.sprite(370, 245, 'battleButtons', 1).setOrigin(0).setScale(2).setDepth(1).setVisible(true);
        this.pokemonBtn = this.add.sprite(270, 275, 'battleButtons', 2).setOrigin(0).setScale(2).setDepth(1).setVisible(true);
        this.runBtn = this.add.sprite(370, 275, 'battleButtons', 3).setOrigin(0).setScale(2).setDepth(1).setVisible(true);

        // Fight menu
        this.fightMenu = this.add.image(0, 225, 'fightMenu').setOrigin(0).setScale(2).setDepth(0).setVisible(false);
        this.ppText = this.add.bitmapText(350, 250, 'battleFont', 'PP  /', 14, 0).setDepth(1).setVisible(false);
        this.typeText = this.add.bitmapText(350, 280, 'battleFont', 'TYPE', 14, 0).setDepth(1).setVisible(false);
        let move01 = this.add.bitmapText(30, 250, 'battleFont', '', 12, 0).setDepth(1).setVisible(false).setInteractive();
        let move02 = this.add.bitmapText(175, 250, 'battleFont', '', 12, 0).setDepth(1).setVisible(false).setInteractive();
        let move03 = this.add.bitmapText(30, 280, 'battleFont', '', 12, 0).setDepth(1).setVisible(false).setInteractive();
        let move04 = this.add.bitmapText(175, 280, 'battleFont', '', 12, 0).setDepth(1).setVisible(false).setInteractive();
        this.fightMenuButtons = this.physics.add.staticGroup([move01, move02, move03, move04], { classType: Phaser.Physics.Arcade.bitmapText });
        // this.fightMenuButtons.getChildren().forEach((move, i) => {
        //     let moveName = this.player.pokemon[pokemonIndex].moves[i].name;
        //     move.on('pointerup', () => {
        //         console.log(moveName + ' selected');
        //     })
        // })

        // Create trainers
        this.player = trainers.find(trainer => trainer.role === "player");
        const npc = trainers.find(trainer => trainer.role === "npc");
        // One single turn system,pairs for one player and odd for the other ??
        let turn = 0;

        // Select pokemon
        this.playerPokemonArray = this.player.pokemon.filter(pokemon => pokemon.hp > 0);
        this.npcPokemonArray = this.shufflePokemon(npc.pokemon);

        this.currentA = this.playerPokemonArray[0];
        this.currentB = this.npcPokemonArray[0];

        // PokemonA.x :: -60 -> 120
        // PokemonB.x :: 540 -> 350
        this.pokemonA = this.add.sprite(-60, 190, 'pokemonBack', (this.currentA.id - 1)).setScale(2);
        this.pokemonB = this.add.sprite(540, 100, 'pokemonFront', (this.currentB.id - 1)).setScale(2);

        this.fightBtn.on('pointerup', () => {
            phase = 'fight menu';
        })

    }
    
    update() {
        if (phase === 'entrance') {
            this.pokemonEntrance(this.pokemonA, 2);
            this.pokemonEntrance(this.pokemonB, 2);
        }
        if (phase === 'fight menu') {
            this.battleMenu.setVisible(false);
            this.fightBtn.setVisible(false);
            this.bagBtn.setVisible(false);
            this.pokemonBtn.setVisible(false);
            this.runBtn.setVisible(false);
            this.fightMenu.setVisible(true);
            this.ppText.setVisible(true);
            this.typeText.setVisible(true);
            this.fightMenuButtons.setVisible(true);
            this.createMoves(this.playerPokemonArray.indexOf(this.currentA));
        }
    }

    shufflePokemon(array) {
        return array
            .map((a) => ({sort: Math.random(), value: a}))
            .sort((a, b) => a.sort - b.sort)
            .map((a) => a.value);
    };
    pokemonEntrance(pokemon, speed) {
        if (pokemon == this.pokemonA && pokemon.x < 120) pokemon.x += speed;
        if (pokemon == this.pokemonB && pokemon.x > 350) pokemon.x -= speed;
    }
    createMoves(pokemonIndex) {
        this.fightMenuButtons.getChildren().forEach((move, i) => move.text = this.player.pokemon[pokemonIndex].moves[i].name);
        // this.showPP(pokemonIndex)
        this.fightMenuButtons.getChildren().forEach((move, i) => {
            let moveName = this.player.pokemon[pokemonIndex].moves[i].name;
            move.on('pointerdown', () => {
                this.ppText.text = 'PP ' + this.player.pokemon[pokemonIndex].moves[i].currentPp + '/' + this.player.pokemon[pokemonIndex].moves[i].pp;
                this.typeText.text = moves.find((move) => move.ename == moveName).type;;
            });
            move.on('pointerup', () => {
                console.log(moveName + ' selected');
                this.attack = moveName;
                return this.attack;
            })
        })
    }
    pickOpponentMoves() {
        // choose random move
    }
    selectAttacker() {
        // which pokemon starts the round?
        // according to speed of their picked moves
    }
    calculateDamage(attack, opponent) {
        // Look for:
        //      - accuracy: is it going to attack or not?
        //      - power of the move
        //      - type of the move: is it weak/strong to the opponent?
        //          * weak: power/2
        //          * strong: power*2
    }
}