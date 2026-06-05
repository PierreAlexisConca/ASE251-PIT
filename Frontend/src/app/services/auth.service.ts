import { Injectable } from '@angular/core';
import { AuthUser } from '../models/auth-user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'pit-auth-user';

  private get storage(): Storage | null {
    return typeof globalThis !== 'undefined' && 'localStorage' in globalThis
      ? globalThis.localStorage
      : null;
  }

  getCurrentUser(): AuthUser | null {
    const raw = this.storage?.getItem(this.storageKey) ?? null;
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  }

  setCurrentUser(user: AuthUser): void {
    this.storage?.setItem(this.storageKey, JSON.stringify(user));
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  logout(): void {
    this.storage?.removeItem(this.storageKey);
  }
}