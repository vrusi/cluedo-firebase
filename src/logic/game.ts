export type Weapon = 'Rope' | 'Dagger' | 'Wrench' | 'Pistol' | 'Candlestick' | 'Lead Pipe';
type CardType = 'Suspect' | 'Room' | 'Weapon';
type CharacterName = 'Plum' | 'White' | 'Scarlet' | 'Green' | 'Mustard' | 'Peacock';
type GameStatus = 'Created' | 'Playing' | 'Over';
type Result<T> = T | Error;

export enum Direction {
    NORTH = 'N',
    EAST = 'E',
    SOUTH = 'S',
    WEST = 'W',
}

export enum Field {
    CORRIDOR = 'C',
    DOOR_NORTH = 'N',
    DOOR_EAST = 'E',
    DOOR_SOUTH = 'S',
    DOOR_WEST = 'W',
    TELEPORT = 'T',
    SUSPECT = 'P'
}

export class Position {
    public row: number;
    public col: number;

    constructor(row: number, col: number) {
        this.row = row;
        this.col = col;
    }

    get asString() {
        return '[' + this.row + ', ' + this.col + ']';
    }

    isEqual(positionToCompare: Position) {
        return this.row === positionToCompare.row && this.col === positionToCompare.col;
    }
}

export enum ErrorType {
    OUT_OF_BOUNDS = 'cannot walk out of bounds',
    WALL = 'cannot walk into a wall',
    INVALID_DIRECTION = 'invalid direction',
    INVALID_MOVE = 'invalid move',
    ROOM_NOT_FOUND = 'room not found',
    TELEPORT_NOT_FOUND = 'teleport not found',
    UNKNOWN = 'unknown error',
    FIELD_TAKEN = 'cannot walk into another suspect',
}

export class GameError extends Error {
    public type: ErrorType;
    public message: string;

    constructor(type: ErrorType, message?: string) {
        super();
        this.type = type;
        this.message = message ?? '';
    }

    get fullMessage(): string {
        return this.message === '' ? this.type : this.type + ' | ' + this.message;
    }
}

export class Utils {
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

    static isNumeric(string: string): boolean {
        return !isNaN(+string);
    }

    // https://stackoverflow.com/a/10050831
    static range(size: number, startAt: number = 0) {
        return [...Array(size).keys()].map(i => i + startAt);
    }

}

export class Board {
    public fields: string[][];
    public rooms: Room[];
    public weapons: Weapon[]

