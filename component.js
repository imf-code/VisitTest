// JavaScript source code

class TemperatureDisplay extends HTMLElement {

    constructor() {

        super();

        var shadow = this.attachShadow({ mode: 'open' });
    }

    _options = new Object();

    // GET weather data from API based on given options object for given function
    static async GETCurrentTemp(options, callback) {
        let api = "https://snapshot-api.visit.fi/heliotron/weather/forecast/";
        let resource = api + String(options.location.lat) + "," + String(options.location.long) + "," + String(Math.floor(options.time.stop / 1000)) + "?exclude=hourly,daily,flags&units=si";
        console.log(resource); // debug
        let promise = await fetch(resource);
        let response = await promise.json();
        console.log(response); // debug
        callback(response);
    }

    // Visual aspects of the component
    DrawElement(response) {
        console.log(response); // debug
        document.getElementById("asdf").innerHTML = response.latitude + "<br>" + response.longitude + "<br>" + response.currently.temperature;
    }

    connectedCallback() {
        // Updates on changes to options || todo: add check for no changes if time?
        Object.defineProperty(this, 'options', {
            set: function (opt) {
                console.log("BarFoo"); // debug
                this._options = opt;
                TemperatureDisplay.GETCurrentTemp(this._options, this.DrawElement);
            },
            get: function () { return this._options; }
        });
    }
}

customElements.define('my-element', TemperatureDisplay);