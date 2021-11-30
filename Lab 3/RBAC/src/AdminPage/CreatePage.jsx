import React from 'react';

// import { Formik, Field, Form, ErrorMessage } from 'formik';
import { userService, authenticationService } from '@/_services';

class CreatePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: authenticationService.currentUserValue,
            userFromApi: null
        };
    }

    componentDidMount() {
        const { currentUser } = this.state;
        // userService.getById(currentUser.id).then(userFromApi => this.setState({ userFromApi }));
    }

    render() {
        const { currentUser, userFromApi } = this.state;
        return (
            <div>
                <h3>Create Calendar</h3>
                <form>
                    <label>Calendar Title:
                        <input type="text" />
                    </label>
                </form>
            </div>
        );
    }
}

export { CreatePage };