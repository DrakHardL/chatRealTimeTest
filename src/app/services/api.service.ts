import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Message {
    message: string,
    author: string,
}

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private readonly URL: string = "http://192.168.35.126:3000";

    onUpdate = new EventEmitter();

    constructor(
        private readonly http: HttpClient
    ) { }

    sendMessage(message: Message): Observable<Message> {
        return this.http.post<Message>(`${this.URL}/api/message`, message);
    }
    getMessages(): Observable<Message[]> {
        return this.http.get<Message[]>(`${this.URL}/api/message`)
    }
}
