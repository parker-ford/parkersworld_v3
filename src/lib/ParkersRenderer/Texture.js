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
            const response = await fetch(this.path);
            const blob = await response.blob();
            this.source = await createImageBitmap(blob);
            this.width = this.source.width;
            this.height = this.source.height;
    }
}