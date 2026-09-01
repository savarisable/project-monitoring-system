import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { formatDate, formatDateTime } from '../../utils/dateUtils';
import { DataTable } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { ReviewModal } from '../../components/FileUploadModal';
import {
  FileCheck2,
  Download,
  CheckCircle2,
  AlertTriangle,
  History,
  FileText,
  CalendarCheck,
  Award,
  Clock,
} from 'lucide-react';

export const GuideSubmissionsPage = () => {
  const [submissionTab, setSubmissionTab] = useState('MY_GROUPS'); // 'MY_GROUPS' or 'ALL_DEPT'
  const [submissions, setSubmissions] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubVersion, setSelectedSubVersion] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
  const [offlineMilestoneId, setOfflineMilestoneId] = useState('');
  const [offlineNotes, setOfflineNotes] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadData = async (tab = submissionTab) => {
    setLoading(true);
    try {
      const [subsData, tmplsData] = await Promise.all([
        tab === 'ALL_DEPT' ? api.guide.getAllDepartmentSubmissions() : api.guide.getSubmissions(),
        api.common.getFeedbackTemplates(),
      ]);
      setSubmissions(subsData);
      setTemplates(tmplsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(submissionTab);
  }, [submissionTab]);

  const handleTabSwitch = (tab) => {
    setSubmissionTab(tab);
    loadData(tab);
  };

  const handleOpenReview = (submission) => {
    if (!submission.versions || submission.versions.length === 0) {
      setError('No submitted document version found for this milestone.');
      return;
    }
    const latestVersion = submission.versions[0]; // ordered desc
    setSelectedSubVersion(latestVersion);
    setSelectedSubmission(submission);
    setError('');
    setIsReviewModalOpen(true);
  };

  const handlePerformReview = async (reviewData) => {
    try {
      await api.guide.reviewSubmission({
        submissionVersionId: selectedSubVersion.id,
        verdict: reviewData.verdict,
        predefinedFeedbackId: reviewData.predefinedFeedbackId,
        predefinedFeedbackText: reviewData.predefinedFeedbackText,
        customRemarks: reviewData.customRemarks,
      });

      setMessage(`Review recorded successfully. Verdict: ${reviewData.verdict}`);
      loadData();
    } catch (err) {
      throw err;
    }
  };

  const handleMarkOffline = async (e) => {
    e.preventDefault();
    if (!offlineMilestoneId) {
      setError('Please select milestone');
      return;
    }
    try {
      await api.guide.markOffline({
        projectMilestoneId: Number(offlineMilestoneId),
        notes: offlineNotes,
      });
      setIsOfflineModalOpen(false);
      setOfflineNotes('');
      setMessage('Marked as physical/offline submission successfully.');
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to mark offline submission.');
    }
  };

  const columns = [
    {
      header: 'Group & Milestone',
      render: (s) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
            {s.groupNumber}: {s.milestoneTitle}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.projectTitle}</div>
        </div>
      ),
    },
    {
      header: 'Current Version',
      render: (s) => (
        <span className="badge badge-neutral">V{s.currentVersion}</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (s) => <StatusBadge status={s.status} />,
    },
    {
      header: 'Latest Document',
      render: (s) => {
        const latest = s.versions?.[0];
        if (!latest) return <span style={{ color: 'var(--text-subtle)', fontSize: '0.75rem' }}>No file</span>;

        if (latest.submissionMode === 'OFFLINE') {
          return <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600 }}>Physical Hardcopy</span>;
        }

        return (
          <a
            href={api.common.getFileDownloadUrl(latest.id)}
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.75rem' }}
          >
            <Download size={13} /> {latest.fileName}
          </a>
        );
      },
    },
    {
      header: 'Actions',
      render: (s) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => handleOpenReview(s)}
            disabled={s.status === 'VERIFIED'}
          >
            <CheckCircle2 size={14} /> {s.status === 'VERIFIED' ? 'Verified' : 'Review & Verify'}
          </button>
          <button
            className="btn btn-secondary btn-sm"
            title="Version History"
            onClick={() => {
              setSelectedSubmission(s);
              setIsHistoryModalOpen(true);
            }}
          >
            <History size={14} /> History ({s.versions?.length || 0})
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>Submissions & Document Reviews</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Review student project reports, evaluate versions, request corrections, and approve stages.
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', backgroundColor: 'var(--bg-subtle)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <button
            type="button"
            className={`btn btn-sm ${submissionTab === 'MY_GROUPS' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none', borderRadius: '6px' }}
            onClick={() => handleTabSwitch('MY_GROUPS')}
          >
            My Assigned Groups
          </button>
          <button
            type="button"
            className={`btn btn-sm ${submissionTab === 'ALL_DEPT' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none', borderRadius: '6px' }}
            onClick={() => handleTabSwitch('ALL_DEPT')}
          >
            All Department Submissions
          </button>
        </div>
      </div>

      {message && (
        <div style={{ padding: '0.75rem 1rem', backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
          {message}
        </div>
      )}

      {error && (
        <div style={{ padding: '0.75rem 1rem', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      <div className="card">
        <DataTable
          columns={columns}
          data={submissions}
          searchPlaceholder="Search submissions by group, milestone..."
          emptyMessage={
            submissionTab === 'MY_GROUPS'
              ? 'No submissions found for your assigned groups. Switch to "All Department Submissions" or assign student groups in Project Head portal.'
              : 'No project submissions uploaded across the department yet.'
          }
        />
      </div>

      {/* Review Modal with Predefined Feedback Templates */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onReview={handlePerformReview}
        submissionTitle={selectedSubmission ? `${selectedSubmission.groupNumber} - ${selectedSubmission.milestoneTitle}` : ''}
        versionNumber={selectedSubVersion?.versionNumber || 1}
        templates={templates}
      />

      {/* Version History Modal */}
      <Modal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        title={selectedSubmission ? `${selectedSubmission.groupNumber}: ${selectedSubmission.milestoneTitle} Version History` : 'History'}
        maxWidth="650px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {selectedSubmission?.versions?.map((v) => (
            <div
              key={v.id}
              style={{
                padding: '1rem',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#fafbfc',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--primary-700)' }}>
                  Version {v.versionNumber} ({v.submissionMode})
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {new Date(v.submittedAt).toLocaleString()}
                </span>
              </div>

              {v.submissionMode === 'ONLINE' && v.fileName && (
                <div style={{ marginBottom: '0.5rem' }}>
                  <a
                    href={api.common.getFileDownloadUrl(v.id)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                  >
                    <Download size={14} /> Download {v.fileName} ({(v.fileSize / (1024 * 1024)).toFixed(2)} MB)
                  </a>
                </div>
              )}

              {v.studentNotes && (
                <div style={{ fontSize: '0.8125rem', color: '#334155', fontStyle: 'italic', marginBottom: '0.5rem' }}>
                  <strong>Student Remarks:</strong> "{v.studentNotes}"
                </div>
              )}

              {v.review ? (
                <div
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: v.review.verdict === 'VERIFIED' ? '#ecfdf5' : '#fef2f2',
                    border: '1px solid',
                    borderColor: v.review.verdict === 'VERIFIED' ? '#a7f3d0' : '#fecaca',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <StatusBadge status={v.review.verdict} />
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Reviewed by {v.review.guideName}
                    </span>
                  </div>
                  {v.review.predefinedFeedbackText && (
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a', marginTop: '0.25rem' }}>
                      {v.review.predefinedFeedbackText}
                    </div>
                  )}
                  {v.review.customRemarks && (
                    <div style={{ fontSize: '0.8125rem', color: '#475569', marginTop: '0.25rem' }}>
                      <strong>Remarks:</strong> {v.review.customRemarks}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Awaiting review</div>
              )}
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export const GuidePresentationsPage = () => {
  const [presentations, setPresentations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPresentation, setSelectedPresentation] = useState(null);
  const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);
  const [marksObtained, setMarksObtained] = useState('');
  const [maxMarks, setMaxMarks] = useState('50');
  const [attendanceStatus, setAttendanceStatus] = useState('PRESENT');
  const [remarks, setRemarks] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadPresentations = async () => {
    setLoading(true);
    try {
      const data = await api.guide.getPresentations();
      setPresentations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPresentations();
  }, []);

  const handleOpenEvaluate = (p) => {
    setSelectedPresentation(p);
    setMarksObtained(p.evaluation?.marksObtained != null ? String(p.evaluation.marksObtained) : '');
    setMaxMarks(p.evaluation?.maxMarks != null ? String(p.evaluation.maxMarks) : '50');
    setAttendanceStatus(p.evaluation?.attendanceStatus || 'PRESENT');
    setRemarks(p.evaluation?.remarks || '');
    setError('');
    setIsEvalModalOpen(true);
  };

  const handleSaveEvaluation = async (e) => {
    e.preventDefault();
    if (marksObtained === '') {
      setError('Please enter marks obtained.');
      return;
    }
    if (Number(marksObtained) > Number(maxMarks)) {
      setError(`Marks obtained cannot exceed maximum marks (${maxMarks}).`);
      return;
    }

    try {
      await api.guide.evaluatePresentation(selectedPresentation.id, {
        marksObtained: Number(marksObtained),
        maxMarks: Number(maxMarks),
        remarks,
        attendanceStatus,
      });

      setIsEvalModalOpen(false);
      setMessage(`Evaluation marks recorded for ${selectedPresentation.groupNumber}.`);
      loadPresentations();
    } catch (err) {
      setError(err.message || 'Failed to record presentation evaluation.');
    }
  };

  const columns = [
    {
      header: 'Group',
      accessor: 'groupNumber',
      render: (p) => <strong>{p.groupNumber}</strong>,
    },
    {
      header: 'Presentation Title & Stage',
      render: (p) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{p.title}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{p.projectTitle}</div>
        </div>
      ),
    },
    {
      header: 'Schedule & Venue',
      render: (p) => (
        <div style={{ fontSize: '0.8125rem' }}>
          <div>{formatDate(p.scheduledDate)} {p.startTime ? `at ${p.startTime}` : ''}</div>
          <div style={{ color: '#94a3b8' }}>{p.venue || 'Seminar Hall'}</div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (p) => <StatusBadge status={p.status} />,
    },
    {
      header: 'Marks Assessment',
      render: (p) => (
        p.evaluation ? (
          <div>
            <div style={{ fontWeight: 700, color: 'var(--primary-700)', fontSize: '0.9375rem' }}>
              {p.evaluation.marksObtained} / {p.evaluation.maxMarks}
            </div>
            <StatusBadge status={p.evaluation.attendanceStatus} />
          </div>
        ) : (
          <span style={{ color: '#94a3b8', fontSize: '0.8125rem' }}>Not evaluated yet</span>
        )
      ),
    },
    {
      header: 'Actions',
      render: (p) => (
        <button className="btn btn-primary btn-sm" onClick={() => handleOpenEvaluate(p)}>
          <Award size={14} /> {p.evaluation ? 'Edit Marks' : 'Evaluate & Score'}
        </button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>Presentation Stages & Marks Assessment</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Assess student presentations, record scores, evaluate viva performance, and log attendance.
        </p>
      </div>

      {message && (
        <div style={{ padding: '0.75rem 1rem', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
          {message}
        </div>
      )}

      <div className="card">
        <DataTable
          columns={columns}
          data={presentations}
          searchPlaceholder="Search presentations by group, project, title..."
        />
      </div>

      {/* Evaluate Modal */}
      <Modal
        isOpen={isEvalModalOpen}
        onClose={() => setIsEvalModalOpen(false)}
        title={selectedPresentation ? `Evaluate ${selectedPresentation.groupNumber} - ${selectedPresentation.title}` : 'Evaluation'}
        maxWidth="550px"
      >
        <form onSubmit={handleSaveEvaluation}>
          {error && (
            <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Marks Obtained *</label>
              <input
                type="number"
                step="0.5"
                className="form-control"
                placeholder="e.g. 45"
                value={marksObtained}
                onChange={(e) => setMarksObtained(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Max Marks</label>
              <input
                type="number"
                className="form-control"
                value={maxMarks}
                onChange={(e) => setMaxMarks(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Student Team Attendance Status *</label>
            <select
              className="form-control"
              value={attendanceStatus}
              onChange={(e) => setAttendanceStatus(e.target.value)}
              required
            >
              <option value="PRESENT">All Members Present</option>
              <option value="PARTIALLY_PRESENT">Partially Present</option>
              <option value="NOT_ATTENDED">Not Attended / Absent</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Evaluation Remarks & Viva Feedback</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Strengths, technical accuracy, demo evaluation, suggestions..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsEvalModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Evaluation & Marks
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
