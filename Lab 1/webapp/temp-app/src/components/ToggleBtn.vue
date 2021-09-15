<template>
    <div>
        <label for="toggle_button">
            <span v-if="isActive" class="toggle__label"></span>
            <span v-if="! isActive" class="toggle__label"></span>

            <input type="checkbox" id="toggle_button" v-model="checkedValue">
            Farenheit
            <span class="toggle__switch"></span>
        </label>
    </div>
</template>

<script>
export default {
    name: 'ToggleButton',
    data() {
        return {
            currentState: false
        }
    },

    computed: {
        isActive() {
            this.$emit('isFarenheit', this.currentState)
            // console.log(this.currentState)
            return this.currentState;
        },

        checkedValue: {
            get() {
                return this.defaultState
            },
            set(newValue) {
                this.currentState = newValue;
            }
        }
    }
}
</script>

<style scoped>
div {
    margin: 10px 0 0;
}
</style>