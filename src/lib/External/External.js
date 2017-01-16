/**
 *  Wrap a function inside a module so that the function can be
 *  overriden from outside the module with a custom function.  The 
 *  customized function is available both outside and inside the 
 *  requirified module.
 *
 *  In the module:
 *      var overridableFunction = External( function (a) {
 *          ...
 *      });
 *      module.exports = { overridableFunction: overridableFunction };
 *
 *  In the calling module:
 *      SomeModule.overridableFunction.BIND(myCustomFunction);
 *      SomeModule.overridableFunction();  // will run myCustomFunction
 *
 *  @module External
 */

var Thing = require('../Thing/Thing.js');

function External (callFunction, callContext) {
    var callMe, context;

    function setFunction (newFunc, newContext) {
        callMe = newFunc;
        context = newContext || {};
    }

    function wrapper () {
        return callMe.apply(context, arguments);
    }

    wrapper.BIND = setFunction;

    setFunction(callFunction, callContext);

    return wrapper;
}

Thing.External = External;

module.exports = External;
