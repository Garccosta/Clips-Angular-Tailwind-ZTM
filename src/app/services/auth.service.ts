import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import IUser from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore 
  ) { 
    this.usersCollection = this.db.collection('users')
  }

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

    await this.usersCollection.add({
      name,
      email,
      age,
      phoneNumber
    })
  }
}
