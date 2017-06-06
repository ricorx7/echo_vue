// component.vue
<template>
  <div>
        <md-theme>
          <md-layout md-gutter>

              <md-layout>
                <md-card md-with-hover>
                  <md-card-header>
                    <md-card-header-text>
                      <div class="md-title">ADCP Data</div>
                      <div class="md-subhead">
                        <md-theme md-name="successFailBtn">
                          <md-button v-if="$wampIsConnected" class="md-primary md-raised">Connected
                            <md-icon>cloud</md-icon>
                            <md-tooltip md-direction="top">Connection made to WAMP server</md-tooltip>
                          </md-button>
                          <md-button v-else class="md-warn">Connecting...
                            <md-icon>cloud-off</md-icon>
                            <md-tooltip md-direction="top">Connection lost to WAMP server</md-tooltip>
                          </md-button>
                          <md-button v-if="$wampIsOpen" class="md-primary md-raised">Open
                            <md-icon>rss_feed</md-icon>
                            <md-tooltip md-direction="top">Connection open to WAMP server</md-tooltip>
                          </md-button>
                          <md-button v-else class="md-warn">Openning...
                            <md-icon>rss_feed</md-icon>
                            <md-tooltip md-direction="top">Openning connection to WAMP server</md-tooltip>
                          </md-button>
                          
                          <md-button v-if="$wampIsRetrying" class="md-warn">Retrying...</md-button>
                        </md-theme>
                      </div>
                    </md-card-header-text>

                    <md-menu md-size="4" md-direction="bottom left">
                      <md-button class="md-icon-button" md-menu-trigger>
                        <md-icon>menu</md-icon>
                      </md-button>

                      <md-menu-content>
                          <md-input-container>
                              <label for="serialPort">Serial Port</label>
                              <md-select name="serialPort" id="serialPort" v-model="selectedSerialPort">
                                <md-option v-for="port in serialPortList" :key="port" :value="port">{{ port }}</md-option>
                              </md-select>
                            <md-button class="md-icon-button" v-on:click.native="getSerialList()">
                              <md-icon>refresh</md-icon>
                            </md-button>
                            </md-input-container>

                          <md-input-container>
                              <label for="baud">Baud Rate</label>
                              <md-select name="baud" id="baud" v-model="selectedBaud">
                                <md-option value="921600">921600</md-option>
                                <md-option value="460800">460800</md-option>
                                <md-option value="230400">230400</md-option>
                                <md-option value="115200">115200</md-option>
                                <md-option value="38400">38400</md-option>
                                <md-option value="19200">19200</md-option>
                                <md-option value="9600">9600</md-option>
                                <md-option value="4800">4800</md-option>
                                <md-option value="2400">2400</md-option>
                              </md-select>
                            </md-input-container>

                        <md-menu-item>
                          <md-button class="md-raised md-accent" v-on:click.native="connectSerialPort()">
                              Connect
                              <md-icon>rss_feed</md-icon>
                            </md-button>
                        </md-menu-item>
                      </md-menu-content>
                    </md-menu>

                    <md-menu md-size="4" md-direction="bottom left">
                      <md-button class="md-icon-button" md-menu-trigger>
                        <md-icon>code</md-icon>
                      </md-button>

                      <md-menu-content>
                        <md-menu-item>
                          <md-button class="md-dense" v-on:click.native="sendSpecificCmd('START')">
                            START PINGING
                            <md-tooltip>Start the ADCP pinging.</md-tooltip>
                          </md-button>
                        </md-menu-item>

                        <md-menu-item>
                          <md-button class="md-dense" v-on:click.native="sendSpecificCmd('STOP')">
                            STOP PINGING
                            <md-tooltip>Stop the ADCP pinging.</md-tooltip>
                          </md-button>
                        </md-menu-item>

                        <md-menu-item>
                          <md-button class="md-dense" v-on:click.native="sendSpecificCmd('CSHOW')">
                            CSHOW
                            <md-tooltip>Show all the current settings on the ADCP.</md-tooltip>
                          </md-button>
                        </md-menu-item>

                        <md-menu-item>
                          <md-button class="md-dense" v-on:click.native="sendSpecificCmd('SLEEP')">
                            SLEEP
                            <md-tooltip>Turn off the ADCP.  Send a BREAK to turn it back on.</md-tooltip>
                          </md-button>
                        </md-menu-item>

                        <md-menu-item>
                          <md-button class="md-dense" v-on:click.native="sendSetTime()">
                            Set Time
                            <md-tooltip>Set the time on the ADCP based off the computer's time.</md-tooltip>
                          </md-button>
                        </md-menu-item>

                        <md-menu-item>
                          <md-button class="md-dense" v-on:click.native="sendSpecificCmd('CEMAC')">
                            CEMAC
                            <md-tooltip>Turn ON or OFF the ethernet</md-tooltip>
                          </md-button>
                        </md-menu-item>

                        <md-menu-item>
                          <md-button class="md-dense" v-on:click.native="sendSpecificCmd('CPZ')">
                            Zero PS
                            <md-tooltip>Zero the pressure sensor.</md-tooltip>
                          </md-button>
                        </md-menu-item>

                        <md-menu-item>
                          <md-button class="md-dense" v-on:click.native="sendSpecificCmd('DIAGCPT')">
                            Compass Connect
                            <md-tooltip>Turn ON Compass pass through.  This will show the raw compass data.</md-tooltip>
                          </md-button>
                        </md-menu-item>

                        <md-menu-item>
                          <md-button class="md-dense"v-on:click.native="sendSpecificCmd('XXXXXXXXXXXXXXXX')">
                            Compass Disconnect
                            <md-tooltip>Turn OFF Compass pass through.  This will stop received compass data.</md-tooltip>
                          </md-button>
                        </md-menu-item>
                      </md-menu-content>
                    </md-menu>
          
                  </md-card-header>

                  <md-card-content>
                      <textarea rows="25" cols="50">{{ serialData }}</textarea>
                       <textarea rows="25" cols="75"> {{ ensData }} </textarea>
                  </md-card-content>

                  <md-card-actions>
                    <md-input-container md-inline>
                      <label>Command</label>
                      <md-input v-model="command"></md-input>
                    </md-input-container>
                    <md-button class="md-primary md-raised" v-on:click.native="sendCmd()">SEND</md-button>
                    <md-button class="md-accent md-raised" v-on:click.native="sendBreak()">BREAK</md-button>
                  </md-card-actions>
                </md-card>
              </md-layout>

          </md-layout>
        </md-theme>

