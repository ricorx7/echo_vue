// component.vue
<template>
  <div>
    <b-button-group>
        <b-button variant="success" v-if="$wampIsConnected">
            <span>Connected</span>
        </b-button>
       <b-button variant="danger" v-else>
            <span>Connecting...</span>
       </b-button>
      <b-button variant="success" v-if="$wampIsOpen">
          <span>Open</span>
      </b-button>
      <b-button variant="danger" v-else>
          <span>Opening...</span>
      </b-button>
      <b-button variant="danger" v-if="$wampIsRetrying">
          <span>Retrying...</span>
      </b-button>
    </b-button-group>

        <p>Connected: {{ $wampIsConnected }}</p>

        <b-jumbotron header="Serial Data" >
          <textarea>{{ serialData }}</textarea>
          <textarea>{{ ensData }}</textarea>
        </b-jumbotron>

        <input v-model="command">
        <b-button variant="primary" v-on:click="sendCmd">SEND</b-button>
        <b-button variant="info" v-on:click="sendBreak">BREAK</b-button>
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
  name: 'EchoWamp',
  data() {
    return {
      command: '',
      serialData: '-',
      ensData: '-',
    };
  },
  methods: {
    sendBreak() {
      this.serialData = '';
      this.$wampCall('com.rti.onbreak', [100]);
    },
    sendCmd() {
      if (this.command !== '') {
        this.$wampCall('com.rti.oncmd', [this.command]);
        this.command = '';
      }
    },
  },
  wamp: {
    subscribe: {
      'com.rti.serialdata'(args) {
        if (this.serialData.length > 1030) {
          const data = this.serialData + JSON.parse(args[0]).value;
          this.serialData = data.substring(data.length - 1030);
        } else {
          this.serialData = this.serialData + JSON.parse(args[0]).value;
        }
        console.log('com.rti.serialdata');
      },
      'com.rti.ensdata'(args) {
        this.ensData = JSON.parse(args[0]);
        console.log('com.rti.ensdata');
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
