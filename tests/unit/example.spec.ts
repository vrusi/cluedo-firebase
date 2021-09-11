import { assert } from 'chai'
import Game, { Board, FieldType, Player, Room, Suspect, Weapon } from '@/logic/game'
import boardMap from "../../src/logic/boardMap";

describe('Game: initialisation', () => {

  let rooms: Room[]
  let weapons: Weapon[];
  let suspects: Suspect[];
  let board: Board;
  let players: Player[];
  let game: Game;

  beforeEach(() => {
    rooms = [new Room('Courtyard'), new Room('Game Room'), new Room('Study'), new Room('Dining Room'), new Room('Garage'), new Room('Living Room'), new Room('Kitchen'), new Room('Bedroom'), new Room('Bathroom')];
    weapons = ['Rope', 'Dagger', 'Wrench', 'Pistol', 'Candlestick', 'Lead Pipe'] as Weapon[];
    suspects = [
      new Suspect('Scarlet', { row: 24, col: 7 }, '#690500'),
      new Suspect('White', { row: 0, col: 9 }, '#cccccc'),
      new Suspect('Green', { row: 0, col: 14 }, '#083d00'),
      new Suspect('Plum', { row: 19, col: 23 }, '#370080'),
      new Suspect('Peacock', { row: 6, col: 23 }, '#003c52'),
      new Suspect('Mustard', { row: 17, col: 0 }, '#bf7900'),
    ];
    board = new Board(boardMap as FieldType[][], rooms, weapons);
    players = [
      new Player(suspects[0], suspects, weapons, rooms),
      new Player(suspects[1], suspects, weapons, rooms),
    ];
  });

  it('creates a game', () => {
    game = new Game(board, players, suspects, weapons, rooms);
    assert.strictEqual(game.status.toLowerCase(), 'created');
  });

  it('initialises the game', () => {
    game = new Game(board, players, suspects, weapons, rooms);
    game.init();
    assert.strictEqual(game.status.toLowerCase(), 'playing');
  });

  it('distributes the weapons', () => {
    game = new Game(board, players, suspects, weapons, rooms);
    game.init();
    let weaponsCount = 0;
    game.rooms.forEach(room => weaponsCount += room.weapons.length);
    assert.strictEqual(game.weapons.length, weaponsCount);
  });

  it('distributes the cards', () => {
    game = new Game(board, players, suspects, weapons, rooms);
    game.init();

    const cardsAll = (game.suspects as any[]).concat(game.weapons).concat(game.rooms);
    const cardsAllCount = cardsAll.length;
    const cardsSolutionCount = game.solution?.length ?? 0;
    const cardsDistributedCount = cardsAllCount - cardsSolutionCount;
    assert.strictEqual(cardsSolutionCount, 3);

    let cardsCount = 0;
    game.players.forEach(player => cardsCount += player.cards.length);
    assert.strictEqual(cardsCount, cardsDistributedCount);
  });

  it('selects the first player', () => {
    game = new Game(board, players, suspects, weapons, rooms);
    game.init();

    assert.isTrue(!!game.currentPlayer && game.players.includes(game.currentPlayer));
  })
})