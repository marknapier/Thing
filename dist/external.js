var External = Thing.External;

var NumberCruncher = (function () {
    function go () {
        outputNumber( inputNumber() * 100 );
    }

    var inputNumber = External(function inputNumber () {});
    var outputNumber = External(function outputNumber (randFloat) {});

    return {
        go: go,
        inputNumber: inputNumber,
        outputNumber: outputNumber
    };
}());

function main () {
    var Rand = Thing.classes.Rand;
    var display = Thing.classes.Label.make({
        w: 100,
        h: 100,
        overflow: 'hidden',
        backgroundColor: 'gray',
        fontSize: '24px',
        text: 'blah'
    }).render();
    var pulse = Thing.classes.Pulsar.make();

    NumberCruncher.inputNumber.BIND( Rand.randSin );
    NumberCruncher.outputNumber.BIND( display.setText );
    pulse.action.BIND( NumberCruncher.go );

    pulse.go();
}


$(function () {
    main();
});

