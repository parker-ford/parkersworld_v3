export class Input {
    static keys = {};

    static initialized = false;

    static init() {
        if(!this.initialized){
            window.addEventListener('keydown', function(event) {
                Input.keys[event.key] = true;
            });

            window.addEventListener('keyup', function(event) {
                Input.keys[event.key] = false;
            });

            this.initialized = true;
            console.log("Input initialized");
        }
    }

    static isKeyDown(key) {
        return !!Input.keys[key];
    }
}

Input.init();