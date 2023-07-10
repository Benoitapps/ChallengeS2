import SDK from "../../sdk";

export default {
    install(app, apiToken) {
        console.log("Tracking plugin is installed");
        app.provide('sdk', new SDK(apiToken));
    }
};