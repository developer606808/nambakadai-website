import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Users, MessageCircle, MapPin, Calendar, Star, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MainLayout } from '@/components/main-layout';
import { prisma } from '@/lib/prisma';

// Generate metadata for SEO
export async function generateMetadata({
  params
}: {
  params: Promise<{ params: string[] }>
}): Promise<Metadata> {
  const { params: routeParams } = await params;
  const [slug, publicKey] = routeParams || [];

  if (!slug || !publicKey) {
    return {
      title: 'Community Not Found',
    };
  }

  try {
    const community = await prisma.community.findUnique({
      where: { uuid: publicKey }
    });

    if (!community) {
      return {
        title: 'Community Not Found',
      };
    }

    return {
      title: `${community.name} - Nambakadai Community`,
      description: community.description || `Join ${community.name} community on Nambakadai.`,
      openGraph: {
        title: `${community.name} - Nambakadai Community`,
        description: community.description || `Join ${community.name} community on Nambakadai.`,
        images: community.image ? [community.image] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Community Not Found',
    };
  }
}

export default async function CommunityDetailsPage({
  params
}: {
  params: Promise<{ params: string[] }>
}) {
  const { params: routeParams } = await params;
  const [slug, publicKey] = routeParams || [];

  if (!slug || !publicKey) {
    notFound();
  }

  try {
    // Fetch community details
    const community = await prisma.community.findUnique({
      where: { uuid: publicKey },
      include: {
        posts: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
              }
            },
            likes: true,
            comments: {
              include: {
                user: {
                  select: {
                    name: true,
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10, // Limit to 10 recent posts
        },
        members: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
              }
            }
          },
          take: 6, // Show 6 recent members
        }
      }
    });

    if (!community) {
      notFound();
    }

    return (
      <MainLayout>
        <div className="min-h-screen bg-[#f9fcf7]">
          {/* Community Header */}
          <div className="bg-white border-b">
            <div className="container mx-auto px-4 py-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Community Image and Basic Info */}
                <div className="flex flex-col sm:flex-row items-center lg:items-start gap-6">
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border-4 border-white shadow-lg">
                    <Image
                      src={community.image || "/placeholder.svg"}
                      alt={community.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-center lg:text-left">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{community.name}</h1>
                    <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-5 w-5 text-blue-500" />
                        <span className="font-semibold">{community.memberCount} members</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-5 w-5 text-green-500" />
                        <span className="font-semibold">{community.postCount} posts</span>
                      </div>
                      {community.isVerified && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{community.location || 'Global'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{community.category}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Community Stats and Actions */}
                <div className="lg:ml-auto">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-lg mb-4">Community Stats</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Members</span>
                        <span className="font-semibold">{community.memberCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Posts</span>
                        <span className="font-semibold">{community.postCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category</span>
                        <span className="font-semibold">{community.category}</span>
                      </div>
                    </div>
                    <div className="mt-6">
                      <Button className="w-full bg-green-500 hover:bg-green-600">
                        Join Community
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Community Description */}
              {community.description && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">About This Community</h2>
                  <p className="text-gray-700 leading-relaxed">{community.description}</p>
                </div>
              )}

              {/* Community Rules */}
              {community.rules && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Community Rules</h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">{community.rules}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Community Content */}
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content - Posts */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Recent Posts</h2>
                  <Link href={`/community/${slug}/${publicKey}/posts`}>
                    <Button variant="outline" className="flex items-center gap-2">
                      View All Posts
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                {community.posts.length > 0 ? (
                  <div className="space-y-4">
                    {community.posts.map((post) => (
                      <div key={post.id} className="bg-white rounded-lg border p-6">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden">
                            <Image
                              src={post.user.avatar || "/placeholder.svg"}
                              alt={post.user.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{post.user.name}</h4>
                              <span className="text-sm text-gray-500">
                                {new Date(post.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-3">{post.content}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <MessageCircle className="h-4 w-4" />
                                <span>{post.commentCount} comments</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4" />
                                <span>{post.likeCount} likes</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No posts yet</h3>
                    <p className="text-gray-500">Be the first to start a discussion in this community!</p>
                  </div>
                )}
              </div>

              {/* Sidebar - Members */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Recent Members</h3>
                  {community.members.length > 0 ? (
                    <div className="space-y-3">
                      {community.members.map((member) => (
                        <div key={member.id} className="flex items-center gap-3">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden">
                            <Image
                              src={member.user.avatar || "/placeholder.svg"}
                              alt={member.user.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{member.user.name}</p>
                            <p className="text-xs text-gray-500 capitalize">{member.role.toLowerCase()}</p>
                          </div>
                        </div>
                      ))}
                      {community.memberCount > 6 && (
                        <p className="text-sm text-gray-500 text-center">
                          +{community.memberCount - 6} more members
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No members yet</p>
                  )}
                </div>

                {/* Community Actions */}
                <div className="bg-white rounded-lg border p-6">
                  <h3 className="font-semibold mb-4">Community Actions</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full" size="sm">
                      Create Post
                    </Button>
                    <Button variant="outline" className="w-full" size="sm">
                      Invite Members
                    </Button>
                    <Button variant="outline" className="w-full" size="sm">
                      Community Settings
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  } catch (error) {
    console.error('Error fetching community:', error);
    notFound();
  }
}