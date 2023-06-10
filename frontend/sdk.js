const EMPTY_DATA = {
    api_token: null,
    trackers: {
        mouse: [], // { x: 0, y: 0, timestamp: 0, path: string }
        clicks: [], // { x: 0, y: 0, timestamp: 0, target: HTMLElement, outerHTML: string, path: string }
        startTime: new Date(),
        endTime: null,
    },
};

const MOUSE_DELAY = 5000;

export default class SDK {
    constructor(api_token) {
        this.api_token = api_token;
        this.mouseX = 0;
        this.mouseY = 0;
        this.data = EMPTY_DATA;

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
            this.data.trackers.mouse.push({
                x: this.mouseX,
                y: this.mouseY,
                timestamp: Date.now(),
                path: window.location.pathname,
            });
        }, MOUSE_DELAY);
    }

    trackClicks() {
        document.body.addEventListener("click", (e) => {
            this.data.trackers.clicks.push({
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
            this.data.api_token = this.api_token;
            this.data.trackers.endTime = new Date();
            let data = JSON.stringify(this.data);
            navigator.sendBeacon('http://localhost:3000/sdk', data);
            this.data = EMPTY_DATA;
        });
    }
}
