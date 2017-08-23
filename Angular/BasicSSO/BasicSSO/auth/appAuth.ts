var express = require("express");
var passport = require("passport");
import https = require('https');
import { TokenCacheService } from '../services/tokenCacheService';
import { Constants } from '../constants';

var tokenCache = new TokenCacheService();

export class appAuth {
    private app: any = null;

    //AAD authentication strategy
    private OIDCStrategy = require('../node_modules/passport-azure-ad/lib/index').OIDCStrategy;

    constructor(app: any) {
        this.app = app;

        passport.serializeUser(function (user, done) {
            done(null, user);
        });

        passport.deserializeUser(function (user, done) {
            done(null, user);
        });

        passport.use('O365', this.constructOIDCStrategy());
    }

    constructOIDCStrategy() {
        return new this.OIDCStrategy({
            identityMetadata: Constants.IdentityMetadata,
            clientID: Constants.ClientId,
            responseType: 'code',
            responseMode: 'form_post',
            redirectUrl: this.app.get('env') === 'development'
                ? 'https://localhost:44380/auth/openid/return'
                : 'https://' + Constants.Host + '/auth/openid/return',
            allowHttpForRedirectUrl: true,
            clientSecret: Constants.ClientSecret,
            validateIssuer: false,
            isB2C: false,
            passReqToCallback: true,
            loggingLevel: 'info',
            nonceLifetime: null,
        }, function (req, iss, sub, profile, jwtClaims, access_token, refresh_token, params, done) {
            if (!profile.oid) {
                return done(new Error("No oid found"), null);
            }
            profile.tid = profile._json.tid;
            profile.authType = 'O365';
            req.res.cookie('authType', 'O365');

            var tokenCacheService = new TokenCacheService();
            tokenCacheService.createOrUpdate(profile.oid, Constants.AADGraphResource, {
                refreshToken: refresh_token,
                accessToken: access_token,
                expiresOn: new Date(parseInt(params.expires_on) * 1000)
            }).then(item => {
                done(null, profile);
            });
        });
    }


    ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        else if (req.baseUrl.startsWith("/api/")) {
            res.send(401, 'missing authorization header');
        }
        res.redirect('/');
    }

    public initPassport(app: any) {
        app.use(passport.initialize());
        app.use(passport.session());
    }

    public initAuthRoute(app: any) {

        app.get('/auth/login/o365', function (req, res, next) {
            var email = '';
            passport.authenticate('O365', {
                resourceURL: Constants.AADGraphResource,
                customState: 'my_state',
                failureRedirect: '/',
                login_hint: email
            })(req, res, next);
        });

        app.get('/auth/openid/return', passport.authenticate('O365', { failureRedirect: '/' }), function (req, res) {
            res.redirect('/');
        });

        app.post('/auth/openid/return', passport.authenticate('O365', { failureRedirect: '/' }), function (req, res) {
            res.redirect('/');
        });

        app.get('/logout', function (req, res) {
            let authType = req.cookies['authType'];
            res.clearCookie('authType');
            req.logOut();
            req.session = null;
            if (authType == 'O365')
                res.redirect(Constants.Authority + 'oauth2/logout?post_logout_redirect_uri=' + req.protocol + '://' + req.get('host'));
            else
                res.redirect('/');
        });
    }
}