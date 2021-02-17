import { Coordinate } from '../coordinate';
import { Pencil } from '../pencil';

export class StartPathEvent {
    id: string;
    coordinate: Coordinate;
    pencil: Pencil;
}
