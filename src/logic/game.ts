export type FieldType = '0' | '1' | 'R' | 'C' | 'N' | 'E' | 'S' | 'W';
type RoomName = 'Courtyard' | 'Game Room' | 'Study' | 'Dining Room' | 'Garage' | 'Living Room' | 'Kitchen' | 'Bedroom' | 'Bathroom';
export type Weapon = 'Rope' | 'Dagger' | 'Wrench' | 'Pistol' | 'Candlestick' | 'Lead Pipe';
type CardType = 'Suspect' | 'Room' | 'Weapon';
type CharacterName = 'Plum' | 'White' | 'Scarlet' | 'Green' | 'Mustard' | 'Peacock';
export type Position = { row: number, col: number };
type GameStatus = 'Created' | 'Playing' | 'Over';
type Result<T> = T | Error;

export enum Direction {
    NORTH,
    SOUTH,
    EAST,
    WEST,
}

enum ErrorMessage {
    BOUNDS = 'The player tried to step out of the bounds.',
    WALL = 'The player tried to walk into a wall.',
    UNKNOWN = 'Something went wrong.',
}

class Utils {
    static getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static isError<T>(result: Result<T>): result is Error {
        return result instanceof Error;
    }

    static isSuccess<T>(result: Result<T>): result is T {
        return !this.isError(result);
    }

    // https://stackoverflow.com/a/2450976
    static shuffle(array: any[]) {
        let currentIndex = array.length;
        let randomIndex;
      
        // While there remain elements to shuffle...
        while (currentIndex != 0) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      
        return array;
      }

}

export class Board {
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

    get width() {
        return this.fields[0].length;
    }

    get height() {
        return this.fields.length;
    }

    distributeWeapons() {
        this.weapons.forEach(
            weapon => {
                let room = this.rooms[Utils.getRandomInt(0, this.rooms.length - 1)];
                while(!room.hasNoWeapons){
                    room = this.rooms[Utils.getRandomInt(0, this.rooms.length - 1)];
                }
                room.weapons.push(weapon);
            }
        );
    }
}


export class Suspect {
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

export class Player {
    public character: Suspect;
    public knownSuspects: Suspect[];
    public knownWeapons: Weapon[];
    public knownRooms: Room[];
    public cards: (Suspect | Weapon | Room)[];
    public position: Position;
    public notepad: Map<Suspect | Weapon | Room, {
        type: CardType,
        state: 'unseen' | 'seen' | 'marked'
    }
    >;
    public currentField: FieldType;

    constructor(
        character: Suspect,
        knownSuspects: Suspect[],
        knownWeapons: Weapon[],
        knownRooms: Room[],
        position?: Position,
        cards?: (Suspect | Weapon | Room)[],
    ) {
        this.character = character;
        this.knownSuspects = knownSuspects;
        this.knownWeapons = knownWeapons;
        this.knownRooms = knownRooms;
        this.position = position ?? this.character.startingPosition;
        this.notepad = new Map;
        this.cards = cards ?? [];
        this.currentField = 'C';
    }

}

export class Room {
    public name: RoomName;
    public weapons: Weapon[];
    public suspects: Suspect[];
    public entrances: Position[];
    public passages: Room[];

    constructor(
        name: RoomName,
        weapons?: Weapon[],
        suspects?: Suspect[],
        entrances?: Position[],
        passages?: Room[],
    ) {
        this.name = name;
        this.weapons = weapons ?? [];
        this.suspects = suspects ?? [];
        this.entrances = entrances ?? [];
        this.passages = passages ?? [];
    }

    get hasNoWeapons() {
        return this.weapons.length === 0;
    }
}

type possibleRoll = 1 | 2 | 3 | 4 | 5 | 6;

class Dice {
    public currentRoll: possibleRoll | null = null;
    
