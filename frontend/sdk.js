const EMPTY_TRACKERS = {
    mouse: [], // { x: 0, y: 0, timestamp: 0, path: string }
    clicks: [], // { x: 0, y: 0, timestamp: 0, target: HTMLElement, outerHTML: string, path: string }
    startTime: new Date(),
    endTime: null,
};

const EMPTY_DATA = {
    api_token: null,
    user_token: null,
    trackers: EMPTY_TRACKERS,
};

const MOUSE_DELAY = 5000;

export default class SDK {
    constructor(api_token) {
        this.mouseX = 0;
        this.mouseY = 0;
        this.data = EMPTY_DATA;
        this.data.api_token = api_token;

        console.log("SDK is running")
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

    getFingerprintUser() {
        if (!localStorage.getItem('fingerprint')) {
            localStorage.setItem('fingerprint', self.crypto.randomUUID());
        }
        return localStorage.getItem('fingerprint');
    }

    initSendData() {
        window.addEventListener("unload", () => {
            this.data.trackers.endTime = new Date();
            this.data.user_token = this.getFingerprintUser();

            let data = JSON.stringify(this.data);
            navigator.sendBeacon('http://localhost:3000/sdk', data);
        });
    }
}
