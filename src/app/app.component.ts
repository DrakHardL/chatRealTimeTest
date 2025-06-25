import { Component, ElementRef, HostListener, signal, ViewChild } from '@angular/core';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { RouterOutlet } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { Subscription, take } from 'rxjs';
import { CardModule } from 'primeng/card';

import { EventSourceService } from './services/event-source.service';
import { ApiService } from './services/api.service';


@Component({
    selector: 'app-root',
    imports: [
        CardModule,
        RouterOutlet,
        ButtonModule,
        TextareaModule,
        FormsModule,
        InputGroupModule,
        InputGroupAddonModule,
        InputTextModule,
        SelectModule,
        InputNumberModule
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    currentMessage: string | undefined;
    messages = signal([
        { message: "test", author: "front dev" },
    ]);

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
                console.log("====--====");

                console.log("Event");

                this.fetchMesages();
            },
            error: (err) => {
                console.error('Erreur SSE:', err);
            }
        });
    }

    private fetchMesages() {
        this.apiService.getMessages().pipe(take(1)).subscribe(rep => {
            console.log(this.messages);
            this.messages.set(rep);
            console.log(this.messages);
        })
    }

    ngOnDestroy(): void {
        this.eventSubscription?.unsubscribe();
    }

    onSubmit() {
        this.apiService.sendMessage({
            author: '685bf7c4bf87b398dbfb1be9',
            message: this.currentMessage!,
        }).subscribe(() => {
            this.fetchMesages();

            this.currentMessage = undefined;
        });

    }

}
