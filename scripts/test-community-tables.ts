import { prisma } from '@/lib/prisma';

async function testCommunityTables() {
  try {
    // Test creating a community
    const community = await prisma.community.create({
      data: {
        name: 'Test Community',
        description: 'A test community for verification',
        category: 'Testing',
        privacy: 'PUBLIC',
        location: 'Test Location',
        rules: 'Be respectful',
        memberCount: 1,
        postCount: 0,
        isVerified: false,
        isBlocked: false,
      },
    });

    console.log('Community created successfully:', community);

    // Test creating a community member
    const member = await prisma.communityMember.create({
      data: {
        userId: 'test-user-id',
        communityId: community.id,
        role: 'ADMIN',
        isApproved: true,
        joinedAt: new Date(),
      },
    });

    console.log('Community member created successfully:', member);

    // Test creating a post
    const post = await prisma.communityPost.create({
      data: {
        content: 'This is a test post',
        type: 'TEXT',
        userId: 'test-user-id',
        communityId: community.id,
        likeCount: 0,
        commentCount: 0,
        isPinned: false,
      },
    });

    console.log('Post created successfully:', post);

    // Test creating a comment
    const comment = await prisma.communityComment.create({
      data: {
        content: 'This is a test comment',
        userId: 'test-user-id',
        postId: post.id,
        likeCount: 0,
      },
    });

    console.log('Comment created successfully:', comment);

    // Test liking a post
    const like = await prisma.communityLike.create({
      data: {
        userId: 'test-user-id',
        postId: post.id,
      },
    });

    console.log('Like created successfully:', like);

    // Update post like count
    await prisma.communityPost.update({
      where: { id: post.id },
      data: {
        likeCount: {
          increment: 1,
        },
      },
    });

    console.log('Post like count updated successfully');

    // Clean up test data
    await prisma.communityLike.delete({ where: { id: like.id } });
    await prisma.communityComment.delete({ where: { id: comment.id } });
    await prisma.communityPost.delete({ where: { id: post.id } });
    await prisma.communityMember.delete({ where: { id: member.id } });
    await prisma.community.delete({ where: { id: community.id } });

    console.log('Test data cleaned up successfully');
    console.log('All community table tests passed!');
  } catch (error) {
    console.error('Error testing community tables:', error);
  }
}

// Run the test
testCommunityTables();