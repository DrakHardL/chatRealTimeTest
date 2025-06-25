import { Component, ElementRef, HostListener, signal, ViewChild, WritableSignal } from '@angular/core';
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

import { LoginModalComponent } from "./login-modal/login-modal.component";
import { EventSourceService } from './services/event-source.service';
import { ApiService, Message } from './services/api.service';


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
    InputNumberModule,
    LoginModalComponent
],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    currentMessage: string | undefined;
    messages: WritableSignal<Message[]> = signal([]);

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
        const url = 'http://localhost:3000/api/connect';

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
            console.log(this.messages());
            const transformedMessages = rep.map(msg => ({
                ...msg,
                author: Array.isArray(msg.author) && msg.author.length === 1 ? msg.author[0] : msg.author
            }));
            this.messages.set(transformedMessages);
            console.log(this.messages());
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
