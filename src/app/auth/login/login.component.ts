import {
    afterNextRender,
    Component,
    DestroyRef,
    inject,
    OnInit,
    viewChild,
} from "@angular/core";
import {
    AbstractControl,
    FormControl,
    FormGroup,
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { debounceTime, of, subscribeOn, Subscription } from "rxjs";

function mustContainQuestionMark(control: AbstractControl) {
    if (control.value.includes("?")) {
        return null;
    }

    return { doesNotContainQuestionMark: true };
}

function emailIsUnique(control: AbstractControl){
  if(control.value !== 'rutv1k46@gwu.edu'){
    return of(null)
  }

  return of({notUnique: true})
}

@Component({
    selector: "app-login",
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule],
    templateUrl: "./login.component.html",
    styleUrl: "./login.component.css",
})

// export class LoginComponent {
//     private form = viewChild.required<NgForm>("form");
//     private destroyRef = inject(DestroyRef);

//     constructor() {
//       afterNextRender(() => {
//           const savedForm = window.localStorage.getItem('saved-login-form');

//           if(savedForm){
//             const loadedFormData = JSON.parse(savedForm)
//             const savedEmail = loadedFormData.email

//             setTimeout(() => {
//               this.form().controls['email'].setValue(savedEmail)
//             }, 1)

//           }
//             const subscription = this.form()
//                 .valueChanges?.pipe(debounceTime(500))
//                 .subscribe({
//                     next: (value) =>
//                         window.localStorage.setItem(
//                             "saved-login-form",
//                             JSON.stringify({ email: value.email })
//                         ),
//                 });
//             this.destroyRef.onDestroy(() => subscription?.unsubscribe());
//         });
//     }

//     onSubmit(formData: NgForm) {
//         if (formData.form.invalid) {
//             return;
//         }
//         const enteredEmail = formData.form.value.email;
//         const enteredPassword = formData.form.value.password;

//         console.log(formData.form);
//         console.log(enteredEmail, enteredPassword);
//     }
// }
export class LoginComponent implements OnInit {
  private destroyRef = inject(DestroyRef)
    form = new FormGroup({
        email: new FormControl("", {
            validators: [Validators.email, Validators.required],
            asyncValidators: [emailIsUnique]
        }),
        password: new FormControl("", {
            validators: [
                Validators.required,
                Validators.minLength(6),
                mustContainQuestionMark,
            ],
        }),
    });

    get emailIsInvalid() {
        return (
            this.form.controls.email.touched &&
            this.form.controls.email.dirty &&
            this.form.controls.email.invalid
        );
    }

    get passwordIsInvalid() {
        return (
            this.form.controls.password.touched &&
            this.form.controls.password.dirty &&
            this.form.controls.password.invalid
        );
    }

    ngOnInit(){
      const savedForm = window.localStorage.getItem('saved-login-form')

      if(savedForm){
        const loadedFormData = JSON.parse(savedForm)
        const savedEmail = loadedFormData.email

        this.form.controls.email.setValue(savedEmail)
      }


      const subscription = this.form.valueChanges.pipe(debounceTime(500)).subscribe({
        next: value => {window.localStorage.setItem('saved-login-form', JSON.stringify({email: value.email}))}
      })

      this.destroyRef.onDestroy(() => subscription.unsubscribe())
    }

    onSubmit() {
        // console.log(this.form)

        const eneteredEmail = this.form.value.email;
        const eneteredPassword = this.form.value.password;

        console.log(eneteredEmail, eneteredPassword);
    }
}
