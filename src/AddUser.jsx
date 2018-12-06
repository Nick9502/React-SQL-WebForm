import React, {Component} from 'react';
import {DropdownButton, MenuItem, Button} from 'react-bootstrap';;
const hrtime = require('browser-process-hrtime')
const cors = require('cors')
const HashFucntions = require('./hashing/HashFunctions')
var request = require('request');

class AddUser extends Component {
	constructor(props){
		super(props);
		this.state = {
			site: '',
			username: '',
			password: '',
			hashFunc: 'None',
			performance:'',
			error: {
				message: ''
			}
		}
	}
	encryptPassword() {
		var start = new Date()
		var hrstart = hrtime()
		const {password,hashFunc,performance} = this.state;
		if (hashFunc === 'MD5'){
			let hashPassword=HashFucntions.md5(password);
			let funcPerformance = HashFucntions.testLocalPerformance(start,hrstart);
			this.setState({password: hashPassword, performance: funcPerformance},()=> {
				console.log('Encrypted Password',hashPassword)
				console.log('Time to run in ms:', funcPerformance)
				this.addUser(hashPassword,funcPerformance);
			})
		}
		else if (hashFunc === 'SHA-512'){
			let hashPassword=HashFucntions.saltHashPassword(password);
			let funcPerformance = HashFucntions.testLocalPerformance(start,hrstart);
			this.setState({password: hashPassword, performance: funcPerformance},()=> {
				console.log('Encrypted Password',hashPassword)
				this.addUser(hashPassword,funcPerformance);
			})
		}
		else if (hashFunc === 'BCrypt'){
			let hashPassword=HashFucntions.bcryptExecute(password,10);
			let funcPerformance = HashFucntions.testLocalPerformance(start,hrstart);
			this.setState({password: hashPassword, performance: funcPerformance},()=>{
				console.log('Encrypted Password',hashPassword)
				this.addUser(hashPassword,funcPerformance);
			})	
		}
	}

	addUser(hashPass,perf) {
		const {site,username,hashFunc,performance} = this.state;
		var options = {
			uri: 'http://localhost:3000/user/signup',
			method: 'POST',
			json: {
				site,
				username,
				password: hashPass,
				hashFunc,
				performance: perf
			}
		  };
		  
		  request(options,cors(), function (error, response, body) {
			if (!error && response.statusCode === 200) {
			  console.log('body.id',body.id) // Print the shortened url.
			}
		  });
	}
	render() {
		return (
			<div className="form-inline" style={{margin: '5%'}}>
				<h2>Sign Up</h2>
				<div className="form-group">
					<input
					className="form-control"
					name="site"
					type="text"
					style={{marginRight: '5px'}}
					placeholder="site"
					onChange={event => this.setState({site: event.target.value})}
					/>
					<input
					className="form-control"
					name="username"
					type="text"
					style={{marginRight: '5px'}}
					placeholder="username"
					onChange={event => this.setState({username: event.target.value})}
					/>
					<input
					className="form-control"
					name="password"
					type="text"
					style={{marginRight: '5px'}}
					placeholder="password"
					onChange={event => this.setState({password: event.target.value})}
					/>
					<DropdownButton
					title={this.state.hashFunc}
					>
					<MenuItem 
					eventKey="1"
					onSelect={event => this.setState({hashFunc: 'None'})}
					>None</MenuItem>
					<MenuItem 
					eventKey="2"
					onSelect={event => this.setState({hashFunc: 'MD5'})}
					>MD5</MenuItem>
					<MenuItem 
					eventKey="3"
					onSelect={event => this.setState({hashFunc: 'SHA-512'})}
					>SHA-512</MenuItem>
					<MenuItem 
					eventKey="4"
					onSelect={event => this.setState({hashFunc: 'BCrypt'})}
					>BCrypt</MenuItem>
					</DropdownButton>
					<button
						className="btn btn-primary"
						type="button"
						onClick={() => this.encryptPassword()}
					>
						Add User
					</button>
				</div>
				<div>{this.state.error.message}</div>
			</div>
		)
	}
}

export default AddUser;