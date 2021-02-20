import { Slide } from './slide';
import { Pencil } from './pencil';

export class Session {
    id: string;
    selectedSlideIndex?: number;
    slides: Array<Slide>;
    pencil: Pencil;
}
