export class Scene {
    constructor() {
        this.objects = [];
    }

    add(object) {
        this.objects.push(object);
    }

    clear() {
        this.objects = [];
    }
}