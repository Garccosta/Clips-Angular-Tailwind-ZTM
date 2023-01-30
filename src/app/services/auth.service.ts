import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import IUser from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore 
  ) { }

  public async createUser({
    name,
    email, 
    password, 
    age, 
    phoneNumber} : IUser): Promise<any> {

    const userCredentials = this.auth.createUserWithEmailAndPassword(
      email as string,
      password as string
    )

    await this.db.collection('users').add({
      name,
      email,
      age,
      phoneNumber
    })
  }
}
