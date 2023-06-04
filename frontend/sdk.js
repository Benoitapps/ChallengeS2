const EMPTY_TRACKER = {
    mouse: [], // { x: 0, y: 0, timestamp: 0, path: string }
    clicks: [], // { x: 0, y: 0, timestamp: 0, target: HTMLElement, outerHTML: string, path: string }
    startTime: new Date(),
    endTime: null,
};

const MOUSE_DELAY = 1000;

export default class SDK {
    constructor() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.tracker = EMPTY_TRACKER;

        this.initTracker();
        this.initSendData();
    }

    initTracker() {
        this.trackMouseMovement();
        this.trackClicks();
    }

    trackMouseMovement() {
        document.addEventListener("mousemove", (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        this.getMousePosition();
    }

    getMousePosition() {
        setInterval(() => {
            this.tracker.mouse.push({
                x: this.mouseX,
                y: this.mouseY,
                timestamp: Date.now(),
                path: window.location.pathname,
            });
        }, MOUSE_DELAY);
    }

    trackClicks() {
        document.body.addEventListener("click", (e) => {
            this.tracker.clicks.push({
                x: e.clientX,
                y: e.clientY,
                timestamp: Date.now(),
                target: e.target.outerHTML,
                path: window.location.pathname,
            });
        });
    }

    initSendData() {
        window.addEventListener("unload", () => {
            this.tracker.endTime = new Date();
            let data = JSON.stringify(this.tracker);
            navigator.sendBeacon('http://localhost:3000/sdk', data);
            this.tracker = EMPTY_TRACKER;
        });
    }
}
