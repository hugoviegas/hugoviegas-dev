# Data Model: Personal Portfolio UI Fixes & Enhancements

## Overview

This document defines the data structures and entities required for the portfolio UI improvements, time-based greetings, and enhanced user experience features.

## Core Entities

### User Preferences

```typescript
interface UserPreferences {
  language: LanguageCode; // 'EN' | 'PT'
  theme: "light" | "dark" | "system";
  timezone?: string; // Optional: for future greeting personalization
}
```

**Fields**:

- `language`: Controls UI language and content localization
- `theme`: Determines color scheme (light/dark/system)
- `timezone`: Optional field for precise time-based greetings

**Relationships**:

- Stored in localStorage via useLanguage hook
- Persisted across browser sessions
- Affects all translated content and theme application

### Time Context

```typescript
interface TimeContext {
  currentHour: number; // 0-23
  currentMinute: number; // 0-59
  timezone: string; // e.g., 'Europe/Dublin'
  greeting: TimeBasedGreeting;
}
```

**Fields**:

- `currentHour`: Hour of day (0-23) for greeting calculation
- `currentMinute`: Minute of hour for precise timing
- `timezone`: User's timezone for accurate time representation
- `greeting`: Calculated greeting based on time of day

### Time-Based Greeting

```typescript
type TimeBasedGreeting = "morning" | "afternoon" | "evening" | "night";

interface GreetingData {
  type: TimeBasedGreeting;
  text: {
    EN: string;
    PT: string;
  };
  emoji: string;
}
```

**Greeting Rules**:

- Morning: 5:00 - 11:59
- Afternoon: 12:00 - 16:59
- Evening: 17:00 - 20:59
- Night: 21:00 - 4:59

### Contact Form Data

```typescript
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  _honeypot: string; // Spam protection
  timestamp: Date;
  userAgent?: string;
}
```

**Validation Rules**:

- `name`: Required, minimum 2 characters
- `email`: Required, valid email format
- `subject`: Required, minimum 5 characters
- `message`: Required, minimum 10 characters
- `_honeypot`: Must be empty (spam detection)

### Translation Entity

```typescript
interface TranslationEntry {
  key: string;
  EN: string;
  PT: string;
  context?: string; // Optional context for translators
  lastUpdated: Date;
}
```

**Categories**:

- UI Labels (buttons, navigation)
- Content (sections, descriptions)
- Time-based greetings
- Error messages
- Accessibility labels

## Component State Models

### HeroSection State

```typescript
interface HeroSectionState {
  displayText: string;
  currentIndex: number;
  greeting: GreetingData;
  isTypingComplete: boolean;
  showResumeDialog: boolean;
}
```

### TopControls State

```typescript
interface TopControlsState {
  isToggling: boolean;
  currentLanguage: LanguageInfo;
}
```

### Navbar State

```typescript
interface NavbarState {
  isMobileMenuOpen: boolean;
  mounted: boolean;
  activeSection: string;
}
```

## Data Flow

### Language Management

```
User Action → useLanguage Hook → localStorage → Component Re-render → Translated Content
```

### Theme Management

```
User Action → ThemeToggle → CSS Variables → Global Theme Application
```

### Time-Based Greeting Flow

```
Page Load → getCurrentTime() → calculateGreeting() → selectTranslation() → Display Greeting
```

### Contact Form Flow

```
User Input → Form Validation → Web3Forms API → Success/Error Handling → User Feedback
```

## Validation Rules

### Form Validation

```typescript
const validationRules = {
  name: {
    required: true,
    minLength: 2,
    pattern: /^[a-zA-Z\s]+$/,
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  subject: {
    required: true,
    minLength: 5,
    maxLength: 100,
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 1000,
  },
};
```

### Time Validation

```typescript
const timeValidation = {
  hour: { min: 0, max: 23 },
  minute: { min: 0, max: 59 },
  timezone: { required: true },
};
```

## Error Handling

### Translation Errors

- Fallback to English if Portuguese translation missing
- Log missing keys for future translation completion
- Graceful degradation for unsupported languages

### Time Calculation Errors

- Default to generic greeting if timezone detection fails
- Fallback to client-side time if server time unavailable
- Handle daylight saving time transitions

### Form Submission Errors

- Network failure: Show retry option
- Validation failure: Highlight specific fields
- Spam detection: Show appropriate message
- API errors: Provide user-friendly error messages

## Performance Considerations

### Data Storage

- Use localStorage for user preferences (language, theme)
- Implement proper error handling for storage failures
- Consider IndexedDB for larger data in future

### State Updates

- Debounce rapid state changes (language toggling)
- Use React.memo for expensive re-renders
- Implement proper cleanup for timers and listeners

### Bundle Size

- Lazy load heavy components (resume dialog, project modals)
- Tree-shake unused translations
- Optimize asset loading (images, fonts)

## Future Extensibility

### Project Data Structure

```typescript
interface Project {
  id: string;
  title: TranslationEntry;
  description: TranslationEntry;
  technologies: string[];
  category: ProjectCategory;
  featured: boolean;
  liveUrl?: string;
  githubUrl?: string;
  metrics?: TranslationEntry;
  images: ProjectImage[];
  dateAdded: Date;
}
```

### Dynamic Content Loading

- Prepare for CMS integration
- Support for dynamic project addition
- Version control for content changes
- A/B testing capabilities for UI variations

This data model provides a solid foundation for the UI improvements while maintaining extensibility for future enhancements.
