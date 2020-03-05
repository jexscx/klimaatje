import socketIo from 'socket.io';
import { Klimaatje } from './klimaatje';

/**
 * In charge of receiving weather events and processing them.
 */
export class WeatherReceiver {

    /**
     * Create a new `WeatherReceiver`.
     * @param {socketIo.Server} io the socketIo connection the weather events will be sent over
     * @param {Klimaatje} klimaatje the Klimaatje to change according to received weather events
     */
    constructor(io, klimaatje) {
        this.klimaatje = klimaatje;
        // Wait for a web socket connection
        io.on('connection', client => {

            // Subscribe to the 'weatherDescription' event
            client.on('weatherDescription', description => {
                console.log(`The description is: ${description}`);
                this.processWeatherDescription(description);
            });
        });
    }

    /**
     * Sets the relay of the {@link Klimaatje} to on or off depending on the description.
     * @param {'Clouds' | 'Clear' | 'Snow' | 'Rain' | 'Drizzle' | 'Thunderstorm'} description the weather description
     */
    processWeatherDescription(description) {
        console.log(`in process weather description`);
        switch (description) {
            case "Clouds":
            case "Clear":
                this.klimaatje.setRelay(false);
                break;
            case "Snow":
            case "Rain":
            case "Drizzle":
            case "Thunderstorm":
                    console.log(`Relay on!`);
                this.klimaatje.setRelay(true);
                break;
            default:
                throw Error('Unknown weather description.');
        }
    }
}