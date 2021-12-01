import React from 'react';
import Firebase from 'firebase';
import {app} from '../firebase-config';
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
        this.getUserData();
        // userService.getById(currentUser.id).then(userFromApi => this.setState({ userFromApi }));
    }

    getUserData = () => {
        let ref = Firebase.database().ref("/");
        ref.on('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var childData = childSnapshot.val();
                var recordId = childSnapshot.ref_.path.pieces_[0];
                var node = document.createElement("option");
                node.value = recordId;
                node.id = recordId;
                var textnode = document.createTextNode(childData.calName);
                node.appendChild(textnode);
                document.getElementById("cals").appendChild(node);  
            });
        });
    };

    change = (e) => {
        this.setState({ selectCal: e.target.value });
        document.getElementById('deleteBtn').disabled = false;
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

        let ref = Firebase.database().ref("/");
        ref.child(selectCal).remove();

        document.getElementById(selectCal).remove();
        document.getElementById('deleteBtn').disabled = true;
    }

    render() {
        const { currentUser, userFromApi } = this.state;
        return (
            <div>
                <h3>Delete Calendar</h3>
                <label htmlFor="cals">Choose a calendar event:</label>
                <select name="cals" id="cals" onChange={this.change} value={this.state.value}>
                    <option value="" defaultValue>--Please select a calendar--</option>
                </select>
                <div id="delete" className="d-none">
                    <button id="deleteBtn" className="btn btn-primary" onClick={this.onSelect}>
                        Delete
                    </button>
                </div>
            </div>
        );
    }
}

export { DeletePage };