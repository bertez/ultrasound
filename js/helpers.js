var TimeoutChain = function() {
    var This = this;
    this._timeoutHandler = null;
    this.chain = [];
    this.currentStep = 0;
    this.isRunning = false;
    this.nextStep = function() {
        This.currentStep = This.currentStep + 1;
        if (This.currentStep == This.chain.length) {
            This.stop();
        } else {
            This.processCurrentStep();
        }
    };
    this.processCurrentStep = function() {
        This._timeoutHandler = window.setTimeout(function() {
            This.chain[This.currentStep].func();
            This.nextStep();
        }, This.chain[This.currentStep].time);
    };
    this.start = function() {
        if (This.chain.length === 0) {
            return;
        }
        if (This.isRunning === true) {
            return;
        }
        This.isRunning = true;
        This.currentStep = 0;
        This.processCurrentStep();
    };
    this.stop = function() {
        This.isRunning = false;
        window.clearTimeout(This._timeoutHandler);
    };
    this.add = function(_function, _timeout) {
        This.chain[This.chain.length] = {
            func: _function,
            time: _timeout
        };
    };
};


function compare_week(a,b) {
  if (a.week < b.week)
     return -1;
  if (a.week > b.week)
    return 1;
  return 0;
}

Array.prototype.shuffle = function() {
  var i = this.length, j, temp;
  if ( i == 0 ) return this;
  while ( --i ) {
     j = Math.floor( Math.random() * ( i + 1 ) );
     temp = this[i];
     this[i] = this[j];
     this[j] = temp;
  }
  return this;
}