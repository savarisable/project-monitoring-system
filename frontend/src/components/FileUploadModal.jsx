import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

export const FileUploadModal = ({ isOpen, onClose, onUpload, milestoneTitle, currentVersion = 1, isResubmission = false }) => {
  const [file, setFile] = useState(null);
  const [studentNotes, setStudentNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload (PDF, DOCX, PPTX).');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await onUpload(file, studentNotes);
      setFile(null);
      setStudentNotes('');
      onClose();
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isResubmission ? `Resubmit ${milestoneTitle} (Version ${currentVersion + 1})` : `Upload ${milestoneTitle}`}
      maxWidth="550px"
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Select Document (PDF, DOC, DOCX, PPT, PPTX - Max 25MB)</label>
          <div
            style={{
              border: '2px dashed var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem 1rem',
              textAlign: 'center',
              backgroundColor: '#fafbfc',
              cursor: 'pointer',
            }}
            onClick={() => document.getElementById('file-input-modal').click()}
          >
            <Upload size={32} style={{ margin: '0 auto 0.75rem auto', color: 'var(--primary-600)' }} />
            <input
              id="file-input-modal"
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFile(e.target.files[0]);
                  setError('');
                }
              }}
            />
            {file ? (
              <div style={{ color: '#0f172a', fontWeight: 600 }}>
                <FileText size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
                {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
              </div>
            ) : (
              <div>
                <p style={{ fontWeight: 500, color: 'var(--text-main)' }}>Click to browse or drag and drop file here</p>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>Allowed formats: PDF (Recommended), DOCX, PPTX</p>
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Submission Remarks / Notes (Optional)</label>
          <textarea
            className="form-control"
            rows="3"
            placeholder="Add brief details about the changes or highlights of this version..."
            value={studentNotes}
            onChange={(e) => setStudentNotes(e.target.value)}
          ></textarea>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Uploading...' : 'Submit Document'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const ReviewModal = ({ isOpen, onClose, onReview, submissionTitle, versionNumber, templates = [] }) => {
  const [verdict, setVerdict] = useState('VERIFIED');
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [customRemarks, setCustomRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleTemplateClick = (tmpl) => {
    setSelectedTemplateId(tmpl.id);
    if (!customRemarks.trim()) {
      setCustomRemarks(tmpl.messageTemplate);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const selectedTmpl = templates.find((t) => t.id === selectedTemplateId);
      await onReview({
        verdict,
        predefinedFeedbackId: selectedTemplateId,
        predefinedFeedbackText: selectedTmpl ? selectedTmpl.messageTemplate : null,
        customRemarks,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Review submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Review ${submissionTitle} (Version ${versionNumber})`}
      maxWidth="600px"
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Review Verdict *</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div
              style={{
                border: verdict === 'VERIFIED' ? '2px solid #10b981' : '1px solid var(--border-color)',
                backgroundColor: verdict === 'VERIFIED' ? '#ecfdf5' : 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                padding: '1rem',
                cursor: 'pointer',
                textAlign: 'center',
              }}
              onClick={() => setVerdict('VERIFIED')}
            >
              <CheckCircle2 size={24} style={{ color: '#10b981', margin: '0 auto 0.5rem auto' }} />
              <div style={{ fontWeight: 700, color: '#065f46' }}>Verify & Approve</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Approve this milestone stage</div>
            </div>

            <div
              style={{
                border: verdict === 'CORRECTION_REQUIRED' ? '2px solid #ef4444' : '1px solid var(--border-color)',
                backgroundColor: verdict === 'CORRECTION_REQUIRED' ? '#fef2f2' : 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                padding: '1rem',
                cursor: 'pointer',
                textAlign: 'center',
              }}
              onClick={() => setVerdict('CORRECTION_REQUIRED')}
            >
              <AlertTriangle size={24} style={{ color: '#ef4444', margin: '0 auto 0.5rem auto' }} />
              <div style={{ fontWeight: 700, color: '#991b1b' }}>Correction Required</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Request student resubmission</div>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Select Predefined Feedback (Quick Academic Response)</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
            {templates.map((tmpl) => (
              <button
                key={tmpl.id}
                type="button"
                className={`feedback-template-btn ${selectedTemplateId === tmpl.id ? 'active' : ''}`}
                onClick={() => handleTemplateClick(tmpl)}
              >
                {tmpl.title}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Guide Remarks & Specific Feedback</label>
          <textarea
            className="form-control"
            rows="4"
            placeholder="Enter specific corrections, guidelines, or commendations for the student group..."
            value={customRemarks}
            onChange={(e) => setCustomRemarks(e.target.value)}
          ></textarea>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button
            type="submit"
            className={`btn btn-${verdict === 'VERIFIED' ? 'success' : 'danger'}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Recording...' : verdict === 'VERIFIED' ? 'Confirm Verification' : 'Send Correction Notice'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
