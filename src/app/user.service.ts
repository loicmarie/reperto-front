import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import { User } from './user';
import { AuthService } from './auth.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class UserService {

    constructor(private http: HttpClient) {}

    // CRUD

    list(): Observable<User[]> {
        return this.http.get<User[]>(`/api/users/`).map(users => users.map(user => User.fromObject(user)));
    }

    create(user: User): Observable<User> {
        return this.http.post<User>(`/api/users/`, user.toDB()).map(user => User.fromObject(user));
    }

    get(id: string): Observable<User> {
        return this.http.get<Object>(`/api/users/${id}`).map(user => User.fromObject(user));
    }

    update(user: User): Observable<void> {
        console.log('USER UPDT', user);
        return this.http.post<void>(`/api/users/${user._id}`, user.toDB());
    }

    delete(user: User): Observable<void> {
        return this.http.delete<void>(`/api/users/${user._id}`)
    }

    // Utils

    getFromUserId(userId: string): Observable<User> {
        return this.http.get<Object>(`/api/users/uid/${userId}`).map(user => User.fromObject(user));
    }

}
