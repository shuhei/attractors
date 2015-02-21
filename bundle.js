/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);
	var fit = __webpack_require__(2);
	var form = __webpack_require__(3);
	var control = __webpack_require__(4);
	var attractors = __webpack_require__(5);

	var INITIAL_DISTANCE = 6;
	var DEFAULT_ATTRACTOR = 'kingsDream';

	var canvas = document.createElement('canvas');
	document.body.appendChild(canvas);
	fit(canvas);
	var getStates = control(canvas, INITIAL_DISTANCE);

	form.set(DEFAULT_ATTRACTOR, attractors[DEFAULT_ATTRACTOR].defaults);
	console.log(form.data);

	canvas.addEventListener('webglcontextlost', function(e) {
	  console.log('context lost', e);
	  e.preventDefault();
	}, false);

	canvas.addEventListener('webglcontextrestores', function(e) {
	  console.log('context restored', e);
	}, false);

	var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
	app.init(gl);
	update();
	draw();

	form.onUpdate(update);

	function update() {
	  var data = form.data;
	  var attractor = attractors[data.attractor];
	  var args = [gl, attractor].concat(data.params);
	  app.update.apply(null, args);
	}

	function draw() {
	  var states = getStates();
	  app.draw(gl, Date.now(), states.rotation, states.distance);
	  requestAnimationFrame(draw);
	}


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var mat = __webpack_require__(10);
	var createProgram = __webpack_require__(6);
	var addColor = __webpack_require__(7);

	module.exports = {
	  init: init,
	  draw: draw,
	  update: update
	};

	var ITERATIONS = 100000;
	var ROTATION_TIME = 100000;

	var program;
	var buffer;
	var vertices;
	var mvp = mat.create();
	var viewTranslate = [0, 0, 0];

	function init(gl) {
	  // Create shaders and program.
	  var vertSrc = getScript('shader-vert');
	  var fragSrc = getScript('shader-frag');
	  var attributeNames = ['position', 'color'];
	  var uniformNames = ['mvp', 'alpha'];
	  program = createProgram(gl, vertSrc, fragSrc, uniformNames, attributeNames);

	  // Create buffer.
	  buffer = gl.createBuffer();
	  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	  gl.enableVertexAttribArray(program.attributes.position);
	  gl.vertexAttribPointer(program.attributes.position, 3, gl.FLOAT, false, 24, 0);
	  gl.enableVertexAttribArray(program.attributes.color);
	  gl.vertexAttribPointer(program.attributes.color, 3, gl.FLOAT, false, 24, 12);

	  // Calc vertices.
	  vertices = new Float32Array(ITERATIONS * 6);
	  addColor(vertices, ITERATIONS);
	}

	function update(gl, attractor, params) {
	  attractor(vertices, ITERATIONS, params);
	  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
	}

	function draw(gl, t, rotation, distance) {
	  var w = gl.drawingBufferWidth;
	  var h = gl.drawingBufferHeight;
	  gl.viewport(0, 0, w, h);
	  gl.clearColor(0.0, 0.0, 0.0, 1.0);
	  gl.clear(gl.COLOR_BUFFER_BIT);

	  gl.useProgram(program.program);

	  viewTranslate[2] = -distance;

	  var theta = (t % ROTATION_TIME) / ROTATION_TIME * Math.PI * 2;
	  mat.identity(mvp);

	  // Perspective
	  mat.perspective(mvp, Math.PI / 4, w / h, 0.1, 50);

	  // Model View
	  mat.translate(mvp, mvp, viewTranslate);
	  mat.rotateY(mvp, mvp, rotation.x + theta);
	  mat.rotateX(mvp, mvp, rotation.y + theta);

	  gl.uniformMatrix4fv(program.uniforms.mvp, false, mvp);
	  gl.uniform1f(program.uniforms.alpha, 0.2 / (distance / 6));

	  gl.enable(gl.BLEND);
	  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE)
	  gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD)

	  // TODO: Smooth point?
	  gl.drawArrays(gl.POINTS, 0, ITERATIONS);
	}

	function getScript(id) {
	  var script = document.getElementById(id);
	  return script.innerText;
	}


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(canvas) {
	  window.addEventListener('resize', resize);
	  resize();

	  function resize() {
	    canvas.width = window.innerWidth;
	    canvas.height = window.innerHeight;
	  }
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var paramNames = ['a', 'b', 'c', 'd', 'e', 'f'];
	var select = document.getElementsByName('attractor')[0];
	var fields = paramNames.reduce(function(acc, name) {
	  acc[name] = document.getElementsByName(name)[0];
	  return acc;
	}, {});
	var paramValues = paramNames.reduce(function(acc, name) {
	  acc[name] = document.getElementsByName(name + '-value')[0];
	  return acc;
	}, {});
	var button = document.getElementsByName('update')[0];

	var listeners = [];
	var form = {
	  data: null,
	  onUpdate: onUpdate,
	  set: set
	};
	updateData();
	updateView();

	paramNames.forEach(function(name) {
	  fields[name].addEventListener('change', function() {
	    updateData();
	    updateView();
	  });
	});

	select.addEventListener('change', function() {
	  updateData();
	  updateView();
	});

	button.addEventListener('click', function() {
	  console.log(form.data);
	  listeners.forEach(function(listener) {
	    listener();
	  });
	});

	module.exports = form;

	function set(attractor, params) {
	  select.value = attractor;
	  Object.keys(params).forEach(function(name) {
	    fields[name].value = params[name];
	  });
	  updateData();
	  updateView();
	}

	function updateData() {
	  var attractor = select.value;
	  var params = paramNames.reduce(function(acc, name) {
	    var field = fields[name];
	    acc[name] = parseFloat(field.value, 10);
	    return acc;
	  }, {});
	  form.data = {
	    attractor: attractor,
	    params: params
	  };
	}

	function updateView() {
	  Object.keys(form.data.params).forEach(function(name, i) {
	    paramValues[name].innerText = form.data.params[name];
	  });
	}

	function onUpdate(listener) {
	  listeners.push(listener);
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var DISTANCE_LOWER_BOUND = 0.1;
	var DISTANCE_UPPER_BOUND = 10;
	var GESTURE_ZOOM_SPEED = 0.1;
	var WHEEL_ZOOM_SPEED = 0.01;
	var ROTATION_INERTIA = 0.9;
	var DISTANCE_INERTIA = 0.7;
	var MOUSE_TO_RADIAN = Math.PI / 300.0;

	module.exports = function(container, initialDistance) {
	  var rotation = { x: 0, y: 0 };
	  var target = { x: 0, y: 0 };
	  var targetOnDown = { x: 0, y: 0};
	  var mouse = { x: 0, y: 0 };
	  var mouseOnDown = { x: 0, y: 0 };

	  var distance = initialDistance;
	  var distanceTarget = initialDistance;

	  var lastClickTime = new Date().getTime();
	  var isBirdView = true;

	  var touchEnabled = false;
	  var downEventName, upEventName, outEventName, moveEventName;
	  if ('ontouchstart' in document.documentElement) {
	    touchEnabled = true;
	    downEventName = 'touchstart';
	    upEventName = 'touchend';
	    outEventName = 'touchcancel';
	    moveEventName = 'touchmove';
	  } else {
	    downEventName = 'mousedown';
	    upEventName = 'mouseup';
	    outEventName = 'mouseout';
	    moveEventName = 'mousemove';
	  }

	  // For pinch gesture on touch devices.
	  var previousScale = null;

	  //
	  // Event handlers
	  //

	  function onMouseDown(event) {
	    event.preventDefault();

	    // Check if it's double click/tap.
	    var currentTime = new Date().getTime();
	    var diff = currentTime - lastClickTime;
	    var isSingleTap = touchEnabled && event.targetTouches.length === 1;
	    lastClickTime = currentTime;
	    if ((!touchEnabled || isSingleTap) && diff < 300) {
	      isBirdView = !isBirdView;
	      return;
	    }

	    container.addEventListener(moveEventName, onMouseMove, false);
	    container.addEventListener(upEventName, onMouseUp, false);
	    container.addEventListener(outEventName, onMouseOut, false);

	    if (touchEnabled) {
	      if (event.targetTouches.length !== 1) {
	        return;
	      }
	      var touchItem = event.targetTouches[0];
	      mouseOnDown.x = - touchItem.pageX;
	      mouseOnDown.y = touchItem.pageY;
	    } else {
	      mouseOnDown.x = - event.clientX;
	      mouseOnDown.y = event.clientY;
	    }

	    targetOnDown.x = target.x;
	    targetOnDown.y = target.y;

	    container.style.cursor = 'move';
	  }

	  function onMouseUp(event) {
	    container.removeEventListener(moveEventName, onMouseMove, false);
	    container.removeEventListener(upEventName, onMouseUp, false);
	    container.removeEventListener(outEventName, onMouseOut, false);
	    container.style.cursor = 'auto';
	  }

	  function onMouseOut(event) {
	    container.removeEventListener(outEventName, onMouseMove, false);
	    container.removeEventListener(upEventName, onMouseUp, false);
	    container.removeEventListener(outEventName, onMouseOut, false);
	  }

	  function onMouseMove(event) {
	    if (touchEnabled) {
	      if (event.targetTouches.length !== 1) {
	        return;
	      }
	      var touchItem = event.targetTouches[0];
	      mouse.x = - touchItem.pageX;
	      mouse.y = touchItem.pageY;
	    } else {
	      mouse.x = - event.clientX;
	      mouse.y = event.clientY;
	    }

	    target.x = targetOnDown.x + (mouse.x - mouseOnDown.x) * MOUSE_TO_RADIAN;
	    target.y = targetOnDown.y + (mouse.y - mouseOnDown.y) * MOUSE_TO_RADIAN;
	  }

	  function onMouseWheel(event) {
	    // mousewheel -> wheelDeltaY, wheel -> deltaY
	    var deltaY = event.wheelDeltaY || event.deltaY || 0;
	    event.preventDefault();
	    zoom(deltaY * WHEEL_ZOOM_SPEED);
	    return false;
	  }

	  function onGestureStart(event) {
	    previousScale = event.scale;
	  }

	  function onGestureChange(event) {
	    var scale = event.scale / previousScale;
	    zoom(GESTURE_ZOOM_SPEED * distanceTarget * (scale - 1) / scale);
	    previsousScale = event.scale;
	  }

	  function onGestureEnd(event) {
	    var scale = event.scale / previousScale;
	    zoom(GESTURE_ZOOM_SPEED * distanceTarget * (scale - 1) / scale);
	    previousScale = null;
	  }

	  function zoom(delta) {
	    distanceTarget -= delta;
	    distanceTarget = distanceTarget > DISTANCE_UPPER_BOUND ? DISTANCE_UPPER_BOUND : distanceTarget;
	    distanceTarget = distanceTarget < DISTANCE_LOWER_BOUND ? DISTANCE_LOWER_BOUND : distanceTarget;
	  }

	  container.addEventListener(downEventName, onMouseDown, false);
	  // For Chrome
	  container.addEventListener('mousewheel', onMouseWheel, false);
	  // For Firefox
	  container.addEventListener('wheel', onMouseWheel, false);

	  // For iOS touch devices
	  container.addEventListener('gesturestart', onGestureStart, false);
	  container.addEventListener('gesturechange', onGestureChange, false);
	  container.addEventListener('gestureend', onGestureEnd, false);

	  var states = {
	    rotation: rotation,
	    distance: distance
	  };

	  return function() {
	    rotation.x += (target.x - rotation.x) * (1.0 - ROTATION_INERTIA);
	    rotation.y += (target.y - rotation.y) * (1.0 - ROTATION_INERTIA);

	    distance += (distanceTarget - distance) * (1.0 - DISTANCE_INERTIA);

	    states.distance = distance;
	    return states;
	  };
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  rampe1: __webpack_require__(35),
	  rampe3: __webpack_require__(36),
	  rampe4: __webpack_require__(8),
	  kingsDream: __webpack_require__(9)
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = createProgram;

	function createProgram(gl, vertSrc, fragSrc, uniformNames, attributeNames) {
	  var vert = compileShader(gl, gl.VERTEX_SHADER, vertSrc);
	  var frag = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc);

	  var program = gl.createProgram();
	  gl.attachShader(program, vert);
	  gl.attachShader(program, frag);

	  var attributes = {};
	  attributeNames.forEach(function(name, location) {
	    gl.bindAttribLocation(program, location, name);
	    console.log('attribute location', name, location);
	    attributes[name] = location;
	  });

	  gl.linkProgram(program);
	  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
	    throw new Error('Error linking program: ' + gl.getProgramInfoLog(program));
	  }

	  var uniforms = {};
	  uniformNames.forEach(function(name) {
	    var location = gl.getUniformLocation(program, name);
	    console.log('uniform location', name, location);
	    uniforms[name] = location;
	  });

	  return {
	    program: program,
	    uniforms: uniforms,
	    attributes: attributes
	  };
	}

	function compileShader(gl, type, src) {
	  var shader = gl.createShader(type);
	  gl.shaderSource(shader, src);
	  gl.compileShader(shader);
	  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	    throw new Error('Error compiling shader: ' + gl.getShaderInfoLog(shader));
	  }
	  return shader;
	}


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function(vertices, iterations) {
	  var h;
	  var x;

	  var r;
	  var g;
	  var b;

	  var i;

	  for (i = 0; i < iterations; i++) {
	    // HSL to RGB where S and L are always 1.
	    h = 6 * i / iterations;
	    x = 1 - Math.abs(h % 2 - 1)
	    if (h < 1) {
	      r = 1;
	      g = x;
	      b = 0;
	    } else if (1 <= h && h < 2) {
	      r = x;
	      g = 1;
	      b = 0;
	    } else if (2 <= h && h < 3) {
	      r = 0;
	      g = 1;
	      b = x;
	    } else if (3 <= h && h < 4) {
	      r = 0;
	      g = x;
	      b = 1;
	    } else if (4 <= h && h < 5) {
	      r = x;
	      g = 0;
	      b = 1;
	    } else if (5 <= h) {
	      r = 1;
	      g = 0;
	      b = x;
	    }

	    vertices[i * 6 + 3] = r;
	    vertices[i * 6 + 4] = g;
	    vertices[i * 6 + 5] = b;
	  }

	  return vertices;
	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = calc;

	// TODO: Figure out better parameters.
	calc.defaults = {
	  a: 1.5,
	  b: -3.5,
	  c: -0.765145
	};

	// Rampe4
	// https://softologyblog.wordpress.com/2009/10/19/3d-strange-attractors/
	function calc(vertices, iterations, params) {
	  var a = params.a;
	  var b = params.b;
	  var c = params.c;

	  var x = 0.1;
	  var y = 0.1;
	  var z = 0.1;

	  var xNew;
	  var yNew;
	  var zNew;
	  var i;

	  for (i = 0; i < 100; i++) {
	    xNew = z * Math.sin(a * x) + Math.cos(a * y);
	    yNew = x * Math.sin(b * y) + Math.cos(b * z);
	    zNew = y * Math.sin(c * z) + Math.cos(c * x);
	    x = xNew;
	    y = yNew;
	    z = zNew;
	  }

	  for (i = 0; i < iterations; i++) {
	    xNew = z * Math.sin(a * x) + Math.cos(a * y);
	    yNew = x * Math.sin(b * y) + Math.cos(b * z);
	    zNew = y * Math.sin(c * z) + Math.cos(c * x);
	    x = xNew;
	    y = yNew;
	    z = zNew;

	    vertices[i * 6] = x;
	    vertices[i * 6 + 1] = y;
	    vertices[i * 6 + 2] = z;

	    // Glitch
	    // a = vertices[i * 6 + 5];
	    // b = vertices[i * 6 + 5];
	  }

	  return vertices;
	}


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = calc;

	// TODO: Figure out better parameters.
	calc.defaults = {
	  a: -0.966918,
	  b: 2.879879,
	  c: 0.966918,
	  d: 0.736,
	  e: 0.744728,
	  f: 0.765145
	};

	// The king's dream
	// http://nathanselikoff.com/training/tutorial-strange-attractors-in-c-and-opengl
	function calc(vertices, iterations, params) {
	  var a = params.a;
	  var b = params.b;
	  var c = params.c;
	  var d = params.e;
	  var e = params.d;
	  var f = params.f;

	  var x = 0.1;
	  var y = 0.1;
	  var z = 0.1;

	  var xNew;
	  var yNew;
	  var zNew;
	  var i;

	  for (i = 0; i < 100; i++) {
	    xNew = Math.sin(z * c) + f * Math.sin(x * c);
	    yNew = Math.sin(x * a) + d * Math.sin(y * a);
	    zNew = Math.sin(y * b) + e * Math.sin(z * b);
	    x = xNew;
	    y = yNew;
	    z = zNew;
	  }

	  for (i = 0; i < iterations; i++) {
	    xNew = Math.sin(z * c) + f * Math.sin(x * c);
	    yNew = Math.sin(x * a) + d * Math.sin(y * a);
	    zNew = Math.sin(y * b) + e * Math.sin(z * b);
	    x = xNew;
	    y = yNew;
	    z = zNew;

	    vertices[i * 6] = x;
	    vertices[i * 6 + 1] = y;
	    vertices[i * 6 + 2] = z;

	    // Glitch
	    // a = vertices[i * 6 + 5];
	    // b = vertices[i * 6 + 5];
	  }

	  return vertices;
	}


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  create: __webpack_require__(11)
	  , clone: __webpack_require__(12)
	  , copy: __webpack_require__(13)
	  , identity: __webpack_require__(14)
	  , transpose: __webpack_require__(15)
	  , invert: __webpack_require__(16)
	  , adjoint: __webpack_require__(17)
	  , determinant: __webpack_require__(18)
	  , multiply: __webpack_require__(19)
	  , translate: __webpack_require__(20)
	  , scale: __webpack_require__(21)
	  , rotate: __webpack_require__(22)
	  , rotateX: __webpack_require__(23)
	  , rotateY: __webpack_require__(24)
	  , rotateZ: __webpack_require__(25)
	  , fromRotationTranslation: __webpack_require__(26)
	  , fromQuat: __webpack_require__(27)
	  , frustum: __webpack_require__(28)
	  , perspective: __webpack_require__(29)
	  , perspectiveFromFieldOfView: __webpack_require__(30)
	  , ortho: __webpack_require__(31)
	  , lookAt: __webpack_require__(32)
	  , str: __webpack_require__(33)
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = create;

	/**
	 * Creates a new identity mat4
	 *
	 * @returns {mat4} a new 4x4 matrix
	 */
	function create() {
	    var out = new Float32Array(16);
	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = 1;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 0;
	    out[9] = 0;
	    out[10] = 1;
	    out[11] = 0;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = 0;
	    out[15] = 1;
	    return out;
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = clone;

	/**
	 * Creates a new mat4 initialized with values from an existing matrix
	 *
	 * @param {mat4} a matrix to clone
	 * @returns {mat4} a new 4x4 matrix
	 */
	function clone(a) {
	    var out = new Float32Array(16);
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[3];
	    out[4] = a[4];
	    out[5] = a[5];
	    out[6] = a[6];
	    out[7] = a[7];
	    out[8] = a[8];
	    out[9] = a[9];
	    out[10] = a[10];
	    out[11] = a[11];
	    out[12] = a[12];
	    out[13] = a[13];
	    out[14] = a[14];
	    out[15] = a[15];
	    return out;
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = copy;

	/**
	 * Copy the values from one mat4 to another
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */
	function copy(out, a) {
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[3];
	    out[4] = a[4];
	    out[5] = a[5];
	    out[6] = a[6];
	    out[7] = a[7];
	    out[8] = a[8];
	    out[9] = a[9];
	    out[10] = a[10];
	    out[11] = a[11];
	    out[12] = a[12];
	    out[13] = a[13];
	    out[14] = a[14];
	    out[15] = a[15];
	    return out;
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = identity;

	/**
	 * Set a mat4 to the identity matrix
	 *
	 * @param {mat4} out the receiving matrix
	 * @returns {mat4} out
	 */
	function identity(out) {
	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = 1;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 0;
	    out[9] = 0;
	    out[10] = 1;
	    out[11] = 0;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = 0;
	    out[15] = 1;
	    return out;
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = transpose;

	/**
	 * Transpose the values of a mat4
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */
	function transpose(out, a) {
	    // If we are transposing ourselves we can skip a few steps but have to cache some values
	    if (out === a) {
	        var a01 = a[1], a02 = a[2], a03 = a[3],
	            a12 = a[6], a13 = a[7],
	            a23 = a[11];

	        out[1] = a[4];
	        out[2] = a[8];
	        out[3] = a[12];
	        out[4] = a01;
	        out[6] = a[9];
	        out[7] = a[13];
	        out[8] = a02;
	        out[9] = a12;
	        out[11] = a[14];
	        out[12] = a03;
	        out[13] = a13;
	        out[14] = a23;
	    } else {
	        out[0] = a[0];
	        out[1] = a[4];
	        out[2] = a[8];
	        out[3] = a[12];
	        out[4] = a[1];
	        out[5] = a[5];
	        out[6] = a[9];
	        out[7] = a[13];
	        out[8] = a[2];
	        out[9] = a[6];
	        out[10] = a[10];
	        out[11] = a[14];
	        out[12] = a[3];
	        out[13] = a[7];
	        out[14] = a[11];
	        out[15] = a[15];
	    }
	    
	    return out;
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = invert;

	/**
	 * Inverts a mat4
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */
	function invert(out, a) {
	    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
	        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
	        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
	        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

	        b00 = a00 * a11 - a01 * a10,
	        b01 = a00 * a12 - a02 * a10,
	        b02 = a00 * a13 - a03 * a10,
	        b03 = a01 * a12 - a02 * a11,
	        b04 = a01 * a13 - a03 * a11,
	        b05 = a02 * a13 - a03 * a12,
	        b06 = a20 * a31 - a21 * a30,
	        b07 = a20 * a32 - a22 * a30,
	        b08 = a20 * a33 - a23 * a30,
	        b09 = a21 * a32 - a22 * a31,
	        b10 = a21 * a33 - a23 * a31,
	        b11 = a22 * a33 - a23 * a32,

	        // Calculate the determinant
	        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

	    if (!det) { 
	        return null; 
	    }
	    det = 1.0 / det;

	    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
	    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
	    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
	    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
	    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
	    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
	    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
	    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
	    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
	    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
	    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
	    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
	    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
	    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
	    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
	    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

	    return out;
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = adjoint;

	/**
	 * Calculates the adjugate of a mat4
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */
	function adjoint(out, a) {
	    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
	        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
	        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
	        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

	    out[0]  =  (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
	    out[1]  = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
	    out[2]  =  (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
	    out[3]  = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
	    out[4]  = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
	    out[5]  =  (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
	    out[6]  = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
	    out[7]  =  (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
	    out[8]  =  (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
	    out[9]  = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
	    out[10] =  (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
	    out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
	    out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
	    out[13] =  (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
	    out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
	    out[15] =  (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
	    return out;
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = determinant;

	/**
	 * Calculates the determinant of a mat4
	 *
	 * @param {mat4} a the source matrix
	 * @returns {Number} determinant of a
	 */
	function determinant(a) {
	    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
	        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
	        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
	        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

	        b00 = a00 * a11 - a01 * a10,
	        b01 = a00 * a12 - a02 * a10,
	        b02 = a00 * a13 - a03 * a10,
	        b03 = a01 * a12 - a02 * a11,
	        b04 = a01 * a13 - a03 * a11,
	        b05 = a02 * a13 - a03 * a12,
	        b06 = a20 * a31 - a21 * a30,
	        b07 = a20 * a32 - a22 * a30,
	        b08 = a20 * a33 - a23 * a30,
	        b09 = a21 * a32 - a22 * a31,
	        b10 = a21 * a33 - a23 * a31,
	        b11 = a22 * a33 - a23 * a32;

	    // Calculate the determinant
	    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = multiply;

	/**
	 * Multiplies two mat4's
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the first operand
	 * @param {mat4} b the second operand
	 * @returns {mat4} out
	 */
	function multiply(out, a, b) {
	    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
	        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
	        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
	        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

	    // Cache only the current line of the second matrix
	    var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];  
	    out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
	    out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
	    out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
	    out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

	    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
	    out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
	    out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
	    out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
	    out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

	    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
	    out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
	    out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
	    out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
	    out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

	    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
	    out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
	    out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
	    out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
	    out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
	    return out;
	};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = translate;

	/**
	 * Translate a mat4 by the given vector
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to translate
	 * @param {vec3} v vector to translate by
	 * @returns {mat4} out
	 */
	function translate(out, a, v) {
	    var x = v[0], y = v[1], z = v[2],
	        a00, a01, a02, a03,
	        a10, a11, a12, a13,
	        a20, a21, a22, a23;

	    if (a === out) {
	        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
	        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
	        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
	        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
	    } else {
	        a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
	        a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
	        a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

	        out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
	        out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
	        out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;

	        out[12] = a00 * x + a10 * y + a20 * z + a[12];
	        out[13] = a01 * x + a11 * y + a21 * z + a[13];
	        out[14] = a02 * x + a12 * y + a22 * z + a[14];
	        out[15] = a03 * x + a13 * y + a23 * z + a[15];
	    }

	    return out;
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = scale;

	/**
	 * Scales the mat4 by the dimensions in the given vec3
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to scale
	 * @param {vec3} v the vec3 to scale the matrix by
	 * @returns {mat4} out
	 **/
	function scale(out, a, v) {
	    var x = v[0], y = v[1], z = v[2];

	    out[0] = a[0] * x;
	    out[1] = a[1] * x;
	    out[2] = a[2] * x;
	    out[3] = a[3] * x;
	    out[4] = a[4] * y;
	    out[5] = a[5] * y;
	    out[6] = a[6] * y;
	    out[7] = a[7] * y;
	    out[8] = a[8] * z;
	    out[9] = a[9] * z;
	    out[10] = a[10] * z;
	    out[11] = a[11] * z;
	    out[12] = a[12];
	    out[13] = a[13];
	    out[14] = a[14];
	    out[15] = a[15];
	    return out;
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = rotate;

	/**
	 * Rotates a mat4 by the given angle
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @param {vec3} axis the axis to rotate around
	 * @returns {mat4} out
	 */
	function rotate(out, a, rad, axis) {
	    var x = axis[0], y = axis[1], z = axis[2],
	        len = Math.sqrt(x * x + y * y + z * z),
	        s, c, t,
	        a00, a01, a02, a03,
	        a10, a11, a12, a13,
	        a20, a21, a22, a23,
	        b00, b01, b02,
	        b10, b11, b12,
	        b20, b21, b22;

	    if (Math.abs(len) < 0.000001) { return null; }
	    
	    len = 1 / len;
	    x *= len;
	    y *= len;
	    z *= len;

	    s = Math.sin(rad);
	    c = Math.cos(rad);
	    t = 1 - c;

	    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
	    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
	    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

	    // Construct the elements of the rotation matrix
	    b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
	    b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
	    b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

	    // Perform rotation-specific matrix multiplication
	    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
	    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
	    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
	    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
	    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
	    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
	    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
	    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
	    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
	    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
	    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
	    out[11] = a03 * b20 + a13 * b21 + a23 * b22;

	    if (a !== out) { // If the source and destination differ, copy the unchanged last row
	        out[12] = a[12];
	        out[13] = a[13];
	        out[14] = a[14];
	        out[15] = a[15];
	    }
	    return out;
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = rotateX;

	/**
	 * Rotates a matrix by the given angle around the X axis
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	function rotateX(out, a, rad) {
	    var s = Math.sin(rad),
	        c = Math.cos(rad),
	        a10 = a[4],
	        a11 = a[5],
	        a12 = a[6],
	        a13 = a[7],
	        a20 = a[8],
	        a21 = a[9],
	        a22 = a[10],
	        a23 = a[11];

	    if (a !== out) { // If the source and destination differ, copy the unchanged rows
	        out[0]  = a[0];
	        out[1]  = a[1];
	        out[2]  = a[2];
	        out[3]  = a[3];
	        out[12] = a[12];
	        out[13] = a[13];
	        out[14] = a[14];
	        out[15] = a[15];
	    }

	    // Perform axis-specific matrix multiplication
	    out[4] = a10 * c + a20 * s;
	    out[5] = a11 * c + a21 * s;
	    out[6] = a12 * c + a22 * s;
	    out[7] = a13 * c + a23 * s;
	    out[8] = a20 * c - a10 * s;
	    out[9] = a21 * c - a11 * s;
	    out[10] = a22 * c - a12 * s;
	    out[11] = a23 * c - a13 * s;
	    return out;
	};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = rotateY;

	/**
	 * Rotates a matrix by the given angle around the Y axis
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	function rotateY(out, a, rad) {
	    var s = Math.sin(rad),
	        c = Math.cos(rad),
	        a00 = a[0],
	        a01 = a[1],
	        a02 = a[2],
	        a03 = a[3],
	        a20 = a[8],
	        a21 = a[9],
	        a22 = a[10],
	        a23 = a[11];

	    if (a !== out) { // If the source and destination differ, copy the unchanged rows
	        out[4]  = a[4];
	        out[5]  = a[5];
	        out[6]  = a[6];
	        out[7]  = a[7];
	        out[12] = a[12];
	        out[13] = a[13];
	        out[14] = a[14];
	        out[15] = a[15];
	    }

	    // Perform axis-specific matrix multiplication
	    out[0] = a00 * c - a20 * s;
	    out[1] = a01 * c - a21 * s;
	    out[2] = a02 * c - a22 * s;
	    out[3] = a03 * c - a23 * s;
	    out[8] = a00 * s + a20 * c;
	    out[9] = a01 * s + a21 * c;
	    out[10] = a02 * s + a22 * c;
	    out[11] = a03 * s + a23 * c;
	    return out;
	};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = rotateZ;

	/**
	 * Rotates a matrix by the given angle around the Z axis
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	function rotateZ(out, a, rad) {
	    var s = Math.sin(rad),
	        c = Math.cos(rad),
	        a00 = a[0],
	        a01 = a[1],
	        a02 = a[2],
	        a03 = a[3],
	        a10 = a[4],
	        a11 = a[5],
	        a12 = a[6],
	        a13 = a[7];

	    if (a !== out) { // If the source and destination differ, copy the unchanged last row
	        out[8]  = a[8];
	        out[9]  = a[9];
	        out[10] = a[10];
	        out[11] = a[11];
	        out[12] = a[12];
	        out[13] = a[13];
	        out[14] = a[14];
	        out[15] = a[15];
	    }

	    // Perform axis-specific matrix multiplication
	    out[0] = a00 * c + a10 * s;
	    out[1] = a01 * c + a11 * s;
	    out[2] = a02 * c + a12 * s;
	    out[3] = a03 * c + a13 * s;
	    out[4] = a10 * c - a00 * s;
	    out[5] = a11 * c - a01 * s;
	    out[6] = a12 * c - a02 * s;
	    out[7] = a13 * c - a03 * s;
	    return out;
	};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = fromRotationTranslation;

	/**
	 * Creates a matrix from a quaternion rotation and vector translation
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.translate(dest, vec);
	 *     var quatMat = mat4.create();
	 *     quat4.toMat4(quat, quatMat);
	 *     mat4.multiply(dest, quatMat);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {quat4} q Rotation quaternion
	 * @param {vec3} v Translation vector
	 * @returns {mat4} out
	 */
	function fromRotationTranslation(out, q, v) {
	    // Quaternion math
	    var x = q[0], y = q[1], z = q[2], w = q[3],
	        x2 = x + x,
	        y2 = y + y,
	        z2 = z + z,

	        xx = x * x2,
	        xy = x * y2,
	        xz = x * z2,
	        yy = y * y2,
	        yz = y * z2,
	        zz = z * z2,
	        wx = w * x2,
	        wy = w * y2,
	        wz = w * z2;

	    out[0] = 1 - (yy + zz);
	    out[1] = xy + wz;
	    out[2] = xz - wy;
	    out[3] = 0;
	    out[4] = xy - wz;
	    out[5] = 1 - (xx + zz);
	    out[6] = yz + wx;
	    out[7] = 0;
	    out[8] = xz + wy;
	    out[9] = yz - wx;
	    out[10] = 1 - (xx + yy);
	    out[11] = 0;
	    out[12] = v[0];
	    out[13] = v[1];
	    out[14] = v[2];
	    out[15] = 1;
	    
	    return out;
	};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = fromQuat;

	/**
	 * Creates a matrix from a quaternion rotation.
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {quat4} q Rotation quaternion
	 * @returns {mat4} out
	 */
	function fromQuat(out, q) {
	    var x = q[0], y = q[1], z = q[2], w = q[3],
	        x2 = x + x,
	        y2 = y + y,
	        z2 = z + z,

	        xx = x * x2,
	        yx = y * x2,
	        yy = y * y2,
	        zx = z * x2,
	        zy = z * y2,
	        zz = z * z2,
	        wx = w * x2,
	        wy = w * y2,
	        wz = w * z2;

	    out[0] = 1 - yy - zz;
	    out[1] = yx + wz;
	    out[2] = zx - wy;
	    out[3] = 0;

	    out[4] = yx - wz;
	    out[5] = 1 - xx - zz;
	    out[6] = zy + wx;
	    out[7] = 0;

	    out[8] = zx + wy;
	    out[9] = zy - wx;
	    out[10] = 1 - xx - yy;
	    out[11] = 0;

	    out[12] = 0;
	    out[13] = 0;
	    out[14] = 0;
	    out[15] = 1;

	    return out;
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = frustum;

	/**
	 * Generates a frustum matrix with the given bounds
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {Number} left Left bound of the frustum
	 * @param {Number} right Right bound of the frustum
	 * @param {Number} bottom Bottom bound of the frustum
	 * @param {Number} top Top bound of the frustum
	 * @param {Number} near Near bound of the frustum
	 * @param {Number} far Far bound of the frustum
	 * @returns {mat4} out
	 */
	function frustum(out, left, right, bottom, top, near, far) {
	    var rl = 1 / (right - left),
	        tb = 1 / (top - bottom),
	        nf = 1 / (near - far);
	    out[0] = (near * 2) * rl;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = (near * 2) * tb;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = (right + left) * rl;
	    out[9] = (top + bottom) * tb;
	    out[10] = (far + near) * nf;
	    out[11] = -1;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = (far * near * 2) * nf;
	    out[15] = 0;
	    return out;
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = perspective;

	/**
	 * Generates a perspective projection matrix with the given bounds
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {number} fovy Vertical field of view in radians
	 * @param {number} aspect Aspect ratio. typically viewport width/height
	 * @param {number} near Near bound of the frustum
	 * @param {number} far Far bound of the frustum
	 * @returns {mat4} out
	 */
	function perspective(out, fovy, aspect, near, far) {
	    var f = 1.0 / Math.tan(fovy / 2),
	        nf = 1 / (near - far);
	    out[0] = f / aspect;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = f;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 0;
	    out[9] = 0;
	    out[10] = (far + near) * nf;
	    out[11] = -1;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = (2 * far * near) * nf;
	    out[15] = 0;
	    return out;
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = perspectiveFromFieldOfView;

	/**
	 * Generates a perspective projection matrix with the given field of view.
	 * This is primarily useful for generating projection matrices to be used
	 * with the still experiemental WebVR API.
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {number} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
	 * @param {number} near Near bound of the frustum
	 * @param {number} far Far bound of the frustum
	 * @returns {mat4} out
	 */
	function perspectiveFromFieldOfView(out, fov, near, far) {
	    var upTan = Math.tan(fov.upDegrees * Math.PI/180.0),
	        downTan = Math.tan(fov.downDegrees * Math.PI/180.0),
	        leftTan = Math.tan(fov.leftDegrees * Math.PI/180.0),
	        rightTan = Math.tan(fov.rightDegrees * Math.PI/180.0),
	        xScale = 2.0 / (leftTan + rightTan),
	        yScale = 2.0 / (upTan + downTan);

	    out[0] = xScale;
	    out[1] = 0.0;
	    out[2] = 0.0;
	    out[3] = 0.0;
	    out[4] = 0.0;
	    out[5] = yScale;
	    out[6] = 0.0;
	    out[7] = 0.0;
	    out[8] = -((leftTan - rightTan) * xScale * 0.5);
	    out[9] = ((upTan - downTan) * yScale * 0.5);
	    out[10] = far / (near - far);
	    out[11] = -1.0;
	    out[12] = 0.0;
	    out[13] = 0.0;
	    out[14] = (far * near) / (near - far);
	    out[15] = 0.0;
	    return out;
	}



/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = ortho;

	/**
	 * Generates a orthogonal projection matrix with the given bounds
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {number} left Left bound of the frustum
	 * @param {number} right Right bound of the frustum
	 * @param {number} bottom Bottom bound of the frustum
	 * @param {number} top Top bound of the frustum
	 * @param {number} near Near bound of the frustum
	 * @param {number} far Far bound of the frustum
	 * @returns {mat4} out
	 */
	function ortho(out, left, right, bottom, top, near, far) {
	    var lr = 1 / (left - right),
	        bt = 1 / (bottom - top),
	        nf = 1 / (near - far);
	    out[0] = -2 * lr;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = -2 * bt;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 0;
	    out[9] = 0;
	    out[10] = 2 * nf;
	    out[11] = 0;
	    out[12] = (left + right) * lr;
	    out[13] = (top + bottom) * bt;
	    out[14] = (far + near) * nf;
	    out[15] = 1;
	    return out;
	};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var identity = __webpack_require__(14);

	module.exports = lookAt;

	/**
	 * Generates a look-at matrix with the given eye position, focal point, and up axis
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {vec3} eye Position of the viewer
	 * @param {vec3} center Point the viewer is looking at
	 * @param {vec3} up vec3 pointing up
	 * @returns {mat4} out
	 */
	function lookAt(out, eye, center, up) {
	    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
	        eyex = eye[0],
	        eyey = eye[1],
	        eyez = eye[2],
	        upx = up[0],
	        upy = up[1],
	        upz = up[2],
	        centerx = center[0],
	        centery = center[1],
	        centerz = center[2];

	    if (Math.abs(eyex - centerx) < 0.000001 &&
	        Math.abs(eyey - centery) < 0.000001 &&
	        Math.abs(eyez - centerz) < 0.000001) {
	        return identity(out);
	    }

	    z0 = eyex - centerx;
	    z1 = eyey - centery;
	    z2 = eyez - centerz;

	    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
	    z0 *= len;
	    z1 *= len;
	    z2 *= len;

	    x0 = upy * z2 - upz * z1;
	    x1 = upz * z0 - upx * z2;
	    x2 = upx * z1 - upy * z0;
	    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
	    if (!len) {
	        x0 = 0;
	        x1 = 0;
	        x2 = 0;
	    } else {
	        len = 1 / len;
	        x0 *= len;
	        x1 *= len;
	        x2 *= len;
	    }

	    y0 = z1 * x2 - z2 * x1;
	    y1 = z2 * x0 - z0 * x2;
	    y2 = z0 * x1 - z1 * x0;

	    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
	    if (!len) {
	        y0 = 0;
	        y1 = 0;
	        y2 = 0;
	    } else {
	        len = 1 / len;
	        y0 *= len;
	        y1 *= len;
	        y2 *= len;
	    }

	    out[0] = x0;
	    out[1] = y0;
	    out[2] = z0;
	    out[3] = 0;
	    out[4] = x1;
	    out[5] = y1;
	    out[6] = z1;
	    out[7] = 0;
	    out[8] = x2;
	    out[9] = y2;
	    out[10] = z2;
	    out[11] = 0;
	    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
	    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
	    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
	    out[15] = 1;

	    return out;
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = str;

	/**
	 * Returns a string representation of a mat4
	 *
	 * @param {mat4} mat matrix to represent as a string
	 * @returns {String} string representation of the matrix
	 */
	function str(a) {
	    return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' +
	                    a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' +
	                    a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + 
	                    a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
	};

/***/ },
/* 34 */,
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = calc;

	// TODO: Figure out better parameters.
	calc.defaults = {
	  a: 1.5,
	  b: -3.5,
	  c: -0.765145,
	  d: -0.744728,
	  e: -2.5,
	  f: -1.83
	};

	// Rampe1
	// https://softologyblog.wordpress.com/2009/10/19/3d-strange-attractors/
	function calc(vertices, iterations, params) {
	  var a = params.a;
	  var b = params.b;
	  var c = params.c;
	  var d = params.d;
	  var e = params.e;
	  var f = params.f;

	  var x = 0.1;
	  var y = 0.1;
	  var z = 0.1;

	  var xNew;
	  var yNew;
	  var zNew;
	  var i;

	  for (i = 0; i < 100; i++) {
	    xNew = x * Math.sin(a * x) + Math.cos(b * y);
	    yNew = y * Math.sin(c * y) + Math.cos(d * z);
	    zNew = z * Math.sin(e * z) + Math.cos(f * x);
	    x = xNew;
	    y = yNew;
	    z = zNew;
	  }

	  for (i = 0; i < iterations; i++) {
	    xNew = x * Math.sin(a * x) + Math.cos(b * y);
	    yNew = y * Math.sin(c * y) + Math.cos(d * z);
	    zNew = z * Math.sin(e * z) + Math.cos(f * x);
	    x = xNew;
	    y = yNew;
	    z = zNew;

	    vertices[i * 6] = x;
	    vertices[i * 6 + 1] = y;
	    vertices[i * 6 + 2] = z;

	    // Glitch
	    // a = vertices[i * 6 + 5];
	    // b = vertices[i * 6 + 5];
	  }

	  return vertices;
	}


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = calc;

	// TODO: Figure out better parameters.
	calc.defaults = {
	  a: 1.5,
	  b: -3.5,
	  c: -0.765145,
	  d: -0.744728,
	  e: -2.5,
	  f: -1.83
	};

	// Rampe3
	// https://softologyblog.wordpress.com/2009/10/19/3d-strange-attractors/
	function calc(vertices, iterations, params) {
	  var a = params.a;
	  var b = params.b;
	  var c = params.c;
	  var d = params.d;
	  var e = params.e;
	  var f = params.f;

	  var x = 0.1;
	  var y = 0.1;
	  var z = 0.1;

	  var xNew;
	  var yNew;
	  var zNew;
	  var i;

	  for (i = 0; i < 100; i++) {
	    xNew = x * z * Math.sin(a * x) - Math.cos(b * y);
	    yNew = y * x * Math.sin(c * y) - Math.cos(d * z);
	    zNew = z * y * Math.sin(e * z) - Math.cos(f * x);
	    x = xNew;
	    y = yNew;
	    z = zNew;
	  }

	  for (i = 0; i < iterations; i++) {
	    xNew = x * z * Math.sin(a * x) - Math.cos(b * y);
	    yNew = y * x * Math.sin(c * y) - Math.cos(d * z);
	    zNew = z * y * Math.sin(e * z) - Math.cos(f * x);
	    x = xNew;
	    y = yNew;
	    z = zNew;

	    vertices[i * 6] = x;
	    vertices[i * 6 + 1] = y;
	    vertices[i * 6 + 2] = z;

	    // Glitch
	    // a = vertices[i * 6 + 5];
	    // b = vertices[i * 6 + 5];
	  }

	  return vertices;
	}


/***/ }
/******/ ])