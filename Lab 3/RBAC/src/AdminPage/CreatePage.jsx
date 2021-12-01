import React from 'react';
import Firebase from 'firebase';
import {app} from '../firebase-config';
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
            timeslot: ''
        };
    }

    componentDidMount() {
        const { currentUser } = this.state;
        // userService.getById(currentUser.id).then(userFromApi => this.setState({ userFromApi }));
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
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
            calDeadline: calDeadline,
            votesPerSlot: votesPerSlot,
            votesPerUser: votesPerUser,
            timeslot: timeslot
        });
        document.getElementById('submitBtn').disabled = true;
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
                        <input type="text" name="timezone" value={timezone} onChange={this.onChange}/>
                    </label><br/>
                    <label>Event Notes (optional):
                        <input type="text" name="notes" value={notes} onChange={this.onChange}/>
                    </label><br/>
                    <label>Calendar Deadline (optional):
                        <input type="datetime-local" id="calDeadline" name="calDeadline" value={calDeadline} onChange={this.onChange}/>
                    </label><br/>
                    <label>Votes Per Timeslot (optional):
                        <input type="number" id="votesPerSlot" min="1" max="100000" step="1" placeholder="1" name="votesPerSlot" value={votesPerSlot} onChange={this.onChange}/>
                    </label><br/>
                    <label>Votes Per User (optional):
                        <input type="number" id="votesPerUser" min="1" max="100000" step="1" placeholder="1" name="votesPerUser" value={votesPerUser} onChange={this.onChange}/>
                    </label><br/>
                    <label>Timeslots*:
                        <input type="text" name="timeslot" value={timeslot} onChange={this.onChange} required/>
                    </label><br/>
                    <button id="submitBtn" className="btn btn-primary" type="submit">
                        Submit
                    </button>
                </form>
            </div>
        );
    }
}

export { CreatePage };