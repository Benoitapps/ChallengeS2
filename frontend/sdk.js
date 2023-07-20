const MOUSE_DELAY = 1000;
const EMPTY_TRACKERS = {
    mouse: [], // { x: 0, y: 0, timestamp: 0, path: string }
    clicks: [], // { x: 0, y: 0, timestamp: 0, target: HTMLElement, outerHTML: string, path: string }
    paths: [], // { path: string, timestamp: 0 }
    startTime: new Date(),
    endTime: null,
};
const EMPTY_DATA = {
    api_token: null,
    user_fingerprint: null,
    trackers: EMPTY_TRACKERS,
};
const inactivityDelay = 15 * 60 * 1000; // en millisecondes
let inactivityTimer;


export default class SDK {
    constructor(api_token) {
        this.mouseX = 0;
        this.mouseY = 0;
        this.data = EMPTY_DATA;
        this.data.api_token = api_token;

        console.log("SDK is running")
        this.initUserInteractionForInactivity();
        this.initSendData();
    }

    initTracker() {
        this.trackMouseMovement();
        this.trackMouseClick();
        this.trackNavigation();
    }

    stopTracker() {
        this.stopTrackingMouseMovement();
        this.stopTrackingMouseClick();
        this.stopTrackingNavigation();
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

    trackNavigation() {
        console.log("start tracking navigation");
        this.navigationFunction = (e) => {
            // N'ajoute pas le meme path 2 fois
            if (this.data.trackers.paths.length > 0) {
                let lastPath = this.data.trackers.paths[this.data.trackers.paths.length - 1].path;
                if (lastPath === window.location.pathname) {
                    return;
                }
            }
            this.data.trackers.paths.push({
                path: window.location.pathname,
                timestamp: Date.now(),
            });
            console.log("navigation : ", window.location.pathname)
        };

        window.addEventListener("click", this.navigationFunction);
    }

    stopTrackingNavigation() {
        console.log("stop tracking navigation");
        window.removeEventListener("click", this.navigationFunction);
    }

    getFingerprintUser() {
        if (!localStorage.getItem('fingerprint')) {
            localStorage.setItem('fingerprint', self.crypto.randomUUID());
        }
        return localStorage.getItem('fingerprint');
    }

    initSendData() {        
        // ! ajouter egalement unload ?
        // ! envoyer les données en temps réel
        window.addEventListener("visibilitychange", (event) => {
            if (event.target.visibilityState === "hidden") {
                this.data.trackers.endTime = new Date();
                this.data.user_fingerprint = this.getFingerprintUser();
                // navigator.sendBeacon('http://localhost:3000/sdk', JSON.stringify(this.data));
                // TODO: a améliorer
                fetch('http://localhost:3000/sdk', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.data),
                })

                // ! vider les data
                console.log("send data to backend : ", this.data);
                // let api_token = this.data.api_token;
                // let user_fingerprint = this.data.user_fingerprint;

                // this.data.trackers = {...EMPTY_TRACKERS};

                // this.data.api_token = api_token;
                // this.data.user_fingerprint = user_fingerprint;
                console.log("data is empty : ", this.data);
            }
        });
    }

    // ? ------------------------- USER INACTIVITY ------------------------- ? //
    initUserInteractionForInactivity() {
        document.addEventListener("click", () => this.handleUserInteraction());
        document.addEventListener("mousemove", () => this.handleUserInteraction());
        document.addEventListener("keydown", () => this.handleUserInteraction());
        document.addEventListener("scroll", () => this.handleUserInteraction());
        document.addEventListener("touchstart", () => this.handleUserInteraction());
        document.addEventListener("touchmove", () => this.handleUserInteraction());
        document.addEventListener("touchend", () => this.handleUserInteraction());
    }

    resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => this.detectInactivity(), inactivityDelay);
    }

    detectInactivity() {
        console.log("User inactive!");
        // TODO: Send data to backend
        // TODO: Reset data -> Begin new user session
    }

    handleUserInteraction() {
        this.resetInactivityTimer();
    }
    // ? ------------------------- USER INACTIVITY ------------------------- ? //

    initTags() {
        let tags = document.querySelectorAll('button[data-tag]');
        tags.forEach((tag) => {
            tag.addEventListener("click", (e) => {
                console.table("click on this tag : ", e.target);
            });
        });
    }
}
