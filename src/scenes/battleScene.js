import Phaser from 'phaser';
import { trainers } from "../data/characters";
import pokemon from "../data/pokemon.json";
import moves from "../data/moves.json";

import battleBG from '../assets/battleBG01.png';
import pokemonFront from '../assets/pokemon-front.png';
import pokemonBack from '../assets/pokemon-back.png';

let pokemonA;
let pokemonB;

export default class battleScene extends Phaser.Scene {
    constructor(config) {
        super(config)
    }

    preload() {
        this.load.image('battleBG', battleBG);
        this.load.spritesheet('pokemonFront', pokemonFront, { frameWidth: 64, frameHeight: 64  });
        this.load.spritesheet('pokemonBack', pokemonBack, { frameWidth: 64, frameHeight: 64  });
    }

    create() {
        const bg = this.add.image(0, 0, 'battleBG').setOrigin(0).setScale(2);
        
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
        pokemonA = this.add.sprite(-60, 190, 'pokemonBack', (currentA.id - 1)).setScale(2);
        pokemonB = this.add.sprite(540, 100, 'pokemonFront', (currentB.id - 1)).setScale(2);
    }
    
    update() {
        this.pokemonEntrance(pokemonA, 2);
        this.pokemonEntrance(pokemonB, 2);
    }

    shufflePokemon(array) {
        return array
            .map((a) => ({sort: Math.random(), value: a}))
            .sort((a, b) => a.sort - b.sort)
            .map((a) => a.value);
    };

    pokemonEntrance(pokemon, speed) {
        if (pokemon == pokemonA && pokemon.x < 120) pokemon.x += speed;
        if (pokemon == pokemonB && pokemon.x > 350) pokemon.x -= speed;
        // if (pokemon.x === 120 ) this.pokemonStop(pokemon);
    }

    pokemonStop (pokemon) {
        if (pokemon ===  pokemonA) console.log('A');
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