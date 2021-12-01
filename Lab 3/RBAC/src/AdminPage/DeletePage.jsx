import React from 'react';

import { userService, authenticationService } from '@/_services';

class DeletePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: authenticationService.currentUserValue,
            userFromApi: null,
            selectCal: ''
        };
    }

    componentDidMount() {
        const { currentUser } = this.state;
        // userService.getById(currentUser.id).then(userFromApi => this.setState({ userFromApi }));
    }

    change = (e) => {
        this.setState({ selectCal: e.target.value });
        if (e.target.value == "") {
            document.getElementById('delete').setAttribute("class", "d-none");
        } else {
            document.getElementById('delete').setAttribute("class", "");
        }
    }

    onSelect = (e) => {
        e.preventDefault();
        const { selectCal } = this.state;
        console.log(selectCal);

        // Delete a selected calendar
        // axios.post('/', { calName })
        //   .then((result) => {
        //     //access the results here....
        //   });
    }

    render() {
        const { currentUser, userFromApi } = this.state;
        return (
            <div>
                <h3>Delete Calendar</h3>
                <label htmlFor="cals">Choose a calendar event:</label>
                <select name="cals" id="cals" onChange={this.change} value={this.state.value}>
                    <option value="" defaultValue>--Please select a calendar--</option>
                    <option value="l1s">Lab 1 Signup</option>
                    <option value="l2s">Lab 2 Signup</option>
                    <option value="oh">Office Hours</option>
                </select>
                <div id="delete" className="d-none">
                    <button className="btn btn-primary" onClick={this.onSelect}>
                        Delete
                    </button>
                </div>
            </div>
        );
    }
}

export { DeletePage };