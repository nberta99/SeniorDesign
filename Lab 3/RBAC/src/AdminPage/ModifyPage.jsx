import React from 'react';

import { userService, authenticationService } from '@/_services';

class ModifyPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: authenticationService.currentUserValue,
            userFromApi: null,
            value: ''
        };
    }

    componentDidMount() {
        const { currentUser } = this.state;
        // userService.getById(currentUser.id).then(userFromApi => this.setState({ userFromApi }));
    }

    change = (e) => {
        this.setState({ value: e.target.value });
        if (e.target.value == "") {
            document.getElementById('form').setAttribute("class", "d-none");
        } else {
            document.getElementById('form').setAttribute("class", "");
        }
    }

    onSubmit = (e) => {
        e.preventDefault();
        
        // const { calName, locName, timezone, notes, calDeadline, votesPerSlot, votesPerUser, timeslot } = this.state;
        const { value } = this.state;
        console.log(value);
        // console.log(calName, locName, timezone, notes, calDeadline, votesPerSlot, votesPerUser, timeslot);
        
        // axios.post('/', { calName })
        //   .then((result) => {
        //     //access the results here....
        //   });
    }

    render() {
        const { currentUser, userFromApi } = this.state;
        return (
            <div>
                <h3>Modify Calendar</h3>
                <label for="cals">Choose a calendar event:</label>
                <select name="cals" id="cals" onChange={this.change} value={this.state.value}>
                    <option value="" selected>--Please select a calendar--</option>
                    <option value="l1s">Lab 1 Signup</option>
                    <option value="l2s">Lab 2 Signup</option>
                    <option value="oh">Office Hours</option>
                </select>
                <form id="form" className="d-none" onSubmit={this.onSubmit}>
                    <label>Event (Calendar) Title:
                        <input type="text"/>
                    </label><br/>
                    <label>Event Location:
                        <input type="text"/>
                    </label><br/>
                    <label>Timezone:
                        <input type="text"/>
                    </label><br/>
                    <label>Event Notes:
                        <input type="text"/>
                    </label><br/>
                    <label>Calendar Deadline:
                        <input type="datetime-local" id="birthdaytime" name="birthdaytime"/>
                    </label><br/>
                    <label>Votes Per Timeslot:
                        <input type="number" id="votesPerSlot" name="votesPerSlot" min="1" max="100000" step="1"/>
                    </label><br/>
                    <label>Votes Per User:
                        <input type="number" id="votesPerUser" name="votesPerUser" min="1" max="100000" step="1"/>
                    </label><br/>
                    <label>Timeslots:
                        <input type="text"/>
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