import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class EventSourceService {
    constructor(private readonly zone: NgZone) { }

    getServerSentEvent(url: string): Observable<MessageEvent> {
        return new Observable(observer => {
            const eventSource = new EventSource(url);

            eventSource.onmessage = event => {
                console.log("on message ?");

                // Angular zone pour déclencher le changement de détection
                observer.next(event);
            };

            eventSource.onerror = error => {
                console.log("on erreur");
                
                this.zone.run(() => {
                    observer.error(error);
                });
                eventSource.close(); // Optionnel : fermer si erreur
            };

            return () => {
                eventSource.close();
            };
        });
    }
}