<link rel="stylesheet" href="//fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic">
<link rel="stylesheet" href="//fonts.googleapis.com/icon?family=Material+Icons">

        </div>
</template>


<script>
import Vue from 'vue';
import VueWamp from 'vue-wamp';

let serialUpdateTimerObj;
let serialDisplayBuffer = '';

Vue.use(VueWamp, {
  debug: true,
  url: 'ws://127.0.0.1:55058/ws',
  realm: 'realm1',
  onopen(session, details) {
    console.log('WAMP connected', session, details);
  },
  onclose(reason, details) {
    console.log(`WAMP closed: ${reason} ${details}`);
  },
});

export default {
  name: 'VueWampMat',
  data() {
    return {
      someValue: 'foobar',
      command: '',
      serialData: '-',
      ensData: '-',
      selectedBaud: '',
      serialPortList: ['CLICK REFRESH'],
      selectedSerialPort: '',
      serial_settings_checked: false,
    };
  },
  mounted() {
    this.getSerialList();
    console.log('mounted');

    this.startUpdateSerialTimer();
  },
  methods: {
    sendBreak() {
      // this.$wampPublish('com.rti.onbreak', [100], {})
      this.$wampCall('com.rti.onbreak', [100]);
    },
    sendCmd() {
      if (this.command !== '') {
        // this.$wampPublish('com.rti.oncmd', [this.command], {})
        // var strCmd = String.fromCharCode(parseInt(this.command, 16))
        this.$wampCall('com.rti.oncmd', [this.command]);
        this.command = '';
      }
    },
    sendSpecificCmd(cmd) {
      this.$wampCall('com.rti.oncmd', [cmd]);
    },
    sendSetTime() {
      this.$wampCall('com.rti.onsettime');
    },
    getSerialList() {
      this.$wampCall('com.rti.serial.list.get', []);
    },
    connectSerialPort() {
      this.$wampCall('com.rti.serial.reconnect', [this.selectedSerialPort, this.selectedBaud]);
      console.log(`Connect serial port: ${this.selectedSerialPort} baud: ${this.selectedBaud}`);
    },
    checkSerialSettings(jsonData) {
      // Check if the serial port and baud rate have been set
      if (!this.serial_settings_checked) {
        this.selectedSerialPort = jsonData.port;
        this.selectedBaud = jsonData.baud;
        this.serial_settings_checked = true;
      }
    },
    startUpdateSerialTimer() {
      serialUpdateTimerObj = window.setInterval(this.timerTick, 1000);
    },
    stopUpdateSerialTimer() {
      window.clearInterval(serialUpdateTimerObj);
      serialUpdateTimerObj = null;
    },
    timerTick() {
      // Rate limit how often the display is updated
      this.serialData = serialDisplayBuffer;
    },
  },
  wamp: {
    subscribe: {
      'com.rti.data.serial'(args) {
        // Limit how much is in the buffer
        const json = JSON.parse(args[0]);
        let data = json.value;
        if (serialDisplayBuffer.length > 1050) {
          data = serialDisplayBuffer + data;
          serialDisplayBuffer = data.substring(data.length - 1050);
        } else {
          serialDisplayBuffer += data;
        }

        // Check the serial settings
        this.checkSerialSettings(json);
      },
      'com.rti.data.ens'(args) {
        const jsonEns = JSON.parse(args[0]);
        this.ensData = JSON.stringify(jsonEns.EnsembleData, null, 2);
        // console.log('com.rti.data.ens', details);
      },
      'com.rti.serial.list'(args) {
        this.serialPortList = JSON.parse(args[0]);
        console.log('com.rti.serial.list');
      },
      'another-topic': {
        acknowledge: true,
        function(args, kwArgs, details) {
          console.log('another topic', details);
        },
      },
    },
  },
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
