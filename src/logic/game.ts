
type FieldType = 'Hall' | 'Door' | 'Room' | 'Inaccessible';
type WeaponsMapType = Map<Room, Weapon | null>;
type BoardWeapon = { weapon: Weapon, isSet: boolean };
type BoardRoom = { room: Room, isTaken: boolean };
type RoomName = 'Courtyard' | 'Game Room' | 'Study' | 'Dining Room' | 'Garage' | 'LivingRoom' | 'Kitchen' | 'Bedroom' | 'Bathroom';
type Weapon = 'Rope' | 'Dagger' | 'Wrench' | 'Pistol' | 'Candlestick' | 'Lead Pipe';
type CardType = 'Suspect' | 'Room' | 'Weapon';
type CardValue = Suspect | Room | Weapon;
type CharacterName = 'Plum' | 'White' | 'Scarlet' | 'Green' | 'Mustard' | 'Peacock';
type Position = { row: number, column: number };
type GameStatus = 'Created' | 'Playing' | 'Over';

class Utils {
    static getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

class Board {
    public fields: FieldType[][];
    public rooms: Room[];
    public weapons: Weapon[]

    constructor(
        fields: FieldType[][],
        rooms: Room[],
        weapons: Weapon[],
    ) {
        this.fields = fields;
        this.rooms = rooms;
        this.weapons = weapons;
    }

    distributeWeapons() {
        this.weapons.forEach(
            weapon => {
                let room;

                do {
                    room = this.rooms[Utils.getRandomInt(0, this.rooms.length)];

                    if (room.hasNoWeapons) {
                        room.weapons.push(weapon);
                    }
                } while (!room.hasNoWeapons);
            }
        );
    }
}


class Suspect {
    public name: CharacterName;
    public startingPosition: Position;
    public colour: string;

    constructor(
        name: CharacterName,
        startingPosition: Position,
        colour: string,
    ) {
        this.name = name;
        this.startingPosition = startingPosition;
        this.colour = colour;
    }
}

class Player {
    public character: Suspect;
    public cards: Card[];
    public position: Position;

    constructor(
        character: Suspect,
        cards: Card[],
        position: Position,
    ) {
        this.character = character;
        this.cards = cards;
        this.position = position;
    }

    // move

    // ask

    // accuse

    // mark
}

class Room {
    public name: RoomName;
    public weapons: Weapon[];
    public suspects: Suspect[];
    public entrances: Position[];

    constructor(
        name: RoomName,
        weapons: Weapon[] = [],
        suspects: Suspect[] = [],
        entrances: Position[],
    ) {
        this.name = name;
        this.weapons = weapons;
        this.suspects = suspects;
        this.entrances = entrances;
    }

    get hasNoWeapons() {
        return this.weapons.length === 0;
    }
}


class Card {
    public type: CardType;
    public value: Suspect | Room | Weapon;
    public isSolution: boolean;

    constructor(
        type: CardType,
        value: CardValue,
        isSolution: boolean,
    ) {
        this.type = type;
        this.value = value;
        this.isSolution = isSolution;
    }
}


export default class Game {
    public board: Board;
    public players: Player[];
    public cards: Card[];
    public status: GameStatus;

    constructor(
        board: Board,
        players: Player[],
        cards: Card[],
        status: GameStatus = 'Created',
    ) {
        this.board = board;
        this.players = players;
        this.cards = cards;
        this.status = status;
    }

    public init() {
        this.board.distributeWeapons();
    }
}