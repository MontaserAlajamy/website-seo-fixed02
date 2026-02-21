import React, { useState, useCallback, useMemo } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import {
    ArrowLeft, Plus, Edit3, Trash2, Eye, Save, Send,
    FileText, Calendar, Tag, Image, Bold, Italic, Heading1,
    Heading2, List, Code, Link, Quote
} from 'lucide-react';
import { useBlogPosts, BlogPost } from '../../hooks/useBlogPosts';

// Configure marked for safe rendering
marked.setOptions({
    breaks: true,
    gfm: true,
});

// Markdown toolbar buttons
const mdButtons = [
    { icon: Bold, label: 'Bold', before: '**', after: '**' },
    { icon: Italic, label: 'Italic', before: '_', after: '_' },
    { icon: Heading1, label: 'H1', before: '# ', after: '' },
    { icon: Heading2, label: 'H2', before: '## ', after: '' },
    { icon: List, label: 'List', before: '- ', after: '' },
    { icon: Code, label: 'Code', before: '`', after: '`' },
    { icon: Link, label: 'Link', before: '[', after: '](url)' },
    { icon: Quote, label: 'Quote', before: '> ', after: '' },
    { icon: Image, label: 'Image', before: '![alt](', after: ')' },
];

function MarkdownPreview({ content }: { content: string }) {
    const html = useMemo(() => {
        try {
            const raw = marked.parse(content || '') as string;
            return DOMPurify.sanitize(raw);
        } catch {
            return '<p>Error rendering markdown</p>';
        }
    }, [content]);

    return (
        <div
            className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-purple-600"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}

interface EditorProps {
    post?: BlogPost;
    onSave: () => void;
    onCancel: () => void;
}

function PostEditorForm({ post, onSave, onCancel }: EditorProps) {
    const { addPost, updatePost, generateSlug } = useBlogPosts();
    const [title, setTitle] = useState(post?.title || '');
    const [slug, setSlug] = useState(post?.slug || '');
    const [excerpt, setExcerpt] = useState(post?.excerpt || '');
    const [content, setContent] = useState(post?.content || '');
    const [coverImageUrl, setCoverImageUrl] = useState(post?.cover_image_url || '');
    const [tags, setTags] = useState(post?.tags?.join(', ') || '');
    const [showPreview, setShowPreview] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        if (!post) {
            setSlug(generateSlug(newTitle));
        }
    };

    const insertMarkdown = useCallback((before: string, after: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = content.substring(start, end);
        const newContent = content.substring(0, start) + before + selected + after + content.substring(end);
        setContent(newContent);

        // Restore cursor position
        setTimeout(() => {
            textarea.focus();
            const cursorPos = start + before.length + selected.length;
            textarea.setSelectionRange(cursorPos, cursorPos);
        }, 10);
    }, [content]);

    const handleSave = async (status: 'draft' | 'published') => {
        if (!title.trim() || !slug.trim()) {
            setError('Title and slug are required');
            return;
        }

        setSaving(true);
        setError(null);

        const postData: Partial<BlogPost> = {
            title: title.trim(),
            slug: slug.trim(),
            excerpt: excerpt.trim() || null,
            content: content.trim(),
            cover_image_url: coverImageUrl.trim() || null,
            status,
            tags: tags
                .split(',')
                .map(t => t.trim())
                .filter(Boolean),
            ...(status === 'published' && !post?.published_at
                ? { published_at: new Date().toISOString() }
                : {}),
        };

        try {
            let result;
            if (post) {
                result = await updatePost(post.id, postData);
            } else {
                result = await addPost(postData);
            }

            if (result.error) {
                setError(result.error);
            } else {
                onSave();
            }
        } catch {
            setError('Failed to save post');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button
                    onClick={onCancel}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </button>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${showPreview
                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}
                    >
                        <Eye className="w-4 h-4" />
                        {showPreview ? 'Editor' : 'Preview'}
                    </button>
                    <button
                        onClick={() => handleSave('draft')}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
                    >
                        <Save className="w-4 h-4" />
                        Save Draft
                    </button>
                    <button
                        onClick={() => handleSave('published')}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-600 disabled:opacity-50 transition-colors"
                    >
                        <Send className="w-4 h-4" />
                        Publish
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {showPreview ? (
                /* Preview mode */
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                        Preview
                    </h2>
                    {coverImageUrl && (
                        <div className="aspect-video rounded-xl overflow-hidden mb-6">
                            <img src={coverImageUrl} alt={title} className="w-full h-full object-cover" />
                        </div>
                    )}
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{title || 'Untitled'}</h1>
                    {excerpt && (
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 italic">{excerpt}</p>
                    )}
                    {tags && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {tags.split(',').map(t => t.trim()).filter(Boolean).map(tag => (
                                <span
                                    key={tag}
                                    className="px-2 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                    <MarkdownPreview content={content} />
                </div>
            ) : (
                /* Editor mode */
                <div className="space-y-4">
                    {/* Title */}
                    <div>
                        <input
                            type="text"
                            value={title}
                            onChange={handleTitleChange}
                            placeholder="Post Title"
                            className="w-full text-2xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400"
                        />
                    </div>

                    {/* Slug */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">/blog/</span>
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="post-slug"
                            className="flex-1 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                    </div>

                    {/* Excerpt */}
                    <div>
                        <input
                            type="text"
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            placeholder="Short excerpt (shown in blog listing)"
                            className="w-full text-sm bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                    </div>

                    {/* Cover Image + Tags row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                            <Image className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <input
                                type="url"
                                value={coverImageUrl}
                                onChange={(e) => setCoverImageUrl(e.target.value)}
                                placeholder="Cover image URL"
                                className="flex-1 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="Tags (comma separated)"
                                className="flex-1 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Markdown toolbar */}
                    <div className="flex items-center gap-1 p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-t-lg">
                        {mdButtons.map(btn => (
                            <button
                                key={btn.label}
                                onClick={() => insertMarkdown(btn.before, btn.after)}
                                title={btn.label}
                                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
                            >
                                <btn.icon className="w-4 h-4" />
                            </button>
                        ))}
                    </div>

                    {/* Content textarea */}
                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your post content in Markdown...

# Heading 1
## Heading 2

**Bold text** and _italic text_

- List item
- Another item

> Blockquote

`inline code`

```
code block
```

[Link text](https://example.com)
![Image alt](https://example.com/image.jpg)"
                        className="w-full min-h-[400px] bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 border-t-0 rounded-b-lg p-4 text-sm font-mono text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 outline-none resize-y"
                    />
                </div>
            )}
        </div>
    );
}

export default function PostEditor() {
    const { posts, loading, deletePost } = useBlogPosts();
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // If editing or creating, show the editor
    if (editingPost || isCreating) {
        return (
            <PostEditorForm
                post={editingPost || undefined}
                onSave={() => {
                    setEditingPost(null);
                    setIsCreating(false);
                }}
                onCancel={() => {
                    setEditingPost(null);
                    setIsCreating(false);
                }}
            />
        );
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this post permanently?')) return;
        setDeletingId(id);
        await deletePost(id);
        setDeletingId(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Posts</h3>
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-600 transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    New Post
                </button>
            </div>

            {/* Posts list */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : posts.length === 0 ? (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-12 text-center border border-dashed border-gray-300 dark:border-gray-600">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No posts yet</h4>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Create your first blog post to share stories and insights.
                    </p>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
                    >
                        <Plus className="w-4 h-4" />
                        Write your first post
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {posts.map(post => (
                        <div
                            key={post.id}
                            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4 group hover:shadow-md transition-shadow"
                        >
                            {/* Cover thumbnail */}
                            {post.cover_image_url ? (
                                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                    <img src={post.cover_image_url} alt="" className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                                    <FileText className="w-6 h-6 text-gray-400" />
                                </div>
                            )}

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                        {post.title}
                                    </h4>
                                    <span
                                        className={`px-2 py-0.5 text-xs rounded-full font-medium flex-shrink-0 ${post.status === 'published'
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                            }`}
                                    >
                                        {post.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {post.published_at
                                            ? new Date(post.published_at).toLocaleDateString()
                                            : post.created_at
                                                ? new Date(post.created_at).toLocaleDateString()
                                                : 'No date'}
                                    </span>
                                    {post.tags && post.tags.length > 0 && (
                                        <span className="flex items-center gap-1">
                                            <Tag className="w-3 h-3" />
                                            {post.tags.slice(0, 3).join(', ')}
                                        </span>
                                    )}
                                </div>
                                {post.excerpt && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                                        {post.excerpt}
                                    </p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => setEditingPost(post)}
                                    className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 transition-colors"
                                    title="Edit"
                                >
                                    <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(post.id)}
                                    disabled={deletingId === post.id}
                                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors disabled:opacity-50"
                                    title="Delete"
                                >
                                    {deletingId === post.id ? (
                                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
