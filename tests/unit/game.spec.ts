import { assert } from 'chai'
import Game, { Board, Direction, ErrorMessage, FieldType, Player, Position, Room, Suspect, Utils, Weapon } from '@/logic/game'
import boardMap from "../../src/logic/boardMap";

describe('Game: initialisation', () => {
  let rooms: Room[]
  let weapons: Weapon[];
  let suspects: Suspect[];
  let board: Board;
  let players: Player[];
  let game: Game;

  beforeEach(() => {
    rooms = [new Room('Kitchen', '1'), new Room('Ballroom', '2'), new Room('Conservatory', '3'), new Room('Dining Room', '4'), new Room('Billiard Room', '5'), new Room('Lounge', '6'), new Room('Library', '7'), new Room('Hall', '8'), new Room('Study', '9')];
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
    rooms = [new Room('Kitchen', '1'), new Room('Ballroom', '2'), new Room('Conservatory', '3'), new Room('Dining Room', '4'), new Room('Billiard Room', '5'), new Room('Lounge', '6'), new Room('Library', '7'), new Room('Hall', '8'), new Room('Study', '9')];
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
    const result = game.move(Scarlet, Direction.NORTH);

    assert.isTrue(Utils.isSuccess(result));
    assert.deepEqual(Scarlet.position, { row: 23, col: 7 });
    assert.strictEqual(game.board.fields[23][7], 'P');
    assert.strictEqual(game.board.fields[24][7], 'C');
  });

  it('moves player west', () => {
    const Plum = game.players[3];
    const result = game.move(Plum, Direction.WEST);

    assert.isTrue(Utils.isSuccess(result));
    assert.deepEqual(Plum.position, { row: 19, col: 22 });
    assert.strictEqual(game.board.fields[19][22], 'P');
    assert.strictEqual(game.board.fields[19][23], 'C');
  });

  it('moves player east', () => {
    const Mustard = game.players[5];
    const result = game.move(Mustard, Direction.EAST);

    assert.isTrue(Utils.isSuccess(result));
    assert.deepEqual(Mustard.position, { row: 17, col: 1 });
    assert.strictEqual(game.board.fields[17][1], 'P');
    assert.strictEqual(game.board.fields[17][0], 'C');
  });

  it('moves player south', () => {
    const White = game.players[1];
    const result = game.move(White, Direction.SOUTH);

    assert.isTrue(Utils.isSuccess(result));
    assert.deepEqual(White.position, { row: 1, col: 9 });
    assert.strictEqual(game.board.fields[1][9], 'P');
    assert.strictEqual(game.board.fields[0][9], 'C');
  });

  it('does not move the player out of bounds', () => {
    const Scarlet = game.players[0];
    const resultScarlet = game.move(Scarlet, Direction.SOUTH);

    assert.isTrue(Utils.isError(resultScarlet));
    assert.strictEqual((resultScarlet as Error).message, ErrorMessage.OUT_OF_BOUNDS);
    assert.deepEqual(Scarlet.position, Scarlet.character.startingPosition);
    assert.strictEqual(game.board.fields[Scarlet.character.startingPosition.row][Scarlet.character.startingPosition.col], 'P');

    const White = game.players[1];
    const resultWhite = game.move(White, Direction.NORTH);

    assert.isTrue(Utils.isError(resultWhite));
    assert.strictEqual((resultWhite as Error).message, ErrorMessage.OUT_OF_BOUNDS);
    assert.deepEqual(White.position, White.character.startingPosition);
    assert.strictEqual(game.board.fields[White.character.startingPosition.row][White.character.startingPosition.col], 'P');

    const Plum = game.players[3];
    const resultPlum = game.move(Plum, Direction.EAST);

    assert.isTrue(Utils.isError(resultPlum));
    assert.strictEqual((resultPlum as Error).message, ErrorMessage.OUT_OF_BOUNDS);
    assert.deepEqual(Plum.position, Plum.character.startingPosition);
    assert.strictEqual(game.board.fields[Plum.character.startingPosition.row][Plum.character.startingPosition.col], 'P');

    const Mustard = game.players[5];
    const resultMustard = game.move(Mustard, Direction.WEST);

    assert.isTrue(Utils.isError(resultMustard));
    assert.strictEqual((resultMustard as Error).message, ErrorMessage.OUT_OF_BOUNDS);
    assert.deepEqual(Mustard.position, Mustard.character.startingPosition);
    assert.strictEqual(game.board.fields[Mustard.character.startingPosition.row][Mustard.character.startingPosition.col], 'P');
  });

  it('does not move the player into a wall', () => {
    const Scarlet = game.players[0];
    game.move(Scarlet, Direction.NORTH);
    const result = game.move(Scarlet, Direction.WEST);

    assert.isTrue(Utils.isError(result));
    assert.strictEqual((result as Error).message, ErrorMessage.WALL);
    assert.deepEqual(Scarlet.position, { row: Scarlet.character.startingPosition.row - 1, col: Scarlet.character.startingPosition.col });
    assert.strictEqual(game.board.fields[Scarlet.character.startingPosition.row - 1][Scarlet.character.startingPosition.col], 'P');
    assert.strictEqual(game.board.fields[Scarlet.character.startingPosition.row][Scarlet.character.startingPosition.col], 'C');
    assert.strictEqual(game.board.fields[Scarlet.character.startingPosition.row - 1][Scarlet.character.startingPosition.col - 1], '6');
  });

  it('does not move the player into a void field', () => {
    const Scarlet = game.players[0];
    const resultA = game.move(Scarlet, Direction.EAST);

    assert.isTrue(Utils.isError(resultA));
    assert.strictEqual((resultA as Error).message, ErrorMessage.WALL);
    assert.deepEqual(Scarlet.position, Scarlet.character.startingPosition);
    assert.strictEqual(game.board.fields[Scarlet.character.startingPosition.row][Scarlet.character.startingPosition.col], 'P');
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
    const resultB = game.move(Scarlet, Direction.EAST);

    assert.isTrue(Utils.isError(resultB));
    assert.strictEqual((resultB as Error).message, ErrorMessage.WALL);
    assert.deepEqual(Scarlet.position, { row: 16, col: 9 });
    assert.strictEqual(game.board.fields[16][9], 'P');
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
    const resultA = game.move(Mustard, Direction.EAST);
    const resultB = game.move(Mustard, Direction.EAST);
    const resultC = game.move(Mustard, Direction.EAST);
    const resultD = game.move(Mustard, Direction.EAST);

    assert.isTrue(Utils.isError(resultA));
    assert.strictEqual((resultA as Error).message, ErrorMessage.ALREADY_OCCUPIED);
    assert.isTrue(Utils.isError(resultB));
    assert.strictEqual((resultB as Error).message, ErrorMessage.ALREADY_OCCUPIED)
    assert.isTrue(Utils.isError(resultC));
    assert.strictEqual((resultC as Error).message, ErrorMessage.ALREADY_OCCUPIED)
    assert.isTrue(Utils.isError(resultD));
    assert.strictEqual((resultD as Error).message, ErrorMessage.ALREADY_OCCUPIED)
    assert.deepEqual(Scarlet.position, { row: Scarlet.character.startingPosition.row - 7, col: Scarlet.character.startingPosition.col });
    assert.deepEqual(Mustard.position, { row: Mustard.character.startingPosition.row, col: Mustard.character.startingPosition.col + 6 });
    assert.strictEqual(game.board.fields[17][5], 'C');
    assert.strictEqual(game.board.fields[17][6], 'P');
    assert.strictEqual(game.board.fields[17][7], 'P');
    assert.strictEqual(game.board.fields[17][8], 'C');
  })

  it('moves the player into a room', () => {
    const Scarlet = game.players[0]
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.WEST);
    const result = game.move(Scarlet, Direction.SOUTH);

    assert.isTrue(Utils.isSuccess(result));
    assert.deepEqual(Scarlet.position, { row: Scarlet.character.startingPosition.row - 5, col: Scarlet.character.startingPosition.col - 1 });
    assert.strictEqual(game.board.fields[19][6], 'S');
    assert.strictEqual(game.board.fields[18][6], 'C');

    const room = game.rooms.find(room => room.id === game.board.fields[20][6]);
    assert.isTrue(room?.suspects.includes(Scarlet.character));
  });

  it('moves the player within a room', () => {
    // walk scarlet into the room
    const Scarlet = game.players[0]
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.WEST);
    game.move(Scarlet, Direction.SOUTH);

    // take some more steps
    game.move(Scarlet, Direction.SOUTH);
    game.move(Scarlet, Direction.SOUTH);
    const result = game.move(Scarlet, Direction.WEST);
    assert.isTrue(Utils.isSuccess(result));
    assert.deepEqual(Scarlet.position, { row: 21, col: 5 })
  });

  it('does not move the player into the room when standing from the wrong side', () => {
    const Scarlet = game.players[0];
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    const result = game.move(Scarlet, Direction.WEST);

    assert.isTrue(Utils.isError(result));
    assert.strictEqual((result as Error).message, ErrorMessage.WALL);
    assert.deepEqual(Scarlet.position, { row: Scarlet.character.startingPosition.row - 5, col: Scarlet.character.startingPosition.col });
    assert.strictEqual(game.board.fields[19][6], 'S');
    assert.strictEqual(game.board.fields[19][7], 'P');

    const room = game.rooms.find(room => room.id === game.board.fields[20][6]);
    assert.isFalse(room?.suspects.includes(Scarlet.character));
  });

  it('moves the player out of the room', () => {
    // get in the room
    const Scarlet = game.players[0]
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.WEST);
    game.move(Scarlet, Direction.SOUTH);

    // get out 
    const result = game.move(Scarlet, Direction.NORTH);
    assert.isTrue(Utils.isSuccess(result));
    assert.deepEqual(Scarlet.position, { row: Scarlet.character.startingPosition.row - 6, col: Scarlet.character.startingPosition.col - 1 });
    assert.strictEqual(game.board.fields[19][6], 'S');
    assert.strictEqual(game.board.fields[18][6], 'P');

    const room = game.rooms.find(room => room.id === game.board.fields[20][6]);
    assert.isFalse(room?.suspects.includes(Scarlet.character));
  });

  it('does not move the player out of the room when wrong direction', () => {
    // get in the room
    const Scarlet = game.players[0]
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.WEST);
    game.move(Scarlet, Direction.SOUTH);

    // get out wrong way
    const result = game.move(Scarlet, Direction.EAST);

    assert.isTrue(Utils.isError(result));
    assert.equal((result as Error).message, ErrorMessage.WALL);
    assert.deepEqual(Scarlet.position, { row: Scarlet.character.startingPosition.row - 5, col: Scarlet.character.startingPosition.col - 1 });
    assert.strictEqual(game.board.fields[19][6], 'S');
    assert.strictEqual(game.board.fields[18][6], 'C');
    assert.strictEqual(game.board.fields[19][7], 'C');

    const room = game.rooms.find(room => room.id === game.board.fields[20][6]);
    assert.isTrue(room?.suspects.includes(Scarlet.character));
  });

  it('does not let the player out of the room if another player is in the doorway', () => {
    // get scarlet into the room
    const Scarlet = game.players[0];
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.WEST);
    game.move(Scarlet, Direction.SOUTH);

    // have mustard block the doorway
    const Mustard = game.players[5];
    game.move(Mustard, Direction.EAST);
    game.move(Mustard, Direction.EAST);
    game.move(Mustard, Direction.EAST);
    game.move(Mustard, Direction.EAST);
    game.move(Mustard, Direction.EAST);
    game.move(Mustard, Direction.EAST);
    game.move(Mustard, Direction.SOUTH);

    // make scarlet try to get out
    const result = game.move(Scarlet, Direction.NORTH);

    assert.isTrue(Utils.isError(result));
    assert.strictEqual((result as Error).message, ErrorMessage.ALREADY_OCCUPIED);

    const room = game.rooms.find(room => room.id === '6');

    assert.isTrue(room?.suspects.includes(Scarlet.character));
  });

  it('lets two players enter the same room', () => {
    const Scarlet = game.players[0];
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.NORTH);
    game.move(Scarlet, Direction.WEST);
    game.move(Scarlet, Direction.SOUTH);

    const Mustard = game.players[5];
    game.move(Mustard, Direction.EAST);
    game.move(Mustard, Direction.EAST);
    game.move(Mustard, Direction.EAST);
    game.move(Mustard, Direction.EAST);
    game.move(Mustard, Direction.EAST);
    game.move(Mustard, Direction.EAST);
    game.move(Mustard, Direction.SOUTH);
    game.move(Mustard, Direction.SOUTH);

    assert.deepEqual(Scarlet.position, Mustard.position);
    assert.deepEqual(Scarlet.position, { row: 19, col: 6 });
    assert.deepEqual(Mustard.position, { row: 19, col: 6 });

    const room = game.rooms.find(room => room.id === '6');
    assert.isTrue(room?.suspects.includes(Scarlet.character));
    assert.isTrue(room?.suspects.includes(Mustard.character));
  });

  it('moves the player out of the room through a different door', () => {
    // get in the ballroom
    const White = game.players[1];
    game.move(White, Direction.SOUTH);
    game.move(White, Direction.WEST);
    game.move(White, Direction.WEST);
    game.move(White, Direction.SOUTH);
    game.move(White, Direction.SOUTH);
    game.move(White, Direction.SOUTH);
    game.move(White, Direction.SOUTH);
    game.move(White, Direction.EAST);

    // move to the other door and get out
    game.move(White, Direction.SOUTH);
    game.move(White, Direction.SOUTH);
    game.move(White, Direction.EAST);

    const result = game.move(White, Direction.SOUTH);
    assert.isTrue(Utils.isSuccess(result));
    assert.deepEqual(White.position, { row: 8, col: 9 });
    assert.strictEqual(game.board.fields[8][9], 'P');
    assert.strictEqual(game.board.fields[7][9], 'N');

    const room = game.rooms.find(room => room.id === '2');
    assert.isFalse(room?.suspects.includes(White.character));
  });

  it('moves players through each other when both are in a room', () => {
    assert.fail();
  });

  it('makes the first player to enter a room leave after the second player comes in', () => {
    assert.fail();
  });

  it('moves the player through the passage', () => {
    assert.fail();

  })
})