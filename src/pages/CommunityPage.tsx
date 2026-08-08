import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  MessageSquare,
  Award,
  TrendingUp,
  Heart,
  Eye,
  Share2,
  Bookmark,
  Plus,
  Search,
  Filter,
  Clock,
  ThumbsUp,
  MessageCircle,
  X,
  Send,
  Image as ImageIcon,
  Link2,
  CheckCircle,
  Star,
  Zap,
  Trophy,
  Target,
  Sparkles
} from 'lucide-react';
import { communityService, type CommunityComment } from '../services/communityService';

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: string;
    reputation: number;
  };
  title: string;
  content: string;
  category: 'discussion' | 'question' | 'showcase' | 'announcement';
  tags: string[];
  likes: number;
  comments: number;
  views: number;
  isLiked: boolean;
  isBookmarked: boolean;
  created_at: string;
  image?: string;
}

interface Member {
  id: string;
  name: string;
  avatar: string;
  role: string;
  reputation: number;
  projects: number;
  contributions: number;
}

const CommunityPage = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [topMembers, setTopMembers] = useState<Member[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  useEffect(() => {
    void loadCommunityData();
  }, []);

  const loadCommunityData = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const loadedPosts = await communityService.listPosts();
      setPosts(loadedPosts);
      const members = Array.from(new Map(loadedPosts.map(post => [post.author.name, post.author])).values())
        .map((author, index) => ({
          id: author.name,
          name: author.name,
          avatar: author.avatar,
          role: author.role,
          reputation: loadedPosts.filter(post => post.author.name === author.name)
            .reduce((total, post) => total + post.likes + post.comments, 0),
          projects: loadedPosts.filter(post => post.author.name === author.name && post.category === 'showcase').length,
          contributions: loadedPosts.filter(post => post.author.name === author.name).length,
        }))
        .sort((a, b) => b.reputation - a.reputation)
        .slice(0, 5);
      setTopMembers(members);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Não foi possível carregar a comunidade.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikePost = async (postId: string) => {
    const previousPosts = posts;
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
    try {
      await communityService.toggleLike(postId);
    } catch {
      setPosts(previousPosts);
      setLoadError('Não foi possível atualizar a curtida.');
    }
  };

  const handleBookmarkPost = async (postId: string) => {
    const previousPosts = posts;
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, isBookmarked: !post.isBookmarked };
      }
      return post;
    }));
    try {
      await communityService.toggleBookmark(postId);
    } catch {
      setPosts(previousPosts);
      setLoadError('Não foi possível atualizar o salvamento.');
    }
  };

  const handleCreatePost = async (data: { title: string; content: string; category: Post['category'] }) => {
    const createdPost = await communityService.createPost(data);
    setPosts(currentPosts => [createdPost, ...currentPosts]);
    setShowNewPostModal(false);
  };

  const handleCommentAdded = (postId: string) => {
    setPosts(currentPosts => currentPosts.map(post => post.id === postId ? { ...post, comments: post.comments + 1 } : post));
  };

  const handleSharePost = async (post: Post) => {
    const url = `${window.location.origin}/dashboard/community?post=${post.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, text: post.content.slice(0, 160), url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareMessage('Link da publicação copiado.');
    } catch (error) {
      if ((error as Error).name !== 'AbortError') setShareMessage('Não foi possível compartilhar agora.');
    }
  };

  const totalLikes = posts.reduce((total, post) => total + post.likes, 0);
  const totalComments = posts.reduce((total, post) => total + post.comments, 0);
  const popularTags = Array.from(
    posts.flatMap(post => post.tags).reduce((counts, tag) => counts.set(tag, (counts.get(tag) || 0) + 1), new Map<string, number>())
  ).sort(([, countA], [, countB]) => countB - countA).slice(0, 8).map(([tag]) => tag);

  const getCategoryInfo = (category: Post['category']) => {
    const categories = {
      discussion: { label: 'Discussão', color: 'bg-blue-500', icon: MessageSquare },
      question: { label: 'Pergunta', color: 'bg-purple-500', icon: MessageCircle },
      showcase: { label: 'Showcase', color: 'bg-green-500', icon: Sparkles },
      announcement: { label: 'Anúncio', color: 'bg-yellow-500', icon: Zap }
    };
    return categories[category];
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Helmet>
        <title>Comunidade - Orientohub</title>
      </Helmet>

      <div className="min-h-screen bg-[#0c121b]">
        <div className="container-custom py-8 space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#34455a] bg-[#151f2b]">
                  <Users className="h-6 w-6 text-primary-300" />
                </div>
                <div>
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-primary-300">Rede de founders</p>
                  <h1 className="flex items-center gap-2 text-3xl font-bold text-white">
                    Comunidade
                    <Heart className="h-6 w-6 text-primary-300" />
                  </h1>
                  <p className="text-[#9ba9bc]">
                    Conecte-se com outros founders e compartilhe conhecimento
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowNewPostModal(true)}
              className="flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-2.5 font-bold text-black transition-all hover:bg-primary-400"
            >
              <Plus className="w-5 h-5" />
              Nova Publicação
            </button>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Membros Ativos', value: topMembers.length, icon: Users, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-500/10' },
              { label: 'Publicações', value: posts.length, icon: MessageSquare, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-500/10' },
              { label: 'Showcases', value: posts.filter(post => post.category === 'showcase').length, icon: Target, color: 'from-green-500 to-green-600', bgColor: 'bg-green-500/10' },
              { label: 'Interações', value: totalLikes + totalComments, icon: Zap, color: 'from-yellow-500 to-yellow-600', bgColor: 'bg-yellow-500/10' }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group rounded-2xl border border-[#273548] bg-[#101722] p-5 shadow-[0_12px_28px_rgba(0,0,0,0.16)] transition-all hover:-translate-y-1 hover:border-primary-400/70 hover:shadow-[0_20px_38px_rgba(0,0,0,0.28)]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#34455a] bg-[#0c121b] transition-transform group-hover:scale-105">
                      <Icon className={`h-5 w-5 ${stat.bgColor.includes('blue') ? 'text-blue-300' : stat.bgColor.includes('purple') ? 'text-purple-300' : stat.bgColor.includes('green') ? 'text-emerald-300' : 'text-yellow-300'}`} />
                    </div>
                  </div>
                  <p className="mb-1 text-sm text-[#9ba9bc]">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </motion.div>
              );
            })}
          </div>

          {loadError && (
            <div className="flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
              <span>{loadError}</span>
              <button onClick={() => void loadCommunityData()} className="font-semibold underline">Tentar novamente</button>
            </div>
          )}
          {shareMessage && (
            <div className="fixed bottom-5 right-5 z-50 rounded-xl border border-primary-400/25 bg-[#151f2b] px-4 py-3 text-sm font-medium text-primary-200 shadow-xl">
              {shareMessage}
              <button onClick={() => setShareMessage(null)} className="ml-3 text-[#9ba9bc] hover:text-white" aria-label="Fechar aviso"><X className="inline h-4 w-4" /></button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Filters */}
              <div className="rounded-2xl border border-[#273548] bg-[#101722] p-4 shadow-[0_12px_28px_rgba(0,0,0,0.16)]">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar discussões..."
                      className="w-full rounded-xl border border-[#34455a] bg-[#0c121b] py-2.5 pl-10 pr-4 text-gray-100 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-400/15 placeholder:text-[#718096]"
                    />
                  </div>

                  <div className="flex gap-2 overflow-x-auto">
                    {[
                      { id: 'all', label: 'Todos' },
                      { id: 'discussion', label: 'Discussões' },
                      { id: 'question', label: 'Perguntas' },
                      { id: 'showcase', label: 'Showcase' }
                    ].map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                          selectedCategory === category.id
                            ? 'bg-primary-500 text-black'
                            : 'border border-[#34455a] bg-[#151f2b] text-gray-300 hover:border-primary-400 hover:text-white'
                        }`}
                      >
                        {category.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Posts */}
              <div className="space-y-4">
                {isLoading ? (
                  <div className="rounded-xl border-2 border-gray-200 bg-white p-10 text-center dark:border-gray-700 dark:bg-gray-800">
                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-500" />
                    <p className="text-gray-600 dark:text-gray-400">Carregando publicações...</p>
                  </div>
                ) : filteredPosts.map((post, index) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    index={index}
                    onLike={handleLikePost}
                    onBookmark={handleBookmarkPost}
                    onCommentAdded={handleCommentAdded}
                    onShare={handleSharePost}
                    getCategoryInfo={getCategoryInfo}
                  />
                ))}

                {!isLoading && filteredPosts.length === 0 && (
                  <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                    <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
                      Nenhuma publicação encontrada
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Top Members */}
              <div className="rounded-2xl border border-[#273548] bg-[#101722] p-6 shadow-[0_12px_28px_rgba(0,0,0,0.16)]">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-lg font-bold text-white">Top Membros</h3>
                </div>
                <div className="space-y-4">
                  {topMembers.map((member, index) => (
                    <div key={member.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#273548] bg-[#0c121b] p-3 transition-all hover:border-[#4c6078] hover:bg-[#151f2b]">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {member.avatar.startsWith('http') ? (
                            <img src={member.avatar} alt={member.name} className="h-full w-full rounded-full object-cover" />
                          ) : member.avatar}
                        </div>
                        {index < 3 && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                            {index + 1}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium text-white">{member.name}</p>
                        <p className="text-xs text-[#9ba9bc]">{member.role}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-bold">{member.reputation}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="rounded-2xl border border-primary-400/20 bg-primary-400/[0.06] p-6">
                <h3 className="mb-4 text-lg font-bold text-white">Sua Atividade</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Publicações', value: posts.length, icon: MessageSquare },
                    { label: 'Comentários', value: totalComments, icon: MessageCircle },
                    { label: 'Curtidas', value: totalLikes, icon: Heart },
                    { label: 'Interações', value: totalLikes + totalComments, icon: Star }
                  ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <div key={i} className="flex items-center justify-between rounded-lg border border-[#34455a] bg-[#0c121b] p-3">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-purple-500" />
                          <span className="text-sm text-gray-300">{stat.label}</span>
                        </div>
                        <span className="font-bold text-white">{stat.value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tags Populares */}
              <div className="rounded-2xl border border-[#273548] bg-[#101722] p-6 shadow-[0_12px_28px_rgba(0,0,0,0.16)]">
                <h3 className="mb-4 text-lg font-bold text-white">Tags Populares</h3>
                <div className="flex flex-wrap gap-2">
                  {(popularTags.length > 0 ? popularTags : ['Ainda sem tags']).map((tag) => (
                    <span
                      key={tag}
                      className="cursor-pointer rounded-lg border border-[#34455a] bg-[#0c121b] px-3 py-1.5 text-sm font-medium text-gray-300 transition-all hover:border-primary-400 hover:bg-primary-400/10 hover:text-primary-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Post Modal */}
      <NewPostModal
        show={showNewPostModal}
        onClose={() => setShowNewPostModal(false)}
        onSubmit={handleCreatePost}
      />
    </>
  );
};

// Post Card Component
interface PostCardProps {
  post: Post;
  index: number;
  onLike: (id: string) => void;
  onBookmark: (id: string) => void;
  onCommentAdded: (id: string) => void;
  onShare: (post: Post) => void;
  getCategoryInfo: (category: Post['category']) => any;
}

const PostCard = ({ post, index, onLike, onBookmark, onCommentAdded, onShare, getCategoryInfo }: PostCardProps) => {
  const categoryInfo = getCategoryInfo(post.category);
  const CategoryIcon = categoryInfo.icon;
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [isSendingComment, setIsSendingComment] = useState(false);
  
  const getTimeAgo = (date: string) => {
    const now = new Date();
    const posted = new Date(date);
    const diffMs = now.getTime() - posted.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'agora';
    if (diffHours < 24) return `${diffHours}h atrás`;
    return `${Math.floor(diffHours / 24)}d atrás`;
  };

  const handleToggleComments = async () => {
    const shouldOpen = !commentsOpen;
    setCommentsOpen(shouldOpen);
    if (!shouldOpen || comments.length) return;
    try {
      setCommentsLoading(true);
      setCommentError(null);
      setComments(await communityService.listComments(post.id));
    } catch (error) {
      setCommentError(error instanceof Error ? error.message : 'Não foi possível carregar os comentários.');
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleSendComment = async () => {
    if (!commentText.trim() || isSendingComment) return;
    try {
      setIsSendingComment(true);
      setCommentError(null);
      const comment = await communityService.createComment(post.id, commentText);
      setComments(current => [...current, comment]);
      setCommentText('');
      onCommentAdded(post.id);
    } catch (error) {
      setCommentError(error instanceof Error ? error.message : 'Não foi possível publicar o comentário.');
    } finally {
      setIsSendingComment(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group rounded-2xl border border-[#273548] bg-[#101722] p-5 shadow-[0_12px_28px_rgba(0,0,0,0.16)] transition-all hover:-translate-y-0.5 hover:border-primary-400/70 hover:shadow-[0_20px_38px_rgba(0,0,0,0.28)]"
    >
      {/* Author & Category */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
            {post.author.avatar.startsWith('http') ? (
              <img src={post.author.avatar} alt={post.author.name} className="h-full w-full rounded-full object-cover" />
            ) : post.author.avatar}
          </div>
          <div>
            <p className="font-medium text-white">{post.author.name}</p>
            <div className="flex items-center gap-2 text-sm text-[#9ba9bc]">
              <span>{post.author.role}</span>
              <span>•</span>
              <span>{getTimeAgo(post.created_at)}</span>
            </div>
          </div>
        </div>
        <span className={`${categoryInfo.color} text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1`}>
          <CategoryIcon className="w-3 h-3" />
          {categoryInfo.label}
        </span>
      </div>

      {/* Content */}
      <h3 className="mb-2 cursor-pointer text-xl font-bold text-white transition-colors group-hover:text-primary-300">
        {post.title}
      </h3>
      <p className="mb-4 text-[#9ba9bc]">
        {post.content}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags.map((tag) => (
          <span key={tag} className="rounded-lg border border-[#34455a] bg-[#0c121b] px-2 py-1 text-sm text-gray-300">
            #{tag}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-[#273548] pt-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onLike(post.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
              post.isLiked
                ? 'bg-red-400/10 text-red-300'
                : 'text-gray-300 hover:bg-[#151f2b]'
            }`}
          >
            <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{post.likes}</span>
          </button>

          <button onClick={() => void handleToggleComments()} className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-gray-300 transition-all hover:bg-[#151f2b]">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{post.comments}</span>
          </button>

          <div className="flex items-center gap-2 text-[#9ba9bc]">
            <Eye className="w-4 h-4" />
            <span className="text-sm">{post.views}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onBookmark(post.id)}
            className={`p-2 rounded-lg transition-all ${
              post.isBookmarked
                ? 'bg-yellow-400/10 text-yellow-300'
                : 'text-gray-300 hover:bg-[#151f2b]'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
          </button>

          <button onClick={() => void onShare(post)} aria-label="Compartilhar publicação" className="rounded-lg p-2 text-gray-300 transition-all hover:bg-[#151f2b]">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      {commentsOpen && (
        <div className="mt-4 border-t border-[#273548] pt-4">
          <div className="mb-3 flex items-center justify-between"><p className="text-sm font-bold text-white">Comentários</p><span className="text-xs text-[#9ba9bc]">{post.comments} no total</span></div>
          {commentsLoading ? <p className="text-sm text-[#9ba9bc]">Carregando comentários...</p> : <div className="space-y-3">
            {comments.map(comment => <div key={comment.id} className="rounded-xl border border-[#273548] bg-[#0c121b] p-3"><div className="flex items-center gap-2"><span className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-[#151f2b] text-[10px] font-bold text-primary-300">{comment.author.avatar.startsWith('http') ? <img src={comment.author.avatar} alt="" className="h-full w-full object-cover" /> : comment.author.avatar}</span><span className="text-sm font-semibold text-white">{comment.author.name}</span><span className="text-xs text-[#718096]">{getTimeAgo(comment.created_at)}</span></div><p className="mt-2 text-sm leading-relaxed text-[#b8c4d4]">{comment.content}</p></div>)}
            {comments.length === 0 && <p className="py-2 text-sm text-[#9ba9bc]">Seja a primeira pessoa a responder.</p>}
          </div>}
          <div className="mt-4 flex gap-2"><input value={commentText} onChange={(event) => setCommentText(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void handleSendComment(); } }} placeholder="Escreva um comentário..." className="min-w-0 flex-1 rounded-xl border border-[#34455a] bg-[#0c121b] px-3 py-2.5 text-sm text-white outline-none placeholder:text-[#718096] focus:border-primary-400" /><button onClick={() => void handleSendComment()} disabled={!commentText.trim() || isSendingComment} className="inline-flex items-center justify-center rounded-xl bg-primary-500 px-3 text-black transition hover:bg-primary-400 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Enviar comentário"><Send className="h-4 w-4" /></button></div>
          {commentError && <p className="mt-2 text-xs text-red-300">{commentError}</p>}
        </div>
      )}
    </motion.div>
  );
};

// New Post Modal
interface NewPostModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; content: string; category: Post['category'] }) => Promise<void>;
}

const NewPostModal = ({ show, onClose, onSubmit }: NewPostModalProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Post['category']>('discussion');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fieldClassName = "w-full rounded-xl border border-[#34455a] bg-[#0c121b] px-4 py-3 text-sm text-gray-100 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-400/15 placeholder:text-[#718096]";

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmit({ title, content, category });
      setTitle('');
      setContent('');
      setCategory('discussion');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Não foi possível publicar agora.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#34455a] bg-[#101722] p-6 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary-400/25 bg-primary-400/10">
                <Plus className="h-6 w-6 text-primary-300" />
              </div>
              <div>
                <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-primary-300">Compartilhe com a rede</p>
                <h2 className="text-2xl font-bold text-white">Nova Publicação</h2>
                <p className="text-sm text-[#9ba9bc]">
                  Compartilhe conhecimento com a comunidade
                </p>
              </div>
            </div>
            <button onClick={onClose} className="rounded-lg p-2 text-gray-300 transition hover:bg-[#151f2b] hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-100">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Post['category'])}
                className={fieldClassName}
              >
                <option value="discussion">Discussão</option>
                <option value="question">Pergunta</option>
                <option value="showcase">Showcase</option>
                <option value="announcement">Anúncio</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-100">Título</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={fieldClassName}
                placeholder="Ex: Como validei minha startup em 30 dias"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-100">Conteúdo</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className={fieldClassName}
                placeholder="Compartilhe sua experiência, pergunta ou conquista..."
              />
            </div>

            {submitError && <div className="rounded-xl border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-200">{submitError}</div>}
            <div className="flex gap-3 border-t border-[#273548] pt-6">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border border-[#34455a] bg-[#151f2b] px-6 py-3 font-medium text-gray-300 transition hover:border-[#4c6078] hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={() => void handleSubmit()}
                disabled={!title.trim() || !content.trim() || isSubmitting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-500 px-6 py-3 font-bold text-black transition hover:bg-primary-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
                {isSubmitting ? 'Publicando...' : 'Publicar'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CommunityPage;