    public get roll(){
        this.currentRoll = Utils.getRandomInt(1, 6) as possibleRoll;
        return this.currentRoll;
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
    public dice: Dice = new Dice();
    public currentPlayer: Player | null = null;

    constructor(
        board: Board,
        players: Player[],
        suspects: Suspect[],
        weapons: Weapon[],
        rooms: Room[],
        status?: GameStatus,
    ) {
        this.board = board;
        this.players = players;
        this.suspects = suspects;
        this.weapons = weapons;
        this.rooms = rooms;
        this.status = status ?? 'Created';
    }

    public init() {
        this.board.distributeWeapons();
        this.solution = this.generateSolution();

        const cardsWithoutSolution = this.cards.filter(card => !this.solution?.includes(card));
        const cardsToDistribute = Utils.shuffle(cardsWithoutSolution);
        let playerToGiveCardTo = 0;
        cardsToDistribute.forEach(card => {
            this.players[playerToGiveCardTo++ % this.players.length].cards.push(card);
        })

        // TODO: choose player with highest roll
        this.currentPlayer = this.randomPlayer;

        this.status = 'Playing';
    }

    get cards(): (Suspect | Weapon | Room)[] {
        return (this.suspects as any[]).concat(this.weapons).concat(this.rooms);
    }

    get randomPlayer(): Player {
        return this.players[Utils.getRandomInt(0, this.players.length - 1)] as Player;
    }

    get randomSuspect(): Suspect {
        return this.suspects[Utils.getRandomInt(0, this.suspects.length - 1)] as Suspect;
    }

    get randomWeapon(): Weapon {
        return this.weapons[Utils.getRandomInt(0, this.weapons.length - 1)] as Weapon;
    }

    get randomRoom(): Room {
        return this.rooms[Utils.getRandomInt(0, this.rooms.length - 1)] as Room;
    }

    get roll(): number {
        return Utils.getRandomInt(1, 6);
    }

    generateSolution(): [Suspect, Weapon, Room] {
        return [this.randomSuspect, this.randomWeapon, this.randomRoom];
    }

    move(player: Player, direction: Direction): Result<true> {
        let newPosition;
        let newField;

        switch(direction) {
            case Direction.NORTH: 
                newPosition = { row: player.position.row - 1, col: player.position.col } as Position;
            
                // check for out of bounds error
                if (newPosition.row < 0) {
                    return new Error(ErrorMessage.BOUNDS);
                }
                
                // check for wall error 
                newField = this.board.fields[newPosition.row][newPosition.col];
                if (newField !== 'C' && newField !== 'E') {
                    return new Error(ErrorMessage.WALL);
                }
                
                // rewrite the board field the player is standing on to its original value
                this.board.fields[player.position.row][player.position.col] = player.currentField;
                
                // rewrite the field the player will be standing on to the new value
                this.board.fields[newPosition.row][newPosition.col] = '1';

                // rewrite player position
                player.position = newPosition;

                return true;  
            
            case Direction.SOUTH:
                newPosition = { row: player.position.row + 1, col: player.position.col } as Position;
                
                // check for out of bounds error
                if (newPosition.row > this.board.height - 1) {
                    return new Error(ErrorMessage.BOUNDS);
                }

                // check for wall error
                newField = this.board.fields[newPosition.row][newPosition.col];
                if (newField !== 'C' && newField !== 'E') {
                    return new Error(ErrorMessage.WALL);
                }
                
                // rewrite the board field the player is standing on to its original value
                this.board.fields[player.position.row][player.position.col] = player.currentField;
                
                // rewrite the field the player will be standing on to the new value
                this.board.fields[newPosition.row][newPosition.col] = '1';

                // rewrite player position
                player.position = newPosition;

                return true;
                
            case Direction.EAST:
                newPosition = { row: player.position.row, col: player.position.col + 1 } as Position;
                
                // check for out of bounds error
                if (newPosition.col > this.board.width - 1) {
                    return new Error(ErrorMessage.BOUNDS);
                }

                // check for wall error
                newField = this.board.fields[newPosition.row][newPosition.col];
                if (newField !== 'C' && newField !== 'E') {
                    return new Error(ErrorMessage.WALL);
                }

                // rewrite the board field the player is standing on to its original value
                this.board.fields[player.position.row][player.position.col] = player.currentField;
                
                // rewrite the field the player will be standing on to the new value
                this.board.fields[newPosition.row][newPosition.col] = '1';

                // rewrite player position
                player.position = newPosition;

                return true;

            case Direction.WEST:
                newPosition = { row: player.position.row, col: player.position.col - 1 } as Position;
                
                // check for out of bounds error
                if (newPosition.col < 0) {
                    return new Error(ErrorMessage.BOUNDS);
                }

                // check for wall error
                newField = this.board.fields[newPosition.row][newPosition.col];
                if (newField !== 'C' && newField !== 'E') {
                    return new Error(ErrorMessage.WALL);
                }
                
                // rewrite the board field the player is standing on to its original value
                this.board.fields[player.position.row][player.position.col] = player.currentField;
                
                // rewrite the field the player will be standing on to the new value
                this.board.fields[newPosition.row][newPosition.col] = '1';

                // rewrite player position
                player.position = newPosition;

                return true;

            default:
                break;
        } 

        return new Error(ErrorMessage.UNKNOWN);
    }


    suggest(suggestant: Player, suggestedSuspect: Suspect, suggestedWeapon: Weapon, suggestedRoom: Room) {

        // select the first player in order
        // TODO: make sure it's the first player to the WEST
        const suggestantIndex = this.players.map(player => player.character === suggestant.character).indexOf(true);
        const playerToAnswer = this.players[(suggestantIndex + 1) % this.players.length];
        
        this.answer(playerToAnswer, suggestedSuspect, suggestedWeapon, suggestedRoom); 
        // if the player is holding any of the cards,
        // pick one to show the suggestand privately

        // and end the round

        // if no cards, say "I cannot answer"
        // and select the next player

    }

    answer(respondent: Player, suggestedSuspect: Suspect, suggestedWeapon: Weapon, suggestedRoom: Room) {
        // TODO when ui

        const possibleAnwers = respondent.cards.filter(item => item === suggestedSuspect || item === suggestedWeapon || item === suggestedRoom);
        
        // 
    }
}
