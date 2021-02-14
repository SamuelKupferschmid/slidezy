export interface Slide {
    id: string,
    index: number;
    background: string;
    paths: Path[];
}

export interface Path {
    id: string;
    pencil: Pencil;
    coordinates: Coordinate[];
}

export interface Coordinate {
    x: number;
    y: number;
}

export interface Pencil {
    width: number;
    color: string;
}