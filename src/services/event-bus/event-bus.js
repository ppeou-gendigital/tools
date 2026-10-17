const {addEventListener, dispatchEvent, removeEventListener} = document;

let opt = {
  broadcaster: undefined,
};

const on = (eventName, callback) => {
  addEventListener(eventName, callback);
  return () => remove(eventName, callback);
};

const broadcast = (eventName, data) => {
  if(opt.broadcaster) {
    opt.broadcaster.postMessage({type: eventName, detail: data});
  }
};

const dispatch = (eventName, data) => {
  dispatchEvent(new CustomEvent(eventName, { detail: data }));
};
const remove = (eventName, callback) => {
  removeEventListener(eventName, callback);
};
const setBroadcaster = (broadcaster) => {
  opt.broadcaster = broadcaster;
};

const useEventBus = () => {
  return {on, dispatch, remove, broadcast, setBroadcaster};
};

export default useEventBus;
