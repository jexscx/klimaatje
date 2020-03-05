import * as five from 'johnny-five';
import { setInterval } from 'timers';

/**
 * Controls the Klimaatje Arduino board.
 * @typedef Klimaatje
 */
export class Klimaatje {

    constructor() {
        this.board;
        this.isBoardReady = false;
        this.relay;
        this.soilReadInterval = 3000;
        this.readSoilPin = this.readSoilPin.bind(this);
        this.setRelay = this.setRelay.bind(this);
        this.setLedState = this.setLedState.bind(this);
        this.onSoilPinValue = this.onSoilPinValue.bind(this);
    }

    /**
     * Set the interval at which to read the soil hydrometer pin.
     * @param {number} the interval in milliseconds
     */
    setSoilReadInterval(interval) {
        this.soilReadInterval = interval;
    }

    /**
     * Initialise the Klimaatje Arduino board.
     * Starts reading the soil hydrometer at the interval specified by `soilReadInterval`.
     * @returns {Promise<void>} resolves when board is ready to be used.
     */
    init() {
        return new Promise(resolve => {
            var self = this;
            this.board = new five.Board();
            this.board.on('ready', () => {
                this.soilPin = new five.Pin('A0');
                this.relay = new five.Relay(10);

                // Led order: from low to high
                this.leds = [
                    new five.Led(13),
                    new five.Led(12),
                    new five.Led(8),
                    new five.Led(7),
                    new five.Led(4),
                    new five.Led(2)
                ];

                // Setup interval to check soil pin
                setInterval(this.readSoilPin, this.soilReadInterval);

                // Resolve promise when everything is done.
                this.isBoardReady = true;
                resolve();
            });
        });
    }

    /**
     * Sets the state of the relay.
     * @param {boolean} state to set the relay to on or to off.
     *   - true = on
     *   - false = off
     * 
     * @throws an error when called when the board is not ready
     */
    setRelay(state) {
        if (this.isBoardReady) {
            if (state) {
                this.relay.on();
            } else {
                this.relay.off();
            }
        } else {
            throw Error('setRelay called when board was not ready');
        }
    }

    /**
     * @private
     * To be called at a specified interval. Reads the soil pin and processes the result.
     */
    readSoilPin() {
        if (this.isBoardReady) {
            // this.soilPin.read(function(error, value) {
            //     console.log(value);
            //   });
            let self = this;
            this.soilPin.query(function (state) {
                console.log(state.value);
                self.onSoilPinValue(state.value);
            });
        }
    }

    /**
     * Sets the leds to a certain state.
     * @param {number} state the state to set the leds to
     *              * 0 = all off
     *              * 1 = first led on
     *              * ...
     *              * 6 = all on
     */
    setLedState(state) {
        for (let i = 0; i < this.leds.length; i++) {
            if (i < state) {
                this.leds[i].on();
            } else {
                this.leds[i].off();
            }
        }
    }

    /**
     * @private
     * Processes the soil hydrometer value.
     * @param {number} soilpinValue the value returned by the soil hydrometer pin
     */
    onSoilPinValue(soilpinValue) {
        if (soilpinValue <= 260) {
            this.setLedState(6);
        }
        else if (soilpinValue <= 356) {
            this.setLedState(5);
        }
        else if (soilpinValue <= 472) {
            this.setLedState(4);
        }
        else if (soilpinValue <= 558) {
            this.setLedState(3);
        }
        else if (soilpinValue <= 704) {
            this.setLedState(2);
        }
        else if (soilpinValue <= 820) {
            this.setLedState(1);
        }
    }
}
