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
            timeslot: ''
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
        this.setState({ [e.target.name]: e.target.value });
    }

    change = (e) => {
        const { calData } = this.state;
        this.setState({ 
            selectCal: e.target.value,
            calName: calData[e.target.value].calName,
            locName: calData[e.target.value].locName,
            timezone: calData[e.target.value].timezone,
            notes: calData[e.target.value].notes,
            calDeadline: calData[e.target.value].calDeadline,
            votesPerSlot: calData[e.target.value].votesPerSlot,
            votesPerUser: calData[e.target.value].votesPerUser,
            timeslot: calData[e.target.value].timeslot.split(", ")
        });
        document.getElementById('updateBtn').disabled = false;
        document.getElementById("timeData").innerHTML = '';
        let yes = calData[e.target.value].timeslot.split(", ");
        yes.forEach(function(childSnapshot) {
            var node = document.createElement("p");
            // node.value = recordId;
            var textnode = document.createTextNode(childSnapshot);
            node.appendChild(textnode);
            document.getElementById("timeData").appendChild(node);
        });

        if (e.target.value == "") {
            document.getElementById('form').setAttribute("class", "d-none");
        } else {
            document.getElementById('form').setAttribute("class", "");
        }
    }

    addElem = () => {
        let yes = document.getElementById('timeslice').value.split(', ');
        document.getElementById("timeData").innerHTML = '';
        // console.log(yes);
        yes.forEach(function(childSnapshot) {
            var node = document.createElement("p");
            var textnode = document.createTextNode(childSnapshot);
            node.appendChild(textnode);
            document.getElementById("timeData").appendChild(node);
        });
    }

    onSubmit = (e) => {
        e.preventDefault();
        const { selectCal, calName, locName, timezone, notes, calDeadline, votesPerSlot, votesPerUser, timeslot } = this.state;
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
            timeslot: document.getElementById('timeslice').value
        });
        document.getElementById('updateBtn').disabled = true;
    }

    render() {
        const { currentUser, userFromApi, calName, locName, timezone, notes, calDeadline, votesPerSlot, votesPerUser, timeslot  } = this.state;
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