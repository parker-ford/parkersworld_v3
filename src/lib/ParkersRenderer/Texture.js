export class Texture {
    constructor(options) {
        this.path = options.path;
        this.loadedPromise = this.init();
    }

    loaded() {
        return this.loadedPromise;
    }

    async init() {
        await this.loadImageBitmap();
    }

    async loadImageBitmap() {
            // const response = await fetch(this.path);
            // const blob = await response.blob();
            // this.source = await createImageBitmap(blob);
            // this.width = this.source.width;
            // this.height = this.source.height;

            const img = document.createElement('img');
            img.src = this.path;
            await img.decode();
            this.source = await createImageBitmap(img);
            this.width = this.source.width;
            this.height = this.source.height;

            // const testImg = document.createElement('img');
            // testImg.src = this.path;
            // document.body.appendChild(testImg);
    }

    // async loadImageBitmap() {
    //     this.width = 5;
    //     this.height = 7;
    //     const _ = [255,   0,   0, 255];  // red
    //     const y = [255, 255,   0, 255];  // yellow
    //     const b = [  0,   0, 255, 255];  // blue
    //     this.source = new Uint8Array([
    //       b, _, _, _, _,
    //       _, y, y, y, _,
    //       _, y, _, _, _,
    //       _, y, y, _, _,
    //       _, y, _, _, _,
    //       _, y, _, _, _,
    //       _, _, _, _, _,
    //     ].flat());
    // }
}