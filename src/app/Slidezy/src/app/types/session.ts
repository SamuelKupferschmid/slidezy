import { Slide } from './slide';

export class Session {
    id: string;
    selectedSlideIndex?: number;
    slides: Array<Slide>;
}
