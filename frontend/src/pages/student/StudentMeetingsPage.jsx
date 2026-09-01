import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { formatDate, formatDateTime } from '../../utils/dateUtils';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import {
  Calendar,
  Clock,
  Bell,
  HelpCircle,
  MessageSquare,
  Send,
  CheckCircle2,
} from 'lucide-react';

export const StudentMeetingsPage = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMeetings = async () => {
      setLoading(true);
      try {
        const data = await api.student.getMeetings();
        setMeetings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadMeetings();
  }, []);

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading meetings...</div>;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>Scheduled Faculty Meetings</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Advisory sessions, architecture reviews, and progress meetings scheduled by your Faculty Guide.
        </p>
      </div>

      {meetings.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
          No meetings currently scheduled by your Guide.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.25rem' }}>
          {meetings.map((m) => (
            <div key={m.id} className="card" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-900)' }}>{m.title}</h3>
                <StatusBadge status={m.status} />
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#475569', marginBottom: '1rem', lineHeight: 1.5 }}>
                {m.purpose || 'Project guidance session'}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', fontSize: '0.8125rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', color: '#64748b' }}>
                <div><strong>Date & Time:</strong> {formatDate(m.meetingDate)} at {m.meetingTime}</div>
                <div><strong>Venue:</strong> {m.venue}</div>
                <div><strong>Guide:</strong> {m.guideName}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const StudentNoticesPage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotices = async () => {
      setLoading(true);
      try {
        const data = await api.student.getNotices();
        setNotices(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadNotices();
  }, []);

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading notices...</div>;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>Official Notices & Circulars</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Departmental deadlines, formatting guidelines, and notices from Project Head and Faculty Guide.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {notices.map((n) => (
          <div key={n.id} className="card" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bell size={18} color="var(--primary-600)" />
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-main)' }}>{n.title}</h3>
              </div>
              <StatusBadge status={n.priority} />
            </div>
            <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              {n.description}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
              <span>Published by <strong>{n.publishedByName}</strong></span>
              <span>Valid till {formatDate(n.toDate)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const StudentRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [predefinedQuestion, setPredefinedQuestion] = useState('NEXT_MEETING');
  const [additionalNote, setAdditionalNote] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const questionsList = [
    { code: 'NEXT_MEETING', label: 'When is our next scheduled meeting?' },
    { code: 'DISCUSS_PROJECT', label: 'Can we discuss our project / synopsis?' },
    { code: 'SUBMISSION_QUESTION', label: 'When will our submitted report be reviewed / corrections discussed?' },
    { code: 'NEXT_PRESENTATION', label: 'When is our next stage presentation scheduled?' },
    { code: 'MEET_GUIDE', label: 'We request a short in-person discussion with the Guide.' },
    { code: 'NEED_EQUIPMENT_LAB', label: 'We require lab / hardware equipment access.' },
    { code: 'GENERAL_QUERY', label: 'General academic project query.' },
  ];

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await api.student.getMyRequests();
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleSendRequest = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.student.sendRequest({
        predefinedQuestion,
        additionalNote,
      });

      setIsModalOpen(false);
      setAdditionalNote('');
      setMessage('Your inquiry has been sent to your Faculty Guide.');
      loadRequests();
    } catch (err) {
      setError(err.message || 'Failed to send inquiry.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>Contact Guide & Inquiries</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Send structured academic questions to your Guide and review replies.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <HelpCircle size={18} /> Send Academic Question
        </button>
      </div>

      {message && (
        <div style={{ padding: '0.75rem 1rem', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
          {message}
        </div>
      )}

      {/* Requests History List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {requests.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            No questions or inquiries sent yet.
          </div>
        ) : (
          requests.map((r) => (
            <div key={r.id} className="card" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-800)' }}>
                    {r.questionLabel}
                  </h3>
                  {r.additionalNote && (
                    <div style={{ fontSize: '0.8125rem', color: '#475569', fontStyle: 'italic', marginTop: '2px' }}>
                      "{r.additionalNote}"
                    </div>
                  )}
                </div>
                <StatusBadge status={r.status} />
              </div>

              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
                Sent on {formatDateTime(r.createdAt)} to {r.guideName}
              </div>

              {/* Guide Response Banner */}
              {r.guideResponse ? (
                <div style={{ padding: '0.75rem 1rem', backgroundColor: '#ecfdf5', borderRadius: 'var(--radius-sm)', border: '1px solid #a7f3d0' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065f46', textTransform: 'uppercase', marginBottom: '2px' }}>
                    Response from {r.guideName} ({formatDate(r.respondedAt)}):
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#065f46', fontWeight: 500 }}>
                    {r.guideResponse}
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '0.8125rem', color: '#d97706', fontWeight: 500 }}>
                  Awaiting Guide response...
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Ask Question Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Send Question to Faculty Guide"
        maxWidth="550px"
      >
        <form onSubmit={handleSendRequest}>
          {error && (
            <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Select Academic Question *</label>
            <select
              className="form-control"
              value={predefinedQuestion}
              onChange={(e) => setPredefinedQuestion(e.target.value)}
              required
            >
              {questionsList.map((q) => (
                <option key={q.code} value={q.code}>
                  {q.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Additional Context / Details (Optional)</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Add any specific context or details for your Guide..."
              value={additionalNote}
              onChange={(e) => setAdditionalNote(e.target.value)}
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Send size={16} /> Send Question
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
