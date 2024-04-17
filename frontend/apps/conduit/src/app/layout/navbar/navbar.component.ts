import { Component, ChangeDetectionStrategy, input } from "@angular/core";
import { RouterModule } from "@angular/router";
import { User } from "@realworld/core/api-types";

@Component({
  selector: "cdt-navbar",
  standalone: true,
  templateUrl: "./navbar.component.html",
  imports: [RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  user = input.required<User>();
  isLoggedIn = input.required<boolean>();
}
