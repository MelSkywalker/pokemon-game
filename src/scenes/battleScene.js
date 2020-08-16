import Phaser from 'phaser';
import { trainers } from "../data/characters";
import POKEMON from "../data/pokemon.json";
import MOVES from "../data/moves.json";
import MOVETYPES from "../data/move-types.json";
import { ADAPTABILITY } from '../data/adaptability';
import TYPEEFFECTIVENESS from '../data/typeEffectiveness.json';

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
        this.attackA;
        this.attackB;
        this.firstAttacker;
        this.secondAttacker;
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
            phase = 'pick moves';
        })

    }
    
    update() {
        if (phase === 'entrance') {
            this.pokemonEntrance(this.pokemonA, 2);
            this.pokemonEntrance(this.pokemonB, 2);
        }
        if (phase === 'pick moves') {
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
            this.attackB = this.pickOpponentMoves(this.currentB);
            phase = 'battle';
        }
        if (phase === 'battle') {
            !!this.attackA &&
            this.calculateDamage(this.attackA, this.currentA, this.currentB);
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
        this.fightMenuButtons.getChildren().forEach((move, i) => {
            let moveName = this.player.pokemon[pokemonIndex].moves[i].name;
            move.on('pointerdown', () => {
                this.ppText.text = 'PP ' + this.player.pokemon[pokemonIndex].moves[i].currentPp + '/' + this.player.pokemon[pokemonIndex].moves[i].pp;
                this.typeText.text = MOVES.find((move) => move.ename == moveName).type;
            });
            move.on('pointerup', () => {
                this.attackA = moveName;
                return this.attackA;
            })
        })
    }
    pickOpponentMoves(pokemon) {
        const pickRandom = Math.floor(Math.random()*pokemon.moves.length);
        const randomMove = pokemon.moves[pickRandom].name;
        return randomMove;
    }
    selectAttacker(pokemonA, pokemonB) {
        const speedPokemonA = POKEMON.find((poke) => poke.name === pokemonA.name).base['Speed'];
        const speedPokemonB = POKEMON.find((poke) => poke.name === pokemonB.name).base['Speed'];
        
        if (speedPokemonA >= speedPokemonB) {
            this.firstAttacker = pokemonA;
            this.secondAttacker = pokemonB;
        } else {
            this.firstAttacker = pokemonB;
            this.secondAttacker = pokemonA;
        }
    }
    calculateDamage(attack, attacker, opponent) {
        // let hpOpponent = opponent.hp;
        const move = MOVES.find((move) => attack === move.ename);
        // const accuracy = move.accuracy;
        const power = move.power;
        const attackType = move.type;
        const physicalMoves = MOVETYPES.find((type) => type.moveType == "Physical").moves;
        const isPhysical = physicalMoves.includes(move.ename);
        const attackerBase = POKEMON.find((poke) => poke.name == attacker.name).base;
        const opponentBase = POKEMON.find((poke) => poke.name == opponent.name).base;
        const effectiveAttack = isPhysical ? attackerBase["Attack"] : attackerBase["Sp. Attack"];
        const effectiveDefense = isPhysical ? opponentBase["Defense"] : opponentBase["Sp. Defense"];
        const attackerLvl = attacker.lvl;
        
        const targets = 1;
        const weather = 1;
        const random4critical = Math.random();
        const critical = random4critical >= 0.0625 ? 1 : 2;
        const randomFactor = (Math.random() * 0.15 + 0.85).toFixed(2);
        const opponentTypes = POKEMON.find((poke) => poke.name == opponent.name).type;
        let STAB = 1;
        if (opponentTypes.includes(attackType)) {
                if (ADAPTABILITY.includes(opponent.name)) {
                        STAB = 2;
                } else {
                        STAB = 1.5;
                }
        }
        const moveInFxTable =  TYPEEFFECTIVENESS.find((atk) => atk.type === move.type).effectiveness;
        const effectivenessValues = opponentTypes.map((type) => moveInFxTable[type]);
        const typeEffectiveness = effectivenessValues.reduce((acc, curr) => acc * curr);

        const burn = 1;
        const other = 1;
        const modifier = targets * weather * critical * randomFactor * STAB * typeEffectiveness * burn * other;

        const damage = ((((2 * attackerLvl / 5) + 2) * power * (effectiveAttack / effectiveDefense)) / 50) * modifier;
        // hpOpponent-= damage;
        // return hpOpponent;
        console.log(damage);
        return damage;
    }
    pokemonAttack() {
        // pokemon animation
        // calculate new HP
        // hp bar animation
    }
    changeRound() {
        // round ++
        // opponent's current hp > 0 ?
        //      opponents = attacker :
        //      opponent = dead &&
        //              opponent pokemonAlive > 0 ?
        //                  pick next pokemon :
        //                  opponent loses
    }
}