const DISTANCE_LOWER_BOUND = 0.1;
const DISTANCE_UPPER_BOUND = 10;
const GESTURE_ZOOM_SPEED = 0.1;
const WHEEL_ZOOM_SPEED = 0.01;
const ROTATION_INERTIA = 0.9;
const DISTANCE_INERTIA = 0.7;
const MOUSE_TO_RADIAN = Math.PI / 300.0;

export default function(container, initialDistance) {
  const rotation = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };
  const targetOnDown = { x: 0, y: 0};
  const mouse = { x: 0, y: 0 };
  const mouseOnDown = { x: 0, y: 0 };

  let distance = initialDistance;
  let distanceTarget = initialDistance;

  let lastClickTime = new Date().getTime();
  let isBirdView = true;

  let touchEnabled = false;
  let downEventName, upEventName, outEventName, moveEventName;
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
  let previousScale = null;

  //
  // Event handlers
  //

  function onMouseDown(event) {
    event.preventDefault();

    // Check if it's double click/tap.
    const currentTime = new Date().getTime();
    const diff = currentTime - lastClickTime;
    const isSingleTap = touchEnabled && event.targetTouches.length === 1;
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
      const touchItem = event.targetTouches[0];
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
      const touchItem = event.targetTouches[0];
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
    const deltaY = event.wheelDeltaY || event.deltaY || 0;
    event.preventDefault();
    zoom(deltaY * WHEEL_ZOOM_SPEED);
    return false;
  }

  function onGestureStart(event) {
    previousScale = event.scale;
  }

  function onGestureChange(event) {
    const scale = event.scale / previousScale;
    zoom(GESTURE_ZOOM_SPEED * distanceTarget * (scale - 1) / scale);
    previsousScale = event.scale;
  }

  function onGestureEnd(event) {
    const scale = event.scale / previousScale;
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

  const states = {
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
