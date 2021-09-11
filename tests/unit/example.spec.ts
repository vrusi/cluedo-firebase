import { assert } from 'chai'
import Game, { Board, Direction, FieldType, Player, Position, Room, Suspect, Weapon } from '@/logic/game'
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
    board = new Board(boardMap() as FieldType[][], rooms, weapons);
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
});

describe('Game: movement', () => {
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
    board = new Board(boardMap() as FieldType[][], rooms, weapons);
    players = [
      new Player(suspects[0], suspects, weapons, rooms),
      new Player(suspects[1], suspects, weapons, rooms),
      new Player(suspects[2], suspects, weapons, rooms),
      new Player(suspects[3], suspects, weapons, rooms),
      new Player(suspects[4], suspects, weapons, rooms),
      new Player(suspects[5], suspects, weapons, rooms),

    ];
    game = new Game(board, players, suspects, weapons, rooms);
    game.init();
  });

  it('moves player north', () => {
    const Scarlet = game.players[0];
    game.move(Scarlet, Direction.NORTH);
    assert.deepEqual(Scarlet.position, { row: 23, col: 7 });
    assert.strictEqual(game.board.fields[23][7], '1');
    assert.strictEqual(game.board.fields[24][7], 'C');
  });

  it('moves player west', () => {
    const Plum = game.players[3];
    game.move(Plum, Direction.WEST);
    assert.deepEqual(Plum.position, { row: 19, col: 22 });
    assert.strictEqual(game.board.fields[19][22], '1');
    assert.strictEqual(game.board.fields[19][23], 'C');
  });

  it('moves player east', () => {
    const Mustard = game.players[5];
    game.move(Mustard, Direction.EAST);
    assert.deepEqual(Mustard.position, { row: 17, col: 1 });
    assert.strictEqual(game.board.fields[17][1], '1');
    assert.strictEqual(game.board.fields[17][0], 'C');
  });

  it('moves player south', () => {
    const White = game.players[1];
    game.move(White, Direction.SOUTH);
    assert.deepEqual(White.position, { row: 1, col: 9 });
    assert.strictEqual(game.board.fields[1][9], '1');
    assert.strictEqual(game.board.fields[0][9], 'C');
  });

  it('does not move the player out of bounds', () => {
    const Scarlet = game.players[0];
    game.move(Scarlet, Direction.SOUTH);
    assert.deepEqual(Scarlet.position, Scarlet.character.startingPosition);
    assert.strictEqual(game.board.fields[Scarlet.character.startingPosition.row][Scarlet.character.startingPosition.col], '1');

    const White = game.players[1];
    game.move(White, Direction.NORTH);
    assert.deepEqual(White.position, White.character.startingPosition);
    assert.strictEqual(game.board.fields[White.character.startingPosition.row][White.character.startingPosition.col], '1');

    const Plum = game.players[3];
    game.move(Plum, Direction.EAST);
    assert.deepEqual(Plum.position, Plum.character.startingPosition);
    assert.strictEqual(game.board.fields[Plum.character.startingPosition.row][Plum.character.startingPosition.col], '1');

    const Mustard = game.players[5];
    game.move(Mustard, Direction.WEST);
    assert.deepEqual(Mustard.position, Mustard.character.startingPosition);
    assert.strictEqual(game.board.fields[Mustard.character.startingPosition.row][Mustard.character.startingPosition.col], '1');
  });

  it('does not move the player into a wall', () => {
    const Scarlet = game.players[0];
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.WEST);
    assert.deepEqual(Scarlet.position, { row: Scarlet.character.startingPosition.row - 1, col: Scarlet.character.startingPosition.col });
    assert.strictEqual(game.board.fields[Scarlet.character.startingPosition.row - 1][Scarlet.character.startingPosition.col], '1');
    assert.strictEqual(game.board.fields[Scarlet.character.startingPosition.row][Scarlet.character.startingPosition.col], 'C');
    assert.strictEqual(game.board.fields[Scarlet.character.startingPosition.row - 1][Scarlet.character.startingPosition.col - 1], 'R');
  });

  it('does not move the player into a void field', () => {
    const Scarlet = game.players[0];
    game.move(Scarlet, Direction.EAST);
    assert.deepEqual(Scarlet.position, Scarlet.character.startingPosition);
    assert.strictEqual(game.board.fields[Scarlet.character.startingPosition.row][Scarlet.character.startingPosition.col], '1');
    assert.strictEqual(game.board.fields[Scarlet.character.startingPosition.row][Scarlet.character.startingPosition.col + 1], '0');

    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.EAST);
    game.move(Scarlet, Direction.EAST);
    game.move(Scarlet, Direction.EAST);
    assert.deepEqual(Scarlet.position, {row: 16, col: 9});
    assert.strictEqual(game.board.fields[16][9], '1');
    assert.strictEqual(game.board.fields[16][8], 'C');
    assert.strictEqual(game.board.fields[16][10], '0');
  });

  it('does not move the player into another player', () => {
    const Scarlet = game.players[0];
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);

    const Mustard = game.players[5];
    game.move(Mustard, Direction.EAST);
    game.move(Mustard, Direction.EAST);
    game.move(Mustard, Direction.EAST);
    game.move(Mustard, Direction.EAST);
    game.move(Mustard, Direction.EAST);
    game.move(Mustard, Direction.EAST);
    game.move(Mustard, Direction.EAST);
    game.move(Mustard, Direction.EAST);
    game.move(Mustard, Direction.EAST);
    game.move(Mustard, Direction.EAST);

    assert.deepEqual(Scarlet.position, {row: Scarlet.character.startingPosition.row - 7, col: Scarlet.character.startingPosition.col});
    assert.deepEqual(Mustard.position, {row: Mustard.character.startingPosition.row, col: Mustard.character.startingPosition.col + 6});
    assert.strictEqual(game.board.fields[17][5], 'C');
    assert.strictEqual(game.board.fields[17][6], '1');
    assert.strictEqual(game.board.fields[17][7], '1');
    assert.strictEqual(game.board.fields[17][8], 'C');
  })
})