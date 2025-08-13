const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs');
const User = require('./model/user');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile?.emails?.[0]?.value;
                const fullName = profile?.displayName || `${profile?.name?.givenName || ''} ${profile?.name?.familyName || ''}`.trim() || 'Google User';
                const photo = profile?.photos?.[0]?.value || '';

                if (!email) {
                    return done(new Error('No email returned from Google'));
                }

                let user = await User.findOne({ email });
                if (user) {
                    return done(null, user);
                }

                const salt = await bcrypt.genSalt(10);
                const randomPasswordHash = await bcrypt.hash(Math.random().toString(36).slice(-12), salt);

                user = new User({
                    fullName,
                    email,
                    password: randomPasswordHash,
                    image: photo,
                });
                await user.save();

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

module.exports = passport;
