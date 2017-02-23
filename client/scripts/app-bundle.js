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

        this.message = '';
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
define('components/go-to-position',['exports', '../http/base-station-request', 'aurelia-framework'], function (exports, _baseStationRequest, _aureliaFramework) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.GoToPosition = undefined;

    function _initDefineProp(target, property, descriptor, context) {
        if (!descriptor) return;
        Object.defineProperty(target, property, {
            enumerable: descriptor.enumerable,
            configurable: descriptor.configurable,
            writable: descriptor.writable,
            value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
        });
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
        var desc = {};
        Object['ke' + 'ys'](descriptor).forEach(function (key) {
            desc[key] = descriptor[key];
        });
        desc.enumerable = !!desc.enumerable;
        desc.configurable = !!desc.configurable;

        if ('value' in desc || desc.initializer) {
            desc.writable = true;
        }

        desc = decorators.slice().reverse().reduce(function (desc, decorator) {
            return decorator(target, property, desc) || desc;
        }, desc);

        if (context && desc.initializer !== void 0) {
            desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
            desc.initializer = undefined;
        }

        if (desc.initializer === void 0) {
            Object['define' + 'Property'](target, property, desc);
            desc = null;
        }

        return desc;
    }

    function _initializerWarningHelper(descriptor, context) {
        throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
    }

    var _desc, _value, _class, _descriptor, _descriptor2;

    var GoToPosition = exports.GoToPosition = (_class = function () {
        function GoToPosition() {
            _classCallCheck(this, GoToPosition);

            _initDefineProp(this, 'xPosition', _descriptor, this);

            _initDefineProp(this, 'yPosition', _descriptor2, this);

            this.path = "/go-to-position/";
            this.httpClient = new _baseStationRequest.BaseStationRequest();
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
    }(), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'xPosition', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: function initializer() {
            return 0;
        }
    }), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'yPosition', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: function initializer() {
            return 0;
        }
    })), _class);
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
define('components/navbar/navbar',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Navbar = exports.Navbar = function () {
        function Navbar() {
            _classCallCheck(this, Navbar);
        }

        Navbar.prototype.execute = function execute() {};

        return Navbar;
    }();
});
define('components/world-vision/world-vision',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var WorldVision = exports.WorldVision = function () {
        function WorldVision() {
            _classCallCheck(this, WorldVision);

            this.canvasId = "monCanvas";
            this.x_position = 0;
            this.y_position = 0;
            this.imagePath = "./src/components/world-vision/image14.jpg";
        }

        WorldVision.prototype.getMousePos = function getMousePos(canvas, evt) {
            var rect = canvas.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        };

        WorldVision.prototype.start = function start() {
            var canvas = document.getElementById(this.canvasId);
            var context = canvas.getContext('2d');
            var self = this;
            canvas.addEventListener('mousemove', function (evt) {
                var mousePos = self.getMousePos(canvas, evt);
                self.x_position = mousePos.x;
                self.y_position = mousePos.y;
            }, false);
        };

        return WorldVision;
    }();
});
define('text!app.html', ['module'], function(module) { module.exports = "<template><div><require from=\"./component.html\"></require><require from=\"./components/navbar/navbar\"></require><require from=\"./components/world-vision/world-vision\"></require><navbar></navbar><world-vision></world-vision><component first-name=\"\" last-name=\"\"></component></div></template>"; });
define('text!component.html', ['module'], function(module) { module.exports = "<template bindable=\"firstName, lastName\">Hello, ${firstName} ${lastName}!</template>"; });
define('text!components/go-to-position.html', ['module'], function(module) { module.exports = "<template><button class=\"color2 waves-effect waves-light btn\" click.trigger=\"execute()\">Go To Position</button></template>"; });
define('text!components/navbar/navbar.html', ['module'], function(module) { module.exports = "<template><nav><div class=\"nav-wrapper color1\"><a href=\"#\" class=\"brand-logo\">Logo</a><ul id=\"nav-mobile\" class=\"right hide-on-med-and-down\"><li><a href=\"sass.html\">Sass</a></li><li><a href=\"badges.html\">Components</a></li><li><a href=\"collapsible.html\">JavaScript</a></li></ul></div></nav></template>"; });
define('text!components/world-vision/world-vision.html', ['module'], function(module) { module.exports = "<template><require from=\"../go-to-position\"></require><div class=\"container\"><div class=\"row\"><div class=\"col s12 m12\"><div class=\"card\"><div class=\"card-content center-align\"><h3>Wolrd Vision</h3><div><div class=\"card-image\"><canvas id=\"${canvasId}\" width=\"640px\" height=\"480px\" style=\"background:url(${imagePath})\"></canvas></div><div class=\"card-content\"><span class=\"equidistant\"><label>Position x: ${x_position}</label><label>Position y: ${x_position}</label></span></div><div class=\"card-action\"><button class=\"color2 waves-effect waves-light btn\" click.trigger=\"start()\">start</button><go-to-position x-position=\"${x_position}\" y-position=\"${y_position}\"></go-to-position></div></div></div></div></div></div></div></template>"; });
//# sourceMappingURL=app-bundle.js.map