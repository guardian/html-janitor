// UMD
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.amdWeb = factory();
    }
}(this, function () {
    return {
      foo: 'bar'
    };
}));
