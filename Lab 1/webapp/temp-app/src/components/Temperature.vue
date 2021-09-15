<template>
  <div class="temperature">
    <h1 id="currTempVal">No Current Temperature Data</h1>
  </div>
</template>

<script>
import Axios from 'axios'

var tempUnit = 'C'

export default {
  name: 'Temperature',
  components: {
  },
  props: ['tempUnit'],
  data() {
    return {
    }
  },
  created() {
  },
  watch: {
    tempUnit(val) {
      tempUnit = val
    }
  },
  mounted() {
    const ctx = document.getElementById('currTempVal');

    async function getTempData() {
      let url = "http://localhost:3000/currTemp" + `?unit=${tempUnit}`
      Axios.get(url).then((response) => {
        // console.log(response.data)
        if (response.data == null) {
          ctx.innerHTML = "No Current Temperature Data"
        } else {
          ctx.innerHTML = response.data + '°' + tempUnit
        }

      })
    }
    
    setInterval(function() {
      getTempData()
    }, 700)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
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
