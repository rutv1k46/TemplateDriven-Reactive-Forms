import { Component } from "@angular/core";
import {
    AbstractControl,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { of } from "rxjs";

function mustContainQuestionMark(control: AbstractControl) {
    if (control.value.includes("?")) {
        return null;
    }

    return { doesNotContainQuestionMark: true };
}

function emailIsUnique(control: AbstractControl) {
    if (control.value !== "rutv1k46@gwu.edu") {
        return of(null);
    }

    return of({ notUnique: true });
}

@Component({
    selector: "app-signup",
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: "./signup.component.html",
    styleUrl: "./signup.component.css",
})
export class SignupComponent {
    form = new FormGroup({
        email: new FormControl("", {
            validators: [Validators.email, Validators.required],
            asyncValidators: [emailIsUnique],
        }),
        password: new FormControl("", {
            validators: [
                Validators.required,
                Validators.minLength(6),
                // mustContainQuestionMark,
            ],
        }),
    });

    onSubmit() {
        console.log(this.form);
    }

    onReset(){
      this.form.reset()
    }
}
