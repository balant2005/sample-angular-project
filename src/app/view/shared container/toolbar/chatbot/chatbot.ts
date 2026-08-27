import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatIconModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css',
})
export class Chatbot {  

  @Output() close = new EventEmitter<void>();

  message = '';

  messages = [
    {
      text: "Hi! I'm Balan, your virtual assistant. How can I help you today?",
      sender: 'bot'
    }
  ];

  sendMessage(): void {

    const text = this.message.trim();

    if (!text) {
      return;
    }

    this.messages.push({ text, sender: 'user' });
    this.message = '';

    this.messages.push({
      text: this.getResponse(text),
      sender: 'bot'
    });

  }


  private getResponse(text: string): string {

    const question = text.toLowerCase();
    const asksAboutPolicyCreation =
      question.includes('policy') &&  
      (question.includes('create') ||
        question.includes('add') ||
        question.includes('new') ||
        question.includes('how'));

    if (asksAboutPolicyCreation) {
      return 'To create a policy, go to the Policy page and click Create Policy. Enter the Policy Name, Source Name, and Variable Name, add the required Actions, then save the policy.';
    }

    const asksAboutUserCreation =
      (question.includes('user') || question.includes('users')) &&
      (question.includes('create') ||
        question.includes('add') ||
        question.includes('new') ||
        question.includes('how'));

    if (asksAboutUserCreation) {
      return 'To create a user, go to the Users page and click + Create User. Enter the Name and Role, choose the Status, then click Save.';
    }

    return 'I am trained to help only with this project. Please ask about features or workflows available in this application.';

  }

}
