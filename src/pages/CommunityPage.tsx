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

  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = () => {
    // Mock data
    const mockPosts: Post[] = [
      {
        id: '1',
        author: {
          name: 'Maria Silva',
          avatar: 'MS',
          role: 'Founder',
          reputation: 850
        },
        title: 'Como validei minha startup em 30 dias sem gastar nada',
        content: 'Compartilhando minha jornada de validação usando apenas landing pages e entrevistas com clientes. Consegui 150 leads qualificados!',
        category: 'showcase',
        tags: ['validação', 'lean startup', 'mvp'],
        likes: 45,
        comments: 12,
        views: 230,
        isLiked: false,
        isBookmarked: false,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        author: {
          name: 'João Santos',
          avatar: 'JS',
          role: 'Developer',
          reputation: 620
        },
        title: 'Qual a melhor stack para um MVP em 2024?',
        content: 'Estou começando um novo projeto e gostaria de sugestões sobre tecnologias para construir um MVP rápido e escalável.',
        category: 'question',
        tags: ['tech', 'mvp', 'desenvolvimento'],
        likes: 23,
        comments: 18,
        views: 156,
        isLiked: true,
        isBookmarked: true,
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        author: {
          name: 'Ana Costa',
          avatar: 'AC',
          role: 'Product Manager',
          reputation: 1250
        },
        title: 'Framework de discovery: como encontrar problemas reais',
        content: 'Desenvolvi um framework que me ajudou a validar 5 ideias em 3 meses. Vou compartilhar o processo completo!',
        category: 'discussion',
        tags: ['product discovery', 'framework', 'metodologia'],
        likes: 67,
        comments: 24,
        views: 345,
        isLiked: false,
        isBookmarked: false,
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    const mockMembers: Member[] = [
      {
        id: '1',
        name: 'Ana Costa',
        avatar: 'AC',
        role: 'Product Manager',
        reputation: 1250,
        projects: 8,
        contributions: 45
      },
      {
        id: '2',
        name: 'Maria Silva',
        avatar: 'MS',
        role: 'Founder',
        reputation: 850,
        projects: 5,
        contributions: 32
      },
      {
        id: '3',
        name: 'João Santos',
        avatar: 'JS',
        role: 'Developer',
        reputation: 620,
        projects: 3,
        contributions: 28
      }
    ];

    setPosts(mockPosts);
    setTopMembers(mockMembers);
  };

  const handleLikePost = (postId: string) => {
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
  };

  const handleBookmarkPost = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, isBookmarked: !post.isBookmarked };
      }
      return post;
    }));
  };

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

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container-custom py-8 space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold flex items-center gap-2">
                    Comunidade
                    <Heart className="w-6 h-6 text-purple-500" />
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Conecte-se com outros founders e compartilhe conhecimento
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowNewPostModal(true)}
              className="px-6 py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-purple-500/30"
            >
              <Plus className="w-5 h-5" />
              Nova Publicação
            </button>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Membros Ativos', value: '1,234', icon: Users, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-500/10' },
              { label: 'Discussões', value: '567', icon: MessageSquare, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-500/10' },
              { label: 'Projetos Compartilhados', value: '89', icon: Target, color: 'from-green-500 to-green-600', bgColor: 'bg-green-500/10' },
              { label: 'Experiências Trocadas', value: '2,345', icon: Zap, color: 'from-yellow-500 to-yellow-600', bgColor: 'bg-yellow-500/10' }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 bg-gradient-to-br ${stat.color} bg-clip-text`} style={{ WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Filters */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar discussões..."
                      className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:ring-0 bg-white dark:bg-gray-900"
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
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
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
                {filteredPosts.map((post, index) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    index={index}
                    onLike={handleLikePost}
                    onBookmark={handleBookmarkPost}
                    getCategoryInfo={getCategoryInfo}
                  />
                ))}

                {filteredPosts.length === 0 && (
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
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <h3 className="font-bold text-lg">Top Membros</h3>
                </div>
                <div className="space-y-4">
                  {topMembers.map((member, index) => (
                    <div key={member.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all cursor-pointer">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {member.avatar}
                        </div>
                        {index < 3 && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                            {index + 1}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{member.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{member.role}</p>
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
              <div className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-800">
                <h3 className="font-bold text-lg mb-4">Sua Atividade</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Publicações', value: 12, icon: MessageSquare },
                    { label: 'Comentários', value: 45, icon: MessageCircle },
                    { label: 'Curtidas Recebidas', value: 89, icon: Heart },
                    { label: 'Reputação', value: 340, icon: Star }
                  ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <div key={i} className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-purple-500" />
                          <span className="text-sm">{stat.label}</span>
                        </div>
                        <span className="font-bold">{stat.value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tags Populares */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-lg mb-4">Tags Populares</h3>
                <div className="flex flex-wrap gap-2">
                  {['lean startup', 'mvp', 'validação', 'produto', 'growth', 'fundraising', 'tech'].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400 rounded-lg text-sm font-medium cursor-pointer transition-all"
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
  getCategoryInfo: (category: Post['category']) => any;
}

const PostCard = ({ post, index, onLike, onBookmark, getCategoryInfo }: PostCardProps) => {
  const categoryInfo = getCategoryInfo(post.category);
  const CategoryIcon = categoryInfo.icon;
  
  const getTimeAgo = (date: string) => {
    const now = new Date();
    const posted = new Date(date);
    const diffMs = now.getTime() - posted.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'agora';
    if (diffHours < 24) return `${diffHours}h atrás`;
    return `${Math.floor(diffHours / 24)}d atrás`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 transition-all group"
    >
      {/* Author & Category */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
            {post.author.avatar}
          </div>
          <div>
            <p className="font-medium">{post.author.name}</p>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
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
      <h3 className="text-xl font-bold mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors cursor-pointer">
        {post.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {post.content}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags.map((tag) => (
          <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-sm rounded-lg">
            #{tag}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onLike(post.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
              post.isLiked
                ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{post.likes}</span>
          </button>

          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{post.comments}</span>
          </button>

          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Eye className="w-4 h-4" />
            <span className="text-sm">{post.views}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onBookmark(post.id)}
            className={`p-2 rounded-lg transition-all ${
              post.isBookmarked
                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
          </button>

          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// New Post Modal
interface NewPostModalProps {
  show: boolean;
  onClose: () => void;
}

const NewPostModal = ({ show, onClose }: NewPostModalProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Post['category']>('discussion');

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
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Nova Publicação</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Compartilhe conhecimento com a comunidade
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Post['category'])}
                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:ring-0 bg-white dark:bg-gray-900"
              >
                <option value="discussion">💬 Discussão</option>
                <option value="question">❓ Pergunta</option>
                <option value="showcase">✨ Showcase</option>
                <option value="announcement">⚡ Anúncio</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Título</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:ring-0 bg-white dark:bg-gray-900"
                placeholder="Ex: Como validei minha startup em 30 dias"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Conteúdo</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:ring-0 bg-white dark:bg-gray-900"
                placeholder="Compartilhe sua experiência, pergunta ou conquista..."
              />
            </div>

            <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
              >
                Cancelar
              </button>
              <button
                disabled={!title || !content}
                className="flex-1 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Publicar
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CommunityPage;
