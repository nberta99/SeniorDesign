<template>
    <div>
        <Temperature/>
        <ToggleButton @isFarenheit="ChangeUnit($event)"/>
        <Graph/>
    </div>
</template>

<script>
import Graph from './Graph.vue'
import Temperature from './Temperature.vue'
import ToggleButton from './ToggleButton.vue'
import Axios from 'axios';

export default {
    name: 'TempComponents',
    components: {
        Graph,
        Temperature,
        ToggleButton
    },
    methods: {
        UpdateCurrTemp(value) {
            console.log(value)
        },
        ChangeUnit(value) {
            if (value == true) {
                this.mainTemp = '°F'
            } else {
                this.mainTemp = '°C'
        }
    },
    mounted() {
        async function getTempData() {
            let url = "http://localhost:3000/currTemp";
            Axios.get(url).then((response) => {
            console.log(response.data)
            response.data
            })
        }

        setInterval(function() {
            getTempData()
        }, 450)
    }
  }
}
</script>