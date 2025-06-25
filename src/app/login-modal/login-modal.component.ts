import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';

import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-login-modal',
  imports: [
    Dialog,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    FormsModule,
  ],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.sass'
})
export class LoginModalComponent {

  constructor(
    private readonly apiService: ApiService
  ) { }

  @Input() visible: boolean = false;
  position: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright' = 'top';

  username: string | undefined;
  password: string | undefined;

  showDialog() {
    this.visible = true;
  }

  onSubmit() {
    this.apiService.login(this.username!, this.password!);
  }
}
