import React from 'react';
import Firebase from 'firebase';
import {app} from '../firebase-config';
import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { userService, authenticationService } from '@/_services';

class UserPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: authenticationService.currentUserValue,
            userFromApi: null,
            calData: {},
            selectCal: '',
            calName: 'Calendar',
            locName: '',
            timezone: '',
            notes: '',
            calDeadline: '',
            votesPerSlot: '',
            votesPerUser: '',
            timeslot: '',
            intervalBounds: '',
            intervalTimes: ['11:00 am - 11:05 am'],
            userName: '',
            timeslotData: ''
        };
    }

    componentDidMount() {
        const { currentUser } = this.state;
        this.getUserData();
        // userService.getById(currentUser.id).then(userFromApi => this.setState({ userFromApi }));
    }

    // Loads data from Firebase
    getUserData = () => {
        const { calData } = this.state;
        let ref = Firebase.database().ref("/");
        ref.on('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var childData = childSnapshot.val();
                var recordId = childSnapshot.ref_.path.pieces_[0];
                calData[recordId] = childData;
                // console.log(childData.timeslotData);
                let deadDate = new Date(childData.calDeadline);
                // Object.entries(childData).forEach(([key, value]) => {
                // console.log(`${value.calName} (${key})`);
                if ((deadDate > new Date()) || (childData.calDeadline == '')) {
                    var node = document.createElement("option");
                    node.value = recordId;
                    var textnode = document.createTextNode(childData.calName);
                    node.appendChild(textnode);
                    document.getElementById("cals").appendChild(node);  
                }
                // });
            });
        });
        this.setState({calData: calData});
    };

    checkChange = (e) => {
        console.log(e.target.name);
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    // Dropdown list of calendar data
    change = (e) => {
        const { calData, intervalTimes } = this.state;
        this.setState({ 
            selectCal: e.target.value,
            calName: calData[e.target.value].calName,
            locName: calData[e.target.value].locName,
            timezone: calData[e.target.value].timezone,
            notes: calData[e.target.value].notes,
            calDeadline: calData[e.target.value].calDeadline,
            votesPerSlot: calData[e.target.value].votesPerSlot,
            votesPerUser: calData[e.target.value].votesPerUser,
            timeslot: calData[e.target.value].timeslot.split(", "),
            intervalTimes: calData[e.target.value].intervalTimes,
            timeslotData: calData[e.target.value].timeslotData
        });
        // console.log(calData[e.target.value].intervalTimes);
        document.getElementById('updateBtn').disabled = false;
        document.getElementById("timeData").innerHTML = '';
        let yes = calData[e.target.value].timeslot.split(", ");
        let i = 0;
        yes.forEach(function(childSnapshot) {
            calData[e.target.value].intervalTimes.forEach(function(intVal) {
                
                let reservation = calData[e.target.value].timeslotData[i];
                var checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = i;
                checkbox.name = 'timeChoices';
                if ((reservation.split(",").length == calData[e.target.value].votesPerSlot) && (reservation != "")) {
                    checkbox.disabled = true;
                }
                checkbox.value = childSnapshot + " " + intVal;
             
                var label = document.createElement('label')
                label.htmlFor = childSnapshot + " " + intVal;
                label.appendChild(document.createTextNode(childSnapshot + " (" + intVal + ") - Reserved by: " + reservation));
             
                var br = document.createElement('br');
             
                var container = document.getElementById('timeData');
                container.appendChild(checkbox);
                container.appendChild(label);
                container.appendChild(br);
                i++;

                // var node = document.createElement("p");
                // // node.value = recordId;
                // var textnode = document.createTextNode(i + ": " + childSnapshot + " (" + intVal + ") - Reserved by: " + calData[e.target.value].timeslotData[i]);
                // i++;
                // node.appendChild(textnode);
                // document.getElementById("timeData").appendChild(node);
            });
            document.getElementById("timeData").appendChild(document.createElement("br"));
        });

        if (e.target.value == "") {
            document.getElementById('form').setAttribute("class", "d-none");
            document.getElementById('dataCalEvent').setAttribute("class", "d-none");
        } else {
            document.getElementById('form').setAttribute("class", "");
            document.getElementById('dataCalEvent').setAttribute("class", "");
        }
    }

    // getIntervals = (intervalArray) => {
    //     const { intervalTimes } = this.state;
    //     let startString = intervalArray[0];
    //     let endString = intervalArray[1];
    //     let intervalString = intervalArray[2];
    //     // console.log(startString, endString, intervalString);
    //     var start = startString.split(":");
    //     var end = endString.split(":");
    //     var interval = intervalString.split(":");
    //     var startInMinutes = start[0]*60+start[1]*1;
    //     var endInMinutes = end[0]*60+end[1]*1;
    //     let intMins = interval[0]*60+interval[1]*1;
    //     let intMinsFloor = Math.floor((endInMinutes-startInMinutes)/interval[0])
    //     var intervalInMinutes = ((interval.length >= 2) ? ((intMins >= 5) ? intMins : 5) : ((intMinsFloor >= 5) ? intMinsFloor : 5));
    //     var times = [];
    //     var intervalsOfTime = [];
    //     var tt = startInMinutes;
    //     var ap = ['am', 'pm']; // AM-PM

    //     //loop to increment the time and push results in array
    //     for (var i=0; tt<=endInMinutes; i++) {
    //     var hh = Math.floor(tt/60); // getting hours of day in 0-24 format
    //     var toTime = (((hh == 0) || (hh == 12)) ? 12 : (hh % 12));
    //     var mm = (tt%60); // getting minutes of the hour in 0-55 format
    //     times[i] = ("0" + (toTime)).slice(-2) + ':' + ("0" + mm).slice(-2) + ap[Math.floor(hh/12)]; // pushing data in array in [00:00 - 12:00 AM/PM format]
    //     tt = tt + intervalInMinutes;
    //     }
        
    //     for(var i = 0; i < times.length-1; i++)
    //       intervalsOfTime.push(times[i] + " - " + times[i+1])
        
    //     // console.log(intervalsOfTime);
    //     this.setState({
    //         intervalTimes: intervalsOfTime
    //     })
        
    //     let yes = document.getElementById('timeslice').value.split(', ');
    //     document.getElementById("timeData").innerHTML = '';
    //     // console.log(intervalTimes);
    //     yes.forEach(function(childSnapshot) {
    //         var node = document.createElement("p");
    //         var textnode = document.createTextNode(childSnapshot + " (" + intervalsOfTime + ")");
    //         node.appendChild(textnode);
    //         document.getElementById("timeData").appendChild(node);
    //     });
    // }

    addElem = () => {
        const { intervalTimes } = this.state;
        let yes = document.getElementById('timeslice').value.split(', ');
        document.getElementById("timeData").innerHTML = '';
        // console.log(intervalTimes);
        yes.forEach(function(childSnapshot) {
            var node = document.createElement("p");
            var textnode = document.createTextNode(childSnapshot + " (" + intervalTimes + ")");
            node.appendChild(textnode);
            document.getElementById("timeData").appendChild(node);
        });
    }

    onSubmit = (e) => {
        e.preventDefault();
        const { selectCal, calName, locName, timezone, notes, calDeadline, votesPerSlot, votesPerUser, timeslot, intervalTimes, timeslotData, userName } = this.state;

        var checkboxes = document.getElementsByName('timeChoices');
        var selected = [];
        let msgStr = [];
        for (var i=0; i<checkboxes.length; i++) {
            if (checkboxes[i].checked) {
                selected.push(checkboxes[i].id);
                msgStr.push(checkboxes[i].value);
            }
        }
        // console.log(userName, selected);
        if (selected.length > votesPerUser) {
            // Too many options selected, max of votesPerUser
            let alertBox = document.getElementById("alertInfo");
            alertBox.setAttribute("class","alert alert-warning");
            alertBox.setAttribute("role","alert");
            alertBox.innerHTML = `Too many timeslots selected. Max of ${votesPerUser}. Currently ${selected.length}`;
            return;
        } else {
            for (var i=0; i<selected.length; i++) {
                let temp = timeslotData[selected[i]];
                if (temp == ""){
                    timeslotData[selected[i]] = userName;
                } else {
                    timeslotData[selected[i]] += ", " + userName;
                }
            }

            let ref = Firebase.database().ref();
            ref.child(selectCal).update({
                timeslotData: timeslotData
            });

            let msgBox = document.getElementById('submitMsg');
            msgBox.setAttribute("class", "alert alert-success");
            msgBox.setAttribute("role","alert");
            var node = document.createElement("p");
            var textnode = document.createTextNode(`Timeslots: ${msgStr}`);
            node.appendChild(textnode);
            msgBox.appendChild(node);
            document.getElementById('pageData').setAttribute("class", "d-none");
        }
    }

    render() {
        const { currentUser, userFromApi, calName, locName, timezone, notes, calDeadline, votesPerSlot, votesPerUser, timeslot, intervalBounds, userName } = this.state;
        return (
            <div>
                {/* <div id="alertInfo" className="d-none"/> */}
                <h3>Calendar Signup</h3>
                <div id="submitMsg" className="d-none">
                    <p>Event/Calendar: {calName}</p>
                    <p>Location: {locName}</p>
                    <p>Event Notes: {notes}</p>
                    <p>User Info: {userName}</p>
                </div>
                <div id="pageData">
                    <label htmlFor="cals">Select a calendar event:</label>
                    <select name="cals" id="cals" onChange={this.change} value={this.state.value}>
                        <option value="" value>--Please select a calendar--</option>
                    </select>
                    <div id="dataCalEvent" className="d-none">
                        <p>Event (Calendar) Title: {calName}</p>
                        <p>Event Location: {locName}</p>
                        <p>Timezone: {timezone}</p>
                        <p>Event Notes: {notes}</p>
                        <p>Calendar Deadline: {calDeadline}</p>
                        <p>Votes Per User: {votesPerUser}</p>
                        <p>Votes Per Timeslot: {votesPerSlot}</p>
                    </div>
                    <form id="form" className="d-none" onSubmit={this.onSubmit}>
                        <p>Timeslots: </p>
                        <div onChange={this.checkChange} id="timeData"/>
                        <label>Enter Name or Email*:
                            <input type="text" name="userName" value={userName} onChange={this.onChange} required/>
                        </label><br/>
                        <button id="updateBtn" className="btn btn-primary" type="submit">
                            Submit
                        </button>
                    </form><br/>
                    <div id="alertInfo" className="d-none"/>
                </div>
            </div>
        );
    }
}

export { UserPage };