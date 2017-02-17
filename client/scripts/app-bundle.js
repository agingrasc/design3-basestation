define('app',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var App = exports.App = function App() {
    _classCallCheck(this, App);

    this.message = 'Hello World!';
  };
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('components/go-to-position',["exports", "../http/base-station-request"], function (exports, _baseStationRequest) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.GoToPosition = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var GoToPosition = exports.GoToPosition = function () {
        function GoToPosition() {
            _classCallCheck(this, GoToPosition);

            this.path = "/go-to-position/";
            this.httpClient = new _baseStationRequest.BaseStationRequest();
            this.xPosition = 0;
            this.yPosition = 0;
        }

        GoToPosition.prototype.execute = function execute() {
            console.log(this.xPosition);
            console.log(this.yPosition);
            var payload = {
                x: this.xPosition,
                y: this.yPosition
            };
            var data = JSON.stringify(payload);
            this.httpClient.post(data, this.path);
        };

        return GoToPosition;
    }();
});
define('http/base-station-request',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var BaseStationRequest = exports.BaseStationRequest = function () {
        function BaseStationRequest() {
            _classCallCheck(this, BaseStationRequest);

            this.baseStationUrl = "http://localhost:12345";
        }

        BaseStationRequest.prototype.post = function post(data, path) {
            fetch(this.baseStationUrl + path, {
                method: "POST",
                headers: {
                    'content-type': 'application/json'
                },
                body: data
            }).then(function (res) {
                return res.json();
            }).then(function (data) {
                console.log(JSON.stringify(data));
            });
        };

        return BaseStationRequest;
    }();
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('text!app.html', ['module'], function(module) { module.exports = "<template><require from=\"./component.html\"></require><require from=\"./components/go-to-position\"></require><component first-name=\"malade\" last-name=\"caliss\"></component><go-to-position></go-to-position><h1>${message}</h1></template>"; });
define('text!component.html', ['module'], function(module) { module.exports = "<template bindable=\"firstName, lastName\">Hello, ${firstName} ${lastName}!</template>"; });
define('text!components/go-to-position.html', ['module'], function(module) { module.exports = "<template><input value.bind=\"xPosition\">X Position :<input value.bind=\"yPosition\">X Position :<button click.trigger=\"execute()\">Go To Position</button></template>"; });
//# sourceMappingURL=app-bundle.js.map