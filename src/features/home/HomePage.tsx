import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface Post {
  id: string;
  title: string;
  preview: string;
  topic: string;
  category: string;
  subCategory: string;
  readTime: string;
  createdAt: string;
  hasVideo: boolean;
  imageUrl: string;
}

interface Topic {
  id: string;
  subCategoryId: string;
  name: string;
  description: string;
  questionCount: number;
}

const features = [
  { title: 'Rapid Quiz', icon: '⚡', description: 'Timed questions with instant feedback and explanations', link: '/rapid-quiz', color: 'bg-orange-50 border-orange-200 hover:border-orange-300', iconBg: 'bg-orange-100' },
  { title: 'Clinical OSCE', icon: '🏥', description: 'Step-by-step patient case simulations with clinical reasoning', link: '/scenarios', color: 'bg-green-50 border-green-200 hover:border-green-300', iconBg: 'bg-green-100' },
  { title: 'Clinio Room', icon: '📚', description: 'Educational content, videos, and discussions', link: '/feed', color: 'bg-blue-50 border-blue-200 hover:border-blue-300', iconBg: 'bg-blue-100' },
  { title: 'Exam Mode', icon: '📝', description: 'Full exam simulation with results and performance breakdown', link: '/exam', color: 'bg-red-50 border-red-200 hover:border-red-300', iconBg: 'bg-red-100' },
];

const stats = [
  { number: '500+', label: 'Practice Questions', icon: '📝' },
  { number: '3', label: 'Exam Categories', icon: '📂' },
  { number: '100%', label: 'Free Access', icon: '🎓' },
  { number: '24/7', label: 'Available', icon: '🌐' },
];

const categoryLinks = [
  { icon: '🏥', label: 'Clinical Medicine', desc: 'Core clinical knowledge', category: 'Clinical Medicine' },
  { icon: '🩺', label: 'NCLEX Practice', desc: 'US/Canada exam prep', category: 'NCLEX' },
  { icon: '🇳🇬', label: 'NMCN Exam Prep', desc: 'Nigeria council exam', category: 'NMCN' },
  { icon: '📋', label: 'Nursing Care Plans', desc: 'Comprehensive guides', category: 'Clinical Medicine' },
  { icon: '💊', label: 'Pharmacology', desc: 'Drug study guides', category: 'NCLEX' },
  { icon: '🧠', label: 'Study Guides', desc: 'Nursing fundamentals', category: 'NMCN' },
];

