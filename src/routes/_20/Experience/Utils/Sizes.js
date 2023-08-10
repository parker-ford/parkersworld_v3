import EventEmitter from "./EventEmitter";

export default class Sizes extends EventEmitter{
    constructor() {

        super()

        //Setup
        this.width = Math.min(document.body.clientWidth, 1400);
        this.height = Math.min(document.body.clientWidth, 1400) * .5;
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);

        //Resize
        window.addEventListener('resize', () => {
            this.width = Math.min(document.body.clientWidth, 1400);
            this.height = Math.min(document.body.clientWidth, 1400) * .5;
            this.pixelRatio = Math.min(window.devicePixelRatio, 2);

            this.trigger('resize')
        })
    }
}