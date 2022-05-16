import WebSocketEvents from "../constants/websocket/WebSocketEvents";

const MAX_WEBSOCKET_FAILS = 20;
const MIN_WEBSOCKET_RETRY_TIME = 3000; // 3 sec
const MAX_WEBSOCKET_RETRY_TIME = 30000; // 30 sec
const TAG = "WebSocketClientWrapper";

class WebSocketClientWrapper {
  constructor() {
    this.conn = null;
    this.connectionUrl = null;
    this.sequence = 1;
    this.eventSequence = 0;
    this.connectFailCount = 0;
    this.eventCallback = null;
    this.responseCallbacks = {};
    this.firstConnectCallback = null;
    this.reconnectCallback = null;
    this.missedEventCallback = null;
    this.errorCallback = null;
    this.closeCallback = null;
  }

  initialize(connectionUrl = this.connectionUrl, token) {
    if (this.conn) {
      return;
    }

    if (connectionUrl == null) {
      console.log(TAG + " must have connection url");
      return;
    }

    if (this.connectFailCount === 0) {
      console.log(TAG + " connecting to " + connectionUrl);
    }

    this.conn = new WebSocket(
      connectionUrl.toString() + "?Authorization=Bearer " + token.toString()
    );
    this.connectionUrl = connectionUrl;

    this.conn.onopen = () => {
      this.eventSequence = 0;

      if (token) {
        //this.sendMessage('Authorization', { token });
      }

      if (this.connectFailCount > 0) {
        console.log("websocket re-established connection");
        if (this.reconnectCallback) {
          this.reconnectCallback();
        }
      } else if (this.firstConnectCallback) {
        this.firstConnectCallback();
      }

      this.connectFailCount = 0;
    };

    this.conn.onclose = () => {
      console.log(TAG + " onclose");
      this.conn = null;
      this.sequence = 1;

      if (this.connectFailCount === 0) {
        console.log(TAG + " onclose , failCount=" + this.connectFailCount);
      }

      this.connectFailCount++;

      if (this.closeCallback) {
        this.closeCallback(this.connectFailCount);
      }

      let retryTime = MIN_WEBSOCKET_RETRY_TIME;

      // If we've failed a bunch of connections then start backing off
      if (this.connectFailCount > MAX_WEBSOCKET_FAILS) {
        retryTime =
          MIN_WEBSOCKET_RETRY_TIME *
          this.connectFailCount *
          this.connectFailCount;
        if (retryTime > MAX_WEBSOCKET_RETRY_TIME) {
          retryTime = MAX_WEBSOCKET_RETRY_TIME;
        }
      }

      setTimeout(() => {
        this.initialize(connectionUrl, token);
      }, retryTime);
    };

    this.conn.onerror = (evt) => {
      if (this.connectFailCount <= 1) {
        console.log(TAG + " onerror");
        console.log(TAG + "" + evt);
      }

      if (this.errorCallback) {
        this.errorCallback(evt);
      }
    };

    this.conn.onmessage = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.seq_reply) {
        if (msg.error) {
          console.log(TAG + "" + msg);
        }

        if (this.responseCallbacks[msg.seq_reply]) {
          this.responseCallbacks[msg.seq_reply](msg);
          Reflect.deleteProperty(this.responseCallbacks, msg.seq_reply);
        }
      } else if (this.eventCallback) {
        if (msg.seq !== this.eventSequence && this.missedEventCallback) {
          //console.log(TAG + ' missed websocket event, act_seq=' + msg.seq + ' exp_seq=' + this.eventSequence); //eslint-disable-line no-console
          //this.missedEventCallback();
        }
        this.eventSequence = msg.seq + 1;
        this.eventCallback(msg);
      }
    };
  }

  setEventCallback(callback) {
    this.eventCallback = callback;
  }

  setFirstConnectCallback(callback) {
    this.firstConnectCallback = callback;
  }

  setReconnectCallback(callback) {
    this.reconnectCallback = callback;
  }

  setMissedEventCallback(callback) {
    this.missedEventCallback = callback;
  }

  setErrorCallback(callback) {
    this.errorCallback = callback;
  }

  setCloseCallback(callback) {
    this.closeCallback = callback;
  }

  close() {
    this.connectFailCount = 0;
    this.sequence = 1;
    if (this.conn && this.conn.readyState === WebSocket.OPEN) {
      this.conn.onclose = () => {};
      this.conn.close();
      this.conn = null;
      console.log(TAG + " websocket closed");
    }
  }

  sendMessage(action, data, responseCallback) {
    const msg = {
      action,
      seq: this.sequence++,
      data,
    };

    if (responseCallback) {
      this.responseCallbacks[msg.seq] = responseCallback;
    }

    if (this.conn && this.conn.readyState === WebSocket.OPEN) {
      this.conn.send(JSON.stringify(msg));
    } else if (!this.conn || this.conn.readyState === WebSocket.CLOSED) {
      this.conn = null;
      this.initialize();
    }
  }

  userTyping(channelId, callback) {
    const data = {};
    data.channelId = channelId;
    this.sendMessage(WebSocketEvents.USER_TYPING, data, callback);
  }
}
//USER_TYPING  user_typing
export default WebSocketClientWrapper;
