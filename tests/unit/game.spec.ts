import { assert } from 'chai'
import Game, { Board, Direction, ErrorType, GameError, Player, Position, Room, Suspect, Utils, Weapon, Field } from '@/logic/game'
import boardMap from "../../src/logic/boardMap";

describe('Game: initialisation', () => {
  let rooms: Room[]
  let weapons: Weapon[];
  let suspects: Suspect[];
  let board: Board;
  let players: Player[];
  let game: Game;

  beforeEach(() => {
    const kitchenFields = [
      new Position(0, 1), new Position(0, 2), new Position(0, 3), new Position(0, 4),
      new Position(0, 5), new Position(0, 6), new Position(1, 1), new Position(1, 2),
      new Position(1, 3), new Position(1, 4), new Position(1, 5), new Position(1, 6),
      new Position(2, 1), new Position(2, 2), new Position(2, 3), new Position(2, 4),
      new Position(2, 5), new Position(2, 6), new Position(3, 1), new Position(3, 2),
      new Position(3, 3), new Position(3, 4), new Position(3, 5), new Position(3, 6),
      new Position(4, 1), new Position(4, 2), new Position(4, 3), new Position(4, 4),
      new Position(4, 5), new Position(4, 6), new Position(5, 1), new Position(5, 2),
      new Position(5, 3), new Position(5, 4), new Position(5, 5), new Position(5, 6),
    ];

    const ballroomFields = [
      new Position(1, 10), new Position(1, 11), new Position(1, 12), new Position(1, 13),
      new Position(2, 8), new Position(2, 9), new Position(2, 10), new Position(2, 11), new Position(2, 12), new Position(2, 13), new Position(2, 14), new Position(2, 15),
      new Position(3, 8), new Position(3, 9), new Position(3, 10), new Position(3, 11), new Position(3, 13), new Position(3, 13), new Position(3, 14), new Position(3, 15),
      new Position(4, 8), new Position(4, 9), new Position(4, 10), new Position(4, 11), new Position(4, 14), new Position(4, 13), new Position(4, 14), new Position(4, 15),
      new Position(5, 8), new Position(5, 9), new Position(5, 10), new Position(5, 11), new Position(5, 15), new Position(5, 13), new Position(5, 14), new Position(5, 15),
      new Position(6, 8), new Position(6, 9), new Position(6, 10), new Position(6, 11), new Position(6, 16), new Position(6, 13), new Position(6, 14), new Position(6, 15),
      new Position(7, 8), new Position(7, 9), new Position(7, 10), new Position(7, 11), new Position(7, 17), new Position(7, 13), new Position(7, 14), new Position(7, 15),
    ];

    const conservatoryFields = [
      new Position(1, 18), new Position(1, 19), new Position(1, 20), new Position(1, 21), new Position(1, 22), new Position(1, 23),
      new Position(2, 18), new Position(2, 19), new Position(2, 20), new Position(2, 21), new Position(2, 22), new Position(2, 23),
      new Position(3, 18), new Position(3, 19), new Position(3, 20), new Position(3, 21), new Position(3, 22), new Position(3, 23),
      new Position(4, 18), new Position(4, 19), new Position(4, 20), new Position(4, 21), new Position(4, 22), new Position(4, 23),
      new Position(5, 19), new Position(5, 20), new Position(5, 21), new Position(5, 22),
    ];

    const diningroomFields = [
      new Position(9, 0), new Position(9, 1), new Position(9, 2), new Position(9, 3), new Position(9, 4),
      new Position(10, 0), new Position(10, 1), new Position(10, 2), new Position(10, 3), new Position(10, 4), new Position(10, 5), new Position(10, 6), new Position(10, 7),
      new Position(11, 0), new Position(11, 1), new Position(11, 2), new Position(11, 3), new Position(11, 4), new Position(11, 5), new Position(11, 6), new Position(11, 7),
      new Position(12, 0), new Position(12, 1), new Position(12, 2), new Position(12, 3), new Position(12, 4), new Position(12, 5), new Position(12, 6), new Position(12, 7),
      new Position(13, 0), new Position(13, 1), new Position(13, 2), new Position(13, 3), new Position(13, 4), new Position(13, 5), new Position(13, 6), new Position(13, 7),
      new Position(14, 0), new Position(14, 1), new Position(14, 2), new Position(14, 3), new Position(14, 4), new Position(14, 5), new Position(14, 6), new Position(14, 7),
      new Position(15, 0), new Position(15, 1), new Position(15, 2), new Position(15, 3), new Position(15, 4), new Position(15, 5), new Position(15, 6), new Position(15, 7),
    ];

    const billiardroomFields = [
      new Position(8, 18), new Position(8, 19), new Position(8, 20), new Position(8, 21), new Position(8, 22), new Position(8, 23),
      new Position(9, 18), new Position(9, 19), new Position(9, 20), new Position(9, 21), new Position(9, 22), new Position(9, 23),
      new Position(10, 18), new Position(10, 19), new Position(10, 20), new Position(10, 21), new Position(10, 22), new Position(10, 23),
      new Position(11, 18), new Position(11, 19), new Position(11, 20), new Position(11, 21), new Position(11, 22), new Position(11, 23),
      new Position(12, 18), new Position(12, 19), new Position(12, 20), new Position(12, 21), new Position(12, 22), new Position(12, 23),
    ];

    const loungeFields = [
      new Position(19, 0), new Position(19, 1), new Position(19, 2), new Position(19, 3), new Position(19, 4), new Position(19, 5), new Position(19, 6),
      new Position(20, 0), new Position(20, 1), new Position(20, 2), new Position(20, 3), new Position(20, 4), new Position(20, 5), new Position(20, 6),
      new Position(21, 0), new Position(21, 1), new Position(21, 2), new Position(21, 3), new Position(21, 4), new Position(21, 5), new Position(21, 6),
      new Position(22, 0), new Position(22, 1), new Position(22, 2), new Position(22, 3), new Position(22, 4), new Position(22, 5), new Position(22, 6),
      new Position(23, 0), new Position(23, 1), new Position(23, 2), new Position(23, 3), new Position(23, 4), new Position(23, 5), new Position(23, 6),
      new Position(24, 0), new Position(24, 1), new Position(24, 2), new Position(24, 3), new Position(24, 4), new Position(24, 5),
    ];

    const libraryRooms = [
      new Position(14, 18), new Position(14, 19), new Position(14, 20), new Position(14, 21), new Position(14, 22),
      new Position(15, 17), new Position(15, 18), new Position(15, 19), new Position(15, 20), new Position(15, 21), new Position(15, 22), new Position(15, 23),
      new Position(16, 17), new Position(16, 18), new Position(16, 19), new Position(16, 20), new Position(16, 21), new Position(16, 22), new Position(16, 23),
      new Position(17, 17), new Position(17, 18), new Position(17, 19), new Position(17, 20), new Position(17, 21), new Position(17, 22), new Position(17, 23),
      new Position(18, 18), new Position(18, 19), new Position(18, 20), new Position(18, 21), new Position(18, 22),
    ];

    const hallFields = [
      new Position(18, 9), new Position(18, 10), new Position(18, 11), new Position(18, 12), new Position(18, 13), new Position(18, 14),
      new Position(19, 9), new Position(19, 10), new Position(19, 11), new Position(19, 12), new Position(19, 13), new Position(19, 14),
      new Position(20, 9), new Position(20, 10), new Position(20, 11), new Position(20, 12), new Position(20, 13), new Position(20, 14),
      new Position(21, 9), new Position(21, 10), new Position(21, 11), new Position(21, 12), new Position(21, 13), new Position(21, 14),
      new Position(22, 9), new Position(22, 10), new Position(22, 11), new Position(22, 12), new Position(22, 13), new Position(22, 14),
      new Position(23, 9), new Position(23, 10), new Position(23, 11), new Position(23, 12), new Position(23, 13), new Position(23, 14),
      new Position(24, 9), new Position(24, 10), new Position(24, 11), new Position(24, 12), new Position(24, 13), new Position(24, 14),
    ];

    const studyFields = [
      new Position(21, 17), new Position(21, 18), new Position(21, 19), new Position(21, 20), new Position(21, 21), new Position(21, 22), new Position(21, 23),
      new Position(22, 17), new Position(22, 18), new Position(22, 19), new Position(22, 20), new Position(22, 21), new Position(22, 22), new Position(22, 23),
      new Position(23, 17), new Position(23, 18), new Position(23, 19), new Position(23, 20), new Position(23, 21), new Position(23, 22), new Position(23, 23),
      new Position(24, 18), new Position(24, 19), new Position(24, 20), new Position(24, 21), new Position(24, 22), new Position(24, 23),
    ];

    const kitchen = new Room('Kitchen', '1', kitchenFields);
    const ballroom = new Room('Ballroom', '2', ballroomFields);
    const conservatory = new Room('Conservatory', '3', conservatoryFields);
    const diningroom = new Room('Dining Room', '4', diningroomFields);
    const billiardroom = new Room('Billiard Room', '5', billiardroomFields);
    const lounge = new Room('Lounge', '6', loungeFields);
    const library = new Room('Library', '7', libraryRooms);
    const hall = new Room('Hall', '8', hallFields);
    const study = new Room('Study', '9', studyFields);

    const kitchenTeleports = [
      { destinationRoom: study, destinationPosition: new Position(24, 23), sourceRoom: kitchen, sourcePosition: new Position(1, 0) },
    ];
    kitchen.teleports = kitchenTeleports;

    const studyTeleports = [
      { destinationRoom: kitchen, destinationPosition: new Position(1, 0), sourceRoom: study, sourcePosition: new Position(24, 23) }
    ];
    study.teleports = studyTeleports;

    const loungeTeleports = [
      { destinationRoom: conservatory, destinationPosition: new Position(1, 23), sourceRoom: lounge, sourcePosition: new Position(24, 0) },
    ]
    lounge.teleports = loungeTeleports;

    const conservatoryTeleports = [
      { destinationRoom: lounge, destinationPosition: new Position(24, 0), sourceRoom: conservatory, sourcePosition: new Position(1, 23) },
    ]
    conservatory.teleports = conservatoryTeleports;

    rooms = [
      kitchen,
      ballroom,
      conservatory,
      diningroom,
      billiardroom,
      lounge,
      library,
      hall,
      study,
    ];

    weapons = ['Rope', 'Dagger', 'Wrench', 'Pistol', 'Candlestick', 'Lead Pipe'] as Weapon[];
    suspects = [
      new Suspect('Scarlet', new Position(24, 7), '#690500'),
      new Suspect('White', new Position(0, 9), '#cccccc'),
      new Suspect('Green', new Position(0, 14), '#083d00'),
      new Suspect('Plum', new Position(19, 23), '#370080'),
      new Suspect('Peacock', new Position(6, 23), '#003c52'),
      new Suspect('Mustard', new Position(17, 0), '#bf7900'),
    ];
    board = new Board(boardMap() as string[][], rooms, weapons);
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
    const kitchenFields = [
      new Position(0, 1), new Position(0, 2), new Position(0, 3), new Position(0, 4),
      new Position(0, 5), new Position(0, 6), new Position(1, 1), new Position(1, 2),
      new Position(1, 3), new Position(1, 4), new Position(1, 5), new Position(1, 6),
      new Position(2, 1), new Position(2, 2), new Position(2, 3), new Position(2, 4),
      new Position(2, 5), new Position(2, 6), new Position(3, 1), new Position(3, 2),
      new Position(3, 3), new Position(3, 4), new Position(3, 5), new Position(3, 6),
      new Position(4, 1), new Position(4, 2), new Position(4, 3), new Position(4, 4),
      new Position(4, 5), new Position(4, 6), new Position(5, 1), new Position(5, 2),
      new Position(5, 3), new Position(5, 4), new Position(5, 5), new Position(5, 6),
    ];

    const ballroomFields = [
      new Position(1, 10), new Position(1, 11), new Position(1, 12), new Position(1, 13),
      new Position(2, 8), new Position(2, 9), new Position(2, 10), new Position(2, 11), new Position(2, 12), new Position(2, 13), new Position(2, 14), new Position(2, 15),
      new Position(3, 8), new Position(3, 9), new Position(3, 10), new Position(3, 11), new Position(3, 13), new Position(3, 13), new Position(3, 14), new Position(3, 15),
      new Position(4, 8), new Position(4, 9), new Position(4, 10), new Position(4, 11), new Position(4, 14), new Position(4, 13), new Position(4, 14), new Position(4, 15),
      new Position(5, 8), new Position(5, 9), new Position(5, 10), new Position(5, 11), new Position(5, 15), new Position(5, 13), new Position(5, 14), new Position(5, 15),
      new Position(6, 8), new Position(6, 9), new Position(6, 10), new Position(6, 11), new Position(6, 16), new Position(6, 13), new Position(6, 14), new Position(6, 15),
      new Position(7, 8), new Position(7, 9), new Position(7, 10), new Position(7, 11), new Position(7, 17), new Position(7, 13), new Position(7, 14), new Position(7, 15),
    ];

    const conservatoryFields = [
      new Position(1, 18), new Position(1, 19), new Position(1, 20), new Position(1, 21), new Position(1, 22), new Position(1, 23),
      new Position(2, 18), new Position(2, 19), new Position(2, 20), new Position(2, 21), new Position(2, 22), new Position(2, 23),
      new Position(3, 18), new Position(3, 19), new Position(3, 20), new Position(3, 21), new Position(3, 22), new Position(3, 23),
      new Position(4, 18), new Position(4, 19), new Position(4, 20), new Position(4, 21), new Position(4, 22), new Position(4, 23),
      new Position(5, 19), new Position(5, 20), new Position(5, 21), new Position(5, 22),
    ];

    const diningroomFields = [
      new Position(9, 0), new Position(9, 1), new Position(9, 2), new Position(9, 3), new Position(9, 4),
      new Position(10, 0), new Position(10, 1), new Position(10, 2), new Position(10, 3), new Position(10, 4), new Position(10, 5), new Position(10, 6), new Position(10, 7),
      new Position(11, 0), new Position(11, 1), new Position(11, 2), new Position(11, 3), new Position(11, 4), new Position(11, 5), new Position(11, 6), new Position(11, 7),
      new Position(12, 0), new Position(12, 1), new Position(12, 2), new Position(12, 3), new Position(12, 4), new Position(12, 5), new Position(12, 6), new Position(12, 7),
      new Position(13, 0), new Position(13, 1), new Position(13, 2), new Position(13, 3), new Position(13, 4), new Position(13, 5), new Position(13, 6), new Position(13, 7),
      new Position(14, 0), new Position(14, 1), new Position(14, 2), new Position(14, 3), new Position(14, 4), new Position(14, 5), new Position(14, 6), new Position(14, 7),
      new Position(15, 0), new Position(15, 1), new Position(15, 2), new Position(15, 3), new Position(15, 4), new Position(15, 5), new Position(15, 6), new Position(15, 7),
    ];

    const billiardroomFields = [
      new Position(8, 18), new Position(8, 19), new Position(8, 20), new Position(8, 21), new Position(8, 22), new Position(8, 23),
      new Position(9, 18), new Position(9, 19), new Position(9, 20), new Position(9, 21), new Position(9, 22), new Position(9, 23),
      new Position(10, 18), new Position(10, 19), new Position(10, 20), new Position(10, 21), new Position(10, 22), new Position(10, 23),
      new Position(11, 18), new Position(11, 19), new Position(11, 20), new Position(11, 21), new Position(11, 22), new Position(11, 23),
      new Position(12, 18), new Position(12, 19), new Position(12, 20), new Position(12, 21), new Position(12, 22), new Position(12, 23),
    ];

    const loungeFields = [
      new Position(19, 0), new Position(19, 1), new Position(19, 2), new Position(19, 3), new Position(19, 4), new Position(19, 5), new Position(19, 6),
      new Position(20, 0), new Position(20, 1), new Position(20, 2), new Position(20, 3), new Position(20, 4), new Position(20, 5), new Position(20, 6),
      new Position(21, 0), new Position(21, 1), new Position(21, 2), new Position(21, 3), new Position(21, 4), new Position(21, 5), new Position(21, 6),
      new Position(22, 0), new Position(22, 1), new Position(22, 2), new Position(22, 3), new Position(22, 4), new Position(22, 5), new Position(22, 6),
      new Position(23, 0), new Position(23, 1), new Position(23, 2), new Position(23, 3), new Position(23, 4), new Position(23, 5), new Position(23, 6),
      new Position(24, 0), new Position(24, 1), new Position(24, 2), new Position(24, 3), new Position(24, 4), new Position(24, 5),
    ];

    const libraryRooms = [
      new Position(14, 18), new Position(14, 19), new Position(14, 20), new Position(14, 21), new Position(14, 22),
      new Position(15, 17), new Position(15, 18), new Position(15, 19), new Position(15, 20), new Position(15, 21), new Position(15, 22), new Position(15, 23),
      new Position(16, 17), new Position(16, 18), new Position(16, 19), new Position(16, 20), new Position(16, 21), new Position(16, 22), new Position(16, 23),
      new Position(17, 17), new Position(17, 18), new Position(17, 19), new Position(17, 20), new Position(17, 21), new Position(17, 22), new Position(17, 23),
      new Position(18, 18), new Position(18, 19), new Position(18, 20), new Position(18, 21), new Position(18, 22),
    ];

    const hallFields = [
      new Position(18, 9), new Position(18, 10), new Position(18, 11), new Position(18, 12), new Position(18, 13), new Position(18, 14),
      new Position(19, 9), new Position(19, 10), new Position(19, 11), new Position(19, 12), new Position(19, 13), new Position(19, 14),
      new Position(20, 9), new Position(20, 10), new Position(20, 11), new Position(20, 12), new Position(20, 13), new Position(20, 14),
      new Position(21, 9), new Position(21, 10), new Position(21, 11), new Position(21, 12), new Position(21, 13), new Position(21, 14),
      new Position(22, 9), new Position(22, 10), new Position(22, 11), new Position(22, 12), new Position(22, 13), new Position(22, 14),
      new Position(23, 9), new Position(23, 10), new Position(23, 11), new Position(23, 12), new Position(23, 13), new Position(23, 14),
      new Position(24, 9), new Position(24, 10), new Position(24, 11), new Position(24, 12), new Position(24, 13), new Position(24, 14),
    ];

    const studyFields = [
      new Position(21, 17), new Position(21, 18), new Position(21, 19), new Position(21, 20), new Position(21, 21), new Position(21, 22), new Position(21, 23),
      new Position(22, 17), new Position(22, 18), new Position(22, 19), new Position(22, 20), new Position(22, 21), new Position(22, 22), new Position(22, 23),
      new Position(23, 17), new Position(23, 18), new Position(23, 19), new Position(23, 20), new Position(23, 21), new Position(23, 22), new Position(23, 23),
      new Position(24, 18), new Position(24, 19), new Position(24, 20), new Position(24, 21), new Position(24, 22), new Position(24, 23),
    ];

    const kitchen = new Room('Kitchen', '1', kitchenFields);
    const ballroom = new Room('Ballroom', '2', ballroomFields);
    const conservatory = new Room('Conservatory', '3', conservatoryFields);
    const diningroom = new Room('Dining Room', '4', diningroomFields);
    const billiardroom = new Room('Billiard Room', '5', billiardroomFields);
    const lounge = new Room('Lounge', '6', loungeFields);
    const library = new Room('Library', '7', libraryRooms);
    const hall = new Room('Hall', '8', hallFields);
    const study = new Room('Study', '9', studyFields);

    const kitchenTeleports = [
      { destinationRoom: study, destinationPosition: new Position(24, 23), sourceRoom: kitchen, sourcePosition: new Position(1, 0) },
    ];
    kitchen.teleports = kitchenTeleports;

    const studyTeleports = [
      { destinationRoom: kitchen, destinationPosition: new Position(1, 0), sourceRoom: study, sourcePosition: new Position(24, 23) }
    ];
    study.teleports = studyTeleports;

    const loungeTeleports = [
      { destinationRoom: conservatory, destinationPosition: new Position(1, 23), sourceRoom: lounge, sourcePosition: new Position(24, 0) },
    ]
    lounge.teleports = loungeTeleports;

    const conservatoryTeleports = [
      { destinationRoom: lounge, destinationPosition: new Position(24, 0), sourceRoom: conservatory, sourcePosition: new Position(1, 23) },
    ]
    conservatory.teleports = conservatoryTeleports;


    rooms = [
      kitchen,
      ballroom,
      conservatory,
      diningroom,
      billiardroom,
      lounge,
      library,
      hall,
      study,
    ];

    weapons = ['Rope', 'Dagger', 'Wrench', 'Pistol', 'Candlestick', 'Lead Pipe'] as Weapon[];
    suspects = [
      new Suspect('Scarlet', new Position(24, 7), '#690500'),
      new Suspect('White', new Position(0, 9), '#cccccc'),
      new Suspect('Green', new Position(0, 14), '#083d00'),
      new Suspect('Plum', new Position(19, 23), '#370080'),
      new Suspect('Peacock', new Position(6, 23), '#003c52'),
      new Suspect('Mustard', new Position(17, 0), '#bf7900'),
    ];
    board = new Board(boardMap() as string[][], rooms, weapons);
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
    assert.deepEqual(Scarlet.position, new Position(23, 7));
    assert.strictEqual(game.board.fields[23][7], Field.SUSPECT);
    assert.strictEqual(game.board.fields[24][7], Field.CORRIDOR);
  });


  it('moves player west', () => {
    const Plum = game.players[3];
    const result = game.move(Plum, Direction.WEST);

    assert.isTrue(Utils.isSuccess(result));
    assert.deepEqual(Plum.position, new Position(19, 22));
    assert.strictEqual(game.board.fields[19][22], Field.SUSPECT);
    assert.strictEqual(game.board.fields[19][23], Field.CORRIDOR);
  });

  it('moves player east', () => {
    const Mustard = game.players[5];
    const result = game.move(Mustard, Direction.EAST);

    assert.isTrue(Utils.isSuccess(result));
    assert.deepEqual(Mustard.position, new Position(17, 1));
    assert.strictEqual(game.board.fields[17][1], Field.SUSPECT);
    assert.strictEqual(game.board.fields[17][0], Field.CORRIDOR);
  });

  it('moves player south', () => {
    const White = game.players[1];
    const result = game.move(White, Direction.SOUTH);

    assert.isTrue(Utils.isSuccess(result));
    assert.deepEqual(White.position, new Position(1, 9));
    assert.strictEqual(game.board.fields[1][9], Field.SUSPECT);
    assert.strictEqual(game.board.fields[0][9], Field.CORRIDOR);
  });

  it('does not move the player out of bounds', () => {
    const Scarlet = game.players[0];
    let result = game.move(Scarlet, Direction.SOUTH);

    assert.isTrue(Utils.isError(result));
    assert.strictEqual((result as GameError).type, ErrorType.OUT_OF_BOUNDS);
    assert.deepEqual(Scarlet.position, Scarlet.character.startingPosition);
    assert.strictEqual(game.board.fields[Scarlet.character.startingPosition.row][Scarlet.character.startingPosition.col], Field.SUSPECT);

    const White = game.players[1];
    result = game.move(White, Direction.NORTH);

    assert.isTrue(Utils.isError(result));
    assert.strictEqual((result as GameError).type, ErrorType.OUT_OF_BOUNDS);
    assert.deepEqual(White.position, White.character.startingPosition);
    assert.strictEqual(game.board.fields[White.character.startingPosition.row][White.character.startingPosition.col], Field.SUSPECT);

    const Plum = game.players[3];
    result = game.move(Plum, Direction.EAST);

    assert.isTrue(Utils.isError(result));
    assert.strictEqual((result as GameError).type, ErrorType.OUT_OF_BOUNDS);
    assert.deepEqual(Plum.position, Plum.character.startingPosition);
    assert.strictEqual(game.board.fields[Plum.character.startingPosition.row][Plum.character.startingPosition.col], Field.SUSPECT);

    const Mustard = game.players[5];
    result = game.move(Mustard, Direction.WEST);

    assert.isTrue(Utils.isError(result));
    assert.strictEqual((result as GameError).type, ErrorType.OUT_OF_BOUNDS);
    assert.deepEqual(Mustard.position, Mustard.character.startingPosition);
    assert.strictEqual(game.board.fields[Mustard.character.startingPosition.row][Mustard.character.startingPosition.col], Field.SUSPECT);
  });

  it('does not move the player into a wall', () => {
    const Scarlet = game.players[0];
    game.move(Scarlet, Direction.NORTH);
    const result = game.move(Scarlet, Direction.WEST);

    assert.isTrue(Utils.isError(result));
    assert.strictEqual((result as GameError).type, ErrorType.WALL);
    assert.deepEqual(Scarlet.position, new Position(Scarlet.character.startingPosition.row - 1, Scarlet.character.startingPosition.col));
    assert.strictEqual(game.board.fields[Scarlet.character.startingPosition.row - 1][Scarlet.character.startingPosition.col], Field.SUSPECT);
    assert.strictEqual(game.board.fields[Scarlet.character.startingPosition.row][Scarlet.character.startingPosition.col], Field.CORRIDOR);
    assert.strictEqual(game.board.fields[Scarlet.character.startingPosition.row - 1][Scarlet.character.startingPosition.col - 1], '6');
  });

  it('does not move the player into a void field', () => {
    const Scarlet = game.players[0];
    const resultA = game.move(Scarlet, Direction.EAST);

    assert.isTrue(Utils.isError(resultA));
    assert.strictEqual((resultA as GameError).type, ErrorType.INVALID_MOVE);
    assert.deepEqual(Scarlet.position, Scarlet.character.startingPosition);
    assert.strictEqual(game.board.fields[Scarlet.character.startingPosition.row][Scarlet.character.startingPosition.col], Field.SUSPECT);
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
    assert.strictEqual((resultB as GameError).type, ErrorType.INVALID_MOVE);
    assert.deepEqual(Scarlet.position, new Position(16, 9));
    assert.strictEqual(game.board.fields[16][9], Field.SUSPECT);
    assert.strictEqual(game.board.fields[16][8], Field.CORRIDOR);
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
    assert.strictEqual((resultA as GameError).type, ErrorType.FIELD_TAKEN);
    assert.isTrue(Utils.isError(resultB));
    assert.strictEqual((resultB as GameError).type, ErrorType.FIELD_TAKEN)
    assert.isTrue(Utils.isError(resultC));
    assert.strictEqual((resultC as GameError).type, ErrorType.FIELD_TAKEN)
    assert.isTrue(Utils.isError(resultD));
    assert.strictEqual((resultD as GameError).type, ErrorType.FIELD_TAKEN)
    assert.deepEqual(Scarlet.position, new Position(Scarlet.character.startingPosition.row - 7, Scarlet.character.startingPosition.col));
    assert.deepEqual(Mustard.position, new Position(Mustard.character.startingPosition.row, Mustard.character.startingPosition.col + 6));
    assert.strictEqual(game.board.fields[17][5], Field.CORRIDOR);
    assert.strictEqual(game.board.fields[17][6], Field.SUSPECT);
    assert.strictEqual(game.board.fields[17][7], Field.SUSPECT);
    assert.strictEqual(game.board.fields[17][8], Field.CORRIDOR);
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
    assert.deepEqual(Scarlet.position, new Position(19, 6));
    assert.strictEqual(game.board.fields[19][6], Field.SUSPECT);
    assert.strictEqual(game.board.fields[18][6], Field.CORRIDOR);
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
    assert.deepEqual(Scarlet.position, new Position(21, 5))
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
    assert.strictEqual((result as GameError).type, ErrorType.WALL);
    assert.deepEqual(Scarlet.position, new Position(19, 7));
    assert.strictEqual(game.board.fields[19][6], 'S');
    assert.strictEqual(game.board.fields[19][7], Field.SUSPECT);

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
    assert.deepEqual(Scarlet.position, new Position(18, 6));
    assert.strictEqual(game.board.fields[19][6], 'S');
    assert.strictEqual(game.board.fields[18][6], Field.SUSPECT);

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
    assert.equal((result as GameError).type, ErrorType.WALL);
    assert.deepEqual(Scarlet.position, new Position(19, 6));
    assert.strictEqual(game.board.fields[19][6], Field.SUSPECT);
    assert.strictEqual(game.board.fields[18][6], Field.CORRIDOR);
    assert.strictEqual(game.board.fields[19][7], Field.CORRIDOR);

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
    assert.strictEqual((result as GameError).type, ErrorType.FIELD_TAKEN);

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

    assert.deepEqual(Scarlet.position, new Position(20, 6));
    assert.deepEqual(Mustard.position, new Position(19, 6));

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
    assert.deepEqual(White.position, new Position(8, 9));
    assert.strictEqual(game.board.fields[8][9], Field.SUSPECT);
    assert.strictEqual(game.board.fields[7][9], Field.DOOR_NORTH);

    const room = game.rooms.find(room => room.id === '2');
    assert.isFalse(room?.suspects.includes(White.character));
  });

  it('moves the player through the passage', () => {
    assert.fail();

  })
})