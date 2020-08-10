import Phaser from 'phaser';
import { trainers } from "../data/characters";
import pokemon from "../data/pokemon.json";
import moves from "../data/moves.json";

import battleFont from '../assets/font/battle-font.png';
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
        const battleMenu = this.add.image(240, 225, 'battleMenu').setOrigin(0).setScale(2).setDepth(0).setVisible(true);
        const fightBtn = this.add.sprite(270, 245, 'battleButtons', 0).setOrigin(0).setScale(2).setDepth(1).setVisible(true);
        const bagBtn = this.add.sprite(370, 245, 'battleButtons', 1).setOrigin(0).setScale(2).setDepth(1).setVisible(true);
        const pokemonBtn = this.add.sprite(270, 275, 'battleButtons', 2).setOrigin(0).setScale(2).setDepth(1).setVisible(true);
        const runBtn = this.add.sprite(370, 275, 'battleButtons', 3).setOrigin(0).setScale(2).setDepth(1).setVisible(true);

        let fontConfig = this.cache.json.get('battle-font-json');
        this.cache.bitmapFont.add('battleFont', Phaser.GameObjects.RetroFont.Parse(this, fontConfig));
        var txt = this.add.bitmapText(100, 100, 'battleFont', 'Adfaagp/05A');

        const fightMenu = this.add.image(0, 225, 'fightMenu').setOrigin(0).setScale(2).setDepth(0).setVisible(false);

        // Create trainers
        const player = trainers.find(trainer => trainer.role === "player");
        const npc = trainers.find(trainer => trainer.role === "npc");
        let turn = 0;

        // Select pokemon
        const playerPokemonArray = player.pokemon.filter(pokemon => pokemon.hp > 0);
        const npcPokemonArray = this.shufflePokemon(npc.pokemon);

        let currentA = playerPokemonArray[0];
        let currentB = npcPokemonArray[0];

        // PokemonA.x :: -60 -> 120
        // PokemonB.x :: 540 -> 350
        this.pokemonA = this.add.sprite(-60, 190, 'pokemonBack', (currentA.id - 1)).setScale(2);
        this.pokemonB = this.add.sprite(540, 100, 'pokemonFront', (currentB.id - 1)).setScale(2);

        fightBtn.setInteractive();
        fightBtn.on('pointerup', () => {
            phase = 'fight menu';
            battleMenu.setVisible(false);
            fightBtn.setVisible(false);
            bagBtn.setVisible(false);
            pokemonBtn.setVisible(false);
            runBtn.setVisible(false);
            fightMenu.setVisible(true);
        })

    }
    
    update() {
        if (phase === 'entrance') {
            this.pokemonEntrance(this.pokemonA, 2);
            this.pokemonEntrance(this.pokemonB, 2);
        }

        // if (phase === '')
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

}

        // this.add.sprite(350, 100, 'pokemonFront', (currentB.id - 1)).setScale(2);
        // this.add.sprite(120, 190, 'pokemonBack', (currentA.id - 1)).setScale(2);


        // function round (pokemonA, pokemonB) {
        //     let currentA = pokemonA[0];
        //     let currentB = pokemonB[0];
        // }

        // function selectPokemon (trainer) {
        //     let alivePokemon = trainer.pokemon.filter(pokemon => pokemon.hp > 0);
        //     let selectedPokemon;
        //     if (trainer === player) {
        //         if (turn === 0) {
        //             selectedPokemon = alivePokemon[0];
        //         }
        //         else {
        //             selectedPokemon = pickedPokemon;
        //         }
        //     }
        //     else { 
        //         let randomNum = Math.floor(Math.random()*alivePokemon.length);
        //         selectedPokemon = alivePokemon[randomNum];
        //     }
        //     return selectedPokemon;
        // }

        // Get pokemon data
        // console.log(pokemon.find(poke => poke.id == pokemonNpc.id));