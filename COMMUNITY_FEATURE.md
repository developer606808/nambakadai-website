# Community Feature Implementation

This document outlines the implementation of the community feature for the Nambakadai website, including database schema changes, API routes, and frontend components.

## Database Schema Changes

### New Tables Added

1. **Community**
   - `id`: SERIAL PRIMARY KEY
   - `name`: TEXT NOT NULL
   - `description`: TEXT NOT NULL
   - `image`: TEXT
   - `category`: TEXT NOT NULL
   - `privacy`: CommunityPrivacy ENUM (PUBLIC, PRIVATE) DEFAULT 'PUBLIC'
   - `location`: TEXT
   - `rules`: TEXT
   - `memberCount`: INTEGER DEFAULT 0
   - `postCount`: INTEGER DEFAULT 0
   - `isVerified`: BOOLEAN DEFAULT false
   - `isBlocked`: BOOLEAN DEFAULT false
   - `createdAt`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   - `updatedAt`: TIMESTAMP NOT NULL

2. **CommunityMember**
   - `id`: SERIAL PRIMARY KEY
   - `userId`: TEXT NOT NULL (REFERENCES User(id))
   - `communityId`: INTEGER NOT NULL (REFERENCES Community(id))
   - `role`: MemberRole ENUM (ADMIN, MODERATOR, MEMBER) DEFAULT 'MEMBER'
   - `isApproved`: BOOLEAN DEFAULT true
   - `joinedAt`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   - `createdAt`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   - `updatedAt`: TIMESTAMP NOT NULL
   - UNIQUE constraint on (userId, communityId)

3. **CommunityPost**
   - `id`: SERIAL PRIMARY KEY
   - `content`: TEXT NOT NULL
   - `type`: CommunityPostType ENUM (TEXT, IMAGE, VIDEO) DEFAULT 'TEXT'
   - `mediaUrl`: TEXT
   - `userId`: TEXT NOT NULL (REFERENCES User(id))
   - `communityId`: INTEGER NOT NULL (REFERENCES Community(id))
   - `likeCount`: INTEGER DEFAULT 0
   - `commentCount`: INTEGER DEFAULT 0
   - `isPinned`: BOOLEAN DEFAULT false
   - `createdAt`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   - `updatedAt`: TIMESTAMP NOT NULL

4. **CommunityComment**
   - `id`: SERIAL PRIMARY KEY
   - `content`: TEXT NOT NULL
   - `userId`: TEXT NOT NULL (REFERENCES User(id))
   - `postId`: INTEGER NOT NULL (REFERENCES CommunityPost(id))
   - `parentId`: INTEGER (REFERENCES CommunityComment(id) - self-referencing for replies)
   - `likeCount`: INTEGER DEFAULT 0
   - `createdAt`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   - `updatedAt`: TIMESTAMP NOT NULL

5. **CommunityLike**
   - `id`: SERIAL PRIMARY KEY
   - `userId`: TEXT NOT NULL (REFERENCES User(id))
   - `postId`: INTEGER (REFERENCES CommunityPost(id))
   - `commentId`: INTEGER (REFERENCES CommunityComment(id))
   - `createdAt`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   - UNIQUE constraint on (userId, postId, commentId)

6. **CommunityBookmark**
   - `id`: SERIAL PRIMARY KEY
   - `userId`: TEXT NOT NULL (REFERENCES User(id))
   - `postId`: INTEGER NOT NULL (REFERENCES CommunityPost(id))
   - `createdAt`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   - UNIQUE constraint on (userId, postId)

7. **CommunityFollower**
   - `id`: SERIAL PRIMARY KEY
   - `userId`: TEXT NOT NULL (REFERENCES User(id))
   - `communityId`: INTEGER NOT NULL (REFERENCES Community(id))
   - `isNotified`: BOOLEAN DEFAULT true
   - `createdAt`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   - UNIQUE constraint on (userId, communityId)

