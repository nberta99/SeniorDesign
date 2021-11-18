import React from 'react';

import { userService } from '@/_services';

class AdminPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: null
        };
    }

    componentDidMount() {
        userService.getAll().then(users => this.setState({ users }));
    }

    render() {
        const { users } = this.state;
        return (
            <div>
                <h1>Calendar Admin</h1>
                <div>
                    <p>Calendar - Create | Modify | Delete</p>
                </div>
                <div>
                    All users from secure (admin only) api end point:
                    {users &&
                        <ul>
                            {users.map(user =>
                                <li key={user.id}>{user.firstName} {user.lastName}</li>
                            )}
                        </ul>
                    }
                </div>
            </div>
        );
    }
}

export { AdminPage };