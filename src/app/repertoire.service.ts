import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Repertoire } from './repertoire';
import { AuthService } from './auth.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class RepertoireService {

    constructor(private http: HttpClient) {}

    // CRUD

    list(): Observable<Repertoire[]> {
        return this.http.get<Repertoire[]>(`/api/repertoires/`).map(repertoires => repertoires.map(repertoire => Repertoire.fromObject(repertoire)));
    }

    create(repertoire: Repertoire): Observable<Repertoire> {
        return this.http.post<Repertoire>(`/api/repertoires/`, repertoire.toDB()).map(repertoire => Repertoire.fromObject(repertoire));
    }

    new(): Observable<Repertoire> {
        let repertoire = new Repertoire();
        return this.http.post<Repertoire>(`/api/repertoires/`, repertoire.toDB()).map(repertoire => Repertoire.fromObject(repertoire));
    }

    get(id: string): Observable<Repertoire> {
        return this.http.get<Object>(`/api/repertoires/${id}`).map(repertoire => Repertoire.fromObject(repertoire));
    }

    update(repertoire: Repertoire): Observable<void> {
        return this.http.post<void>(`/api/repertoires/${repertoire._id}`, repertoire.toDB());
    }

    delete(repertoire: Repertoire): Observable<void> {
        return this.http.delete<void>(`/api/repertoires/${repertoire._id}`)
    }

}
