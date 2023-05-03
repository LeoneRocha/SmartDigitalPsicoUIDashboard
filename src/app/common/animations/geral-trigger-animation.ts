import { state, style, transition, trigger, useAnimation } from "@angular/animations";
import { btnDefaultAnimate } from "./geral-animation";

export let botaoAnimado = trigger('botaoAnimado', [
    state('inicial', style({
        //color: 'green',
        transform: 'scale(1)'
    })),
    state('final', style({
        color: 'green',
        transform: 'scale(1.2)'
    })),
    transition('inicial <=> final', [useAnimation(btnDefaultAnimate)])
]);