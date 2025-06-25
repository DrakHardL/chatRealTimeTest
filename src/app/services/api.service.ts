import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Message {
    message: string,
    author: {
        name: string
    },
}

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private readonly URL: string = "http://localhost:3000";

    onUpdate = new EventEmitter();

    constructor(
        private readonly http: HttpClient
    ) { }

    sendMessage(message: {message: string, author: string}): Observable<Message> {
        return this.http.post<Message>(`${this.URL}/api/message`, message);
    }
    getMessages(): Observable<Message[]> {
        return this.http.get<Message[]>(`${this.URL}/api/message`)
    }

    login(username: string, password: string) {        
        return this.http.post(`${this.URL}/api/login`, {username: username, password: password});
    }
}
