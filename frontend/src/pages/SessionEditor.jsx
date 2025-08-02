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
        <main className="flex justify-center items-center mt-20 mb-48 px-4">
            <div className="w-full max-w-md">
                <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center font2">
                    {sessionId ? 'Edit Session' : 'Create New Session'}
                </h1>
                
                <div className="mb-6 text-center">
                    {autoSaveStatus === 'saving' && (
                        <div className="flex items-center justify-center text-[#00684A]">
                            <div className="animate-spin h-4 w-4 border-2 border-[#00684A] border-t-transparent rounded-full mr-2"></div>
                            <span className="text-sm">Auto-saving...</span>
                        </div>
                    )}
                    {autoSaveStatus === 'saved' && (
                        <div className="flex items-center justify-center text-[#00684A]">
                            <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm">All changes saved</span>
                        </div>
                    )}
                    {autoSaveStatus === 'error' && (
                        <div className="flex items-center justify-center text-red-600">
                            <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm">Auto-save failed</span>
                        </div>
                    )}
                    {lastSaved && (
                        <span className="text-sm text-gray-500 block mt-2">
                            Last saved: {lastSaved.toLocaleTimeString()}
                        </span>
                    )}
                </div>

                <form className="flex flex-col space-y-6">
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="title" className="font2 text-2xl">Title *</label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full border-2 border-black rounded-full py-3 px-4 focus:border-[#00ED64] focus:outline-none transition-colors duration-300"
                            placeholder="Enter session title"
                            required
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label htmlFor="tags" className="font2 text-2xl">Tags</label>
                        <input
                            type="text"
                            name="tags"
                            id="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="meditation, relaxation, breathing"
                            className="w-full border-2 border-black rounded-full py-3 px-4 focus:border-[#00ED64] focus:outline-none transition-colors duration-300"
                        />
                        <p className="text-sm text-gray-500 px-4">Separate tags with commas</p>
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label htmlFor="jsonFileUrl" className="font2 text-2xl">JSON File URL</label>
                        <input
                            type="url"
                            name="jsonFileUrl"
                            id="jsonFileUrl"
                            value={formData.jsonFileUrl}
                            onChange={handleChange}
                            placeholder="https://example.com/session-data.json"
                            className="w-full border-2 border-black rounded-full py-3 px-4 focus:border-[#00ED64] focus:outline-none transition-colors duration-300"
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-center bg-red-50 p-3 rounded-full border border-red-200">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col space-y-3 pt-4">
                        <button
                            type="button"
                            onClick={handleSaveDraft}
                            disabled={saveLoading || !formData.title}
                            className="w-full zen-button text-lg border-2 border-black bg-[#B1FF05] text-[#00684A] py-3 transition-all duration-300 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saveLoading ? 'Saving...' : 'Save as Draft'}
                        </button>

                        <button
                            type="button"
                            onClick={handlePublish}
                            disabled={saveLoading || !formData.title}
                            className="w-full zen-button text-lg border-2 border-black bg-[#00ED64] text-[#00684A] py-3 transition-all duration-300 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saveLoading ? 'Publishing...' : 'Publish'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default SessionEditor;