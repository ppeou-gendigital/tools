import {useEffect} from 'react';
import useEventBus from '../event-bus/event-bus';

const Message = () => {
  console.log('register message-service');
  const {dispatch, setBroadcaster} = useEventBus();
  useEffect(() => {
    chrome.runtime && chrome.runtime.onConnect.addListener(function (port) {
      console.assert(port.name === "channel001");
      setBroadcaster(port);
      port.onMessage.addListener((e) => {
        dispatch(e.type, e.detail);
      });
    });

    chrome.tabs && chrome.tabs.query({active: true, lastFocusedWindow: true}).then(tabs => {
      chrome.scripting
        .executeScript({
          target: {tabId: tabs[0].id},
          files: ['runner.js'],
        })
        .then(() => {
          console.log("script injected");
        });
    });


  });
  return null;
};

export default Message;
