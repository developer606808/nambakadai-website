const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testCommunityTables() {
  try {
    // Test that we can query the tables (they exist)
    const communities = await prisma.community.findMany({ take: 1 });
    console.log('Community table exists and is accessible');
    
    const members = await prisma.communityMember.findMany({ take: 1 });
    console.log('CommunityMember table exists and is accessible');
    
    const posts = await prisma.communityPost.findMany({ take: 1 });
    console.log('CommunityPost table exists and is accessible');
    
    const comments = await prisma.communityComment.findMany({ take: 1 });
    console.log('CommunityComment table exists and is accessible');
    
    const likes = await prisma.communityLike.findMany({ take: 1 });
    console.log('CommunityLike table exists and is accessible');
    
    const bookmarks = await prisma.communityBookmark.findMany({ take: 1 });
    console.log('CommunityBookmark table exists and is accessible');
    
    const followers = await prisma.communityFollower.findMany({ take: 1 });
    console.log('CommunityFollower table exists and is accessible');
    
    const reports = await prisma.communityReport.findMany({ take: 1 });
    console.log('CommunityReport table exists and is accessible');
    
    console.log('All community tables are properly created and accessible!');
  } catch (error) {
    console.error('Error testing community tables:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testCommunityTables();