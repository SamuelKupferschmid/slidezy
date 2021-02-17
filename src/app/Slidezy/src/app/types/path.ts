import { Pencil } from './pencil';
import { Coordinate } from './coordinate';

export class Path {
    id: string;
    pencil: Pencil;
    coordinates: Array<Coordinate>;
}
