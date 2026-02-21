import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, Award } from 'lucide-react';
import { useSkills } from '../../hooks/useSkills';

export default function SkillsManagement() {
    const { skills, loading, addSkill, updateSkill, deleteSkill } = useSkills();
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        icon: '',
    });

    const resetForm = () => {
        setFormData({ name: '', description: '', icon: '' });
        setShowForm(false);
        setEditingId(null);
    };

    const handleEdit = (skill: any) => {
        setFormData({
            name: skill.name,
            description: skill.description || '',
            icon: skill.icon || '',
        });
        setEditingId(skill.id);
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            await updateSkill(editingId, formData);
        } else {
            await addSkill({ ...formData, order_index: skills.length });
        }
        resetForm();
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Delete this skill?')) {
            await deleteSkill(id);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Skills</h3>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Skill
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
                            {editingId ? 'Edit Skill' : 'New Skill'}
                        </h4>
                        <button type="button" onClick={resetForm} className="p-2 text-gray-500"><X className="w-5 h-5" /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" required placeholder="Skill Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                        <input type="text" placeholder="Icon (e.g. lucide name)" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                    </div>
                    <textarea placeholder="Description" rows={2} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                    <div className="flex gap-3">
                        <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            <Save className="w-5 h-5" /> {editingId ? 'Update' : 'Add'}
                        </button>
                        <button type="button" onClick={resetForm} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg">Cancel</button>
                    </div>
                </motion.form>
            )}

            <div className="space-y-3">
                {skills.map((skill, i) => (
                    <motion.div key={skill.id} layout className="flex items-center gap-4 bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                            {i + 1}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{skill.name}</h4>
                            {skill.description && <p className="text-sm text-gray-600 dark:text-gray-400">{skill.description}</p>}
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleEdit(skill)} className="p-2 text-blue-600 hover:text-blue-700"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(skill.id)} className="p-2 text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {skills.length === 0 && (
                <div className="text-center py-12">
                    <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No skills yet. Add your first skill!</p>
                </div>
            )}
        </div>
    );
}
