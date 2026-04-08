import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private audio: HTMLAudioElement | null = null;

  constructor() {
    // Initialize audio in constructor
    if (typeof window !== 'undefined') {
      this.audio = new window.Audio('assets/notification.mp3');
    }
  }

  async requestPermission(): Promise<boolean> {
    console.log('Checking notification permission...');
    
    if (!('Notification' in window)) {
      console.log('This browser does not support desktop notifications');
      return false;
    }

    console.log('Current notification permission:', Notification.permission);

    if (Notification.permission === 'granted') {
      console.log('Notification permission already granted');
      return true;
    }

    if (Notification.permission !== 'denied') {
      console.log('Requesting notification permission...');
      const permission = await Notification.requestPermission();
      console.log('Permission request result:', permission);
      return permission === 'granted';
    }

    console.log('Notifications are denied by user');
    return false;
  }

  async showNotification(title: string, options: NotificationOptions = {}) {
    console.log('Attempting to show notification:', { title, options });
    
    const hasPermission = await this.requestPermission();
    
    if (!hasPermission) {
      console.log('Notification permission not granted');
      return;
    }

    console.log('Creating notification with title:', title);

    // Play notification sound
    if (this.audio) {
      this.audio.play().catch(error => console.error('Error playing notification sound:', error));
    }

    // Show browser notification
    try {
      const notification = new Notification(title, {
        icon: 'assets/icons/medicine.png',
        ...options
      });
      
      notification.onclick = () => {
        console.log('Notification clicked');
        window.focus();
        notification.close();
      };
      
      notification.onshow = () => {
        console.log('Notification shown successfully');
      };
      
      notification.onerror = (error) => {
        console.error('Error showing notification:', error);
      };

      console.log('Notification created successfully');
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  }

  playSound() {
    if (this.audio) {
      this.audio.play().catch(error => console.error('Error playing notification sound:', error));
    }
  }
}