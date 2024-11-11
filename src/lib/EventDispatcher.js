class EventDispatcher {
    constructor() {
        this.events = {};
    }

    /**
     * Registers an event handler for the specified event.
     *
     * @param {string} event - The name of the event to listen for.
     * @param {Function} callback - The callback function to be executed when the event is triggered.
     * @return {void}
     */
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    /**
     * Unsubscribes all listeners from the specified event.
     *
     * @param {string} event - The name of the event to remove listeners from.
     * @return {void}
     */
    off(event) {
        if (!this.events[event]) return;
        this.events[event] = [];
    }
    
    /**
     * Emits an event, invoking all registered callbacks for that event.
     *
     * @param {string} event - The name of the event to emit.
     * @param {*} data - The data to pass to the callback functions.
     * @return {void}
     */
    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }
}

export default EventDispatcher;