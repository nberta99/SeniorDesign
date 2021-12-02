import React from 'react';
import Firebase from 'firebase';
import {app} from '../firebase-config';
import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { userService, authenticationService } from '@/_services';

class ModifyPage extends React.Component {
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
            votesPerSlot: 1,
            votesPerUser: 1,
            timeslot: '',
            intervalBounds: '',
            intervalTimes: ['11:00 am - 11:05 am']
        };
    }

    componentDidMount() {
        const { currentUser } = this.state;
        this.getUserData();
        // userService.getById(currentUser.id).then(userFromApi => this.setState({ userFromApi }));
    }

    getUserData = () => {
        const { calData } = this.state;
        let ref = Firebase.database().ref("/");
        ref.on('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var childData = childSnapshot.val();
                var recordId = childSnapshot.ref_.path.pieces_[0];
                calData[recordId] = childData;
                // console.log(childData);
                // Object.entries(childData).forEach(([key, value]) => {
                // console.log(`${value.calName} (${key})`);
                var node = document.createElement("option");
                node.value = recordId;
                var textnode = document.createTextNode(childData.calName);
                node.appendChild(textnode);
                document.getElementById("cals").appendChild(node);  
                // });
            });
        });
        this.setState({calData: calData});
    };

    onChange = (e) => {
        if ((e.target.name == 'intervalBounds') && (e.target.value.split(',').length == 3)) {
            document.getElementById('intervalBtn').setAttribute('class', 'btn btn-primary');
        } else if ((e.target.name == 'intervalBounds') && (e.target.value.split(',').length != 3)) {
            document.getElementById('intervalBtn').setAttribute('class', 'd-none btn btn-primary');
        }
        this.setState({ [e.target.name]: e.target.value });
    }

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
            intervalTimes: calData[e.target.value].intervalTimes
        });
        // console.log(calData[e.target.value].intervalTimes);
        document.getElementById('updateBtn').disabled = false;
        document.getElementById("timeData").innerHTML = '';
        let yes = calData[e.target.value].timeslot.split(", ");
        yes.forEach(function(childSnapshot) {
            var node = document.createElement("p");
            // node.value = recordId;
            var textnode = document.createTextNode(childSnapshot + " (" + calData[e.target.value].intervalTimes + ")");
            node.appendChild(textnode);
            document.getElementById("timeData").appendChild(node);
        });

        if (e.target.value == "") {
            document.getElementById('form').setAttribute("class", "d-none");
        } else {
            document.getElementById('form').setAttribute("class", "");
        }
    }

    getIntervals = (intervalArray) => {
        const { intervalTimes } = this.state;
        let startString = intervalArray[0];
        let endString = intervalArray[1];
        let intervalString = intervalArray[2];
        // console.log(startString, endString, intervalString);
        var start = startString.split(":");
        var end = endString.split(":");
        var interval = intervalString.split(":");
        var startInMinutes = start[0]*60+start[1]*1;
        var endInMinutes = end[0]*60+end[1]*1;
        let intMins = interval[0]*60+interval[1]*1;
        let intMinsFloor = Math.floor((endInMinutes-startInMinutes)/interval[0])
        var intervalInMinutes = ((interval.length >= 2) ? ((intMins >= 5) ? intMins : 5) : ((intMinsFloor >= 5) ? intMinsFloor : 5));
        var times = [];
        var intervalsOfTime = [];
        var tt = startInMinutes;
        var ap = ['am', 'pm']; // AM-PM

        //loop to increment the time and push results in array
        for (var i=0; tt<=endInMinutes; i++) {
        var hh = Math.floor(tt/60); // getting hours of day in 0-24 format
        var toTime = (((hh == 0) || (hh == 12)) ? 12 : (hh % 12));
        var mm = (tt%60); // getting minutes of the hour in 0-55 format
        times[i] = ("0" + (toTime)).slice(-2) + ':' + ("0" + mm).slice(-2) + " " + ap[Math.floor(hh/12)]; // pushing data in array in [00:00 - 12:00 AM/PM format]
        tt = tt + intervalInMinutes;
        }
        
        for(var i = 0; i < times.length-1; i++)
          intervalsOfTime.push(times[i] + " - " + times[i+1])
        
        // console.log(intervalsOfTime);
        this.setState({
            intervalTimes: intervalsOfTime
        })
        
        let yes = document.getElementById('timeslice').value.split(', ');
        document.getElementById("timeData").innerHTML = '';
        // console.log(intervalTimes);
        yes.forEach(function(childSnapshot) {
            var node = document.createElement("p");
            var textnode = document.createTextNode(childSnapshot + " (" + intervalsOfTime + ")");
            node.appendChild(textnode);
            document.getElementById("timeData").appendChild(node);
        });
    }

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
        const { selectCal, calName, locName, timezone, notes, calDeadline, votesPerSlot, votesPerUser, timeslot, intervalTimes } = this.state;
        // console.log(selectCal, calName, locName, timezone, notes, calDeadline, votesPerSlot, votesPerUser, timeslot);
        
        let ref = Firebase.database().ref();
        ref.child(selectCal).update({
            calName: calName,
            locName: locName,
            timezone: timezone,
            notes: notes,
            calDeadline: document.getElementById('calDeadline').value,
            votesPerSlot: votesPerSlot,
            votesPerUser: votesPerUser,
            timeslot: document.getElementById('timeslice').value,
            intervalTimes: intervalTimes,
            timeslotData: ""
        });
        document.getElementById('updateBtn').disabled = true;
    }

    render() {
        const { currentUser, userFromApi, calName, locName, timezone, notes, calDeadline, votesPerSlot, votesPerUser, timeslot, intervalBounds } = this.state;
        return (
            <div>
                <h3>Modify Calendar</h3>
                <label htmlFor="cals">Choose a calendar event:</label>
                <select name="cals" id="cals" onChange={this.change} value={this.state.value}>
                    <option value="" value>--Please select a calendar--</option>
                </select>
                <form id="form" className="d-none" onSubmit={this.onSubmit}>
                    <label>Event (Calendar) Title*:
                        <input type="text" name="calName" value={calName} onChange={this.onChange} required/>
                    </label><br/>
                    <label>Event Location (optional):
                        <input type="text" name="locName" value={locName} onChange={this.onChange}/>
                    </label><br/>
                    <label>Timezone (optional):
                        <input list="timezones" id="timezoneList" name="timezone" value={timezone} onChange={this.onChange} />
                        <datalist id="timezones">
                            <option value="Eastern"></option>
                            <option value="Central"></option>
                            <option value="Mountain"></option>
                            <option value="Pacific"></option>
                            <option value="Alaska"></option>
                            <option value="Hawaii-Aleutian"></option>
                        </datalist>
                    </label><br/>
                    <label>Event Notes (optional):
                        <input type="text" name="notes" value={notes} onChange={this.onChange}/>
                    </label><br/>
                    <label>Calendar Deadline (optional):
                        <DatePicker
                            id="calDeadline"
                            value={calDeadline}
                            format="MM/DD/YYYY hh:mm a"
                            plugins={[
                                <TimePicker hideSeconds />
                            ]}
                        />
                    </label><br/>
                    <label>Votes Per Timeslot (optional):
                        <input type="number" id="votesPerSlot" min="1" max="100000" step="1" placeholder="1" name="votesPerSlot" value={votesPerSlot} onChange={this.onChange}/>
                    </label><br/>
                    <label>Votes Per User (optional):
                        <input type="number" id="votesPerUser" min="1" max="100000" step="1" placeholder="1" name="votesPerUser" value={votesPerUser} onChange={this.onChange}/>
                    </label><br/>
                    <label>Timeslots*:
                        <DatePicker
                            id="timeslice"
                            name="timeslot"
                            value={timeslot}
                            onClose={this.addElem}
                            multiple
                            format="MM/DD/YYYY"
                            sort
                            plugins={[
                                <DatePanel />
                            ]}
                            required
                        />
                    </label><br/>
                    <label>Interval Bounds (optional):
                        <input type="text" name="intervalBounds" value={intervalBounds} onChange={this.onChange} placeholder='11:00,12:15,:15'/>
                        <button id="intervalBtn" className="d-none btn btn-primary" type="button" onClick={ () => this.getIntervals(intervalBounds.split(','))}>
                            Create Interval
                        </button>
                        {/* <input type="text" name="endTime" value={endTime} onChange={this.onChange}/> */}
                    </label><br/>
                    {/* <label>Time Interval (optional):
                        <input type="text" name="timeInterval" value={timeInterval} onChange={this.onChange}/>
                    </label><br/> */}
                    <div id="timeData"/>
                    <button id="updateBtn" className="btn btn-primary" type="submit">
                        Update
                    </button>
                </form>
            </div>
        );
    }
}

export { ModifyPage };