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
define('http/base-station-request',['exports'], function (exports) {
    'use strict';

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

            this.baseStationUrl = 'http://localhost:12345';
        }

        BaseStationRequest.prototype.post = function post(data, endpoint) {
            fetch(this.baseStationUrl + endpoint, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(data)
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
            this.time = '00:00';
            this.started = false;
        }

        Timer.prototype.start = function start() {
            this.currentLap = setInterval(myTimer, 1000);
            var self = this;
            var d = new Date();
            this.begin = d.valueOf();

            function myTimer() {
                var d = new Date();
                var time = d.valueOf() - self.begin;
                var seconds = Math.floor(time / 1000 % 60);
                var minutes = Math.floor(time / (1000 * 60) % 60);
                var hours = Math.floor(time / (1000 * 60 * 60) % 24);
                self.time = ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
            }
        };

        Timer.prototype.stop = function stop() {
            clearInterval(this.currentLap);
        };

        Timer.prototype.reset = function reset() {
            this.stop();
            this.time = '00:00';
        };

        return Timer;
    }();
});
define('services/vision',['exports'], function (exports) {
    'use strict';

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
            this.world_information = undefined;
            this.origin = undefined;
            this.ratio = undefined;
            this.goto = undefined;
        }

        Vision.prototype.start = function start() {
            var _this = this;

            var ws = new WebSocket('ws://localhost:3000');

            ws.onopen = function () {
                var robotPositionRegisterMessage = JSON.stringify({ 'headers': 'register_vision_data' });
                ws.send(robotPositionRegisterMessage);
            };

            ws.onmessage = function (evt) {
                var data = JSON.parse(evt.data);

                if (data.image.origin.x !== "") {
                    _this.world_information.origin = data.image.origin;
                    _this.world_information.ratio = data.image.ratio;
                    _this.goto.width = data.world.base_table.dimension.width;
                    _this.goto.length = data.world.base_table.dimension.height;
                }

                window.requestAnimationFrame(function () {
                    _this.imageView.imagePath = 'data:image/jpeg;base64,' + data.image.data;
                });

                _this.informations.obstacles = data.world.obstacles;

                var world = data.world;

                _this.informations.worldDimensions = {
                    'width': Math.round(parseFloat(world.base_table.dimension.width)),
                    'length': Math.round(parseFloat(world.base_table.dimension.height)),
                    'unit': world.unit
                };

                var robot = data.world.robot;
                _this.informations.robot = {
                    'position': {
                        'x': robot.position.x,
                        'y': robot.position.y
                    },
                    'orientation': robot.orientation
                };

                _this.goto.robot = {
                    'position': {
                        'x': robot.position.x,
                        'y': robot.position.y,
                        'theta': robot.theta
                    }
                };

                _this.goto.obstacles = [];

                _this.world_information.world_dimension = data.image.sent_dimension;
            };
        };

        Vision.prototype.checkReadyToStart = function checkReadyToStart() {
            if (this.imageView === undefined) {
                return;
            }
            if (this.informations === undefined) {
                return;
            }
            if (this.goto === undefined) {
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

        Vision.prototype.registerGotoPosition = function registerGotoPosition(world_information) {
            this.world_information = world_information;
        };

        Vision.prototype.registerGoto = function registerGoto(goto) {
            console.log(goto);
            this.goto = goto;
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
define('components/go-to-position/go-to-position',['exports', 'aurelia-framework', '../../http/base-station-request', '../../services/vision'], function (exports, _aureliaFramework, _baseStationRequest, _vision) {
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

    var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;

    var GoToPosition = exports.GoToPosition = (_dec = (0, _aureliaFramework.inject)(_vision.Vision), _dec(_class = (_class2 = function () {
        function GoToPosition(vision) {
            _classCallCheck(this, GoToPosition);

            _initDefineProp(this, 'xPosition', _descriptor, this);

            _initDefineProp(this, 'yPosition', _descriptor2, this);

            _initDefineProp(this, 'theta', _descriptor3, this);

            _initDefineProp(this, 'pathfinder', _descriptor4, this);

            this.httpClient = new _baseStationRequest.BaseStationRequest();
            this.vision = vision;
            this.info = {};
            this.vision.registerGoto(this.info);
        }

        GoToPosition.prototype.attached = function attached() {
            if (!this.pathfinder) {
                this.buttonName = 'go to pathfinder';
                this.endpoint = '/go-to-pathfinder';
            } else {
                this.buttonName = 'go to position';
                this.endpoint = '/go-to-position';
            }
        };

        GoToPosition.prototype.execute = function execute() {
            var body = {
                'destination': {
                    'x': this.xPosition,
                    'y': this.yPosition,
                    'theta': this.theta
                }
            };

            console.log(body);

            this.httpClient.post(body, this.endpoint);
        };

        return GoToPosition;
    }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'xPosition', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: function initializer() {
            return 0;
        }
    }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'yPosition', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: function initializer() {
            return 0;
        }
    }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'theta', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: function initializer() {
            return 0;
        }
    }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'pathfinder', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: function initializer() {
            return false;
        }
    })), _class2)) || _class);
});
define('components/informations/informations',['exports', 'aurelia-framework', '../../services/vision', '../../services/timer'], function (exports, _aureliaFramework, _vision, _timer) {
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

    var Informations = exports.Informations = (_dec = (0, _aureliaFramework.inject)(_vision.Vision, _timer.Timer), _dec(_class = function () {
        function Informations(vision, timer) {
            _classCallCheck(this, Informations);

            this.timer = timer;
            this.vision = vision;
            this.informations = {};
            this.informations.obstacles = [];
        }

        Informations.prototype.attached = function attached() {
            this.vision.registerInformations(this.informations);
        };

        Informations.prototype.resetDetection = function resetDetection() {
            fetch('http://0.0.0.0:5000/vision/reset-detection', {
                method: "POST",
                headers: {
                    'content-type': 'application/json'
                },
                mode: 'no-cors'
            }).then(function (response) {
                return response.json();
            }).then(function (message) {
                console.log(message);
            }).catch(function (err) {
                console.log(err);
            });
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
define('components/robot-controller/robot-controller',['exports', 'aurelia-framework', '../../services/timer'], function (exports, _aureliaFramework, _timer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.RobotController = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var RobotController = exports.RobotController = (_dec = (0, _aureliaFramework.inject)(_timer.Timer), _dec(_class = function () {
    function RobotController(timer) {
      _classCallCheck(this, RobotController);

      this.timer = timer;
      this.currentCommand = null;
      this.currentScaling = null;
      this.messageReceived = false;
      this.showImage = true;
      this.fakeSegmentation = false;
      this.takePicture = false;
      this.showSegmentsCoordinates = false;
      this.segmentsCoordinates = [];

      this.options = ['0 - Competition', '1 - Initial Orientation', '2 - Identify Antenna', '3 - Receive Information', '4 - Go to Image', '5 - Take Picture', '6 - Go to Drawing Area', '7 - Draw Figure', '8 - Go Out of Drawing Area', '9 - Light Red Led', '10 - Toggle Pencil'];

      this.scalings = [{ 'value': '1', 'name': '4' }, { 'value': '0.5', 'name': '2' }];
    }

    RobotController.prototype.sendCommand = function sendCommand() {
      var _this = this;

      var taskId = this.options.indexOf(this.currentCommand).toString();
      var data = { 'task_id': taskId };

      if (this.currentScaling) {
        data.scaling = this.currentScaling.value;
      }

      if (isTakePicture(taskId) && this.fakeSegmentation) {
        data.fake_segmentation = true;
      }

      this.messageReceived = false;

      fetch('http://localhost:12345/start-tasks', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then(function (res) {
        return res.json();
      }).then(function (data) {
        if (data.message) {
          _this.message = 'command sent to robot';
          _this.messageReceived = true;
        }

        if (data.image) {
          _this.segmentsCoordinates = data.segments.map(function (coord) {
            return coordToString(coord);
          });
          _this.segmentedImage = data.image;
          _this.thresholdedImage = data.thresholded_image;
        }
      });
    };

    RobotController.prototype.onChange = function onChange() {
      var currentTaskIndex = this.options.indexOf(this.currentCommand);
      if (isTakePicture(currentTaskIndex)) {
        this.takePicture = true;
        this.showImage = true;
        this.showSegmentsCoordinates = false;
      } else if (isDrawPicture(currentTaskIndex)) {
        this.takePicture = false;
        this.showImage = false;
        this.showSegmentsCoordinates = true;
      } else {
        this.takePicture = false;
        this.showSegmentsCoordinates = true;
      }
    };

    RobotController.prototype.startTimer = function startTimer() {
      this.timer.start();
    };

    RobotController.prototype.resetTimer = function resetTimer() {
      this.timer.reset();
    };

    RobotController.prototype.stopTimer = function stopTimer() {
      this.timer.stop();
    };

    return RobotController;
  }()) || _class);


  function isTakePicture(taskId) {
    return taskId === 5 || taskId === '5';
  }

  function isDrawPicture(taskId) {
    return taskId === 7 || taskId === '7';
  }

  function coordToString(coord) {
    return [Math.round(parseFloat(coord[0])), Math.round(parseFloat(coord[1]))].toString();
  }
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
            this.monPixel = "800";

            this.canvasId = 'monCanvas';

            this.visionProperties = {};
            this.visionProperties.imagePath = './src/components/world-vision/image14.jpg';

            this.x_position = 0;
            this.y_position = 0;

            this.chosen_x_position = 0;
            this.chosen_y_position = 0;

            this.world_information = {};
            this.theta = 0;
        }

        WorldVisionDebug.prototype.attached = function attached() {
            var _this = this;

            var canvas = document.getElementById(this.canvasId);

            canvas.addEventListener('mousemove', function (evt) {
                var mousePos = _this.getMousePos(canvas, evt);
                _this.adjustPositions(mousePos);
            }, false);

            canvas.addEventListener('click', function (evt) {
                _this.chosen_x_position = _this.x_position;
                _this.chosen_y_position = _this.y_position;
            }, false);

            this.vision.registerImageView(this.visionProperties);
            this.vision.registerGotoPosition(this.world_information);
        };

        WorldVisionDebug.prototype.resetPathRendering = function resetPathRendering() {
            fetch('http://0.0.0.0:5000/vision/reset-rendering', {
                method: "POST",
                headers: {
                    'content-type': 'application/json'
                },
                mode: 'no-cors'
            }).then(function (response) {
                console.log(response);
            }).catch(function (err) {
                console.log(err);
            });
        };

        WorldVisionDebug.prototype.getMousePos = function getMousePos(canvas, evt) {
            var rect = canvas.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        };

        WorldVisionDebug.prototype.adjustPositions = function adjustPositions(mousePos) {
            var world_origin_x = parseFloat(this.world_information.origin.x);
            var world_origin_y = parseFloat(this.world_information.origin.y);
            var world_image_ratio = parseFloat(this.world_information.ratio);

            this.x_position = Math.floor((mousePos.x - world_origin_x) * world_image_ratio * 10);
            this.y_position = Math.floor((mousePos.y - world_origin_y) * world_image_ratio * 10);
        };

        return WorldVisionDebug;
    }()) || _class);
});
define('text!app.html', ['module'], function(module) { module.exports = "<template><div><require from=\"./components/navbar/navbar\"></require><navbar></navbar></div><router-view></router-view></template>"; });
define('text!components/competition/competition.html', ['module'], function(module) { module.exports = "<template><require from=\"../world-vision/world-vision-competition\"></require><world-vision-competition></world-vision-competition></template>"; });
define('text!components/debug/debug.html', ['module'], function(module) { module.exports = "<template><require from=\"../world-vision/world-vision-debug\"></require><require from=\"../informations/informations\"></require><require from=\"../robot-controller/robot-controller\"></require><div class=\"row\"><div class=\"col s12 m12 l6\"><world-vision-debug></world-vision-debug></div><div class=\"col s12 m12 l6\"><informations></informations><robot-controller></robot-controller></div></div></template>"; });
define('text!components/go-to-position/go-to-position.html', ['module'], function(module) { module.exports = "<template><button class=\"btn blue\" click.trigger=\"execute()\">${buttonName}</button></template>"; });
define('text!components/informations/informations.html', ['module'], function(module) { module.exports = "<template><div class=\"card\"><div class=\"card-content\"><div class=\"row\"><div class=\"col s6\"><h5>Monde</h5><hr><p>Dimension: <span class=\"text-number\">${informations.worldDimensions.width} x ${informations.worldDimensions.length} (${informations.worldDimensions.unit})</span></p></div><div class=\"col s6\"><h5>Robot</h5><hr><p>Position x: <span class=\"text-number\">${informations.robot.position.x}</span></p><p>Position y: <span class=\"text-number\">${informations.robot.position.y}</span></p><p>Angle: <span class=\"text-number\">${informations.robot.orientation}</span></p></div><div class=\"col s12\"><h5>Obstacles</h5><hr><div repeat.for=\"obstacle of informations.obstacles\"><div class=\"col s6\"><p>Position: <span class=\"text-number\">(${obstacle.position.x}, ${obstacle.position.y})</span></p><p>Tag: <span class=\"text-number\">${obstacle.tag}</span></p></div></div></div></div><div class=\"row\"><button class=\"green btn\" click.trigger=\"resetDetection()\">Reset detection</button></div></div></div></template>"; });
define('text!components/navbar/navbar.html', ['module'], function(module) { module.exports = "<template><nav><div class=\"nav-wrapper color1\"><img width=\"55px\" height=\"55px\" src=\"./img/robot.png\"><a href=\"#\" class=\"brand-logo center\">Leonard</a><ul id=\"nav-mobile\" class=\"right hide-on-med-and-down\"><li><a href=\"#/competition\">Competition</a></li><li><a href=\"#/debug\">Debug</a></li></ul></div></nav></template>"; });
define('text!components/robot-controller/robot-controller.html', ['module'], function(module) { module.exports = "<template><div class=\"card\"><div class=\"card-content\"><h5>Robot Controller <span if.bind=\"messageReceived\" class=\"chip blue\">${message}</span></h5><div class=\"row\"><div class=\"col s2\"><h5 style=\"background-color:rgba(0,0,0,.1);padding:6px;border-radius:2px;margin:0;text-align:center\">${timer.time}</h5></div><div class=\"col s8\"><button class=\"green btn\" click.trigger=\"startTimer()\">Start</button> <button class=\"red btn\" click.trigger=\"stopTimer()\">Stop</button> <button class=\"blue btn\" click.trigger=\"resetTimer()\">Reset</button></div></div><div class=\"row\"><select value.bind=\"currentCommand\" change.trigger=\"onChange()\" style=\"display:block;width:80%;float:left\"><option repeat.for=\"option of options\" value.bind=\"option\">${option}</option></select><button class=\"cyan btn\" click.trigger=\"sendCommand()\" style=\"margin-left:15px\">Go</button></div><div class=\"row\" if.bind=\"takePicture\"><input class=\"with-gap\" type=\"checkbox\" id=\"fakeSegmentation\" checked.bind=\"fakeSegmentation\"><label for=\"fakeSegmentation\">Fake Segmentation</label><select value.bind=\"currentScaling\" style=\"display:block;width:80%;float:left\"><option repeat.for=\"scaling of scalings\" model.bind=\"scaling\">${scaling.name}</option></select></div><div if.bind=\"showImage\"><img if.bind=\"segmentedImage\" src=\"data:image/png;base64,${segmentedImage}\" width=\"640px\" height=\"640px\"> <img if.bind=\"!segmentedImage\" src=\"img/default-placeholder.png\" alt=\"\" width=\"640px\" height=\"640px\"> <img if.bind=\"segmentedImage\" src=\"data:image/png;base64,${thresholdedImage}\" style=\"width:100%\"></div><div if.bind=\"showSegmentsCoordinates\"><p><span repeat.for=\"coordinate of segmentsCoordinates\">[${coordinate}]--></span></p></div></div></div></template>"; });
define('text!components/stat/stat.html', ['module'], function(module) { module.exports = ""; });
define('text!components/world-vision/world-vision-competition.html', ['module'], function(module) { module.exports = "<template><div class=\"container\"><div class=\"row\"><div class=\"col s12 m12\"><div class=\"card\"><div class=\"card-content center-align\"><h3>World Vision</h3><div><div class=\"card-image\"><canvas id=\"${canvasId}\" width=\"640px\" height=\"480px\" style=\"background:url(${imagePath})\"></canvas></div><div class=\"card-content\"><span class=\"equidistant float-left\"><label>Robot position</label><label>x :</label><label class=\"text-number\">${x_position}</label><label>y :</label><label class=\"text-number\">${y_position}</label></span><span class=\"equidistant float-right\"></span></div><div class=\"card-action\"><button class=\"color2 waves-effect waves-light btn\" click.trigger=\"start()\">Start</button></div></div></div></div></div></div></div></template>"; });
define('text!components/world-vision/world-vision-debug.html', ['module'], function(module) { module.exports = "<template><require from=\"../go-to-position/go-to-position\"></require><require from=\"../robot-controller/robot-controller\"></require><div class=\"card\"><div class=\"card-content\"><div class=\"row\"><h5>World Vision</h5><div class=\"center-align\"><img id=\"${canvasId}\" width=\"640px\" height=\"400px\" src=\"${visionProperties.imagePath}\" style=\"cursor:crosshair\"></div></div><div class=\"row\"><div class=\"col s6\"><p>Mouse position: <span class=\"text-number\">(${x_position}, ${y_position})</span></p><button class=\"indigo btn\" click.trigger=\"resetPathRendering()\">Reset path rendering</button></div><div class=\"col s6\"><div class=\"row\"><p>Next destination --> <span class=\"text-number\">(${chosen_x_position}, ${chosen_y_position})</span></p><input value.bind=\"theta\" placeholder=\"theta\"></div><ul class=\"collection center-align\"><li class=\"collection-item\"><go-to-position x-position=\"${chosen_x_position}\" y-position=\"${chosen_y_position}\" theta=\"${theta}\" pathfinder=\"true\"></go-to-position></li><li class=\"collection-item\"><go-to-position x-position=\"${chosen_x_position}\" y-position=\"${chosen_y_position}\" theta=\"${theta}\"></go-to-position></li></ul></div></div></div></div></template>"; });
//# sourceMappingURL=app-bundle.js.map