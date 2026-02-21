import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, Camera, Image, Upload, CheckCircle, AlertCircle, ArrowLeft, GripVertical } from 'lucide-react';
import { usePhotoAlbums, usePhotos } from '../../hooks/usePhotoAlbums';

export default function PhotoManagement() {
    const { albums, loading, addAlbum, updateAlbum, deleteAlbum } = usePhotoAlbums();
    const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        cover_image_url: '',
    });

    const resetForm = () => {
        setFormData({ title: '', description: '', cover_image_url: '' });
        setShowForm(false);
        setEditingId(null);
    };

    const handleEdit = (album: any) => {
        setFormData({
            title: album.title,
            description: album.description || '',
            cover_image_url: album.cover_image_url || '',
        });
        setEditingId(album.id);
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            await updateAlbum(editingId, formData);
        } else {
            await addAlbum({ ...formData, order_index: albums.length });
        }
        resetForm();
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Delete this album and all its photos?')) {
            await deleteAlbum(id);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (selectedAlbumId) {
        return (
            <PhotosPanel
                albumId={selectedAlbumId}
                albumTitle={albums.find(a => a.id === selectedAlbumId)?.title || 'Album'}
                onBack={() => setSelectedAlbumId(null)}
            />
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Photo Albums</h3>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    New Album
                </button>
            </div>

            {showForm && (
                <motion.form
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmit}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 space-y-4"
                >
                    <div className="flex justify-between items-center">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {editingId ? 'Edit Album' : 'New Album'}
                        </h4>
                        <button type="button" onClick={resetForm} className="p-2 text-gray-500 hover:text-gray-700">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <input
                        type="text"
                        required
                        placeholder="Album Title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <textarea
                        placeholder="Description"
                        rows={2}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <input
                        type="url"
                        placeholder="Cover Image URL (optional — first uploaded photo will be used)"
                        value={formData.cover_image_url}
                        onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <div className="flex gap-3">
                        <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                            <Save className="w-5 h-5" />
                            {editingId ? 'Update' : 'Create'}
                        </button>
                        <button type="button" onClick={resetForm} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg">
                            Cancel
                        </button>
                    </div>
                </motion.form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {albums.map((album) => (
                    <motion.div
                        key={album.id}
                        layout
                        className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden cursor-pointer group"
                    >
                        <div
                            onClick={() => setSelectedAlbumId(album.id)}
                            className="aspect-[4/3] overflow-hidden"
                        >
                            {album.cover_image_url ? (
                                <img src={album.cover_image_url} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-500 flex items-center justify-center">
                                    <Camera className="w-12 h-12 text-gray-400" />
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start">
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{album.title}</h4>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(album)} className="p-1 text-blue-600 hover:text-blue-700"><Edit className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(album.id)} className="p-1 text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                            {album.description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{album.description}</p>}
                        </div>
                    </motion.div>
                ))}
            </div>

            {albums.length === 0 && (
                <div className="text-center py-12">
                    <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No albums yet. Create your first one!</p>
                </div>
            )}
        </div>
    );
}

// Drag-and-drop photo uploader & manager with reordering
function PhotosPanel({ albumId, albumTitle, onBack }: { albumId: string; albumTitle: string; onBack: () => void }) {
    const { photos, loading, uploadPhotos, uploadProgress, deletePhoto, reorderPhotos } = usePhotos(albumId);
    const [isDragging, setIsDragging] = useState(false);

    // Reorder drag state
    const [draggedPhotoId, setDraggedPhotoId] = useState<string | null>(null);
    const [dragOverPhotoId, setDragOverPhotoId] = useState<string | null>(null);
    const [localPhotos, setLocalPhotos] = useState(photos);

    // Sync localPhotos with fetched photos
    React.useEffect(() => {
        setLocalPhotos(photos);
    }, [photos]);

    // --- File upload drag-and-drop ---
    const handleDragOver = useCallback((e: React.DragEvent) => {
        // Only respond to file drags, not photo reorder drags
        if (draggedPhotoId) return;
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, [draggedPhotoId]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        if (draggedPhotoId) return;
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, [draggedPhotoId]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        if (draggedPhotoId) return;
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files).filter(f =>
            f.type.startsWith('image/')
        );

        if (files.length > 0) {
            uploadPhotos(files, albumId);
        }
    }, [albumId, uploadPhotos, draggedPhotoId]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            uploadPhotos(files, albumId);
            e.target.value = ''; // Reset input
        }
    };

    // --- Photo reorder drag-and-drop ---
    const handlePhotoDragStart = (e: React.DragEvent, photoId: string) => {
        setDraggedPhotoId(photoId);
        e.dataTransfer.effectAllowed = 'move';
        // Set a transparent drag image so we see our custom styling
        const el = e.currentTarget as HTMLElement;
        e.dataTransfer.setDragImage(el, el.offsetWidth / 2, el.offsetHeight / 2);
    };

    const handlePhotoDragOver = (e: React.DragEvent, photoId: string) => {
        if (!draggedPhotoId || draggedPhotoId === photoId) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverPhotoId(photoId);
    };

    const handlePhotoDragEnd = async () => {
        if (!draggedPhotoId || !dragOverPhotoId || draggedPhotoId === dragOverPhotoId) {
            setDraggedPhotoId(null);
            setDragOverPhotoId(null);
            return;
        }

        // Compute new order
        const oldIndex = localPhotos.findIndex(p => p.id === draggedPhotoId);
        const newIndex = localPhotos.findIndex(p => p.id === dragOverPhotoId);

        if (oldIndex === -1 || newIndex === -1) {
            setDraggedPhotoId(null);
            setDragOverPhotoId(null);
            return;
        }

        // Create reordered array (optimistic UI)
        const reordered = [...localPhotos];
        const [moved] = reordered.splice(oldIndex, 1);
        reordered.splice(newIndex, 0, moved);
        setLocalPhotos(reordered);

        setDraggedPhotoId(null);
        setDragOverPhotoId(null);

        // Persist new order to database
        await reorderPhotos(reordered.map((p, i) => ({ id: p.id, order_index: i })));
    };

    const isUploading = uploadProgress.some(p => p.status === 'uploading' || p.status === 'pending');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="flex items-center gap-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{albumTitle}</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {localPhotos.length} photo{localPhotos.length !== 1 ? 's' : ''}
                </span>
            </div>

            {/* Reorder hint */}
            {localPhotos.length > 1 && (
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                    <GripVertical className="w-3 h-3" />
                    Drag photos by the grip handle to reorder
                </p>
            )}

            {/* Drag-and-drop upload zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                    relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer
                    ${isDragging
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 scale-[1.01]'
                        : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }
                `}
                onClick={() => document.getElementById('photo-file-input')?.click()}
            >
                <input
                    id="photo-file-input"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />

                <div className="flex flex-col items-center gap-3">
                    <div className={`p-4 rounded-full transition-colors ${isDragging ? 'bg-purple-100 dark:bg-purple-800/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                        <Upload className={`w-8 h-8 ${isDragging ? 'text-purple-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                            {isDragging ? 'Drop photos here' : 'Drag & drop photos here'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            or click to browse • JPG, PNG, WebP supported
                        </p>
                    </div>
                </div>
            </div>

            {/* Upload progress */}
            {uploadProgress.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {isUploading ? 'Uploading...' : 'Upload Complete'}
                    </h4>
                    {uploadProgress.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                            {item.status === 'done' && <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />}
                            {item.status === 'error' && <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
                            {(item.status === 'uploading' || item.status === 'pending') && (
                                <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                            )}
                            <span className="text-sm text-gray-600 dark:text-gray-400 truncate flex-1 min-w-0">
                                {item.file}
                            </span>
                            <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex-shrink-0">
                                <div
                                    className={`h-full rounded-full transition-all duration-300 ${item.status === 'error' ? 'bg-red-500' :
                                        item.status === 'done' ? 'bg-green-500' : 'bg-purple-500'
                                        }`}
                                    style={{ width: `${item.progress}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Photo grid with reordering */}
            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : localPhotos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {localPhotos.map((photo) => (
                        <motion.div
                            key={photo.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            draggable
                            onDragStart={(e) => handlePhotoDragStart(e as unknown as React.DragEvent, photo.id)}
                            onDragOver={(e) => handlePhotoDragOver(e as unknown as React.DragEvent, photo.id)}
                            onDragEnd={handlePhotoDragEnd}
                            className={`
                                relative group rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-sm hover:shadow-lg transition-all duration-200
                                ${draggedPhotoId === photo.id ? 'opacity-40 scale-95 ring-2 ring-purple-500' : ''}
                                ${dragOverPhotoId === photo.id && draggedPhotoId !== photo.id ? 'ring-2 ring-purple-400 scale-105' : ''}
                            `}
                        >
                            <img
                                src={photo.thumbnail_url || photo.image_url}
                                alt={photo.title || ''}
                                className="w-full aspect-square object-cover pointer-events-none"
                                loading="lazy"
                            />
                            {/* Grip handle (top-left) */}
                            <div className="absolute top-2 left-2 p-1 bg-black/50 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                                <GripVertical className="w-4 h-4 text-white" />
                            </div>
                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between pointer-events-auto">
                                    <span className="text-white text-xs truncate max-w-[70%]">
                                        {photo.title || 'Untitled'}
                                    </span>
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Delete this photo?')) {
                                                deletePhoto(photo.id);
                                            }
                                        }}
                                        className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <Image className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-lg">No photos yet</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                        Drag and drop images above to get started
                    </p>
                </div>
            )}
        </div>
    );
}
