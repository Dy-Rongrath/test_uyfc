// ================================================================================>> Core Library
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// ================================================================================>> Thrid Party Library

// ================================================================================>> Custom Library

@Component({
  selector: 'app-root',
  template: `<router-outlet />`,
  standalone: true,
  imports: [RouterOutlet],
})
export class AppComponent {}
