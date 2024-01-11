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

    update(){
        this.objects.forEach(element => {
            if(typeof element.update === 'function'){
                element.update();
            }
        });
    }
}