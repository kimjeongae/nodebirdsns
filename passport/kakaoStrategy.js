const KakaoStrategy = require('passport-kakao').Strategy;

const { User } = require('../models');

module.exports = (passport) => {
  passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_ID,
    callbackURL: '/auth/kakao/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const exUser = await User.findOne({ where: { snsId: profile.id, provider: 'kakao' } });
      if (exUser) {
        done(null, exUser);
      } else {
        const newUser = await User.create({
          //email: profile._json && profile._json.kaccount_email,
          //nick: profile.displayName,
          email: profile._json && profile._json.kakao_account.email,
          nick: profile._json.kakao_account.profile.nickname,

          snsId: profile.id,
          provider: 'kakao',
        });
        done(null, newUser);
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};
