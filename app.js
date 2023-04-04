function strToIntArray(str) {
  let chunks = [];

  if (str.length % 2) return []

  for (let i = 0, charsLength = str.length; i < charsLength; i += 2) {
    chunks.push(Number('0x' + str.substring(i, i + 2)));
  }

  return chunks;
}

function arrayToIntStr(data) {
  let result = '';
  for (let byte in data) {
    result += data[byte].toString(16).padStart(2, '0');
  }
  return result.toUpperCase();
}

function isBitSet(data, bit) {
  return ((data >> bit) % 2 !== 0);
}

function intArrayToBitParams(data) {
  let result = [];

  if (!Array.isArray(data)) return result;

  for (let bytePos = 0; bytePos < data.length; bytePos++) {
    result[bytePos] = {};
    for (let bitPos = 0; bitPos < 8; bitPos++) {
      result[bytePos][bitPos] = isBitSet(data[bytePos], bitPos);
    }
  }

  return result;
}

const Configurator = {
  data() {
    return {
      zone2100: 'EEE47440003000',
      zone0200: 'FE8000',

      zone2100p: [], zone0200p: [],
    }
  },
  computed: {
    params2100() {
      return strToIntArray(this.zone2100);
    },
    params0200() {
      return strToIntArray(this.zone0200);
    },
    params2100result() {
      let result = {};

      for (let bytePos = 0; bytePos < this.params2100.length; bytePos++) {
        result[bytePos] = 0;
        for (let bitPos = 0; bitPos < 8; bitPos++) {
          if (this.zone2100p[bytePos] && this.zone2100p[bytePos][bitPos]) {
            result[bytePos] = result[bytePos] | (1 << bitPos);
          }
        }
      }
      return result;
    },
    params0200result() {
      let result = {};

      for (let bytePos = 0; bytePos < this.params0200.length; bytePos++) {
        result[bytePos] = 0;
        for (let bitPos = 0; bitPos < 8; bitPos++) {
          if (this.zone0200p[bytePos] && this.zone0200p[bytePos][bitPos]) {
            result[bytePos] = result[bytePos] | (1 << bitPos);
          }
        }
      }
      return result;
    },
    params2100resultStr() {
      return arrayToIntStr(this.params2100result);
    },
    params0200resultStr() {
      return arrayToIntStr(this.params0200result);
    },
    isResultReady() {
      return (Array.isArray(this.zone2100p) && this.zone2100p.length === 7) && (Array.isArray(this.zone0200p) && this.zone0200p.length === 3);
    }
  },
  watch: {
    zone2100(value) {
      this.zone2100p = intArrayToBitParams(this.params2100);
    },
    zone0200(value) {
      this.zone0200p = intArrayToBitParams(this.params0200);
    }
  }
}

Vue.createApp(Configurator).mount('#app');
