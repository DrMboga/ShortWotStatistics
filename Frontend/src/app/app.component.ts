import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { NavButtonComponent } from './components/nav-button/nav-button.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbar, NavButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
}
