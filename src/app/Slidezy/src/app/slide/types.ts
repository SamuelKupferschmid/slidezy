export interface Slide {
    id: string,
    index: number;
}

export interface Path {
    pencil: Pencil;
}

export interface Coordinate {
    x: number;
    y: number;
}

export interface Pencil {
    width: number;
    color: string;
}