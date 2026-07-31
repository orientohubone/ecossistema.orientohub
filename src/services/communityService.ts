import { supabase } from '../config/supabase';

export type CommunityCategory = 'discussion' | 'question' | 'showcase' | 'announcement';

export interface CommunityPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: string;
    reputation: number;
  };
  title: string;
  content: string;
  category: CommunityCategory;
  tags: string[];
  likes: number;
  comments: number;
  views: number;
  isLiked: boolean;
  isBookmarked: boolean;
  created_at: string;
}

export interface CreateCommunityPostData {
  title: string;
  content: string;
  category: CommunityCategory;
  tags?: string[];
}

const initials = (name: string) => name.split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase();

const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!user) throw new Error('Usuário não autenticado.');
  return user;
};

const mapPost = (
  row: any,
  likedIds: Set<string>,
  bookmarkedIds: Set<string>,
  currentUserId?: string,
  currentUserAvatar?: string,
): CommunityPost => ({
  id: row.id,
  author: {
    name: row.author_name,
    avatar: (row.user_id && currentUserAvatar && row.user_id === currentUserId)
      ? currentUserAvatar
      : row.author_avatar || initials(row.author_name),
    role: row.author_role || 'Membro',
    reputation: 0,
  },
  title: row.title,
  content: row.content,
  category: row.category,
  tags: Array.isArray(row.tags) ? row.tags : [],
  likes: row.likes_count || 0,
  comments: row.comments_count || 0,
  views: row.views_count || 0,
  isLiked: likedIds.has(row.id),
  isBookmarked: bookmarkedIds.has(row.id),
  created_at: row.created_at,
});

export const communityService = {
  async listPosts(): Promise<CommunityPost[]> {
    const user = await getCurrentUser();
    const currentUserAvatar = user.user_metadata?.avatar_url || '';
    const { data: rows, error } = await supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;

    const postIds = (rows || []).map(row => row.id);
    if (postIds.length === 0) return [];

    const [{ data: likes, error: likesError }, { data: bookmarks, error: bookmarksError }] = await Promise.all([
      supabase.from('community_post_likes').select('post_id').eq('user_id', user.id).in('post_id', postIds),
      supabase.from('community_post_bookmarks').select('post_id').eq('user_id', user.id).in('post_id', postIds),
    ]);
    if (likesError) throw likesError;
    if (bookmarksError) throw bookmarksError;

    return (rows || []).map(row => mapPost(
      row,
      new Set((likes || []).map(item => item.post_id)),
      new Set((bookmarks || []).map(item => item.post_id)),
      user.id,
      currentUserAvatar,
    ));
  },

  async createPost(data: CreateCommunityPostData): Promise<CommunityPost> {
    const user = await getCurrentUser();
    const metadata = user.user_metadata || {};
    const name = metadata.name || metadata.full_name || user.email?.split('@')[0] || 'Membro';
    const avatar = metadata.avatar_url || initials(name);
    const { data: row, error } = await supabase
      .from('community_posts')
      .insert({
        user_id: user.id,
        author_name: name,
        author_avatar: avatar,
        author_role: metadata.role || 'Membro',
        title: data.title.trim(),
        content: data.content.trim(),
        category: data.category,
        tags: data.tags || [],
      })
      .select('*')
      .single();
    if (error) throw error;
    return mapPost(row, new Set(), new Set(), user.id, avatar);
  },

  async toggleLike(postId: string): Promise<boolean> {
    const { data, error } = await supabase.rpc('toggle_community_post_like', { p_post_id: postId });
    if (error) throw error;
    return Boolean(data);
  },

  async toggleBookmark(postId: string): Promise<boolean> {
    const { data, error } = await supabase.rpc('toggle_community_post_bookmark', { p_post_id: postId });
    if (error) throw error;
    return Boolean(data);
  },
};
