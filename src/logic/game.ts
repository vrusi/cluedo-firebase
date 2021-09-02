
type FieldType = 'Hall' | 'Door' | 'Room' | 'Inaccessible';
type WeaponsMapType = Map<Room, Weapon | null>;
type BoardWeapon = { weapon: Weapon, isSet: boolean };
type BoardRoom = { room: Room, isTaken: boolean };

class Board {
    public fields: FieldType[][];
    public rooms: BoardRoom[];
    public weapons: BoardWeapon[]
    public weaponsMap: WeaponsMapType;

    constructor(
        fields: FieldType[][],
        rooms: BoardRoom[],
        weapons: BoardWeapon[],
        weaponsMap: WeaponsMapType,
    ) {
        this.fields = fields;
        this.rooms = rooms;
        this.weapons = weapons;
        this.weaponsMap = weaponsMap;
    }

    getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    initWeapons() {
        this.weapons.forEach(
            weapon => {
                let room = this.rooms[0];
                do {
                    room = this.rooms[this.getRandomInt(0, this.rooms.length)];

                    if (!room.isTaken) {
                        room.isTaken = true;
                        this.weaponsMap.set(room.room, weapon.weapon);
                        break;
                    }

                } while (room.isTaken);
            }
        );
    }


}

type CharacterName = 'Plum' | 'White' | 'Scarlet' | 'Green' | 'Mustard' | 'Peacock';

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

type Position = { row: number, column: number };

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
}

type Room = 'Courtyard' | 'Game Room' | 'Study' | 'Dining Room' | 'Garage' | 'LivingRoom' | 'Kitchen' | 'Bedroom' | 'Bathroom';
type Weapon = 'Rope' | 'Dagger' | 'Wrench' | 'Pistol' | 'Candlestick' | 'Lead Pipe';
type CardType = 'Suspect' | 'Room' | 'Weapon';
type CardValue = Suspect | Room | Weapon;

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

    constructor(
        board: Board,
        players: Player[],
        cards: Card[],
    ) {
        this.board = board;
        this.players = players;
        this.cards = cards;
    }


}