const FIREBASE_URL = 'https://firestore.googleapis.com/v1/projects/clinio-ai/databases/(default)/documents';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [quizTopics, setQuizTopics] = useState<Topic[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLatestPosts();
    fetchQuizTopics();
  }, []);

  const fetchLatestPosts = async () => {
    try {
      const response = await fetch(
        `${FIREBASE_URL}/posts?orderBy=createdAt%20desc&pageSize=10`
      );
      const data = await response.json();

      if (data.documents) {
        const posts = data.documents.map((doc: any) => {
          const f = doc.fields;
          return {
            id: doc.name.split('/').pop(),
            title: f.title?.stringValue || '',
            preview: f.preview?.stringValue || '',
            topic: f.topic?.stringValue || '',
            category: f.category?.stringValue || '',
            subCategory: f.subCategory?.stringValue || '',
            readTime: f.readTime?.stringValue || '',
            createdAt: f.createdAt?.stringValue || '',
            hasVideo: f.hasVideo?.booleanValue || false,
            imageUrl: f.imageUrl?.stringValue || '',
          };
        });
        setLatestPosts(posts);
      }
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchQuizTopics = async () => {
    try {
      const response = await fetch(`${FIREBASE_URL}/topics`);
      const data = await response.json();

      if (data.documents) {
        const allTopics = data.documents
          .map((doc: any) => {
            const f = doc.fields;
            return {
              id: doc.name.split('/').pop(),
              subCategoryId: f.subCategoryId?.stringValue || '',
              name: f.name?.stringValue || '',
              description: f.description?.stringValue || '',
              questionCount: f.questionCount?.integerValue || f.questionCount?.stringValue || 0,
            };
          })
          .filter((t: Topic) => t.questionCount > 0)
          .sort((a: Topic, b: Topic) => b.questionCount - a.questionCount)
          .slice(0, 10);
        setQuizTopics(allTopics);
      }
    } catch (err) {
      console.error('Failed to load topics:', err);
    } finally {
      setLoadingTopics(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    return dateStr;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/feed?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/feed?category=${encodeURIComponent(category)}`);
  };

  const handleSubCategoryClick = (subCategory: string) => {
    navigate(`/feed?subCategory=${encodeURIComponent(subCategory)}`);
  };

  const handleTopicQuizClick = (topicName: string) => {
    navigate(`/rapid-quiz?topic=${encodeURIComponent(topicName)}`);
  };

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-blue-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
              For All Your Nursing Needs
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Empowering your nursing journey with trusted resources. Practice questions, study guides, and clinical scenarios — all in one place.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-6">
              <div className="flex items-center bg-white rounded-xl shadow-lg overflow-hidden">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search for topics, questions, or study guides..."
                  className="flex-1 px-5 py-4 text-gray-900 text-base outline-none border-none"
                />
                <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-4 font-semibold transition-colors">
                  🔍 Search
                </button>
              </div>
            </form>

            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <Link to="/rapid-quiz" className="bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors shadow-md">
                ⚡ Start Practice Quiz
              </Link>
              <Link to="/exam" className="bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-400 transition-colors shadow-md border border-primary-400">
                📝 Take Full Exam
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(stat => (
              <div key={stat.label} className="text-center">
                <span className="text-2xl">{stat.icon}</span>
                <p className="text-2xl md:text-3xl font-bold text-primary-600">{stat.number}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {/* Feature Cards */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">How Clinio AI Works</h2>
          <p className="text-gray-500 text-center mb-8">Choose your study mode and start learning</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map(feature => (
              <Link key={feature.title} to={feature.link} className={`p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${feature.color}`}>
                <div className={`w-12 h-12 ${feature.iconBg} rounded-lg flex items-center justify-center text-2xl mb-3`}>{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Access Categories - CLICKABLE */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">Explore by Category</h2>
          <p className="text-gray-500 text-center mb-8">Click to browse posts in each category</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categoryLinks.map(cat => (
              <button
                key={cat.label}
                onClick={() => handleCategoryClick(cat.category)}
                className="text-center p-5 bg-white rounded-xl border-2 border-gray-200 hover:border-primary-300 hover:shadow-md transition-all group cursor-pointer"
              >
                <span className="text-3xl block mb-2">{cat.icon}</span>
                <p className="text-sm font-semibold text-gray-800 group-hover:text-primary-600">{cat.label}</p>
                <p className="text-xs text-gray-400 mt-1">{cat.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Latest Posts - 10 Max */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Latest Study Guides & Posts</h2>
              <p className="text-gray-500 mt-1">Expert-written content for nursing and medical students</p>
            </div>
            <Link to="/feed" className="hidden sm:inline-flex items-center gap-1 text-primary-600 font-semibold hover:text-primary-700">
              View All Posts <span className="text-xl">→</span>
            </Link>
          </div>

          {loadingPosts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="card p-5 animate-pulse">
                  <div className="h-40 bg-gray-200 rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : latestPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestPosts.slice(0, 10).map(post => (
                  <Link key={post.id} to={`/feed/${post.id}`} className="card overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group">
                    {post.imageUrl ? (
                      <img src={post.imageUrl} alt={post.title} className="w-full h-44 object-cover" />
                    ) : (
                      <div className="w-full h-44 bg-gradient-to-br from-primary-100 to-blue-100 flex items-center justify-center">
                        <span className="text-4xl">📚</span>
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full font-medium border border-primary-100">{post.topic}</span>
                        {post.subCategory && (
                          <button
                            onClick={(e) => { e.preventDefault(); handleSubCategoryClick(post.subCategory); }}
                            className="text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full font-medium border border-gray-100 hover:bg-gray-100 cursor-pointer"
                          >
                            {post.subCategory}
                          </button>
                        )}
                        {post.hasVideo && <span className="text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-full font-medium border border-red-100">🎬</span>}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">{post.title}</h3>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{post.preview}</p>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{post.readTime}</span>
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {latestPosts.length > 6 && (
                <div className="text-center mt-8">
                  <Link to="/feed" className="btn-primary inline-flex items-center gap-2 px-8 py-3">
                    View All {latestPosts.length} Posts <span>→</span>
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-4xl mb-3">📝</p>
              <p className="text-gray-500 text-lg">No posts yet. Check back soon for study guides!</p>
            </div>
          )}
        </section>

        {/* Latest Quiz Topics - 10 Max */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Popular Quiz Topics</h2>
              <p className="text-gray-500 mt-1">Practice with our most popular question sets</p>
            </div>
            <Link to="/rapid-quiz" className="hidden sm:inline-flex items-center gap-1 text-primary-600 font-semibold hover:text-primary-700">
              Start a Quiz <span className="text-xl">→</span>
            </Link>
          </div>

          {loadingTopics ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="card p-4 animate-pulse">
                  <div className="h-3 bg-gray-200 rounded w-16 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : quizTopics.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {quizTopics.slice(0, 10).map(topic => (
                  <button
                    key={topic.id}
                    onClick={() => handleTopicQuizClick(topic.name)}
                    className="card p-4 text-left hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer border-2 border-transparent hover:border-primary-200"
                  >
                    <span className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full font-medium">
                      {topic.questionCount} Questions
                    </span>
                    <h4 className="font-semibold text-gray-900 mt-2 text-sm">{topic.name}</h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{topic.description}</p>
                  </button>
                ))}
              </div>
              {quizTopics.length > 5 && (
                <div className="text-center mt-8">
                  <Link to="/rapid-quiz" className="btn-primary inline-flex items-center gap-2 px-8 py-3">
                    Explore All Quiz Topics <span>→</span>
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-4xl mb-3">📝</p>
              <p className="text-gray-500 text-lg">Quiz topics coming soon!</p>
            </div>
          )}
        </section>

        {/* CTA Banner */}
        <section>
          <div className="bg-gradient-to-r from-primary-600 to-blue-700 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Ace Your Nursing Exams?</h2>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">Join thousands of nursing students using Clinio AI for their exam preparation. 100% free, no login required.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/rapid-quiz" className="bg-white text-primary-700 px-8 py-3 rounded-lg font-bold hover:bg-primary-50 transition-colors shadow-lg">
                Start Practicing Now
              </Link>
              <Link to="/feed" className="bg-primary-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-400 transition-colors border border-primary-400">
                Browse Study Guides
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
