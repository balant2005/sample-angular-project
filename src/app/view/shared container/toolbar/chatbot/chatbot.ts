import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  PLATFORM_ID,
  ViewChild,
  inject
} from '@angular/core';
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
export class Chatbot implements OnInit, AfterViewChecked {

  @Output() close = new EventEmitter<void>();

  private readonly platformId = inject(PLATFORM_ID);
  private readonly historyKey = 'project-assistant-chat-history'; 
 
  @ViewChild('chatBody') private chatBody?: ElementRef<HTMLElement>;

  message = '';
  isTyping = false;
  private shouldScrollToBottom = true;

  messages = [
    {
      text: "hi iam balan your virtual assistant. How can I help you today?",
      sender: 'bot'
    }
  ];

  ngOnInit(): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const savedMessages = localStorage.getItem(this.historyKey);

    if (savedMessages) {
      try {
        this.messages = JSON.parse(savedMessages);
      } catch {
        localStorage.removeItem(this.historyKey);
      }
    }

  }

  ngAfterViewChecked(): void {

    if (!this.shouldScrollToBottom || !this.chatBody) {
      return;
    }

    this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
    this.shouldScrollToBottom = false;

  }

  sendMessage(): void {

    const text = this.message.trim();

    if (!text) {
      return;
    }

    this.messages.push({ text, sender: 'user' });
    this.message = '';
    this.saveHistory();
    this.shouldScrollToBottom = true;

    this.messages.push({
      text: this.getResponse(text),
      sender: 'bot'
    });
    this.saveHistory();
    this.shouldScrollToBottom = true;

  }


  newChat(): void {

    this.messages = [
      {
        text: "hi iam balan, your virtual assistant. How can I help you today?",
        sender: 'bot'
      }
    ];
    this.message = '';
    this.isTyping = false;
    this.shouldScrollToBottom = true;
    this.saveHistory();

  }


  private saveHistory(): void {

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.historyKey, JSON.stringify(this.messages));
    }

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
 