
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

export default class Game {
    public board: Board;
    public players: Player[];
    public suspects: Suspect[];
    public weapons: Weapon[];
    public rooms: Room[];
    public solution: [Suspect, Weapon, Room] | null = null;
    public status: GameStatus;

    constructor(
        board: Board,
        players: Player[],
        suspects: Suspect[],
        weapons: Weapon[],
        rooms: Room[],
        status: GameStatus = 'Created',
    ) {
        this.board = board;
        this.players = players;
        this.suspects = suspects;
        this.weapons = weapons;
        this.rooms = rooms;
        this.status = status;
    }

    public init() {
        this.board.distributeWeapons();
        this.solution = this.generateSolution();
    }

    get randomSuspect(): Suspect {
        return this.suspects[Utils.getRandomInt(0, this.suspects.length)] as Suspect;
    }

    get randomWeapon(): Weapon {
        return this.weapons[Utils.getRandomInt(0, this.weapons.length)] as Weapon;
    }

    get randomRoom(): Room {
        return this.rooms[Utils.getRandomInt(0, this.rooms.length)] as Room;
    }

    generateSolution(): [Suspect, Weapon, Room] {
        return [this.randomSuspect, this.randomWeapon, this.randomRoom];
    }
}