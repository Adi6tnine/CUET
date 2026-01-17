# 📦 JSONBin Setup Guide for AVION

## 🎯 What is JSONBin?

JSONBin.io is a cloud storage service that allows AVION to store and share data across users. It enables:
- **Global leaderboards** across all users
- **Shared progress tracking** and statistics
- **Cross-device synchronization** of user data
- **Community features** like achievements and rankings

## 🚀 Quick Setup (5 minutes)

### Step 1: Create JSONBin Account
1. Go to [jsonbin.io](https://jsonbin.io/)
2. Click "Sign Up" (free account gives 100 API calls/month)
3. Verify your email address
4. Log in to your dashboard

### Step 2: Create API Key
1. In JSONBin dashboard, go to "API Keys" section
2. Click "Create API Key"
3. Give it a name like "AVION-Production"
4. Copy the API key (starts with `$2a$10$...`)

### Step 3: Create Storage Bin
1. Go to "Bins" section in dashboard
2. Click "Create Bin"
3. Name it "AVION-SharedData"
4. Set privacy to "Private"
5. Copy the Bin ID (format: `xxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

### Step 4: Initialize Bin with Data Structure
1. In the bin editor, paste the JSON structure below
2. Click "Save"

## 📋 Initial JSON Structure for Your Bin

Copy and paste this exact structure into your JSONBin:

```json
{
  "metadata": {
    "appName": "AVION",
    "version": "2.0.0",
    "createdAt": "2026-01-17T00:00:00.000Z",
    "lastUpdated": "2026-01-17T00:00:00.000Z",
    "totalUsers": 0,
    "totalQuizzes": 0,
    "description": "AVION - Intelligent CUET Preparation Platform"
  },
  "globalStats": {
    "totalQuestions": 0,
    "totalCorrectAnswers": 0,
    "totalQuizzes": 0,
    "averageAccuracy": 0,
    "topPerformers": [],
    "subjectStats": {
      "Physics": {
        "totalQuizzes": 0,
        "totalQuestions": 0,
        "totalCorrectAnswers": 0,
        "averageAccuracy": 0
      },
      "Chemistry": {
        "totalQuizzes": 0,
        "totalQuestions": 0,
        "totalCorrectAnswers": 0,
        "averageAccuracy": 0
      },
      "Mathematics": {
        "totalQuizzes": 0,
        "totalQuestions": 0,
        "totalCorrectAnswers": 0,
        "averageAccuracy": 0
      },
      "English": {
        "totalQuizzes": 0,
        "totalQuestions": 0,
        "totalCorrectAnswers": 0,
        "averageAccuracy": 0
      },
      "General Test": {
        "totalQuizzes": 0,
        "totalQuestions": 0,
        "totalCorrectAnswers": 0,
        "averageAccuracy": 0
      }
    },
    "dailyStats": {}
  },
  "users": {},
  "leaderboard": [],
  "achievements": [
    {
      "id": "first_quiz",
      "name": "Getting Started",
      "description": "Complete your first quiz",
      "icon": "🎯",
      "requirement": "totalQuizzes >= 1"
    },
    {
      "id": "accuracy_master",
      "name": "Accuracy Master",
      "description": "Achieve 90% accuracy in a quiz",
      "icon": "🎯",
      "requirement": "accuracy >= 90"
    },
    {
      "id": "quiz_marathon",
      "name": "Quiz Marathon",
      "description": "Complete 50 quizzes",
      "icon": "🏃‍♂️",
      "requirement": "totalQuizzes >= 50"
    },
    {
      "id": "subject_expert",
      "name": "Subject Expert",
      "description": "Score 95% in any subject",
      "icon": "🧠",
      "requirement": "subjectAccuracy >= 95"
    },
    {
      "id": "daily_streak",
      "name": "Daily Streak",
      "description": "Practice for 7 consecutive days",
      "icon": "🔥",
      "requirement": "dailyStreak >= 7"
    }
  ],
  "sharedQuestionBanks": {
    "community_contributed": {
      "name": "Community Questions",
      "description": "Questions contributed by AVION users",
      "questions": [],
      "contributors": []
    },
    "expert_verified": {
      "name": "Expert Verified",
      "description": "Questions verified by CUET experts",
      "questions": [],
      "verifiers": []
    }
  }
}
```

## 🔧 Environment Variables Setup

Add these to your deployment platform (Vercel/Netlify):

```bash
VITE_JSONBIN_API_KEY=your_api_key_here
VITE_JSONBIN_BIN_ID=your_bin_id_here
```

### For Vercel:
1. Go to your project dashboard
2. Click "Settings" → "Environment Variables"
3. Add the variables above

### For Netlify:
1. Go to your site dashboard
2. Click "Site settings" → "Environment variables"
3. Add the variables above

### For Local Development:
Create a `.env` file in your project root:
```bash
VITE_JSONBIN_API_KEY=your_api_key_here
VITE_JSONBIN_BIN_ID=your_bin_id_here
```

## 📊 What Data Gets Stored

### User Data Structure
When users take quizzes, this data is automatically stored:

```json
{
  "users": {
    "user_abc123_1642377600000": {
      "userId": "user_abc123_1642377600000",
      "name": "Anonymous User",
      "createdAt": "2026-01-17T10:00:00.000Z",
      "lastActive": "2026-01-17T10:30:00.000Z",
      "totalQuizzes": 5,
      "totalQuestions": 75,
      "totalCorrectAnswers": 60,
      "totalXP": 300,
      "averageAccuracy": 80,
      "studyTracker": {
        "dailyGoal": 15,
        "currentStreak": 3,
        "longestStreak": 7,
        "totalStudyTime": 1800,
        "lastStudyDate": "2026-01-17"
      },
      "quizHistory": [
        {
          "subject": "Physics",
          "chapter": "Electrostatics",
          "score": 45,
          "totalQuestions": 15,
          "correctAnswers": 12,
          "accuracy": 80,
          "timeTaken": 900,
          "timestamp": "2026-01-17T10:00:00.000Z"
        }
      ]
    }
  }
}
```

### Global Statistics
Automatically calculated and updated:

```json
{
  "globalStats": {
    "totalQuestions": 1250,
    "totalCorrectAnswers": 1000,
    "totalQuizzes": 85,
    "averageAccuracy": 80,
    "subjectStats": {
      "Physics": {
        "totalQuizzes": 25,
        "totalQuestions": 375,
        "totalCorrectAnswers": 300,
        "averageAccuracy": 80
      }
    },
    "dailyStats": {
      "2026-01-17": {
        "quizzes": 12,
        "questions": 180,
        "correctAnswers": 144,
        "uniqueUsers": ["user_abc123", "user_def456"]
      }
    }
  }
}
```

### Leaderboard
Top 100 users automatically ranked:

```json
{
  "leaderboard": [
    {
      "rank": 1,
      "userId": "user_abc123_1642377600000",
      "name": "Anonymous User",
      "totalXP": 1250,
      "averageAccuracy": 92,
      "totalQuizzes": 45,
      "lastActive": "2026-01-17T10:30:00.000Z"
    }
  ]
}
```

## 🔒 Privacy & Security

### What's Stored:
- ✅ Quiz scores and statistics
- ✅ Study progress and streaks
- ✅ Anonymous user IDs
- ✅ Performance metrics

### What's NOT Stored:
- ❌ Personal information (names, emails)
- ❌ Device information
- ❌ Location data
- ❌ Browsing history

### Security Features:
- 🔐 Private bins (only your app can access)
- 🔑 API key authentication
- 🚫 No personal data collection
- 🔄 Local fallback if cloud unavailable

## 📈 Benefits of Using JSONBin

### For Users:
- **Global Leaderboards**: See how you rank against other CUET aspirants
- **Cross-Device Sync**: Continue your progress on any device
- **Community Features**: Shared achievements and milestones
- **Performance Insights**: Compare your progress with global averages

### For You (Developer):
- **User Engagement**: Leaderboards increase motivation
- **Analytics**: Understand how users interact with your app
- **Community Building**: Shared progress creates user community
- **Data Insights**: See which subjects/chapters need improvement

## 🚀 Testing Your Setup

After setting up JSONBin:

1. **Deploy your app** with the environment variables
2. **Take a quiz** to generate some data
3. **Check your JSONBin** - you should see user data appear
4. **View leaderboard** in the app - you should see your score

## 💡 Optional: Advanced Features

### Custom Question Banks
Users can contribute questions that get stored in `sharedQuestionBanks`:

```json
{
  "sharedQuestionBanks": {
    "community_contributed": {
      "questions": [
        {
          "id": "community_001",
          "subject": "Physics",
          "chapter": "Electrostatics",
          "question": "What is Coulomb's law?",
          "options": ["F = kq₁q₂/r²", "F = ma", "F = mg", "F = qE"],
          "correctAnswer": 0,
          "contributor": "user_abc123",
          "verified": false
        }
      ]
    }
  }
}
```

### Achievement System
Automatically tracks and awards achievements:

```json
{
  "achievements": [
    {
      "id": "first_quiz",
      "name": "Getting Started",
      "description": "Complete your first quiz",
      "icon": "🎯",
      "requirement": "totalQuizzes >= 1"
    }
  ]
}
```

## 🆘 Troubleshooting

### Common Issues:

1. **"Cloud sync disabled"** message:
   - Check environment variables are set correctly
   - Verify API key and Bin ID are valid

2. **Data not syncing**:
   - Check JSONBin dashboard for API usage
   - Verify bin privacy settings (should be Private)

3. **Leaderboard empty**:
   - Take a few quizzes to populate data
   - Check browser console for errors

### Support:
- JSONBin Documentation: [docs.jsonbin.io](https://docs.jsonbin.io)
- Free tier: 100 API calls/month
- Paid tier: Unlimited calls from $5/month

## ✅ Setup Complete!

Once you've:
1. ✅ Created JSONBin account
2. ✅ Generated API key
3. ✅ Created bin with initial data
4. ✅ Set environment variables
5. ✅ Deployed your app

Your AVION app will have:
- 🏆 Global leaderboards
- 📊 Shared statistics
- 🔄 Cross-device sync
- 🎯 Community features

**Your users will love the competitive and social aspects this adds to their CUET preparation!**