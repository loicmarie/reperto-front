import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { User } from './user';
import { AuthService } from './auth.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class UserService {

    constructor(private http: HttpClient) {}

    // CRUD

    list(): Observable<User[]> {
        return this.http.get<User[]>(`/api/users/`);
    }

    create(user: User): Observable<User> {
        return this.http.post<User>(`/api/users/`, this.toDB(user));
    }

    get(id: string): Observable<User> {
        return this.http.get<User>(`/api/users/${id}`);
    }

    update(user: User): Observable<void> {
        return this.http.post<void>(`/api/users/${user['_id']}`, this.toDB(user));
    }

    delete(user: User): Observable<void> {
        return this.http.delete<void>(`/api/users/${user._id}`)
    }

    // Utils

    toDB(user: User): Object {
        return {
            '_id': user._id,
            'name': user.name,
            'nickname': user.nickname,
            'userId': user.userId,
            'variants': user.variants.map(variant => variant._id)
        };
    }

    getFromUserId(userId: string): Observable<User> {
        return this.http.get<User>(`/api/users/uid/${userId}`);
    }

}
