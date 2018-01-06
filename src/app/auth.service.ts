import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/do';
import { environment as env } from '../environments/environment';
import * as auth0 from 'auth0-js';

import { UserService } from './user.service';
import { User } from './user';

@Injectable()
export class AuthService {

  auth0 = new auth0.WebAuth({
    clientID: env.authClientId,
    domain: env.authDomain,
    responseType: 'token id_token',
    audience: 'https://' + env.authDomain + '/userinfo',
    redirectUri: 'http://' + env.repertoDomain + ':' + env.repertoPort + '/',
    scope: 'openid profile'
  });

  user: User;

  constructor(public router: Router,
      private userService: UserService) {}

  public getProfile(): Observable<User> {
    console.log('getProfile');
    return new Observable<User>(observer => {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        let errStr = 'Access token must exist to fetch profile';
        console.log(errStr);
        return observer.error(new Error(errStr));
      }

      this.auth0.client.userInfo(accessToken, (err, profile) => {
        let anonymous: User = new User(
          '',
          profile.name,
          profile.nickname,
          profile.sub.split('|')[1],
          [],
          []
        );
        console.log('users.getFromUserId');
        return this.userService.getFromUserId(anonymous.userId)
          .subscribe(user => {
            console.log('users.getFromUserId', user);
              if (user != null) {
                  this.user = user;
                  observer.next(this.user);
              } else {
                  this.createUser(user).subscribe(res => observer.next(res));
              }
          }, error => {
            console.error(error);
            console.error('BUT CREATED', anonymous);
            this.createUser(anonymous).subscribe(res => observer.next(res));
          });
      });
    });
  }

  public createUser(anonymous: User) {
    console.log('createUser', anonymous);
    return new Observable<User>(observer => {
      this.userService.create(anonymous)
        .subscribe(user => {
          console.log(user);
          this.user = user;
          observer.next(user);
        }, error => {
          console.error('ARFF', error);
          observer.next(error);
        });
    });
  }

  public login(): void {
    this.auth0.authorize();
  }

  private retrieveAuthentication() {
    return new Observable<User>(observer => {
      this.auth0.parseHash((err, authResult) => {
        console.log(authResult, err)
        if (authResult && authResult.accessToken && authResult.idToken) {
          window.location.hash = '';
          this.setSession(authResult);
          // this.router.navigate(['/']);
        } else if (err) {
          // this.router.navigate(['/']);
          return observer.error(err);
        } else {
          console.log('no auth, no error', this.user);
          // return observer.error(new Error('Session timed out'));
        }
        return observer.next();
      });
    });
  }

  public handleAuthentication(): Observable<User> {
    return new Observable<User>(observer => {
      this.retrieveAuthentication()
        .subscribe(() => {
          this.getProfile()
            .subscribe(user => {
              observer.next(user);
            }, error => {
              // console.error(error);
              observer.next();
            });
        }, error => {
          // console.error(error);
          observer.error(error);
        });
    });
  }

  private setSession(authResult): void {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // Go back to the home route
    this.router.navigate(['/']);

    this.user = undefined;
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

}
