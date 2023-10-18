const GitHubStrategy = require('passport-github2')
const UserManager = require('../dao/UserManagerMongo')
const userManager = new UserManager()
const settings = require('../commands/commands')
const {generateToken} = require('../utils/jwt')
const CLIENT_ID= settings.client_Id
const CLIENT_SECRET = settings.client_Secret




	const githubstrategy = new GitHubStrategy({
		clientID: CLIENT_ID,
		clientSecret:CLIENT_SECRET,
		callbackURL:'http://localhost:8080/api/sessions/github-callback'
	}, async (accessToken, refreshToken, profile, done) => {

		try {
			let user = await userManager.getUserByUsername(profile.username)
	
			if (!user) {
				let newUser = { first_name: profile.username, last_name: '', email: profile._json.email, age: 18, password: '' }
				let result = await userManager.createUser(newUser)
	
				return done(null, result)
			} else {
				return done(null, user)
			}
	
		} catch (error) {
			return done(error)
		}
	})

module.exports = githubstrategy