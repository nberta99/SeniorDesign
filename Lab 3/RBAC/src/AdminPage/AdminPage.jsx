import React from 'react';
import { Link } from 'react-router-dom';
import { userService } from '@/_services';
import { CreatePage, ModifyPage, DeletePage } from '@/AdminPage';

class AdminPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: null,
            viewForm: false, // set back to false
            type: null
        };

        this.onEdit = this.onEdit.bind(this);

        this.calendarState = null; // set back to null
    }

    componentDidMount() {
        userService.getAll().then(users => this.setState({ users }));
    }

    onEdit(option) {
        switch (option) {
            case "Delete":
                this.calendarState = <DeletePage/>; // this.calendarState = <StripeForm/>
                break;
            case "Modify":
                this.calendarState = <ModifyPage/>;
                break;
            default:
                 this.calendarState = <CreatePage/>;
        }
        this.setState({ viewForm: true });
    }

    render() {
        const { users } = this.state;
        return (
            <div>
                <h1>Calendar Admin</h1>
                <div>
                    <p>Calendar - <button className="btn btn-primary" onClick={() => this.onEdit("Create")}>Create</button> | <button className="btn btn-primary" onClick={() => this.onEdit("Modify")}>Modify</button> | <button className="btn btn-primary" onClick={() => this.onEdit("Delete")}>Delete</button></p>
                </div>
                <div>
                    {(this.state.viewForm) ?
                    this.calendarState : ''}
                </div>
                <div>
                    Choose from options to create, modify, or delete a calendar poll
                </div>
                {/* <div>
                    All users from secure (admin only) api end point:
                    {users &&
                        <ul>
                            {users.map(user =>
                                <li key={user.id}>{user.firstName} {user.lastName}</li>
                            )}
                        </ul>
                    }
                </div> */}
            </div>
        );
    }
}

export { AdminPage };