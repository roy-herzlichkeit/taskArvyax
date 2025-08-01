import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { sessionAPI } from '../utils/api';

const SessionEditor = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const sessionId = searchParams.get('id');

    const [formData, setFormData] = useState({
        title: '',
        tags: '',
        jsonFileUrl: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [saveLoading, setSaveLoading] = useState(false);

    useEffect(() => {
        if (sessionId) {
            // Load existing session for editing
            const loadSession = async () => {
                try {
                    setLoading(true);
                    const response = await sessionAPI.getSession(sessionId);
                    const session = response.data;
                    setFormData({
                        title: session.title || '',
                        tags: session.tags?.join(', ') || '',
                        jsonFileUrl: session.jsonFileUrl || ''
                    });
                } catch (err) {
                    setError('Failed to load session');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            loadSession();
        }
    }, [sessionId]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSaveDraft = async () => {
        setSaveLoading(true);
        setError('');

        try {
            const sessionData = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                sessionId: sessionId || undefined
            };

            await sessionAPI.saveDraft(sessionData);
            alert('Draft saved successfully!');
            navigate('/my-sessions');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save draft');
            console.error(err);
        } finally {
            setSaveLoading(false);
        }
    };

    const handlePublish = async () => {
        setSaveLoading(true);
        setError('');

        try {
            const sessionData = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                sessionId: sessionId || undefined
            };

            await sessionAPI.publishSession(sessionData);
            alert('Session published successfully!');
            navigate('/my-sessions');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to publish session');
            console.error(err);
        } finally {
            setSaveLoading(false);
        }
    };

    if (loading) return <div className="p-4">Loading session...</div>;

    return (
        <main className="p-4 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">
                {sessionId ? 'Edit Session' : 'Create New Session'}
            </h1>

            <div className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter session title"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                        Tags (comma-separated)
                    </label>
                    <input
                        type="text"
                        name="tags"
                        id="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="meditation, relaxation, breathing"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="mt-1 text-sm text-gray-500">Separate tags with commas</p>
                </div>

                <div>
                    <label htmlFor="jsonFileUrl" className="block text-sm font-medium text-gray-700 mb-2">
                        JSON File URL
                    </label>
                    <input
                        type="url"
                        name="jsonFileUrl"
                        id="jsonFileUrl"
                        value={formData.jsonFileUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/session-data.json"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {error && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <div className="flex gap-4 pt-4">
                    <button
                        onClick={handleSaveDraft}
                        disabled={saveLoading || !formData.title}
                        className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saveLoading ? 'Saving...' : 'Save as Draft'}
                    </button>

                    <button
                        onClick={handlePublish}
                        disabled={saveLoading || !formData.title}
                        className="flex-1 px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saveLoading ? 'Publishing...' : 'Publish'}
                    </button>
                </div>
            </div>
        </main>
    );
};

export default SessionEditor;