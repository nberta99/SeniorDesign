import React from 'react';
import ReactDOM from 'react-dom';
import Firebase from 'firebase';
import {app} from '../firebase-config';
import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import { userService, authenticationService } from '@/_services';
import TimePicker from 'react-multi-date-picker/plugins/time_picker';

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
        this.setState({ [e.target.name]: e.target.value });
    }

    // change = (e) => {
    //     let dval = document.getElementById('timeslice').value;
    //     // this.setState({ timeslot: dval });
    //     console.log(this.timeslot);
    // }

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
        const { calName, locName, timezone, notes, calDeadline, votesPerSlot, votesPerUser, timeslot } = this.state;
        // console.log(calName, locName, timezone, notes, calDeadline, votesPerSlot, votesPerUser, timeslot);

        const rootRef = Firebase.database().ref();
        // const storesRef = rootRef.child(`${new Date().valueOf()}`);
        const newStoreRef = rootRef.push();
        newStoreRef.set({
            calName: calName,
            locName: locName,
            timezone: timezone,
            notes: notes,
            calDeadline: document.getElementById('calDeadline').value,
            votesPerSlot: votesPerSlot,
            votesPerUser: votesPerUser,
            timeslot: document.getElementById('timeslice').value
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
        const { currentUser, userFromApi, calName, locName, timezone, notes, calDeadline, votesPerSlot, votesPerUser, timeslot } = this.state;
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
                            // onChange={this.onChange}
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