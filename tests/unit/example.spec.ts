import { assert, expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld.vue'
import Game, { Board, FieldType, Player, Room, Suspect, Weapon } from '@/logic/game'
import boardMap from "../../src/logic/boardMap";

describe('HelloWorld.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = shallowMount(HelloWorld, {
      props: { msg }
    })
    expect(wrapper.text()).to.include(msg)
  })
})

describe('Gameplay', () => {
  it('creates a game', () => {
    const rooms = [new Room('Courtyard'), new Room('Game Room'), new Room('Study'), new Room('Dining Room'), new Room('Garage'), new Room('Living Room'), new Room('Kitchen'), new Room('Bedroom'), new Room('Bathroom')];
    const weapons = ['Rope', 'Dagger', 'Wrench', 'Pistol', 'Candlestick', 'Lead Pipe'] as Weapon[];
    const suspects = [
        new Suspect('Scarlet', { row: 24, col: 7}, '#690500'),
        new Suspect('White', { row: 0, col: 9 }, '#cccccc'),
        new Suspect('Green', { row: 0, col: 14 }, '#083d00'),
        new Suspect('Plum', { row: 19, col: 23 }, '#370080'),
        new Suspect('Peacock', { row: 6, col: 23 }, '#003c52'),
        new Suspect('Mustard', { row: 17, col: 0 }, '#bf7900'),
    ];
    const board = new Board(boardMap as FieldType[][], rooms, weapons);
    const players = [
        new Player(suspects[0], suspects, weapons, rooms),
        new Player(suspects[1], suspects, weapons, rooms),
    ];

    const game = new Game(board, players, suspects, weapons, rooms);
    assert.strictEqual(game.status.toLowerCase(), 'created');
  })
})