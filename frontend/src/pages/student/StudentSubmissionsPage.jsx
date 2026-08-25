import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { FileUploadModal } from '../../components/FileUploadModal';
import { Modal } from '../../components/Modal';
import {
  Upload,
  Download,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  History,
  Calendar,
  Award,
} from 'lucide-react';

export const StudentSubmissionsPage = () => {
  const [project, setProject] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [projectData, subsData] = await Promise.all([
        api.student.getMyProject(),
        api.student.getSubmissions(),
      ]);
      setProject(projectData);
      setSubmissions(subsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenUpload = (milestone, submission) => {
    setSelectedMilestone(milestone);
    setSelectedSubmission(submission);
    setIsUploadModalOpen(true);
  };

  const handleUploadFile = async (file, notes) => {
    try {
      await api.student.uploadSubmission(selectedMilestone.id, notes, file);
      setMessage(`Document for '${selectedMilestone.title}' submitted successfully.`);
      loadData();
    } catch (err) {
      throw err;
    }
  };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading submissions...</div>;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>Project Document Submissions</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Submit synopsis, design reports, progress updates and final project dissertations for Guide review.
        </p>
      </div>

      {message && (
        <div style={{ padding: '0.75rem 1rem', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
          {message}
        </div>
      )}

      {/* Submissions List per Milestone */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {project?.milestones?.map((m) => {
          const sub = submissions.find((s) => s.projectMilestoneId === m.id);
          const isCorrectionRequired = sub?.status === 'CORRECTION_REQUIRED';
          const isVerified = sub?.status === 'VERIFIED';
          const isSubmitted = sub?.status === 'ONLINE_SUBMITTED' || sub?.status === 'SUBMITTED' || sub?.status === 'RESUBMITTED';
          const latestVersion = sub?.versions?.[0];

          return (
            <div
              key={m.id}
              className="card"
              style={{
                marginBottom: 0,
                borderLeft: isVerified
                  ? '4px solid #10b981'
                  : isCorrectionRequired
                  ? '4px solid #ef4444'
                  : isSubmitted
                  ? '4px solid #3b82f6'
                  : '4px solid var(--border-color)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {m.order}. {m.title}
                    </h3>
                    {sub ? <StatusBadge status={sub.status} /> : <StatusBadge status={m.status} />}
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '4px' }}>
                    {m.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {(!sub || isCorrectionRequired) && (
                    <button
                      className={`btn btn-${isCorrectionRequired ? 'danger' : 'primary'} btn-sm`}
                      onClick={() => handleOpenUpload(m, sub)}
                    >
                      <Upload size={14} /> {isCorrectionRequired ? `Resubmit (Version ${(sub?.currentVersion || 1) + 1})` : 'Upload Document'}
                    </button>
                  )}

                  {sub?.versions?.length > 0 && (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setSelectedSubmission(sub);
                        setIsHistoryModalOpen(true);
                      }}
                    >
                      <History size={14} /> Versions ({sub.versions.length})
                    </button>
                  )}
                </div>
              </div>

              {/* Latest Submission Card Details */}
              {sub && latestVersion && (
                <div
                  style={{
                    padding: '0.875rem',
                    backgroundColor: '#fafbfc',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    marginTop: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
                      <span className="badge badge-neutral">V{latestVersion.versionNumber}</span>
                      {latestVersion.fileName && (
                        <a
                          href={api.common.getFileDownloadUrl(latestVersion.id)}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Download size={13} /> {latestVersion.fileName}
                        </a>
                      )}
                      {latestVersion.submissionMode === 'OFFLINE' && (
                        <span style={{ color: '#d97706', fontWeight: 600 }}>Physical Hardcopy</span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      Submitted {new Date(latestVersion.submittedAt).toLocaleString()}
                    </span>
                  </div>

                  {latestVersion.studentNotes && (
                    <div style={{ fontSize: '0.8125rem', color: '#475569', fontStyle: 'italic', marginBottom: '0.5rem' }}>
                      <strong>Your Notes:</strong> "{latestVersion.studentNotes}"
                    </div>
                  )}

                  {/* Guide Review Remarks Display */}
                  {latestVersion.review ? (
                    <div
                      style={{
                        padding: '0.75rem',
                        backgroundColor: latestVersion.review.verdict === 'VERIFIED' ? '#ecfdf5' : '#fef2f2',
                        border: '1px solid',
                        borderColor: latestVersion.review.verdict === 'VERIFIED' ? '#a7f3d0' : '#fecaca',
                        borderRadius: 'var(--radius-sm)',
                        marginTop: '0.5rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.8125rem', color: latestVersion.review.verdict === 'VERIFIED' ? '#065f46' : '#991b1b' }}>
                          Guide Verdict: {latestVersion.review.verdict}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {latestVersion.review.guideName}
                        </span>
                      </div>
                      {latestVersion.review.predefinedFeedbackText && (
                        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a' }}>
                          {latestVersion.review.predefinedFeedbackText}
                        </div>
                      )}
                      {latestVersion.review.customRemarks && (
                        <div style={{ fontSize: '0.8125rem', color: '#475569', marginTop: '2px' }}>
                          <strong>Remarks:</strong> {latestVersion.review.customRemarks}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 500, marginTop: '0.25rem' }}>
                      Document is currently under review by your Faculty Guide.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Upload Modal */}
      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadFile}
        milestoneTitle={selectedMilestone?.title}
        currentVersion={selectedSubmission?.currentVersion || 0}
        isResubmission={selectedSubmission?.status === 'CORRECTION_REQUIRED'}
      />

      {/* Version History Modal */}
      <Modal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        title={selectedSubmission ? `${selectedSubmission.milestoneTitle} Version History` : 'History'}
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
                    <Download size={14} /> Download {v.fileName}
                  </a>
                </div>
              )}

              {v.studentNotes && (
                <div style={{ fontSize: '0.8125rem', color: '#334155', fontStyle: 'italic', marginBottom: '0.5rem' }}>
                  <strong>Notes:</strong> "{v.studentNotes}"
                </div>
              )}

              {v.review && (
                <div
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: v.review.verdict === 'VERIFIED' ? '#ecfdf5' : '#fef2f2',
                    border: '1px solid',
                    borderColor: v.review.verdict === 'VERIFIED' ? '#a7f3d0' : '#fecaca',
                  }}
                >
                  <StatusBadge status={v.review.verdict} />
                  {v.review.predefinedFeedbackText && (
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, marginTop: '0.25rem' }}>
                      {v.review.predefinedFeedbackText}
                    </div>
                  )}
                  {v.review.customRemarks && (
                    <div style={{ fontSize: '0.8125rem', color: '#475569', marginTop: '0.25rem' }}>
                      {v.review.customRemarks}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export const StudentPresentationsPage = () => {
  const [presentations, setPresentations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPresentations = async () => {
      setLoading(true);
      try {
        const data = await api.student.getPresentations();
        setPresentations(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadPresentations();
  }, []);

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading presentation schedule...</div>;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>Presentations & Marksheet</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Review presentation schedules, seminar hall venues, and faculty viva evaluation scores.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {presentations.map((p) => (
          <div key={p.id} className="card" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                  Stage {p.presentationNumber}: {p.title}
                </h3>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{p.description}</div>
              </div>
              <StatusBadge status={p.status} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', padding: '0.75rem', backgroundColor: '#fafbfc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Scheduled Date</span>
                <div style={{ fontWeight: 600 }}>{new Date(p.scheduledDate).toLocaleDateString()}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Time Slot</span>
                <div style={{ fontWeight: 600 }}>{p.startTime ? `${p.startTime} - ${p.endTime}` : 'TBA'}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Venue</span>
                <div style={{ fontWeight: 600 }}>{p.venue || 'Seminar Hall'}</div>
              </div>
            </div>

            {/* Evaluation Score Card */}
            {p.evaluation ? (
              <div style={{ padding: '1rem', backgroundColor: '#ecfdf5', borderRadius: 'var(--radius-md)', border: '1px solid #a7f3d0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065f46', textTransform: 'uppercase' }}>
                      Marks Awarded by {p.evaluation.guideName}
                    </span>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#065f46' }}>
                      {p.evaluation.marksObtained} <span style={{ fontSize: '1rem', fontWeight: 500 }}>/ {p.evaluation.maxMarks}</span>
                    </div>
                  </div>
                  <StatusBadge status={p.evaluation.attendanceStatus} />
                </div>
                {p.evaluation.remarks && (
                  <div style={{ fontSize: '0.8125rem', color: '#065f46', borderTop: '1px solid #a7f3d0', paddingTop: '0.5rem' }}>
                    <strong>Faculty Remarks:</strong> "{p.evaluation.remarks}"
                  </div>
                )}
              </div>
            ) : (
              <div style={{ fontSize: '0.8125rem', color: '#94a3b8', fontStyle: 'italic' }}>
                Evaluation pending presentation conduct.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
