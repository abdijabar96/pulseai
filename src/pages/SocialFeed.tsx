import React, { useState } from 'react';
import { MessageSquare, Image, Send, Heart, MessageCircle, Share2, Loader2 } from 'lucide-react';

interface Post {
  id: string;
  author: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: Date;
}

export default function SocialFeed() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: 'Sarah & Max',
      content: 'Morning walk with my best buddy! 🐕',
      image: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=800',
      likes: 24,
      comments: 5,
      timestamp: new Date('2024-03-15T08:30:00')
    },
    {
      id: '2',
      author: 'Tom & Whiskers',
      content: 'Just learned a new trick! So proud of my little guy.',
      likes: 18,
      comments: 3,
      timestamp: new Date('2024-03-15T07:15:00')
    }
  ]);
  
  const [newPost, setNewPost] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  
  const handlePost = async () => {
    if (!newPost.trim() && !selectedImage) return;
    
    setIsPosting(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const post: Post = {
      id: Date.now().toString(),
      author: 'You',
      content: newPost,
      image: selectedImage || undefined,
      likes: 0,
      comments: 0,
      timestamp: new Date()
    };
    
    setPosts([post, ...posts]);
    setNewPost('');
    setSelectedImage(null);
    setIsPosting(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-3">
        <div className="rounded-full bg-blue-100 p-2">
          <MessageSquare className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pet Social</h1>
          <p className="text-gray-600">
            Connect with other pet owners, share moments, and build a community.
          </p>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-lg">
        <div className="space-y-4">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share a moment with your pet..."
            className="w-full rounded-lg border border-gray-300 p-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            rows={3}
          />
          
          {selectedImage && (
            <div className="relative">
              <img
                src={selectedImage}
                alt="Selected"
                className="max-h-64 rounded-lg object-cover"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute right-2 top-2 rounded-full bg-gray-900 bg-opacity-50 p-1 text-white hover:bg-opacity-70"
              >
                ×
              </button>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <label className="cursor-pointer rounded-full bg-blue-100 p-2 text-blue-600 hover:bg-blue-200">
                <Image className="h-5 w-5" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            
            <button
              onClick={handlePost}
              disabled={isPosting || (!newPost.trim() && !selectedImage)}
              className="flex items-center space-x-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:bg-gray-300"
            >
              {isPosting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span>Post</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <div className="font-semibold text-gray-900">{post.author}</div>
              <div className="text-sm text-gray-500">
                {new Date(post.timestamp).toLocaleString()}
              </div>
            </div>
            
            <p className="text-gray-700">{post.content}</p>
            
            {post.image && (
              <img
                src={post.image}
                alt="Post"
                className="mt-4 rounded-lg"
              />
            )}
            
            <div className="mt-4 flex items-center space-x-6 text-gray-500">
              <button
                onClick={() => handleLike(post.id)}
                className="flex items-center space-x-2 hover:text-red-500"
              >
                <Heart className="h-5 w-5" />
                <span>{post.likes}</span>
              </button>
              
              <button className="flex items-center space-x-2 hover:text-blue-500">
                <MessageCircle className="h-5 w-5" />
                <span>{post.comments}</span>
              </button>
              
              <button className="flex items-center space-x-2 hover:text-green-500">
                <Share2 className="h-5 w-5" />
                <span>Share</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}