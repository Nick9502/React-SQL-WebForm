
import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, browserHistory} from 'react-router-dom'
import AddUser from './AddUser';
import Profile from './Profile';
import history from './history';
import Home from './Home';

ReactDOM.render(
	<Router path="/" history={history} >
	<div>
		<Route path="/" component={AddUser}/>
		<Route path="/profile" component={Profile}/>
		<Route path="/adduser" component={AddUser}/>
	</div>
	</Router>,
	document.getElementById('root')
)