import SDK from "../../sdk";

export default {
    install(app, apiToken) {
        console.log("Tracking plugin is installed");
        const sdk = new SDK(apiToken);
        
        app.provide('sdk', sdk);

        app.directive('tracker', {
            mounted(el, binding){
                const tag = binding.value;
                const events = Object.keys(binding.modifiers);

                events.forEach(event => {
                    el.addEventListener(event, () => {
                        sdk.addTagToQueue({
                            token: tag,
                            path: window.location.pathname,
                            timestamp: Date.now(),
                            eventType: event,
                        });
                    });
                });
            }
        });
    }
};