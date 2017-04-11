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
                route: ['', 'debug'],
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
            }).then(function (responseData) {
                console.log(JSON.stringify(responseData));
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
define('services/task',['exports', 'aurelia-framework', './timer'], function (exports, _aureliaFramework, _timer) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Task = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Task = exports.Task = (_dec = (0, _aureliaFramework.inject)(_timer.Timer), _dec(_class = function () {
        function Task(timer) {
            _classCallCheck(this, Task);

            this.timer = timer;
            this.data = undefined;
            this.tasks = [];
        }

        Task.prototype.start = function start() {
            var _this = this;

            this.ws = new WebSocket('ws://localhost:3000');

            this.ws.onopen = function () {
                var taskRegisterMessage = JSON.stringify({ 'headers': 'register_task_data' });
                _this.ws.send(taskRegisterMessage);
            };

            this.ws.onmessage = function (evt) {
                var data = JSON.parse(evt.data);
                _this.tasks.splice(0, _this.tasks.length);

                for (var taskName in data.data) {
                    var taskStatus = stringToBoolean(data.data[taskName]);

                    if (taskName === 'light_red_led') {
                        if (taskStatus) {
                            _this.onCycleEnd();
                            _this.timer.pause();
                        }
                    }

                    _this.tasks.push({
                        'name': snakeToCamel(taskName),
                        'done': taskStatus,
                        'color': colorFrom(taskStatus)
                    });
                }
            };
        };

        Task.prototype.startTask = function startTask() {
            this.timer.start();
        };

        Task.prototype.resetTasks = function resetTasks() {
            this.ws.send(JSON.stringify({ 'headers': 'reset_tasks' }));
        };

        Task.prototype.registerInformations = function registerInformations(data) {
            this.tasks = data;
        };

        Task.prototype.registerCycleEnd = function registerCycleEnd(onCycleEnd) {
            this.onCycleEnd = onCycleEnd;
            this.start();
        };

        return Task;
    }()) || _class);


    function stringToBoolean(stringBoolean) {
        if (stringBoolean === 'True') {
            return true;
        } else {
            return false;
        }
    }

    function colorFrom(status) {
        if (status) {
            return 'green';
        } else {
            return 'red';
        }
    }

    function snakeToCamel(s) {
        return s.charAt(0).toUpperCase() + s.replace(/(\_\w)/g, function (m) {
            return ' ' + m[1].toUpperCase();
        }).slice(1);
    }
});
define('services/timer',['exports'], function (exports) {
    'use strict';

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

            this.lastTime = 0;
            this.isPause = false;
            this.isStarted = false;
            this.totalTime = 0;
            this.time = '00:00';
        }

        Timer.prototype.start = function start() {
            this.lastTime = new Date().valueOf();

            if (!this.isStarted) {
                this.currentLap = setInterval(this.updateTime.bind(this), 1000);
                this.isStarted = true;
            }
        };

        Timer.prototype.updateTime = function updateTime() {
            var timeDelta = new Date().valueOf() - this.lastTime;

            this.totalTime = this.totalTime + timeDelta;

            var seconds = Math.floor(this.totalTime / 1000 % 60);
            var minutes = Math.floor(this.totalTime / (1000 * 60) % 60);

            this.lastTime = new Date().valueOf();

            this.time = ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2);
        };

        Timer.prototype.stop = function stop() {
            clearInterval(this.currentLap);

            this.isStarted = false;
        };

        Timer.prototype.reset = function reset() {
            this.stop();
            this.totalTime = 0;
            this.time = '00:00';
        };

        Timer.prototype.pause = function pause() {
            this.stop();
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

            this.informations = {};
            this.imageView = undefined;
            this.world_information = undefined;
            this.origin = undefined;
            this.ratio = undefined;
            this.goto = {};
        }

        Vision.prototype.start = function start() {
            var _this = this;

            this.ws = new WebSocket('ws://localhost:3000');

            this.ws.onopen = function () {
                var robotPositionRegisterMessage = JSON.stringify({ 'headers': 'register_vision_data' });
                _this.ws.send(robotPositionRegisterMessage);
            };

            this.ws.onmessage = function (evt) {
                var data = JSON.parse(evt.data);

                if (data.image.origin.x !== '') {
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

                _this.goto.obstacles = [];

                _this.world_information.world_dimension = data.image.sent_dimension;
            };
        };

        Vision.prototype.setDestinationPosition = function setDestinationPosition(nextDestination) {
            this.goto = { 'destination': nextDestination };
        };

        Vision.prototype.getDestinationPosition = function getDestinationPosition() {
            return this.goto;
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

        Vision.prototype.registerGotoPosition = function registerGotoPosition(worldInformation) {
            this.world_information = worldInformation;
        };

        Vision.prototype.registerGoto = function registerGoto(goto) {
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

    var _dec, _class, _desc, _value, _class2, _descriptor;

    var GoToPosition = exports.GoToPosition = (_dec = (0, _aureliaFramework.inject)(_vision.Vision), _dec(_class = (_class2 = function () {
        function GoToPosition(vision) {
            _classCallCheck(this, GoToPosition);

            _initDefineProp(this, 'pathfinder', _descriptor, this);

            this.httpClient = new _baseStationRequest.BaseStationRequest();
            this.vision = vision;
        }

        GoToPosition.prototype.attached = function attached() {
            if (this.pathfinder) {
                this.buttonName = 'go to pathfinder';
                this.endpoint = '/go-to-pathfinder';
            } else {
                this.buttonName = 'go to position';
                this.endpoint = '/go-to-position';
            }
        };

        GoToPosition.prototype.execute = function execute() {
            this.httpClient.post(this.vision.getDestinationPosition(), this.endpoint);
        };

        return GoToPosition;
    }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'pathfinder', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: function initializer() {
            return true;
        }
    })), _class2)) || _class);
});
define('components/informations/informations',['exports', 'aurelia-framework', '../../services/vision', '../../services/timer', '../../services/task'], function (exports, _aureliaFramework, _vision, _timer, _task) {
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

    var Informations = exports.Informations = (_dec = (0, _aureliaFramework.inject)(_vision.Vision, _timer.Timer, _task.Task), _dec(_class = function () {
        function Informations(vision, timer, task) {
            _classCallCheck(this, Informations);

            this.timer = timer;
            this.vision = vision;
            this.informations = {};
            this.informations.obstacles = [];
            this.task = task;
            this.task_information = [];
        }

        Informations.prototype.attached = function attached() {
            this.vision.registerInformations(this.informations);
            this.task.registerInformations(this.task_information);
        };

        Informations.prototype.resetDetection = function resetDetection() {
            fetch('http://0.0.0.0:5000/vision/reset-detection', {
                method: 'POST',
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

        Informations.prototype.resetPathRendering = function resetPathRendering() {
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

        Informations.prototype.colorFor = function colorFor(task) {
            return 'red-text';
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

    var Navbar = exports.Navbar = function () {
        function Navbar() {
            _classCallCheck(this, Navbar);

            this.showNavbar = true;
        }

        Navbar.prototype.attached = function attached() {
            var _this = this;

            setTimeout(function () {
                _this.showNavbar = false;
            }, 3000);
        };

        return Navbar;
    }();
});
define('components/robot-controller/robot-controller',['exports', 'aurelia-framework', '../../services/timer', '../../services/task'], function (exports, _aureliaFramework, _timer, _task) {
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

  var RobotController = exports.RobotController = (_dec = (0, _aureliaFramework.inject)(_timer.Timer, _task.Task), _dec(_class = function () {
    function RobotController(timer, task) {
      var _this = this;

      _classCallCheck(this, RobotController);

      this.timer = timer;
      this.taskService = task;

      this.currentCommand = null;
      this.currentScaling = null;
      this.currentOrientation = null;

      this.messageReceived = false;
      this.showImage = true;
      this.fakeSegmentation = false;
      this.takePicture = false;
      this.showSegmentsCoordinates = false;
      this.robotOnline = false;
      this.taskSent = false;
      this.taskDone = false;

      this.options = ['0 - Competition', '1 - Initial Orientation', '2 - Identify Antenna', '3 - Receive Information', '4 - Go to Image', '5 - Take Picture', '6 - Go to Drawing Area', '7 - Draw Figure', '8 - Go Out of Drawing Area', '9 - Light Red Led', '10 - Toggle Pencil', '11 - Null', '12 - Images Routine'];

      this.scalings = [{ 'value': '1', 'name': '4' }, { 'value': '0.5', 'name': '2' }];

      this.orientations = [{ 'value': 'SOUTH', 'name': 'SUD' }, { 'value': 'NORTH', 'name': 'NORD' }, { 'value': 'EAST', 'name': 'EST' }, { 'value': 'WEST', 'name': 'WEST' }];

      this.ws = new WebSocket('ws://localhost:3000');

      this.ws.onopen = function () {
        _this.ws.send(JSON.stringify({ 'headers': 'register_image_segmentation' }));
        _this.ws.send(JSON.stringify({ 'headers': 'register_robot_online' }));
      };

      this.ws.onmessage = function (event) {
        var data = JSON.parse(event.data);

        if (data.data === 'robot_online') {
          _this.robotOnline = true;
        } else if (data.data === 'robot_offline') {
          _this.robotOnline = false;
        } else if (data.data.image) {
          _this.segmentedImage = data.data.image;
          _this.thresholdedImage = data.data.thresholded_image;
        }
      };
    }

    RobotController.prototype.attached = function attached() {
      this.taskService.registerCycleEnd(this.setTaskDone.bind(this));
    };

    RobotController.prototype.setTaskDone = function setTaskDone() {
      this.taskDone = true;
    };

    RobotController.prototype.sendCommand = function sendCommand() {
      var _this2 = this;

      var taskId = this.options.indexOf(this.currentCommand).toString();
      var data = { 'task_id': taskId };

      if (this.currentScaling) {
        data.scaling = this.currentScaling.value;
        data.orientation = this.currentOrientation.value;
      }

      if (isTakePicture(taskId) && this.fakeSegmentation) {
        data.fake_segmentation = true;
      } else if (isTaskCompetition(taskId)) {
        this.taskSent = true;
        this.taskDone = false;
      } else if (isLightRedLedTask(taskId)) {
        this.taskDone = true;
        this.taskSent = false;
      }

      fetch('http://localhost:12345/start-tasks', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then(function (res) {
        return res.json();
      }).then(function (responseData) {
        if (responseData.message) {
          _this2.startTask();
        }

        if (responseData.image) {
          _this2.segmentsCoordinates = responseData.segments.map(function (coord) {
            return coordToString(coord);
          });
          _this2.segmentedImage = responseData.image;
          _this2.thresholdedImage = responseData.thresholded_image;
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

    RobotController.prototype.startTask = function startTask() {
      this.timer.start();
      this.taskSent = false;
    };

    RobotController.prototype.resetTask = function resetTask() {
      var _this3 = this;

      this.taskService.resetTasks(function () {
        _this3.taskDone = false;
      });
    };

    RobotController.prototype.stopTimer = function stopTimer() {
      this.timer.stop();
    };

    RobotController.prototype.pauseTimer = function pauseTimer() {
      this.timer.pause();
      this.taskDone = false;
      this.taskSent = false;
    };

    return RobotController;
  }()) || _class);


  function isTakePicture(taskId) {
    return taskId === 5 || taskId === '5';
  }

  function isTaskCompetition(taskId) {
    return taskId === 0 || taskId === '0';
  }

  function isDrawPicture(taskId) {
    return taskId === 7 || taskId === '7';
  }

  function isLightRedLedTask(taskId) {
    return taskId === 9 || taskId === '9';
  }

  function coordToString(coord) {
    return [Math.round(parseFloat(coord[0])), Math.round(parseFloat(coord[1]))].toString();
  }
});
define('components/robot-feed/robot-feed',['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var RobotFeed = exports.RobotFeed = function RobotFeed() {
        var _this = this;

        _classCallCheck(this, RobotFeed);

        this.imagePath = 'img/placeholder_480x360.png';
        this.ws = new WebSocket('ws://localhost:3000');

        this.ws.onopen = function () {
            var robotPositionRegisterMessage = JSON.stringify({ 'headers': 'register_to_robot_feed' });
            _this.ws.send(robotPositionRegisterMessage);
        };

        this.ws.onmessage = function (event) {
            var data = JSON.parse(event.data);

            window.requestAnimationFrame(function () {
                _this.imagePath = 'data:image/jpeg;base64,' + data.data.image;
            });
        };
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

            this.visionProperties = {
                'imagePath': 'img/placeholder_640x400.png'
            };

            this.x_position = 0;
            this.y_position = 0;

            this.chosen_x_position = 0;
            this.chosen_y_position = 0;

            this.world_information = {};
            this.theta = 0;
        }

        WorldVisionDebug.prototype.attached = function attached() {
            var _this = this;

            var canvas = document.getElementById('world__feed');

            canvas.addEventListener('mousemove', function (evt) {
                var mousePos = _this.getMousePos(canvas, evt);
                _this.adjustPositions(mousePos);
            }, false);

            canvas.addEventListener('click', function (evt) {
                _this.chosen_x_position = _this.x_position;
                _this.chosen_y_position = _this.y_position;

                _this.nextDestination = {
                    'x': _this.chosen_x_position,
                    'y': _this.chosen_y_position,
                    'theta': _this.theta
                };

                _this.vision.setDestinationPosition(_this.nextDestination);
            }, false);

            this.vision.registerImageView(this.visionProperties);
            this.vision.registerGotoPosition(this.world_information);
        };

        WorldVisionDebug.prototype.getMousePos = function getMousePos(canvas, evt) {
            var rect = canvas.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        };

        WorldVisionDebug.prototype.adjustPositions = function adjustPositions(mousePos) {
            var worldOriginX = parseFloat(this.world_information.origin.x);
            var worldOriginY = parseFloat(this.world_information.origin.y);
            var worldOriginRatio = parseFloat(this.world_information.ratio);

            this.x_position = Math.floor((mousePos.x - worldOriginX) * worldOriginRatio * 10);
            this.y_position = Math.floor((mousePos.y - worldOriginY) * worldOriginRatio * 10);
        };

        return WorldVisionDebug;
    }()) || _class);
});
define('text!app.html', ['module'], function(module) { module.exports = "<template><router-view></router-view></template>"; });
define('text!components/competition/competition.html', ['module'], function(module) { module.exports = "<template><require from=\"../world-vision/world-vision-competition\"></require><world-vision-competition></world-vision-competition></template>"; });
define('text!components/debug/debug.html', ['module'], function(module) { module.exports = "<template><require from=\"../world-vision/world-vision-debug\"></require><require from=\"../informations/informations\"></require><require from=\"../robot-controller/robot-controller\"></require><require from=\"../robot-feed/robot-feed\"></require><div class=\"row\"><div class=\"col s12 m12 l6\"><world-vision-debug></world-vision-debug><robot-feed></robot-feed></div><div class=\"col s12 m12 l6\"><informations></informations><robot-controller></robot-controller></div></div></template>"; });
define('text!components/go-to-position/go-to-position.html', ['module'], function(module) { module.exports = "<template><button class=\"btn green\" click.trigger=\"execute()\">${buttonName}</button></template>"; });
define('text!components/informations/informations.html', ['module'], function(module) { module.exports = "<template><div class=\"card\"><div class=\"card-content\"><div class=\"row\"><div class=\"col s6\"><h5>Monde</h5><hr><p>Dimension: <span class=\"text-number\">${informations.worldDimensions.width} x ${informations.worldDimensions.length} (${informations.worldDimensions.unit})</span></p><button class=\"btn blue\" click.trigger=\"resetDetection()\">Reset detection</button> <button class=\"indigo btn\" click.trigger=\"resetPathRendering()\">Reset path rendering</button></div><div class=\"col s6\"><h5>Robot</h5><hr><p>Position x: <span class=\"text-number\">${informations.robot.position.x}</span></p><p>Position y: <span class=\"text-number\">${informations.robot.position.y}</span></p><p>Angle: <span class=\"text-number\">${informations.robot.orientation}</span></p></div><div class=\"col s12\"><h5>Obstacles</h5><hr><div repeat.for=\"obstacle of informations.obstacles\"><div class=\"col s6\"><p>Position: <span class=\"text-number\">(${obstacle.position.x}, ${obstacle.position.y})</span></p><p>Tag: <span class=\"text-number\">${obstacle.tag}</span></p></div></div></div><div class=\"col s12\"><h5>Tâches</h5><hr><div class=\"col s12\"><div repeat.for=\"task of task_information\"><div class=\"chip white-text ${task.color}\" style=\"float:left\">${$index} - ${task.name}</div></div></div></div></div></div></div></template>"; });
define('text!components/navbar/navbar.html', ['module'], function(module) { module.exports = "<template><nav if.bind=\"showNavbar\"><div class=\"nav-wrapper color1\"><img width=\"55px\" height=\"55px\" src=\"./img/robot.png\"><a href=\"#\" class=\"brand-logo center\">Leonard</a><ul id=\"nav-mobile\" class=\"right hide-on-med-and-down\"><li><a href=\"/\">Debug</a></li></ul></div></nav></template>"; });
define('text!components/robot-controller/robot-controller.html', ['module'], function(module) { module.exports = "<template><require from=\"../go-to-position/go-to-position\"></require><div class=\"card\"><div class=\"card-content\"><h5>Robot Control <span if.bind=\"robotOnline\" class=\"chip green\">ROBOT ONLINE</span> <span if.bind=\"!robotOnline\" class=\"chip red\">ROBOT OFFLINE</span></h5><h5><span if.bind=\"taskSent\" class=\"chip blue\">CYCLE STARTED</span> <span if.bind=\"taskDone\" class=\"chip green\">CYCLE COMPLETE</span></h5><div class=\"row\"><div class=\"col s2\"><h5 style=\"background-color:rgba(0,0,0,.1);padding:6px;border-radius:2px;margin:0;text-align:center\">${timer.time}</h5></div><div class=\"col s8\"><button class=\"blue btn\" click.trigger=\"resetTask()\">Reset</button><go-to-position></go-to-position></div></div><div class=\"row\"><select value.bind=\"currentCommand\" change.trigger=\"onChange()\" style=\"display:block;width:80%;float:left\"><option repeat.for=\"option of options\" value.bind=\"option\">${option}</option></select><button class=\"cyan btn\" click.trigger=\"sendCommand()\" style=\"margin-left:15px\">Go</button></div><div class=\"row\" if.bind=\"takePicture\"><div><input class=\"with-gap\" type=\"checkbox\" id=\"fakeSegmentation\" checked.bind=\"fakeSegmentation\"><label for=\"fakeSegmentation\">Fake Segmentation</label></div><select value.bind=\"currentScaling\" style=\"display:block;width:50%;float:left\"><option repeat.for=\"scaling of scalings\" model.bind=\"scaling\">${scaling.name}</option></select><select value.bind=\"currentOrientation\" style=\"display:block;width:50%;float:left\"><option repeat.for=\"orientation of orientations\" model.bind=\"orientation\">${orientation.name}</option></select></div><div if.bind=\"showImage\"><img if.bind=\"segmentedImage\" src=\"data:image/png;base64,${segmentedImage}\" width=\"640px\" height=\"640px\"> <img if.bind=\"!segmentedImage\" src=\"img/default-placeholder.png\" alt=\"\" width=\"640px\" height=\"640px\"> <img if.bind=\"segmentedImage\" src=\"data:image/png;base64,${thresholdedImage}\" style=\"width:100%\"></div></div></div></template>"; });
define('text!components/robot-feed/robot-feed.html', ['module'], function(module) { module.exports = "<template><div class=\"card\"><div class=\"card-content\"><div class=\"row\"><h5>Robot Feed</h5><div class=\"center-align\"><img id=\"robot__feed\" style=\"width:100%;height:auto\" src=\"${imagePath}\"></div></div></div></div></template>"; });
define('text!components/stat/stat.html', ['module'], function(module) { module.exports = ""; });
define('text!components/world-vision/world-vision-competition.html', ['module'], function(module) { module.exports = "<template><div class=\"container\"><div class=\"row\"><div class=\"col s12 m12\"><div class=\"card\"><div class=\"card-content center-align\"><h3>World Vision</h3><span class=\"float-left\"><label>Robot position</label><label>x :</label><label class=\"text-number\">${x_position}</label><label>y :</label><label class=\"text-number\">${y_position}</label></span><div><div class=\"card-image\"><canvas id=\"${canvasId}\" width=\"640px\" height=\"480px\" style=\"background:url(${imagePath})\"></canvas></div><div class=\"card-action\"><button class=\"color2 waves-effect waves-light btn\" click.trigger=\"start()\">Start</button></div></div></div></div></div></div></div></template>"; });
define('text!components/world-vision/world-vision-debug.html', ['module'], function(module) { module.exports = "<template><require from=\"../robot-controller/robot-controller\"></require><div class=\"card\"><div class=\"card-content\"><div class=\"row\"><h5>World Vision <span>Cursor: (${x_position}, ${y_position}) -- Next Destination (${nextDestination.x}, ${nextDestination.y})</span></h5><div class=\"center-align\"><img id=\"world__feed\" width=\"640px\" height=\"400px\" src=\"${visionProperties.imagePath}\" style=\"cursor:crosshair\"></div></div></div></div></template>"; });
//# sourceMappingURL=app-bundle.js.map