export class Input {
    static keys = {};
    static mouseButtons = {};

    static initialized = false;

    static init() {
        if(!this.initialized){
            window.addEventListener('keydown', function(event) {
                Input.keys[event.key] = true;
            });

            window.addEventListener('keyup', function(event) {
                Input.keys[event.key] = false;
            });

            window.addEventListener('mousedown', function(event) {
                Input.mouseButtons[event.button] = true;
            });

            window.addEventListener('mouseup', function(event) {
                Input.mouseButtons[event.button] = false;
            });

            window.addEventListener('mousemove', function(event) {
                Input.mousePosition.x = event.clientX;
                Input.mousePosition.y = event.clientY;
            });

            this.initialized = true;
        }
    }

    static isKeyDown(key) {
        return !!Input.keys[key];
    }

    static isMouseDown(button) {
        return !!Input.mouseButtons[button];
    }

    static getMousePosition() {
        return Input.mousePosition;
    }
}

Input.init();