<template>
    <div>
        <h3>Notification Information</h3>
        <button id="editBtn" @click="editForm">Edit Form</button>
        <p id="formStatus" hidden></p>
        <form>
            <p>
                Cell #:
                <input v-model="form.cell" placeholder="8885550123" disabled/>
            </p>
            <p>
                Minimum Temperature (°C):
                <input v-model="form.minTemp" placeholder="-10" disabled/>
            </p>
            <p>
                Minimum Temperature Message:
                <input v-model="form.minText" placeholder="It's cold" disabled/>
            </p>
            <p>
                Maximum Temperature (°C):
                <input v-model="form.maxTemp" placeholder="100" disabled/>
            </p>
            <p>
                Maximum Temperature Message:
                <input v-model="form.maxText" placeholder="It's hot" disabled/>
            </p>
        </form>
        <button id="updateBtn" @click="submitUpdate" hidden>Submit</button>
    </div>
</template>

<script>
import Axios from 'axios';
import FormData from 'form-data';

export default {
    name: 'NotificationInfo',
    data() {
        return {
            form: {
                cell: 8885559876,
                minTemp: -10,
                maxTemp: 100,
                minText: "It's cold",
                maxText: "It's hot"
            }
        }
    },
    methods: {
        toggleForm(edit) {
            // Assumes when edit is true that form is being edited, false when submitted (non-editable)
            let inputs = document.getElementsByTagName('input')
            for (let i = 0; i < inputs.length; i++) {
                inputs[i].disabled = !edit
            }
            document.getElementById('editBtn').hidden = edit
            document.getElementById('updateBtn').hidden = !edit
        },
        editForm() {
            // console.log("edit form")
            this.toggleForm(true)
        },
        submitUpdate() {
            // console.log('submit update')
            let msg = document.getElementById('formStatus')
            msg.hidden = false
            this.postFormData()
            msg.innerHTML = "Form updated"
            this.toggleForm(false)
        },
        postFormData() {
            const form_data = new FormData();
            form_data.append('cell', this.form.cell);
            form_data.append('minTemp', this.form.minTemp);
            form_data.append('minText', this.form.minText);
            form_data.append('maxTemp', this.form.maxTemp);
            form_data.append('maxText', this.form.maxText);
            Axios.post(
                "http://localhost:3000/notifications",
                {cell: this.form.cell, minTemp: this.form.minTemp, minText: this.form.minText, maxTemp: this.form.maxTemp, maxText: this.form.maxText})
                .then(() => {
                    //handle success
                    // console.log(response);
                })
                .catch(function () {
                    //handle error
                    // console.log(response);
                });
        },
        async getNotificationData() {
            let url = "http://localhost:3000/notifications"
            Axios.get(url).then((response) => {
                this.form.maxText = response.data.maxText
                this.form.maxTemp = response.data.maxTemp
                this.form.minText = response.data.minText
                this.form.minTemp = response.data.minTemp
                this.form.cell    = response.data.cell
            })
        }
    },
    mounted() {
        this.getNotificationData()
    }
}
</script>

<style scoped>

</style>