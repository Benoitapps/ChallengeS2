const EMPTY_TRACKERS = {
    mouse: [], // { x: 0, y: 0, timestamp: 0, path: string }
    clicks: [], // { x: 0, y: 0, timestamp: 0, target: HTMLElement, outerHTML: string, path: string }
    startTime: new Date(),
    endTime: null,
};

const EMPTY_DATA = {
    api_token: null,
    user_fingerprint: null,
    trackers: EMPTY_TRACKERS,
};

const MOUSE_DELAY = 1000;

export default class SDK {
    constructor(api_token) {
        this.mouseX = 0;
        this.mouseY = 0;
        this.data = EMPTY_DATA;
        this.data.api_token = api_token;

        console.log("SDK is running")
        this.initSendData();
    }

    initTracker() {
        this.trackMouseMovement();
        this.trackMouseClick();
    }

    stopTracker() {
        this.stopTrackingMouseMovement();
        this.stopTrackingMouseClick();
    }

    trackMouseMovement() {
        console.log("start tracking mouse movement");
        this.mouseMoveHandler = (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        };
        document.addEventListener("mousemove", this.mouseMoveHandler);
        this.getMousePosition();
    }

    stopTrackingMouseMovement() {
        console.log("stop tracking mouse movement");
        document.removeEventListener("mousemove", this.mouseMoveHandler);
        this.stopUpdatingMousePosition();
    }

    getMousePosition() {
        this.mousePositionInterval = setInterval(() => {
            this.data.trackers.mouse.push({
                x: this.mouseX,
                y: this.mouseY,
                timestamp: Date.now(),
                path: window.location.pathname,
            });
            console.log("mouse position : ", this.mouseX, this.mouseY)
        }, MOUSE_DELAY);
    }

    stopUpdatingMousePosition() {
        clearInterval(this.mousePositionInterval);
    }

    trackMouseClick() {
        console.log('start tracking mouse click');
        this.trackerFunction = (e) => {
            this.data.trackers.clicks.push({
                x: e.clientX,
                y: e.clientY,
                timestamp: Date.now(),
                target: e.target.outerHTML,
                path: window.location.pathname,
            });
            console.table("click on this element : ", e.target)
        };

        document.body.addEventListener("click", this.trackerFunction);
    }

    stopTrackingMouseClick() {
        console.log("stop tracking mouse click")
        document.body.removeEventListener("click", this.trackerFunction);
    }

    getFingerprintUser() {
        if (!localStorage.getItem('fingerprint')) {
            localStorage.setItem('fingerprint', self.crypto.randomUUID());
        }
        return localStorage.getItem('fingerprint');
    }

    initSendData() {
        window.addEventListener("unload", (e) => {
            this.data.trackers.endTime = new Date();
            this.data.user_fingerprint = this.getFingerprintUser();
            navigator.sendBeacon('http://localhost:3000/sdk', JSON.stringify(this.data));
        });
    }

    initTags() {
        let tags = document.querySelectorAll('button[data-tag]');
        tags.forEach((tag) => {
            tag.addEventListener("click", (e) => {
                console.table("click on this tag : ", e.target);
            });
        });
    }
}