    constructor(
        fields: string[][],
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

    print() {
        const header = ['+', ...Array(this.width).keys()];
        const padding = ('' + this.width).length + 1;
        let headerFormatted = ''
        header.forEach((item) => {
            headerFormatted += ('' + item).padStart(padding, ' ');
        });
        console.log(headerFormatted);

        this.fields.forEach((row, index) => {
            let rowFormatted = ('' + index).padStart(padding, ' ');

            row.forEach((col) => {
                rowFormatted += ('' + col).padStart(padding, ' ');
            })

            console.log(rowFormatted);
        });
    }

    distributeWeapons() {
        this.weapons.forEach(
            weapon => {
                let room = this.rooms[Utils.getRandomInt(0, this.rooms.length - 1)];
                while (!room.hasNoWeapons) {
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
    public currentField: string;

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

    get currentRoom(): Room | null {
        return this.knownRooms.find(room => room.suspects.includes(this.character)) ?? null;
    }
}

type Teleport = { destinationRoom: Room, destinationPosition: Position, sourceRoom: Room, sourcePosition: Position };

export class Room {
    public name: string;
    public id: string;
    public weapons: Weapon[];
    public suspects: Suspect[];
    public positions: Position[];
    //public entrances: Position[];
    public teleports: Teleport[];

    constructor(
        name: string,
        id: string,
        positions: Position[],
        weapons?: Weapon[],
        suspects?: Suspect[],

        teleports?: Teleport[],
    ) {
        this.name = name;
        this.id = id;
        this.positions = positions;
        this.weapons = weapons ?? [];
        this.suspects = suspects ?? [];

        this.teleports = teleports ?? [];
    }

    get hasNoWeapons() {
        return this.weapons.length === 0;
    }

    hasPosition(positionToFind: Position): boolean {
        return !!this.positions.find(position => position.isEqual(positionToFind));
    }
}

type possibleRoll = 1 | 2 | 3 | 4 | 5 | 6;

class Dice {
    public currentRoll: possibleRoll | null = null;

    public get roll() {
        this.currentRoll = Utils.getRandomInt(1, 6) as possibleRoll;
        return this.currentRoll;
    }
}

export default class Game {
    public boardOriginal: Board;
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
        this.boardOriginal = board;
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

    generateMap() {

    }

    generateSolution(): [Suspect, Weapon, Room] {
        return [this.randomSuspect, this.randomWeapon, this.randomRoom];
    }

    getFieldFromPosition(position: Position): string {
        return this.board.fields[position.row][position.col];
    }

    isDirectionNorth(direction: Direction) {
        return direction === Direction.NORTH;
    }

    isDirectionEast(direction: Direction) {
        return direction === Direction.EAST;
    }

    isDirectionSouth(direction: Direction) {
        return direction === Direction.SOUTH;
    }

    isDirectionWest(direction: Direction) {
        return direction === Direction.WEST;
    }

    getNextPosition(positionCurrent: Position, direction: Direction) {
        let positionNew = positionCurrent;

        if (this.isDirectionNorth(direction)) {
            positionNew = new Position(positionCurrent.row - 1, positionCurrent.col);

            if (positionNew.row < 0) {
                return new GameError(ErrorType.OUT_OF_BOUNDS, positionNew.asString);
            } else {
                return positionNew;
            }

        } else if (this.isDirectionEast(direction)) {
            positionNew = new Position(positionCurrent.row, positionCurrent.col + 1)

            if (positionNew.col > this.board.width - 1) {
                return new GameError(ErrorType.OUT_OF_BOUNDS, positionNew.asString);
            } else {
                return positionNew;
            }

        } else if (this.isDirectionSouth(direction)) {
            positionNew = new Position(positionCurrent.row + 1, positionCurrent.col)

            if (positionNew.row > this.board.height - 1) {
                return new GameError(ErrorType.OUT_OF_BOUNDS, positionNew.asString);
            } else {
                return positionNew;
            }

        } else if (this.isDirectionWest(direction)) {
            positionNew = new Position(positionCurrent.row, positionCurrent.col - 1)

            if (positionNew.col < 0) {
                return new GameError(ErrorType.OUT_OF_BOUNDS, positionNew.asString);
            } else {
                return positionNew;
            }

        } else {
            return new GameError(ErrorType.INVALID_DIRECTION, direction);
        }
    }

    isFieldCorridor(field: string) {
        return field === Field.CORRIDOR;
    }

    isFieldDoor(field: string) {
        return field === Field.DOOR_NORTH ||
            field === Field.DOOR_EAST ||
            field === Field.DOOR_SOUTH ||
            field === Field.DOOR_WEST;
    }

    isFieldRoom(field: string) {
        const startsWithZero = field[0] === '0';
        return !startsWithZero && Utils.isNumeric(field);
    }

    isFieldTeleport(field: string) {
        return field === Field.TELEPORT;
    }

    isFieldSuspect(field: string) {
        return field === Field.SUSPECT;
    }

    boardWrite(position: Position, field: string) {
        this.board.fields[position.row][position.col] = field;
    }

    takeStep(player: Player, nextPosition: Position, nextField: string) {
        this.boardWrite(player.position, player.currentField);
        player.currentField = nextField;
        player.position = nextPosition;
        this.boardWrite(nextPosition, Field.SUSPECT);
    }

    isOppositeDirection(field: string, direction: Direction) {
        return (field === Field.DOOR_SOUTH && direction === Direction.NORTH) ||
            (field === Field.DOOR_WEST && direction === Direction.EAST) ||
            (field === Field.DOOR_NORTH && direction === Direction.SOUTH) ||
            (field === Field.DOOR_EAST && direction === Direction.WEST);
    }

    isSameDirection(field: string, direction: Direction) {
        return (field === Field.DOOR_NORTH && direction === Direction.NORTH) ||
            (field === Field.DOOR_EAST && direction === Direction.EAST) ||
            (field === Field.DOOR_SOUTH && direction === Direction.SOUTH) ||
            (field === Field.DOOR_WEST && direction === Direction.WEST);
    }

    getRoomByPosition(position: Position): Result<Room> {
        return this.rooms.find(room => room.hasPosition(position)) ?? new GameError(ErrorType.ROOM_NOT_FOUND, position.asString);
    }

    removeSuspectFromRoomByPosition(position: Position, suspectToRemove: Suspect): Result<boolean> {
        const room = this.getRoomByPosition(position);
        if (Utils.isError(room)) {
            return room;
        } else {
            room.suspects = room.suspects.filter(suspect => suspect.name != suspectToRemove.name);
            return true;
        }
    }

    addSuspectToRoomByPosition(position: Position, suspect: Suspect): Result<boolean> {
        const room = this.getRoomByPosition(position);
        if (Utils.isError(room)) {
            return room;
        } else {
            room.suspects.push(suspect);
            return true;
        }
    }

    moveToCorridor(player: Player, nextPosition: Position, nextField: string, direction: Direction): Result<number> {
        if (this.isFieldCorridor(player.currentField)) {
            // moving through the corridor
            this.takeStep(player, nextPosition, nextField);
            return 1;

        } else if (this.isFieldDoor(player.currentField)) {
            // leaving a room
            if (this.isOppositeDirection(player.currentField, direction)) {
                const result = this.removeSuspectFromRoomByPosition(player.position, player.character);
                if (Utils.isError(result)) {
                    return result;
                } else {
                    this.takeStep(player, nextPosition, nextField);
                    return 1;
                }
            }
        }

        return new GameError(ErrorType.WALL, player.currentField + ' -> ' + nextField + ' at ' + nextPosition.asString + ', ' + direction);
    }

    moveToDoor(player: Player, nextPosition: Position, nextField: string, direction: Direction): Result<number> {
        if (this.isFieldCorridor(player.currentField)) {
            // entering a room
            if (this.isSameDirection(nextField, direction)) {

                const result = this.addSuspectToRoomByPosition(nextPosition, player.character);

                if (Utils.isError(result)) {
                    return result;
                } else {
                    this.takeStep(player, nextPosition, nextField);
                    return 1;
                }
            }

        } else if (this.isFieldRoom(player.currentField)) {
            // leaving a room
            this.takeStep(player, nextPosition, nextField);
            return 1;

        } else if (this.isFieldDoor(player.currentField)) {
            // moving through joining rooms
            if (this.isSameDirection(nextField, direction) && this.isOppositeDirection(player.currentField, direction)) {
                const nextRoom = this.rooms.find(room => room.hasPosition(nextPosition));
                if (!nextRoom) {
                    return new GameError(ErrorType.ROOM_NOT_FOUND, nextPosition.asString);
                }
                const currentRoom = player.currentRoom;
                if (!currentRoom) {
                    return new GameError(ErrorType.ROOM_NOT_FOUND, player.position.asString);
                }

                let result = this.removeSuspectFromRoomByPosition(player.position, player.character);
                if (Utils.isError(result)) {
                    return result;
                }

                result = this.addSuspectToRoomByPosition(nextPosition, player.character);
                if (Utils.isError(result)) {
                    return result;

                } else {
                    this.takeStep(player, nextPosition, nextField);
                    return 0;
                }
            }
        }

        return new GameError(ErrorType.WALL, player.currentField + ' -> ' + nextField + ' at ' + nextPosition.asString + ', ' + direction);
    }

    moveToRoom(player: Player, nextPosition: Position, nextField: string) {
        if (this.isFieldRoom(player.currentField)) {
            // walking inside a room
            if (player.currentField === nextField) {
                this.takeStep(player, nextPosition, nextField);
                return 0;
            }

        } else if (this.isFieldDoor(player.currentField)) {
            // entering a room 
            this.takeStep(player, nextPosition, nextField);
            return 0;

        } else if (this.isFieldTeleport(player.currentField)) {
            // leaving a teleport
            this.takeStep(player, nextPosition, nextField);
            return 0;
        }

        return new GameError(ErrorType.WALL, player.currentField + ' -> ' + nextField + ' at ' + nextPosition.asString);
    }

    teleport(player: Player,) {
        const currentRoom = player.currentRoom;
        if (!currentRoom) { return new GameError(ErrorType.ROOM_NOT_FOUND, player.currentRoom === null ? 'player.currentRoom = null' : 'player.currentRoom = ' + player.currentRoom); }

        const teleport = (currentRoom.teleports as Teleport[]).find(teleport => teleport.sourcePosition.isEqual(player.position));
        if (!teleport) { return new GameError(ErrorType.TELEPORT_NOT_FOUND, 'no teleport in player location: curren field ' + player.currentField + ' at ' + player.position.asString); }

        const destionationRoom = teleport.destinationRoom;
        if (!destionationRoom) { return new GameError(ErrorType.ROOM_NOT_FOUND, 'teleport from ' + teleport.sourcePosition.asString + ' ' + teleport.sourceRoom.name + 'has no destination room'); }

        currentRoom.suspects = (currentRoom.suspects as Suspect[]).filter(suspect => suspect.name !== player.character.name);
        destionationRoom.suspects.push(player.character);
        player.position = teleport.destinationPosition;
        return 0;
    }

    moveToTeleport(player: Player, nextPosition: Position, nextField: string): Result<number> {
        if (this.isFieldRoom(player.currentField)) {
            this.takeStep(player, nextPosition, nextField);
            return this.teleport(player);
        } else {
            return new GameError(ErrorType.INVALID_MOVE, player.currentField + ' -> ' + nextField + ' at ' + nextPosition.asString);
        }
    }

    getPlayerByPosition(position: Position): Player | undefined {
        return this.players.find(player => player.position.isEqual(position));
    }

    moveToSuspect(player: Player, nextPosition: Position, nextField: string): Result<number> {
        const suspectToBeSteppedOn = this.getPlayerByPosition(nextPosition) as Player;
        if (this.isFieldRoom(player.currentField) || this.isFieldDoor(player.currentField) && this.isFieldSuspect(nextField) && this.isFieldRoom(suspectToBeSteppedOn.currentField)) {
            this.takeStep(player, nextPosition, suspectToBeSteppedOn.currentField);
            return 0;
        } else {
            return new GameError(ErrorType.FIELD_TAKEN, 'moved into another suspect outside of a room');
        }
    }

    move(player: Player, direction: Direction): Result<number> {
        const nextPosition = this.getNextPosition(player.position, direction);

        if (Utils.isError(nextPosition)) { return nextPosition; }

        const nextField = this.getFieldFromPosition(nextPosition);
        let result;

        if (this.isFieldCorridor(nextField)) {
            result = this.moveToCorridor(player, nextPosition, nextField, direction);
            return result;

        } else if (this.isFieldDoor(nextField)) {
            result = this.moveToDoor(player, nextPosition, nextField, direction);

        } else if (this.isFieldRoom(nextField)) {
            result = this.moveToRoom(player, nextPosition, nextField);

        } else if (this.isFieldTeleport(nextField)) {
            result = this.moveToTeleport(player, nextPosition, nextField);

        } else if (this.isFieldSuspect(nextField)) {

            result = this.moveToSuspect(player, nextPosition, nextField);
        } else {
            result = new GameError(ErrorType.INVALID_MOVE, player.currentField + ' -> ' + nextField + ', ' + player.position.asString + ' -> ' + nextPosition.toString);
        }

        return result;
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
