// Web component for displaying weather data

class WeatherDisplay extends HTMLElement {

    constructor() {
        super();
        var shadow = this.attachShadow({ mode: 'open' });

        // Initial view
        let style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('type', 'text/css');
        style.setAttribute('href', './component.css');

        let viewport = document.createElement('meta');
        viewport.setAttribute('name', 'viewport');
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');

        let box = document.createElement('div');
        box.setAttribute('id', 'box');

        let header = document.createElement('div');
        header.setAttribute('id', 'header');
        header.innerHTML = 'Weather Display Component';

        let text = document.createElement('div');
        text.setAttribute('id', 'maintext');
        text.innerHTML = 'Select a location.';

        box.appendChild(header);
        box.appendChild(text);
        shadow.appendChild(style);
        shadow.appendChild(viewport);
        shadow.appendChild(box);
    }

    _options = new Object();

    // GET current weather data from API based on given options
    async GETWeather(options, callback) {
        let api = "https://snapshot-api.visit.fi/heliotron/weather/forecast/";
        let resource = api + String(options.location.lat) + "," + String(options.location.long) + "," + String(Math.floor(Date.now() / 1000)) + "?exclude=hourly,daily,flags&units=si";
        let promise = await fetch(resource);
        let response = await promise.json();
        callback(response, this);
    }

    // Display temperature
    DisplayTemp(response, self) {
        let maintext = self.shadowRoot.getElementById('maintext');
        maintext.innerHTML = "Latitude: " + response.latitude + "<br>" + "Longitude: " + response.longitude + "<br>" + "Temperature: " + response.currently.temperature + "&#176;C";
    }

    // Display loading visual
    Loading() {
        let maintext = this.shadowRoot.getElementById('maintext');
        maintext.innerHTML = "Loading...";
    }

    // Display arbitrary text
    TextDisplay(text) {
        let maintext = this.shadowRoot.getElementById('maintext');
        maintext.innerHTML = text;
    }

    connectedCallback() {
        // Verify new options object & update component on success
        Object.defineProperty(this, 'options', {
            set: (opt) => {
                this.Loading();
                if ('location' in opt && 'time' in opt && 'lat' in opt.location && 'long' in opt.location && 'start' in opt.time && 'stop' in opt.time) {
                    if (!isNaN(opt.location.lat) && !isNaN(opt.location.long)) {
                        this._options = opt;
                        this.GETWeather(this._options, this.DisplayTemp);
                    }
                    else {
                        this.TextDisplay("Error: Coordinates must be numbers.");
                    }
                }
                else {
                    this.TextDisplay("Error: Options object is incorrect.");
                }
            },
            get: () => { return this._options; }
        });
    }
}

customElements.define('my-element', WeatherDisplay);