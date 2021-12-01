import React from 'react';

import { userService, authenticationService } from '@/_services';

class ModifyPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: authenticationService.currentUserValue,
            userFromApi: null,
            selectCal: '',
            calName: 'Calendar',
            locName: '',
            timezone: '',
            notes: '',
            calDeadline: '',
            votesPerSlot: 1,
            votesPerUser: 1,
            timeslot: '9:00-10:00'
        };
    }

    componentDidMount() {
        const { currentUser } = this.state;
        // userService.getById(currentUser.id).then(userFromApi => this.setState({ userFromApi }));
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    change = (e) => {
        this.setState({ selectCal: e.target.value });
        // console.log(e.target.value);
        if (e.target.value == "") {
            document.getElementById('form').setAttribute("class", "d-none");
        } else {
            document.getElementById('form').setAttribute("class", "");
        }
    }

    onSubmit = (e) => {
        e.preventDefault();
        const { selectCal, calName, locName, timezone, notes, calDeadline, votesPerSlot, votesPerUser, timeslot } = this.state;
        console.log(selectCal, calName, locName, timezone, notes, calDeadline, votesPerSlot, votesPerUser, timeslot);
        
        // Modify the selected calendar
        // axios.post('/', { calName })
        //   .then((result) => {
        //     //access the results here....
        //   });
    }

    render() {
        const { currentUser, userFromApi, calName, locName, timezone, notes, calDeadline, votesPerSlot, votesPerUser, timeslot  } = this.state;
        return (
            <div>
                <h3>Modify Calendar</h3>
                <label htmlFor="cals">Choose a calendar event:</label>
                <select name="cals" id="cals" onChange={this.change} value={this.state.value}>
                    <option value="" value>--Please select a calendar--</option>
                    <option value="l1s">Lab 1 Signup</option>
                    <option value="l2s">Lab 2 Signup</option>
                    <option value="oh">Office Hours</option>
                </select>
                <form id="form" className="d-none" onSubmit={this.onSubmit}>
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
                    <button className="btn btn-primary" type="submit">
                        Update
                    </button>
                </form>
            </div>
        );
    }
}

export { ModifyPage };