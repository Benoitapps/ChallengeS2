const MOUSE_DELAY = 1000;
const inactivityDelay = 15 * 60 * 1000; // en millisecondes
let inactivityTimer;
const env = import.meta.env

export default class SDK {
    constructor(api_token) {
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouse = [];
        this.clicks = [];
        this.paths = [];
        this.startTime = new Date();
        this.endTime = null;
        this.api_token = api_token;
        this.user_fingerprint = null;

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
            this.mouse.push({
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
            this.clicks.push({
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
            if (this.paths.length > 0) {
                let lastPath = this.paths[this.paths.length - 1].path;
                if (lastPath === window.location.pathname) {
                    return;
                }
            }
            this.paths.push({
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
        let fingerprint = localStorage.getItem('fingerprint');
        if (fingerprint && fingerprint.trim() !== "") return fingerprint;
        return localStorage.setItem('fingerprint', self.crypto.randomUUID());
    }

    initSendData() {
        window.addEventListener("visibilitychange", (event) => {
            if (event.target.visibilityState === "hidden") {
                let data = {
                    api_token: this.api_token,
                    user_fingerprint: this.getFingerprintUser(),
                    mouse: this.mouse,
                    clicks: this.clicks,
                    paths: this.paths,
                    startTime: this.startTime,
                    endTime: new Date(),
                }

                navigator.sendBeacon(`${env.VITE_URL_SITE_CLIENT}/sdk`, JSON.stringify(data));

                this.resetData();
            }
        });
    }

    resetData() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouse = [];
        this.clicks = [];
        this.paths = [];
        this.startTime = new Date();
        this.endTime = null;
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

        let data = {
            api_token: this.api_token,
            user_fingerprint: this.user_fingerprint,
            mouse: this.mouse,
            clicks: this.clicks,
            paths: this.paths,
            startTime: this.startTime,
            endTime: this.endTime,
        };

        navigator.sendBeacon(`${env.VITE_URL_SITE_CLIENT}/sdk`, JSON.stringify(data));
        
        this.resetData();
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
