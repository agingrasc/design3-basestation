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

    var App = exports.App = function () {
        function App() {
            _classCallCheck(this, App);
        }

        App.prototype.configureRouter = function configureRouter(config, router) {
            config.title = 'Aurelia';
            var navStrat = function navStrat(instruction) {
                instruction.config.moduleId = instruction.fragment;
                instruction.config.href = instruction.fragment;
            };
            config.map([{
                route: ['', 'competition'],
                name: 'competition',
                moduleId: './components/competition/competition',
                nav: true,
                title: 'Competition'
            }, {
                route: 'debug',
                name: 'debug',
                moduleId: './components/debug/debug',
                nav: true,
                title: 'Debug'
            }]);
            this.router = router;
        };

        return App;
    }();
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
define('services/timer',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Timer = exports.Timer = function () {
        function Timer() {
            _classCallCheck(this, Timer);

            this.begin = 0;
            this.time = "Timer not started";
        }

        Timer.prototype.startTimer = function startTimer() {
            var myVar = setInterval(myTimer, 1000);
            var self = this;
            var d = new Date();
            this.begin = d.valueOf();

            function myTimer() {
                var d = new Date();
                var time = d.valueOf() - self.begin;
                var seconds = Math.floor(time / 1000 % 60);
                var minutes = Math.floor(time / (1000 * 60) % 60);
                var hours = Math.floor(time / (1000 * 60 * 60) % 24);
                self.time = ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
            }
        };

        Timer.prototype.getTime = function getTime() {
            return this.time;
        };

        return Timer;
    }();
});
define('services/vision',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Vision = exports.Vision = function () {
        function Vision() {
            _classCallCheck(this, Vision);

            this.informations = undefined;
            this.imageView = undefined;
        }

        Vision.prototype.start = function start() {
            var ws = new WebSocket("ws://localhost:3000");
            var tmp = {};
            tmp.headers = "register_vision_data";
            var value = JSON.stringify(tmp);
            ws.onopen = function () {
                ws.send(value);
            };
            var self = this;
            ws.onmessage = function (evt) {
                var data = JSON.parse(evt.data);
                console.log(data);
                self.imageView.imagePath = "data:image/png;base64," + data.image.data;
                self.informations.obstacles = data.world.obstacles;
                self.informations.robot = data.world.robot;
            };
        };

        Vision.prototype.checkReadyToStart = function checkReadyToStart() {
            if (this.imageView === undefined) {
                return;
            }
            if (this.informations === undefined) {
                return;
            }
            this.start();
        };

        Vision.prototype.registerImageView = function registerImageView(imageView) {
            this.imageView = imageView;
            this.checkReadyToStart();
        };

        Vision.prototype.registerInformations = function registerInformations(informations) {
            this.informations = informations;
            this.checkReadyToStart();
        };

        return Vision;
    }();
});
define('components/competition/competition',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Competition = exports.Competition = function Competition() {
    _classCallCheck(this, Competition);
  };
});
define('components/debug/debug',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Debug = exports.Debug = function Debug() {
    _classCallCheck(this, Debug);
  };
});
define('components/go-to-position/go-to-position',['exports', '../../http/base-station-request', 'aurelia-framework'], function (exports, _baseStationRequest, _aureliaFramework) {
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
        function GoToPosition(vision) {
            _classCallCheck(this, GoToPosition);

            _initDefineProp(this, 'xPosition', _descriptor, this);

            _initDefineProp(this, 'yPosition', _descriptor2, this);

            this.vision = vision;
            this.httpClient = new _baseStationRequest.BaseStationRequest();
        }

        GoToPosition.prototype.execute = function execute() {
            console.log(this.xPosition);
            console.log(this.yPosition);
            this.path = "/go-to-position/";
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
define('components/informations/informations',['exports', 'aurelia-framework', '../../services/vision'], function (exports, _aureliaFramework, _vision) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Informations = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Informations = exports.Informations = (_dec = (0, _aureliaFramework.inject)(_vision.Vision), _dec(_class = function () {
        function Informations(vision) {
            _classCallCheck(this, Informations);

            this.vision = vision;
            this.informations = {};
            this.informations.obstacles = [];
        }

        Informations.prototype.attached = function attached() {
            this.vision.registerInformations(this.informations);
        };

        return Informations;
    }()) || _class);
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

  var Navbar = exports.Navbar = function Navbar() {
    _classCallCheck(this, Navbar);
  };
});
define('components/stat/stat',[], function () {
  "use strict";
});
define('components/world-vision/world-vision-competition',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var WorldVisionCompetition = exports.WorldVisionCompetition = function () {
        function WorldVisionCompetition() {
            _classCallCheck(this, WorldVisionCompetition);

            this.canvasId = "monCanvas";
            this.x_position = 0;
            this.y_position = 0;
            this.imagePath = "./src/components/world-vision/image14.jpg";
            this.chosen_x_position = 0;
            this.chosen_y_position = 0;
        }

        WorldVisionCompetition.prototype.attached = function attached() {
            var canvas = document.getElementById(this.canvasId);
            var context = canvas.getContext('2d');
        };

        WorldVisionCompetition.prototype.start = function start() {
            console.log("Started");
        };

        return WorldVisionCompetition;
    }();
});
define('components/world-vision/world-vision-debug',['exports', 'aurelia-framework', '../../services/vision'], function (exports, _aureliaFramework, _vision) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.WorldVisionDebug = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var WorldVisionDebug = exports.WorldVisionDebug = (_dec = (0, _aureliaFramework.inject)(_vision.Vision), _dec(_class = function () {
        function WorldVisionDebug(vision) {
            _classCallCheck(this, WorldVisionDebug);

            this.vision = vision;
            this.canvasId = "monCanvas";

            this.visionProperties = {};
            this.visionProperties.imagePath = "./src/components/world-vision/image14.jpg";

            this.x_position = 0;
            this.y_position = 0;

            this.chosen_x_position = 0;
            this.chosen_y_position = 0;
        }

        WorldVisionDebug.prototype.attached = function attached() {
            var canvas = document.getElementById(this.canvasId);
            var context = canvas.getContext('2d');

            var self = this;

            canvas.addEventListener('mousemove', function (evt) {
                var mousePos = self.getMousePos(canvas, evt);
                self.x_position = Math.floor(mousePos.x);
                self.y_position = Math.floor(mousePos.y);
            }, false);

            canvas.addEventListener('click', function (evt) {
                self.chosen_x_position = self.x_position;
                self.chosen_y_position = self.y_position;
            }, false);

            this.vision.registerImageView(this.visionProperties);
        };

        WorldVisionDebug.prototype.getMousePos = function getMousePos(canvas, evt) {
            var rect = canvas.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        };

        return WorldVisionDebug;
    }()) || _class);
});
define('text!app.html', ['module'], function(module) { module.exports = "<template><div><require from=\"./components/navbar/navbar\"></require><navbar></navbar></div><router-view></router-view></template>"; });
define('text!components/competition/competition.html', ['module'], function(module) { module.exports = "<template><require from=\"../world-vision/world-vision-competition\"></require><world-vision-competition></world-vision-competition></template>"; });
define('text!components/debug/debug.html', ['module'], function(module) { module.exports = "<template><require from=\"../world-vision/world-vision-debug\"></require><require from=\"../informations/informations\"></require><div class=\"row\"><world-vision-debug></world-vision-debug><informations></informations></div></template>"; });
define('text!components/go-to-position/go-to-position.html', ['module'], function(module) { module.exports = "<template><button class=\"color2 waves-effect waves-light btn\" click.trigger=\"execute()\">Go To Position</button></template>"; });
define('text!components/informations/informations.html', ['module'], function(module) { module.exports = "<template><div class=\"col s6 container\"><div class=\"row\"><div class=\"no-left-padding\"><div class=\"card\"><div class=\"card-content center-align\"><h3>Informations</h3><div><div class=\"card-content\"><h5>Obstacles</h5><div class=\"equidistant\" repeat.for=\"obstacle of informations.obstacles\"><label>x :</label><label class=\"text-number\">${obstacle.position.x}</label><label>y :</label><label class=\"text-number\">${obstacle.position.y}</label><label>Tag :</label><label class=\"text-number\">${obstacle.tag}</label><label>Width :</label><label class=\"text-number\">${obstacle.dimension.width}</label></div><div class=\"card-action\"></div><h5>Robot</h5><div class=\"equidistant\"><label>x :</label><label class=\"text-number\">${informations.robot.position.x}</label><label>y :</label><label class=\"text-number\">${informations.robot.position.y}</label><label>Angle :</label><label class=\"text-number\">${informations.robot.orientation.value}</label></div><div class=\"card-action\"></div></div></div></div></div></div></div></div></template>"; });
define('text!components/navbar/navbar.html', ['module'], function(module) { module.exports = "<template><nav><div class=\"nav-wrapper color1\"><img width=\"55px\" height=\"55px\" src=\"./img/robot.png\"><a href=\"#\" class=\"brand-logo center\">Leonard</a><ul id=\"nav-mobile\" class=\"right hide-on-med-and-down\"><li><a href=\"#/competition\">Competition</a></li><li><a href=\"#/debug\">Debug</a></li></ul></div></nav></template>"; });
define('text!components/stat/stat.html', ['module'], function(module) { module.exports = ""; });
define('text!components/world-vision/world-vision-competition.html', ['module'], function(module) { module.exports = "<template><div class=\"container\"><div class=\"row\"><div class=\"col s12 m12\"><div class=\"card\"><div class=\"card-content center-align\"><h3>World Vision</h3><div><div class=\"card-image\"><canvas id=\"${canvasId}\" width=\"640px\" height=\"480px\" style=\"background:url(${imagePath})\"></canvas></div><div class=\"card-content\"><span class=\"equidistant float-left\"><label>Robot position</label><label>x :</label><label class=\"text-number\">${x_position}</label><label>y :</label><label class=\"text-number\">${y_position}</label></span><span class=\"equidistant float-right\"></span></div><div class=\"card-action\"><button class=\"color2 waves-effect waves-light btn\" click.trigger=\"start()\">Start</button></div></div></div></div></div></div></div></template>"; });
define('text!components/world-vision/world-vision-debug.html', ['module'], function(module) { module.exports = "<template><require from=\"../go-to-position/go-to-position\"></require><div class=\"col s6 container\"><div class=\"row\"><div class=\"no-right-padding\"><div class=\"card\"><div class=\"card-content center-align\"><h3>World Vision</h3><div><div class=\"card-image\"><canvas id=\"${canvasId}\" width=\"640px\" height=\"480px\" style=\"background:url(${visionProperties.imagePath})\"></canvas></div><div class=\"card-content\"><span class=\"equidistant float-left\"><label>Mouse position</label><label>x :</label><label class=\"text-number\">${x_position}</label><label>y :</label><label class=\"text-number\">${y_position}</label></span><span class=\"equidistant float-right\"><label>Chosen position</label><label>x :</label><label class=\"text-number\">${chosen_x_position}</label><label>y :</label><label class=\"text-number\">${chosen_y_position}</label></span></div><div class=\"card-action\"><go-to-position x-position=\"${chosen_x_position}\" y-position=\"${chosen_y_position}\"></go-to-position></div></div></div></div></div></div></div></template>"; });
//# sourceMappingURL=app-bundle.js.map