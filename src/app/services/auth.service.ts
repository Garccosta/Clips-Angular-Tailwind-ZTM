import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import IUser from '../models/user.model';
import { delay, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>;

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router
  ) {
    this.usersCollection = this.db.collection('users')
    this.isAuthenticated$ = auth.user.pipe(
      map(user => !!user)
    )
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(
      delay(1000)
    )
  }

  public async createUser({
    name,
    email,
    password,
    age,
    phoneNumber }: IUser): Promise<any> {

    const userCredentials = await this.auth.createUserWithEmailAndPassword(
      email as string,
      password as string
    )

    if (!userCredentials.user) {
      throw new Error('Error creating user')
    }

    await this.usersCollection.doc(userCredentials.user?.uid).set({
      name,
      email,
      age,
      phoneNumber
    })

    await userCredentials.user.updateProfile({
      displayName: name
    })
  }

  public async logout($event?: Event) {
    if ($event) {
      $event.preventDefault();
    }

    await this.auth.signOut();

    await this.router.navigateByUrl('/')
  }
}
