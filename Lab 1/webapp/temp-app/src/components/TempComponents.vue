<template>
    <div>
        <Temperature :tempUnit="tempUnit"/>
        <ScreenWakeBtn/>
        <ToggleButton @isFarenheit="ChangeUnit($event)"/>
        <Graph :tempUnit="tempUnit"/>
    </div>
</template>

<script>
import Graph from './Graph.vue'
import Temperature from './Temperature.vue'
import ToggleButton from './ToggleBtn.vue'
import ScreenWakeBtn from './ScreenWakeBtn.vue'
// import Axios from 'axios';

var tempUnit = 'C';

export default {
    name: 'TempComponents',
    components: {
        Graph,
        Temperature,
        ToggleButton,
        ScreenWakeBtn
    },
    data() {
        return {
            tempUnit: tempUnit
        }
    },
    methods: {
        // UpdateCurrTemp(value) {
        //     // console.log(value)
        // },
        ChangeUnit(value) {
            // tempUnit = value
            if (value == true) {
                this.mainTemp = '°F'
                this.tempUnit = 'F'
                tempUnit = 'F'
            } else {
                this.mainTemp = '°C'
                this.tempUnit = 'C'
                tempUnit = 'C'
            }
        }
    },
  mounted() {
  }
}
</script>