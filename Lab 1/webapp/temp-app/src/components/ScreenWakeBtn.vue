<template>
    <div>
        <button @click="handleClick">Wake Screen</button>
    </div>
</template>

<script>
export default {
    name: 'ScreenWakeBtn',
    data() {
        return {
        }
    },

    methods: {
        handleClick: function(){
            console.log('Wake Screen')
        }
    }
}
</script>