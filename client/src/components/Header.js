import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Payments from './Payments';

class Header extends Component {
    renderContent() {
        //we return certain content in the header depending on the users autentication state
        switch (this.props.auth) {
            case null:
                return 'Still deciding';
            case false:
                return <li><a href="/auth/google">Login with Google</a></li>
            //default is the case that controls when user is logged in into our application
            default: 
                return [
                    <li><Payments /></li>,
                    <li><a href="/api/logout">Logout</a></li>
                ];
        }
    }
    render() {
        console.log('this is this.props:', this.props.auth)
        return(
            <nav>
                <div className="nav-wrapper">
                    <Link to={this.props.auth? '/surveys' : '/'}
                        className="left brand-logo"
                    >
                        Emaily
                    </Link>
                        <ul className="right">  
                            {this.renderContent()}
                        </ul>
                </div>
            </nav>
        )
    }
}  
const mapStateToProps = ({ auth }) => {
    return { auth }; 
    //or state.auth .If key and val is same, one value auth is enough
}

//hooking up the header component to the redux store
//so it knows if user is logged. For that, We want to pull out the auth piece of state.
//that tells us if user is logged in. We connect header to the redux store, 
//we define mapStateToProps and we pull out the auth from there.
export default connect(mapStateToProps)(Header); 