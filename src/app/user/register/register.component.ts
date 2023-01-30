import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore 
    ) {}
  inSubmission = false;

  name = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);
  email = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  age = new FormControl('', [
    Validators.required,
    Validators.min(18),
    Validators.max(120),
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$'),
  ]);
  confirm_password = new FormControl('', [
    Validators.required,
  ]);
  phoneNumber = new FormControl('', [
    Validators.required,
    Validators.minLength(14),
    Validators.maxLength(14),  
  ]);

  showAlert = false;
  alertMsg= 'Please wait! Your account is being created.';
  alertColor = 'blue';

  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirm_password: this.confirm_password,
    phoneNumber: this.phoneNumber,
  })

  async register() {
    this.showAlert = true;
    this.alertMsg = 'Please wait! Your account is being created.';
    this.alertColor = 'blue';
    this.inSubmission = true;

    const { email, password } = this.registerForm.value;

    try {
      const userCredentials = this.auth.createUserWithEmailAndPassword(
        email as string,
        password as string
      )

      await this.db.collection('users').add({
        name: this.name.value,
        email: this.email.value,
        age: this.age.value,
        phoneNumber: this.phoneNumber.value,
      })
    } catch(error) {
      this.alertMsg = "Something went wrong. Please try again.";
      this.alertColor = 'red';
      this.inSubmission = false;

      return
    }

    this.alertMsg = 'Sucess! Your account has been created.';
    this.alertColor = 'green';

  }
}
