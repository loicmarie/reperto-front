import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Variant } from './variant';
import { Move } from './move';
import { AuthService } from './auth.service';

declare var $: any;

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class VariantService {

    constructor(private http: HttpClient) {}

    // CRUD

    list(): Observable<Variant[]> {
        return this.http.get<Variant[]>(`/api/variants/`);
    }

    create(variant: Variant): Observable<Variant> {
        return this.http.post<Variant>(`/api/variants/`, variant);
    }

    get(id: string): Observable<Variant> {
        return this.http.get<Variant>(`/api/variants/${id}`);
    }

    update(variant: Variant): Observable<void> {
        return this.http.post<void>(`/api/variants/${variant._id}`, variant);
    }

    delete(variant: Variant): Observable<void> {
        return this.http.delete<void>(`/api/variants/${variant._id}`);
    }

    // Utils

    new(): Observable<Variant> {
        return this.http.post<Variant>(`/api/variants/`, new Variant());
    }

    moveObjectToInstance(move: Object): Move {
      return new Move(
        move['from'],
        move['to'],
        move['comment'],
        move['promotion'],
        move['previousFEN'],
        move['nextFEN']
      );
    }

}
