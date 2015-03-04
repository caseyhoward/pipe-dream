module.exports = function FunctionChainApplier() {
  this.applyOnObject = function(object, callChain, callArguments) {
    var i, returnValue = object;
    if (callChain.length == 0) {
      return object.apply(null, callArguments);
    } else {
      for(i = 0; i < callChain.length - 1; ++i) {
        returnValue = returnValue[callChain[i]];
      }
      return returnValue[callChain[callChain.length - 1]].apply(null, callArguments);
    }
  };
};
