import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './PostCard.css';

export default function PostCard({ post, onUpdate }) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.like_count || 0);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkLikeStatus();
    loadComments();
  }, [post.id, user]);

  const checkLikeStatus = async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/posts/${post.id}/liked`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setLiked(data.liked);
      }
    } catch (error) {
      console.error('Failed to check like status:', error);
    }
  };

  const loadComments = async () => {
    try {
      const response = await fetch(`/api/comments?postId=${post.id}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert('Please log in to like posts');
      return;
    }

    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setLiked(data.liked);
        setLikeCount(prev => data.liked ? prev + 1 : prev - 1);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to comment');
      return;
    }

    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          postId: post.id,
          content: newComment
        })
      });

      if (response.ok) {
        const comment = await response.json();
        setComments([comment, ...comments]);
        setNewComment('');
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVideoEmbedUrl = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-author">
          <strong>{post.display_name || post.username || 'Admin'}</strong>
          <span className="post-date">
            {new Date(post.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      <h2 className="post-title">{post.title}</h2>
      <p className="post-content">{post.content}</p>

      {post.image_url && (
        <img
          src={post.image_url}
          alt={post.title}
          className="post-image"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}

      {post.video_url && (
        <div className="post-video">
          <iframe
            src={getVideoEmbedUrl(post.video_url)}
            allowFullScreen
          />
        </div>
      )}

      <div className="post-actions">
        <button
          className={`like-button ${liked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          {liked ? '❤️' : '🤍'} {likeCount}
        </button>
        <button
          className="comment-button"
          onClick={() => setShowComments(!showComments)}
        >
          💬 {comments.length}
        </button>
      </div>

      {showComments && (
        <div className="post-comments">
          {user && (
            <form onSubmit={handleAddComment} className="comment-form">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={loading}
              />
              <button type="submit" disabled={loading || !newComment.trim()}>
                {loading ? 'Posting...' : 'Post'}
              </button>
            </form>
          )}

          {!user && (
            <p className="login-prompt">Log in to comment</p>
          )}

          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment">
                <div className="comment-author">
                  {comment.display_name || comment.username}
                </div>
                <div className="comment-content">{comment.content}</div>
                <div className="comment-date">
                  {new Date(comment.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {comments.length === 0 && (
            <p className="no-comments">No comments yet. Be the first to comment!</p>
          )}
        </div>
      )}
    </div>
  );
}
