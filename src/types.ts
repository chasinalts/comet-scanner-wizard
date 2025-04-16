// Common types used throughout the application

// Content metadata type
export interface ContentMetadata {
  id: string;
  type: 'banner' | 'scanner' | 'template' | 'question';
  title: string;
  content: string;
  imageId?: string;
  position?: number;
  scale?: number;
  createdAt: number;
  updatedAt: number;
}

// User type
export interface User {
  username: string;
  email?: string;
  isOwner: boolean;
  displayName?: string;
  photoURL?: string;
}

// Toast notification type
export type ToastType = 'success' | 'error' | 'info' | 'warning';

// Toast notification
export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

// Theme type
export type Theme = 'light' | 'dark';

// Image content type
export interface ImageContent {
  id: string;
  src: string;
  alt: string;
  scale?: number;
  displayText?: string;
}

// Template type
export interface Template {
  id: string;
  title: string;
  code: string;
}

// Question type
export interface Question {
  id: string;
  title: string;
  text: string;
}

// Section type
export interface Section {
  id: string;
  title: string;
  content: string;
  order: number;
}
