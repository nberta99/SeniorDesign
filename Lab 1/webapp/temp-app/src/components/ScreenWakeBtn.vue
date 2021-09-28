<template>
    <div>
        <button @click="handleClick">Wake Screen</button>
    </div>
</template>

<script>
import Axios from 'axios';

export default {
    name: 'ScreenWakeBtn',
    data() {
        return {
        }
    },

    methods: {
        async handleClick() {
            let url = "http://localhost:3000/press"
            Axios.get(url).then(() => {
                // console.log(response)
            })
        }
    }
}
</script>