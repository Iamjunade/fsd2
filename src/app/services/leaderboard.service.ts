import { Injectable, signal } from '@angular/core';
import { db } from '../firebase';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';
import { User } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
  topPlayers = signal<User[]>([]);
  loading = signal<boolean>(true);

  constructor() {
    this.loadLeaderboard();
  }

  loadLeaderboard() {
    const q = query(
      collection(db, 'users'), 
      orderBy('points', 'desc'), 
      limit(50)
    );

    onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const players: User[] = [];
      snapshot.forEach((doc) => {
        players.push({ uid: doc.id, ...doc.data() } as User);
      });
      this.topPlayers.set(players);
      this.loading.set(false);
    }, (error) => {
      console.error('Error loading leaderboard:', error);
      this.loading.set(false);
    });
  }
}
