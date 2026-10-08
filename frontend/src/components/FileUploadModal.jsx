import React, { useState } from 'react';
import { X, Upload, CheckCircle2, AlertCircle, Video, FileText, Link, Sparkles } from 'lucide-react';
import { studentApi } from '../services/api';

const FileUploadModal = ({ isOpen, onClose, milestone, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen || !milestone) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.size > 100 * 1024 * 1024) {
        setError('File size exceeds 100 MB limit. Please compress or provide a Google Drive / YouTube link below.');
        setFile(null);
        return;
      }
      setFile(selected);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file && !linkUrl.trim()) {
      setError('Please choose a file to upload or enter a project/video link.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      }
      if (linkUrl.trim()) {
        formData.append('linkUrl', linkUrl.trim());
      }
      if (remarks.trim()) {
        formData.append('remarks', remarks.trim());
      }

      await studentApi.submitMilestone(milestone.id, formData);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        setFile(null);
        setLinkUrl('');
        setRemarks('');
        if (onSuccess) onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Upload failed. Please check file size and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Upload size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                Upload Deliverable
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[260px] sm:max-w-xs">
                {milestone.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {/* Success Notification Banner */}
          {success && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center gap-3 animate-bounce">
              <CheckCircle2 size={24} className="text-emerald-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold">Upload Successful! 🎉</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-300">
                  Deliverable submitted for faculty guide review.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* File Upload Box */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Deliverable File (PDF, ZIP, MP4, Docs - Up to 100MB)
            </label>
            <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-xl p-4 text-center transition cursor-pointer bg-slate-50/50 dark:bg-slate-800/30">
              <input
                type="file"
                onChange={handleFileChange}
                disabled={loading || success}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {file ? (
                <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-xs sm:text-sm">
                  <FileText size={20} />
                  <span className="truncate max-w-[240px]">{file.name}</span>
                  <span className="text-[11px] text-slate-500">
                    ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                  </span>
                </div>
              ) : (
                <div className="space-y-1">
                  <Upload size={24} className="mx-auto text-slate-400" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Tap or Drag &amp; Drop to Upload
                  </p>
                  <p className="text-[11px] text-slate-400">PDF, ZIP, MP4 Video, PNG up to 100MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Video / Prototype Link */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Link size={13} className="text-blue-500" />
              <span>Demo Video / YouTube / GitHub Link (Optional)</span>
            </label>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://youtu.be/... or Google Drive video link"
              disabled={loading || success}
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Submission Remarks */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Submission Remarks / Changelog (Optional)
            </label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Brief details about what was accomplished in this milestone..."
              disabled={loading || success}
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading || success}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white transition shadow-md ${
                success
                  ? 'bg-emerald-600 shadow-emerald-600/30'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30 disabled:opacity-50'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Uploading Deliverable...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle2 size={15} />
                  <span>Uploaded!</span>
                </>
              ) : (
                <>
                  <Upload size={15} />
                  <span>Submit Deliverable</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FileUploadModal;
