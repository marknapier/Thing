var External = Thing.External;

// Randomizer.init()
// Randomizer.outputNumber.BIND(function (n) {console.log('Randomizer outputNumberted', n);})
// Randomizer.go()

var Randomizer = (function () {
    var Rand = Thing.classes.Rand;

    function init () {
        Rand = Thing.classes.Rand;
    }

    function go () {
        outputNumber( Rand.randInt(0,100) );
    }

    var outputNumber = External(function outputNumber (randFloat) {
    });

    return {
        init: init,
        go: go,
        outputNumber: outputNumber
    };
}());

var Pulse = (function () {
    var delay, T, Timer=Thing.classes.Timer;

    function init (props) {
        props = props || {};
        delay = props.delay || 1000;
        T = Timer.make({callback: trigger.bind(this), delay: delay});
        return this;
    }

    function go () {
        T.go();
        return this;
    }

    function stop () {
        T.stop();
        return this;
    }

    function trigger () {
        action();
        T.go();
    }

    var action = External(function action () {
    });

    return {
        init: init,
        go: go,
        stop: stop,
        action: action
    };
}());


function main () {
    var display = Thing.classes.Label.make({
        w: 100,
        h: 100,
        overflow: 'hidden',
        backgroundColor: 'gray',
        fontSize: '24px',
        text: 'blah'
    }).render();

    // display.setText = display.setText.bind(display);
    window.display = display;

    Randomizer.outputNumber.BIND( display.setText );
    Randomizer.go();
}

window.Randomizer = Randomizer;
window.Pulse = Pulse;


$(function () {
    main();
});

