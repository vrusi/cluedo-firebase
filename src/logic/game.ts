
type FieldType = 'Hall' | 'Door' | 'Room' | 'Inaccessible';
type WeaponsMapType = Map<Room, Weapon | null>; 

class Board {
    public fields: FieldType[][];
    public weapons: WeaponsMapType;

    constructor(
        fields: FieldType[][],
        weapons: WeaponsMapType,
    ) {
        this.fields = fields;
        this.weapons = weapons;
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

type Position = { x: number, y: number };

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
type Weapon = {
    name: 'Rope' | 'Dagger' | 'Wrench' | 'Pistol' | 'Candlestick' | 'Lead Pipe',
    room: Room,
}
type CardType = 'Suspect' | 'Room' | 'Weapon' ;
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