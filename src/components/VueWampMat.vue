// component.vue
<template>
  <div>
    <md-toolbar class="md-dense">
      <md-button class="md-icon-button">
        <md-icon>menu</md-icon>
      </md-button>

      <h2 class="md-title" style="flex: 1">ADCP Terminal</h2>

      <md-icon v-if="$wampIsConnected">cloud
        <md-tooltip md-direction="top">Connected to WAMP server</md-tooltip>
      </md-icon>
      <md-icon v-else class="md-warn">cloud_off
        <md-tooltip md-direction="top">Connection lost to WAMP server</md-tooltip>
      </md-icon>
      <md-icon v-if="$wampIsOpen" >cast_connected
        <md-tooltip md-direction="top">Connection open to WAMP server</md-tooltip>
      </md-icon>
      <md-icon v-else class="md-warn">cast
        <md-tooltip md-direction="top">Connection not open to WAMP server</md-tooltip>
      </md-icon>
      <md-icon v-if="$wampIsRetrying" class="md-warn">cloud_que
        <md-tooltip md-direction="top">Attempting to reconnect</md-tooltip>
      </md-icon>
    </md-toolbar>

        <md-theme>
          <md-layout md-gutter>

              <md-layout>
                <md-card md-with-hover>
                  <md-card-header>
                    <div class="md-title">Serial data</div>
                    <div class="md-subhead">
                      <md-theme md-name="successFailBtn">
                        <md-button v-if="$wampIsConnected" class="md-primary md-raised">Connected</md-button>
                        <md-button v-else class="md-warn">Connecting...</md-button>
                        <md-button v-if="$wampIsOpen" class="md-primary md-raised">Open</md-button>
                        <md-button v-else class="md-warn">Openning...</md-button>
                        <md-button v-if="$wampIsRetrying" class="md-warn">Retrying...</md-button>
                      </md-theme>
                    </div>
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
    };
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
  },
  wamp: {
    subscribe: {
      'com.rti.data.serial'(args, kwArgs, details) {
        let data = '';
        if (this.serialData.length > 1030) {
          data = this.serialData + JSON.parse(args[0]).value;
          this.serialData = data.substring(data.length - 1030);
        } else {
          this.serialData = this.serialData + JSON.parse(args[0]).value;
        }
        console.log('com.rti.data.serial', details);
      },
      'com.rti.data.ens'(args, kwArgs, details) {
        const jsonEns = JSON.parse(args[0]);
        this.ensData = JSON.stringify(jsonEns.EnsembleData, null, 2);
        console.log('com.rti.data.ens', details);
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
