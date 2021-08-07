import React, { Component } from 'react';
import { connect } from 'react-redux';

class Header extends Component {
    render() {
        console.log('this is this.props:', this.props.auth)
        return(
            <nav>
                <div className="nav-wrapper">
                    <a className="left brand-logo">Emaily</a>
                        <ul className="right">  
                            <li>
                                <a>Login with Google</a>
                            </li>
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