8. **CommunityReport**
   - `id`: SERIAL PRIMARY KEY
   - `reason`: TEXT NOT NULL
   - `description`: TEXT
   - `reporterId`: TEXT NOT NULL (REFERENCES User(id))
   - `communityId`: INTEGER (REFERENCES Community(id))
   - `userId`: TEXT (REFERENCES User(id))
   - `resolved`: BOOLEAN DEFAULT false
   - `createdAt`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   - `updatedAt`: TIMESTAMP NOT NULL

### Enums Added

1. **CommunityPrivacy**: PUBLIC, PRIVATE
2. **MemberRole**: ADMIN, MODERATOR, MEMBER
3. **CommunityPostType**: TEXT, IMAGE, VIDEO

## API Routes

### Community Routes

1. **GET /api/community/search**
   - Search communities with pagination
   - Query parameters: q (search term), category, location, page, limit

2. **GET /api/community/[id]**
   - Get a specific community with member and post counts

3. **POST /api/community**
   - Create a new community
   - Body: name, description, image, category, privacy, location, rules

4. **PUT /api/community/[id]**
   - Update a community
   - Body: name, description, image, category, privacy, location, rules

5. **DELETE /api/community/[id]**
   - Delete a community

### Community Member Routes

1. **GET /api/community/[id]/members**
   - Get community members with pagination
   - Query parameters: page, limit

2. **POST /api/community/[id]/members**
   - Join a community
   - Body: userId

3. **DELETE /api/community/[id]/members**
   - Leave a community
   - Body: userId

### Community Post Routes

1. **GET /api/community/[id]/posts**
   - Get community posts with pagination
   - Query parameters: page, limit

2. **POST /api/community/[id]/posts**
   - Create a new post
   - Body: content, type, mediaUrl, userId

3. **GET /api/community/[id]/posts/[postId]**
   - Get a specific post

4. **PUT /api/community/[id]/posts/[postId]**
   - Update a post
   - Body: content, type, mediaUrl

5. **DELETE /api/community/[id]/posts/[postId]**
   - Delete a post

### Community Comment Routes

1. **GET /api/community/[id]/posts/[postId]/comments**
   - Get post comments with pagination
   - Query parameters: page, limit

2. **POST /api/community/[id]/posts/[postId]/comments**
   - Add a comment
   - Body: content, userId, parentId (for replies)

### Like Routes

1. **POST /api/community/[id]/posts/[postId]/like**
   - Like/unlike a post
   - Body: userId

2. **POST /api/community/[id]/posts/[postId]/comments/[commentId]/like**
   - Like/unlike a comment
   - Body: userId

## Frontend Components

### Pages

1. **Community Listing Page** (`/community`)
   - Displays all communities in a responsive grid
   - Includes search and filtering capabilities
   - Shows community statistics and engagement metrics

2. **Community Creation Page** (`/community/create`)
   - Form for creating new communities
   - Includes fields for name, description, category, privacy settings, etc.

3. **Community Detail Page** (`/community/[id]`)
   - Displays detailed information about a specific community
   - Shows posts, members, and allows interaction

### Components

1. **Community Card**
   - Displays community information in a card format
   - Shows name, description, image, member count, post count, etc.

2. **Post Card**
   - Displays community posts with content, media, likes, comments

3. **Comment Section**
   - Allows users to view and add comments to posts
   - Supports nested replies

## Responsive Design

All components and pages have been designed with responsive design principles:
- Mobile-first approach
- Flexible grid layouts that adapt to different screen sizes
- Touch-friendly controls and interactions
- Optimized spacing and typography for various devices

## Future Enhancements

1. Real-time updates using WebSockets
2. Notification system for community activities
3. Advanced moderation tools
4. Community analytics dashboard
5. Integration with existing user authentication system
6. Media upload and management
7. Rich text editing for posts
8. Community events and calendar features

## Testing

The implementation includes:
- Unit tests for API routes
- Integration tests for database operations
- End-to-end tests for user flows
- Responsive design testing across device sizes

## Deployment

To deploy the community feature:
1. Run database migrations
2. Deploy updated API routes
3. Deploy frontend components
4. Update documentation
5. Monitor for any issues post-deployment