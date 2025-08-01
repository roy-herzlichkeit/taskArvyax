import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { sessionAPI } from '../utils/api';

const SessionEditor = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [sessionId, setSessionId] = useState(searchParams.get('id'));

    const [formData, setFormData] = useState({
        title: '',
        tags: '',
        jsonFileUrl: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [saveLoading, setSaveLoading] = useState(false);
    const [autoSaveStatus, setAutoSaveStatus] = useState('idle');
    const [hasChanges, setHasChanges] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [initialFormData, setInitialFormData] = useState(null);

    const autoSaveTimerRef = useRef(null);
    const debounceTimerRef = useRef(null);

    const autoSaveDraft = useCallback(async () => {
        if (!hasChanges || !formData.title.trim())
            return;
        setAutoSaveStatus('saving');
        try {
            const sessionData = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                sessionId: sessionId || undefined
            };
            const res = await sessionAPI.saveDraft(sessionData);
            
            if (!sessionId && res.data.session._id) {
                const newSessionId = res.data.session._id;
                setSessionId(newSessionId);
                window.history.replaceState(null, '', `/session-editor?id=${newSessionId}`);
            }
            
            setAutoSaveStatus('saved');
            setLastSaved(new Date());
            setHasChanges(false);
            setTimeout(() => setAutoSaveStatus('idle'), 2000);
        } catch (e) {
            setAutoSaveStatus('error');
            console.error('Auto-save failed', e);
            setTimeout(() => setAutoSaveStatus('idle'), 5000);
        }
    }, [formData, hasChanges, sessionId]);

    useEffect(() => {
        const currentSessionId = sessionId || searchParams.get('id');
        if (currentSessionId) {
            const loadSession = async () => {
                try {
                    setLoading(true);
                    const response = await sessionAPI.getSession(currentSessionId);
                    const session = response.data;
                    setFormData({
                        title: session.title || '',
                        tags: session.tags?.join(', ') || '',
                        jsonFileUrl: session.jsonFileUrl || ''
                    });
                    setInitialFormData({
                        title: session.title || '',
                        tags: session.tags?.join(', ') || '',
                        jsonFileUrl: session.jsonFileUrl || ''
                    });
                    setHasChanges(false);
                    setSessionId(currentSessionId);
                } catch (err) {
                    setError('Failed to load session');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            loadSession();
        }
    }, [searchParams, sessionId]);

    useEffect(() => {
        if (hasChanges && formData.title.trim()) {
            autoSaveTimerRef.current = setInterval(() => {
                autoSaveDraft();
            }, 45000);
        } else {
            if (autoSaveTimerRef.current) {
                clearInterval(autoSaveTimerRef.current);
            }
        }

        return () => {
            if (autoSaveTimerRef.current) {
                clearInterval(autoSaveTimerRef.current);
            }
        };
    }, [hasChanges, formData.title, autoSaveDraft]);

    const handleChange = (e) => {
        const newFormData = {
            ...formData,
            [e.target.name]: e.target.value
        };

        setFormData(newFormData);

        if (initialFormData) {
            const hasActualChanges =
                newFormData.title !== initialFormData.title ||
                newFormData.tags !== initialFormData.tags ||
                newFormData.jsonFileUrl !== initialFormData.jsonFileUrl;

            setHasChanges(hasActualChanges);
        } else {
            setHasChanges(newFormData.title.trim() !== '');
        }

        if (autoSaveStatus === 'saved') {
            setAutoSaveStatus('idle');
        }

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            if (newFormData.title.trim()) {
                autoSaveDraft();
            }
        }, 2000);
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

            const response = await sessionAPI.saveDraft(sessionData);
            
            if (!sessionId && response.data.session._id) {
                setSessionId(response.data.session._id);
                window.history.replaceState(null, '', `/session-editor?id=${response.data.session._id}`);
            }
            
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

            const response = await sessionAPI.publishSession(sessionData);
            
            if (!sessionId && response.data.session._id) {
                setSessionId(response.data.session._id);
            }
            
            alert('Session published successfully!');
            navigate('/my-sessions');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to publish session');
            console.error(err);
        } finally {
            setSaveLoading(false);
        }
    };

    useEffect(() => {
        return () => {
            if (autoSaveTimerRef.current) {
                clearInterval(autoSaveTimerRef.current);
            }
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    if (loading) 
        return <div className="p-4">Loading session...</div>;

    return (
        <main className="p-4 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">
                {sessionId ? 'Edit Session' : 'Create New Session'}
            </h1>
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {autoSaveStatus === 'saving' && (
                        <div className="flex items-center text-blue-600">
                            <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                            <span className="text-sm">Auto-saving...</span>
                        </div>
                    )}
                    {autoSaveStatus === 'saved' && (
                        <div className="flex items-center text-green-600">
                            <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm">All changes saved</span>
                        </div>
                    )}
                    {autoSaveStatus === 'error' && (
                        <div className="flex items-center text-red-600">
                            <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm">Auto-save failed</span>
                        </div>
                    )}
                </div>
                {lastSaved && (
                    <span className="text-sm text-gray-500">
                        Last saved: {lastSaved.toLocaleTimeString()}
                    </span>
                )}
            </div>
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