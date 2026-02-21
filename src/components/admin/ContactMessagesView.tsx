import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Archive, Trash2, Eye, Clock, CheckCircle } from 'lucide-react';
import { useContactMessages } from '../../hooks/useContactMessages';

type FilterType = 'all' | 'new' | 'read' | 'archived';

export default function ContactMessagesView() {
    const { messages, loading, updateMessageStatus, deleteMessage } = useContactMessages();
    const [filter, setFilter] = useState<FilterType>('all');

    const filteredMessages = filter === 'all'
        ? messages
        : messages.filter((m) => m.status === filter);

    const newCount = messages.filter(m => m.status === 'new').length;

    const handleStatusChange = async (id: string, status: 'new' | 'read' | 'archived') => {
        await updateMessageStatus(id, status);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Delete this message?')) {
            await deleteMessage(id);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const statusColors = {
        new: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
        read: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
        archived: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h3>
                    {newCount > 0 && (
                        <span className="px-2 py-1 text-xs font-bold bg-green-500 text-white rounded-full">
                            {newCount} new
                        </span>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {(['all', 'new', 'read', 'archived'] as FilterType[]).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${filter === f
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                    >
                        {f} {f !== 'all' && `(${messages.filter(m => f === 'all' || m.status === f).length})`}
                    </button>
                ))}
            </div>

            {/* Message list */}
            <div className="space-y-4">
                {filteredMessages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        layout
                        className={`bg-white dark:bg-gray-700 rounded-lg shadow-sm p-5 border-l-4 ${msg.status === 'new' ? 'border-green-500' : msg.status === 'read' ? 'border-blue-500' : 'border-gray-300'
                            }`}
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">{msg.name}</h4>
                                <a href={`mailto:${msg.email}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                    {msg.email}
                                </a>
                                {msg.phone && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{msg.phone}</p>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[msg.status]}`}>
                                    {msg.status}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {new Date(msg.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 whitespace-pre-wrap">
                            {msg.message}
                        </p>

                        <div className="flex gap-2">
                            {msg.status === 'new' && (
                                <button
                                    onClick={() => handleStatusChange(msg.id, 'read')}
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100"
                                >
                                    <Eye className="w-3 h-3" /> Mark Read
                                </button>
                            )}
                            {msg.status !== 'archived' && (
                                <button
                                    onClick={() => handleStatusChange(msg.id, 'archived')}
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100"
                                >
                                    <Archive className="w-3 h-3" /> Archive
                                </button>
                            )}
                            <button
                                onClick={() => handleDelete(msg.id)}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100"
                            >
                                <Trash2 className="w-3 h-3" /> Delete
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredMessages.length === 0 && (
                <div className="text-center py-12">
                    <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No messages to show.</p>
                </div>
            )}
        </div>
    );
}
