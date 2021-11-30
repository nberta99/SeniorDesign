import React from 'react';
import { Router, Route, Link } from 'react-router-dom';

import { history, Role } from '@/_helpers';
import { authenticationService } from '@/_services';
import { PrivateRoute } from '@/_components';
import { HomePage } from '@/HomePage';
import { AdminPage } from '@/AdminPage';
import { LoginPage } from '@/LoginPage';
import { UserPage } from '@/UserPage';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: null,
            isAdmin: false
        };
    }

    componentDidMount() {
        authenticationService.currentUser.subscribe(x => this.setState({
            currentUser: x,
            isAdmin: x && x.role === Role.Admin
        }));
    }

    logout() {
        authenticationService.logout();
        history.push('/login');
    }

    render() {
        const { currentUser, isAdmin } = this.state;
        return (
            <Router history={history}>
                <div>
                    {/* Below code for website navbar */}
                    {currentUser &&
                        <nav className="navbar navbar-expand navbar-dark bg-dark">
                            <div className="navbar-nav">
                                {/* <Link to="/" className="nav-item nav-link">Home</Link> */}
                                {<Link to="/user" className="nav-item nav-link">User</Link>}
                                {isAdmin && <Link to="/admin" className="nav-item nav-link">Admin</Link>}
                                <a onClick={this.logout} className="nav-item nav-link">Logout</a>
                            </div>
                        </nav>
                    }
                    <div className="jumbotron">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-6 offset-md-3">
                                    <PrivateRoute exact path="/" component={HomePage} />
                                    <PrivateRoute exact path="/user" component={UserPage} />
                                    <PrivateRoute path="/admin" roles={[Role.Admin]} component={AdminPage} />
                                    {/* <PrivateRoute path="/create" roles={[Role.Admin]} component={CreatePage} />
                                    <PrivateRoute path="/modify" roles={[Role.Admin]} component={ModifyPage} />
                                    <PrivateRoute path="/delete" roles={[Role.Admin]} component={DeletePage} /> */}
                                    <Route path="/login" component={LoginPage} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Router>
        );
    }
}

export { App }; 