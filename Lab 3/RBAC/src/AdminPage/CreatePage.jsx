import React from 'react';
import ReactDOM from 'react-dom';
import Firebase from 'firebase';
import {app} from '../firebase-config';
import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import TimePicker from 'react-multi-date-picker/plugins/time_picker';
import { userService, authenticationService } from '@/_services';

class CreatePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: authenticationService.currentUserValue,
            userFromApi: null,
            calName: '',
            locName: '',
            timezone: '',
            notes: '',
            calDeadline: '',
            votesPerSlot: 1,
            votesPerUser: 1,
            timeslot: '',
            intervalBounds: '',
            intervalTimes: ['11:00 am - 11:05 am'],
            emails: [],
            value: "",  
            error: null
        };
    }

    componentDidMount() {
        const { currentUser } = this.state;
        // userService.getById(currentUser.id).then(userFromApi => this.setState({ userFromApi }));
    }

    onChange = (e) => {
        if ((e.target.name == 'intervalBounds') && (e.target.value.split(',').length == 3)) {
            document.getElementById('intervalBtn').setAttribute('class', 'btn btn-primary');
        } else if ((e.target.name == 'intervalBounds') && (e.target.value.split(',').length != 3)) {
            document.getElementById('intervalBtn').setAttribute('class', 'd-none btn btn-primary');
        }
        this.setState({ [e.target.name]: e.target.value });
    }

    // change = (e) => {
    //     let dval = document.getElementById('timeslice').value;
    //     // this.setState({ timeslot: dval });
    //     console.log(this.timeslot);
    // }

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
        // console.log(yes);
        yes.forEach(function(childSnapshot) {
            var node = document.createElement("p");
            var textnode = document.createTextNode(childSnapshot + " (" + intervalTimes + ")");
            node.appendChild(textnode);
            document.getElementById("timeData").appendChild(node);
        });
    }

    onSubmit = (e) => {
        e.preventDefault();
        const { calName, locName, timezone, notes, calDeadline, votesPerSlot, votesPerUser, timeslot, intervalTimes } = this.state;
        // console.log(calName, locName, timezone, notes, calDeadline, votesPerSlot, votesPerUser, timeslot);

        const rootRef = Firebase.database().ref();
        const newStoreRef = rootRef.push();
        newStoreRef.set({
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
        document.getElementById('submitBtn').disabled = true;
    }

    handleKeyDown = evt => {
        if (["Enter", "Tab", ",", "space"].includes(evt.key)) {
          evt.preventDefault();
    
          var value = this.state.value.trim();
    
          if (value && this.isValid(value)) {
            this.setState({
              emails: [...this.state.emails, this.state.value],
              value: ""
            });
          }
        }
    };
    
    handleChange = evt => {
        this.setState({
            value: evt.target.value,
            error: null
        });
    };

    handleDelete = item => {
        this.setState({
            emails: this.state.emails.filter(emails => emails !== item)
        });
    };

    handlePaste = evt => {
        evt.preventDefault();

        var paste = evt.clipboardData.getData("text");
        var emails = paste.match(/[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/g);

        if (emails) {
            var toBeAdded = emails.filter(email => !this.isInList(email));

            this.setState({
                emails: [...this.state.emails, ...toBeAdded]
            });
        }
    };

    isValid(email) {
        let error = null;

        if (this.isInList(email)) {
            error = `${email} has already been added.`;
        }

        if (!this.isEmail(email)) {
            error = `${email} is not a valid email address.`;
        }

        if (error) {
            this.setState({ error });

            return false;
        }

        return true;
    }

    isInList(email) {
        return this.state.emails.includes(email);
    }

    isEmail(email) {
        return /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(email);
    }

    render() {
        const { currentUser, userFromApi, calName, locName, timezone, notes, calDeadline, votesPerSlot, votesPerUser, timeslot, intervalBounds } = this.state;
        return (
            <div>
                <h3>Create Calendar</h3>
                <form onSubmit={this.onSubmit}>
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
                    <div id="timeData"/>
                    
                    <label>Invite users:
                        {this.state.emails.map(item => (
                        <div className="tag-item" key={item}>
                            {item}
                            <button
                            type="button"
                            className="button"
                            onClick={() => this.handleDelete(item)}
                            >
                            &times;
                            </button>
                        </div>
                        ))}

                        <input
                            className={"input " + (this.state.error && " has-error")}
                            value={this.state.value}
                            placeholder="Type/paste email addresses and press `Enter`..."
                            onKeyDown={this.handleKeyDown}
                            onChange={this.handleChange}
                            onPaste={this.handlePaste}
                            style={{width: "350px"}}
                        />

                        {this.state.error && <p className="error">{this.state.error}</p>}
                    </label><br/>

                    <label>* Required fields</label><br/>
                
                    <button id="submitBtn" className="btn btn-primary" type="submit">
                        Publish
                    </button>
                </form>
            </div>
        );
    }
}

export { CreatePage };