import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subscription, take } from 'rxjs';

import { EventSourceService } from './services/event-source.service';
import { ApiService, Message } from './services/api.service';


@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.sass'
})
export class AppComponent {
    private messages: Message[] = [
        { message: "test", author: "front dev" },
    ];

    get messagesVIEW() {
        return this.messages;
    }

    @HostListener('window:focus', [])
    onFocus() {
        this.fetchMesages();
    }

    @ViewChild('author') authorNpt!: ElementRef;
    @ViewChild('message') messageNpt!: ElementRef;

    private eventSubscription?: Subscription;

    constructor(
        private readonly SSeService: EventSourceService,
        private readonly apiService: ApiService,
    ) { }

    ngOnInit() {
        this.fetchMesages();
        const url = 'http://192.168.35.126:3000/api/connect';

        this.eventSubscription = this.SSeService.getServerSentEvent(url).subscribe({
            next: (event) => {
                this.fetchMesages();
            },
            error: (err) => {
                console.error('Erreur SSE:', err);
            }
        });
    }

    private fetchMesages() {
        this.apiService.getMessages().pipe(take(1)).subscribe(rep => {
            this.messages = rep;
        })
    }

    ngOnDestroy(): void {
        this.eventSubscription?.unsubscribe();
    }

    onSubmit() {
        console.log("Test");

        this.apiService.sendMessage({
            author: this.authorNpt.nativeElement.value,
            message: this.messageNpt.nativeElement.value,
        }).subscribe(() => {
            this.fetchMesages();
        });
    }

}
