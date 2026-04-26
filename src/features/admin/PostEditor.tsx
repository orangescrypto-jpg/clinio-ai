import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../api/firebase';

const CATEGORIES = ['Clinical Medicine', 'NCLEX', 'NMCN'];

export const PostEditor: React.FC = () => {
  const [title, setTitle] = useState('');
  const [preview, setPreview] = useState('');
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const insertFormatting = (format: string) => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    
    let replacement = '';
    switch (format) {
      case 'bold': replacement = `**${selected || 'bold text'}**`; break;
      case 'h1': replacement = `# ${selected || 'Heading 1'}`; break;
      case 'h2': replacement = `## ${selected || 'Heading 2'}`; break;
      case 'bullet': replacement = `- ${selected || 'list item'}`; break;
      case 'number': replacement = `1. ${selected || 'list item'}`; break;
      case 'line': replacement = `---`; break;
    }

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);
  };

  const handleSave = async () => {
    if (!title || !content) {
      setMessage('Title and content are required!');
      return;
    }

    setSaving(true);
    try {
      await addDoc(collection(db, 'posts'), {
        title,
        preview: preview || content.substring(0, 150) + '...',
        content,
        topic,
        category,
        subCategory: '',
        imageUrl,
        videoUrl,
        hasVideo: videoUrl !== '',
        author: 'Clinio AI',
        readTime: `${Math.ceil(content.split(' ').length / 200)} min read`,
        likes: 0,
        comments: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setMessage('✅ Post saved successfully!');
      setTitle('');
      setPreview('');
      setContent('');
      setTopic('');
      setCategory('');
      setImageUrl('');
      setVideoUrl('');
    } catch (error) {
      setMessage('❌ Error saving post');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Create New Post</h2>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="input-field"
          placeholder="Post title..."
        />
      </div>

      {/* Preview */}
      <div>
        <label className="block text-sm font-medium mb-1">Preview (short summary)</label>
        <input
          value={preview}
          onChange={e => setPreview(e.target.value)}
          className="input-field"
          placeholder="Brief preview for homepage..."
        />
      </div>

      {/* Category & Topic */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)} className="input-field">
            <option value="">Select...</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Topic</label>
          <input value={topic} onChange={e => setTopic(e.target.value)} className="input-field" placeholder="e.g. Cardiovascular" />
        </div>
      </div>

      {/* Formatting Toolbar */}
      <div>
        <label className="block text-sm font-medium mb-1">Content</label>
        <div className="flex gap-1 mb-2 flex-wrap">
          <button onClick={() => insertFormatting('bold')} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm font-bold">B</button>
          <button onClick={() => insertFormatting('h1')} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm">H1</button>
          <button onClick={() => insertFormatting('h2')} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm">H2</button>
          <button onClick={() => insertFormatting('bullet')} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm">• List</button>
          <button onClick={() => insertFormatting('number')} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm">1. List</button>
          <button onClick={() => insertFormatting('line')} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm">---</button>
        </div>
        <textarea
          id="content-editor"
          value={content}
          onChange={e => setContent(e.target.value)}
          className="input-field h-64 font-mono text-sm"
          placeholder="Write your post content...\n\nUse formatting buttons above or:\n# for heading\n** for bold**\n- for bullets\n1. for numbers"
        />
      </div>

      {/* Preview */}
      {content && (
        <div className="card bg-gray-50">
          <h3 className="text-sm font-medium mb-2">📄 Preview</h3>
          <div className="prose prose-sm max-w-none">
            {content.split('\n').map((line, i) => {
              if (line.startsWith('# ')) return <h1 key={i} className="text-xl font-bold mt-3 mb-1">{line.replace('# ', '')}</h1>;
              if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-semibold mt-2 mb-1">{line.replace('## ', '')}</h2>;
              if (line.startsWith('**')) return <p key={i} className="font-bold">{line.replace(/\*\*/g, '')}</p>;
              if (line.startsWith('- ')) return <li key={i} className="ml-4 text-sm">{line.replace('- ', '')}</li>;
              if (line.startsWith('---')) return <hr key={i} className="my-2" />;
              if (line.trim() === '') return <br key={i} />;
              return <p key={i} className="text-sm mb-1">{line}</p>;
            })}
          </div>
        </div>
      )}

      {/* Image URL */}
      <div>
        <label className="block text-sm font-medium mb-1">Image URL (optional)</label>
        <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="input-field" placeholder="https://example.com/image.jpg" />
        <p className="text-xs text-gray-400 mt-1">Upload to imgbb.com or imgur.com and paste link here</p>
      </div>

      {/* Video URL */}
      <div>
        <label className="block text-sm font-medium mb-1">YouTube Video URL (optional)</label>
        <input value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="input-field" placeholder="https://youtube.com/watch?v=..." />
      </div>

      {/* Message */}
      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      {/* Save */}
      <button onClick={handleSave} disabled={saving} className="btn-primary w-full text-lg">
        {saving ? 'Saving...' : '💾 Save Post'}
      </button>
    </div>
  );
};
