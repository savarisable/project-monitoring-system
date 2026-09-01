import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/dateUtils';
import { Modal } from '../../components/Modal';
import {
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Users,
  Award,
  FileText,
  Target,
  Sparkles,
  Plus,
  Trash2,
  ShieldCheck,
  Hourglass,
  Layers,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

export const StudentDiaryPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('my-logs'); // 'my-logs' | 'guide-meetings'
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [workLogs, setWorkLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State for New Work Log
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form Fields
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [moduleName, setModuleName] = useState('');
  const [tasksAccomplished, setTasksAccomplished] = useState('');
  const [hoursSpent, setHoursSpent] = useState('');
  const [challengesFaced, setChallengesFaced] = useState('');
  const [nextPlans, setNextPlans] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [guideDiary, studentLogs] = await Promise.all([
        api.student.getDiary().catch(() => []),
        api.student.getWorkLogs().catch(() => []),
      ]);
      setDiaryEntries(guideDiary || []);
      setWorkLogs(studentLogs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setLogDate(new Date().toISOString().split('T')[0]);
    setModuleName('');
    setTasksAccomplished('');
    setHoursSpent('');
    setChallengesFaced('');
    setNextPlans('');
    setModalError('');
    setIsModalOpen(true);
  };

  const handleSaveWorkLog = async (e) => {
    e.preventDefault();
    if (!moduleName.trim() || !tasksAccomplished.trim()) {
      setModalError('Module name and tasks accomplished are required.');
      return;
    }

    setModalLoading(true);
    setModalError('');

    try {
      const payload = {
        logDate,
        moduleName,
        tasksAccomplished,
        hoursSpent: hoursSpent ? parseFloat(hoursSpent) : 0,
        challengesFaced,
        nextPlans,
      };

      await api.student.createWorkLog(payload);
      setSuccessMessage('Your diary work log entry has been saved successfully.');
      setIsModalOpen(false);

      // Reload logs
      const updatedLogs = await api.student.getWorkLogs();
      setWorkLogs(updatedLogs || []);

      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setModalError(err.message || 'Failed to save work log entry.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteWorkLog = async (id) => {
    if (!window.confirm('Are you sure you want to delete this diary entry?')) return;
    try {
      await api.student.deleteWorkLog(id);
      setWorkLogs(workLogs.filter((l) => l.id !== id));
      setSuccessMessage('Diary entry deleted.');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to delete entry.');
    }
  };

  // Compute Metrics
  const totalMeetings = diaryEntries.length;
  const myAttendances = diaryEntries
    .map((e) => e.attendances?.find((a) => a.studentId === user?.referenceId))
    .filter(Boolean);

  const attendedCount = myAttendances.filter((a) => a.present).length;
  const attendancePercentage = totalMeetings > 0
    ? Math.round((attendedCount / totalMeetings) * 100)
    : 100;

  const totalHoursLogged = workLogs.reduce((sum, l) => sum + (l.hoursSpent || 0), 0);
  const verifiedLogsCount = workLogs.filter((l) => l.verifiedByGuide).length;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen className="text-primary" size={24} /> Project Diary & Work Log
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Maintain your individual capstone project work diary, log hours, and track official faculty review records.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenModal}>
          <Plus size={16} /> Log New Work Entry
        </button>
      </div>

      {successMessage && (
        <div style={{ padding: '0.75rem 1rem', backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={16} /> {successMessage}
        </div>
      )}

      {/* KPI Stats Summary Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-surface) 100%)',
          border: '1px solid var(--border-color)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          padding: '1.25rem',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(56, 189, 248, 0.15)', color: 'var(--primary-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>My Work Entries</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>{workLogs.length} Logged</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Effort Logged</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>{totalHoursLogged} Hours</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Guide Verification</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>{verifiedLogsCount} / {workLogs.length} Verified</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: attendancePercentage >= 75 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: attendancePercentage >= 75 ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Meeting Attendance</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: attendancePercentage >= 75 ? '#10b981' : '#ef4444' }}>
              {attendedCount} / {totalMeetings} ({attendancePercentage}%)
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem', paddingBottom: '0.25rem' }}>
        <button
          onClick={() => setActiveTab('my-logs')}
          className={`btn btn-sm ${activeTab === 'my-logs' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', borderRadius: 'var(--radius-full)' }}
        >
          <BookOpen size={15} /> My Individual Diary & Work Logs ({workLogs.length})
        </button>

        <button
          onClick={() => setActiveTab('guide-meetings')}
          className={`btn btn-sm ${activeTab === 'guide-meetings' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', borderRadius: 'var(--radius-full)' }}
        >
          <Users size={15} /> Faculty Guide Meeting Records & Attendance ({diaryEntries.length})
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading diary data...</div>
      ) : (
        <>
          {/* TAB 1: INDIVIDUAL STUDENT WORK LOGS */}
          {activeTab === 'my-logs' && (
            workLogs.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <FileText size={48} style={{ color: 'var(--text-subtle)', margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)' }}>No Work Logs Recorded Yet</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Document your daily tasks, research, coding milestones, and hours spent for academic verification.
                </p>
                <button className="btn btn-primary" onClick={handleOpenModal}>
                  <Plus size={16} /> Create Your First Work Log Entry
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {workLogs.map((log) => (
                  <div key={log.id} className="card" style={{ borderLeft: log.verifiedByGuide ? '4px solid #10b981' : '4px solid var(--primary-500)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                            {log.moduleName}
                          </span>
                          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={13} /> {formatDate(log.logDate)}
                          </span>
                          {log.hoursSpent > 0 && (
                            <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                              <Clock size={11} /> {log.hoursSpent} Hours Spent
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                          Student: <strong>{log.studentName}</strong> ({log.rollNumber}) &bull; Group: {log.groupNumber}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span
                          className={`badge ${log.verifiedByGuide ? 'badge-success' : 'badge-warning'}`}
                          style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}
                        >
                          {log.verifiedByGuide ? (
                            <>
                              <ShieldCheck size={13} /> Guide Verified
                            </>
                          ) : (
                            <>
                              <Hourglass size={13} /> Awaiting Guide Review
                            </>
                          )}
                        </span>

                        {!log.verifiedByGuide && (
                          <button
                            onClick={() => handleDeleteWorkLog(log.id)}
                            className="btn btn-secondary btn-sm"
                            style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)', padding: '0.3rem 0.5rem' }}
                            title="Delete this entry"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Tasks & Details */}
                    <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '0.75rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-500)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                        🔨 Tasks Accomplished & Deliverables
                      </div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                        {log.tasksAccomplished}
                      </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
                      {log.challengesFaced && (
                        <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                            ⚠️ Challenges / Blockers Faced
                          </div>
                          <p style={{ fontSize: '0.8125rem', color: 'var(--text-main)', margin: 0, whiteSpace: 'pre-wrap' }}>
                            {log.challengesFaced}
                          </p>
                        </div>
                      )}

                      {log.nextPlans && (
                        <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                            🎯 Next Action Plan
                          </div>
                          <p style={{ fontSize: '0.8125rem', color: 'var(--text-main)', margin: 0, whiteSpace: 'pre-wrap' }}>
                            {log.nextPlans}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Guide Remark (If verified) */}
                    {log.guideRemark && (
                      <div style={{ marginTop: '0.75rem', padding: '0.65rem 0.85rem', backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', marginBottom: '0.15rem' }}>
                          💬 Faculty Guide Feedback & Verification Remark
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-main)' }}>
                          &ldquo;{log.guideRemark}&rdquo;
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          )}

          {/* TAB 2: FACULTY GUIDE MEETING RECORDS & ATTENDANCE */}
          {activeTab === 'guide-meetings' && (
            diaryEntries.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <BookOpen size={48} style={{ color: 'var(--text-subtle)', margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)' }}>No Faculty Meetings Logged Yet</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Your faculty guide will log diary entries and attendance after each review meeting.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {diaryEntries.map((entry, idx) => {
                  const myAtt = entry.attendances?.find((a) => a.studentId === user?.referenceId);

                  return (
                    <div key={entry.id} className="card" style={{ borderLeft: '4px solid var(--primary-500)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                              Meeting #{diaryEntries.length - idx}: {formatDate(entry.meetingDate)}
                            </span>
                            {entry.meetingTime && (
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Clock size={13} /> {entry.meetingTime}
                              </span>
                            )}
                            {entry.venue && (
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <MapPin size={13} /> {entry.venue}
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            Guide: <strong>{entry.guideName}</strong> &bull; Group: {entry.groupNumber}
                          </div>
                        </div>

                        {myAtt && (
                          <span
                            className={`badge ${myAtt.present ? 'badge-success' : 'badge-danger'}`}
                            style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}
                          >
                            {myAtt.present ? '✓ Marked Present' : '✗ Marked Absent'}
                          </span>
                        )}
                      </div>

                      {/* Discussion & Remarks */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-500)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                            📝 Discussion Points / Work Reviewed
                          </div>
                          <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', margin: 0, whiteSpace: 'pre-wrap' }}>
                            {entry.discussionPoints}
                          </p>
                        </div>

                        {entry.guidanceGiven && (
                          <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                              💡 Faculty Guidance & Remarks
                            </div>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', margin: 0, whiteSpace: 'pre-wrap' }}>
                              {entry.guidanceGiven}
                            </p>
                          </div>
                        )}

                        {entry.targetForNextMeeting && (
                          <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                              🎯 Next Target & Action Items
                            </div>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', margin: 0, whiteSpace: 'pre-wrap' }}>
                              {entry.targetForNextMeeting}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Team Attendance Record */}
                      {entry.attendances && entry.attendances.length > 0 && (
                        <div>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Users size={15} /> Team Member Attendance & Tasks Logged
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.5rem' }}>
                            {entry.attendances.map((att) => (
                              <div
                                key={att.id}
                                style={{
                                  padding: '0.625rem',
                                  backgroundColor: att.present ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                                  border: '1px solid',
                                  borderColor: att.present ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                  borderRadius: 'var(--radius-md)',
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--text-main)' }}>
                                    {att.studentName}
                                  </span>
                                  <span
                                    className={`badge ${att.present ? 'badge-success' : 'badge-danger'}`}
                                    style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}
                                  >
                                    {att.present ? 'Present' : 'Absent'}
                                  </span>
                                </div>
                                {att.workSummary && (
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', fontStyle: 'italic' }}>
                                    &ldquo;{att.workSummary}&rdquo;
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          )}
        </>
      )}

      {/* Log Work Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Log Personal Project Diary Entry"
        maxWidth="680px"
      >
        <form onSubmit={handleSaveWorkLog} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {modalError && (
            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', borderRadius: '8px', fontSize: '0.8125rem' }}>
              {modalError}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="form-label">Date of Work *</label>
              <input
                type="date"
                className="form-control"
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">Effort / Hours Spent</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="24"
                className="form-control"
                placeholder="e.g. 4.5"
                value={hoursSpent}
                onChange={(e) => setHoursSpent(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Module / Task Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Backend Authentication API & JWT setup / React Dashboard UI"
              value={moduleName}
              onChange={(e) => setModuleName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="form-label">Tasks Accomplished & Deliverables *</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Detailed description of what you implemented, researched, designed, or tested during this session..."
              value={tasksAccomplished}
              onChange={(e) => setTasksAccomplished(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="form-label">Challenges / Blockers Faced (Optional)</label>
            <textarea
              className="form-control"
              rows={2}
              placeholder="Any issues, library bugs, hardware bottlenecks, or questions for your faculty guide..."
              value={challengesFaced}
              onChange={(e) => setChallengesFaced(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Next Target / Upcoming Milestone (Optional)</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Implement Presentation 1 slide deck and database migration"
              value={nextPlans}
              onChange={(e) => setNextPlans(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsModalOpen(false)}
              disabled={modalLoading}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={modalLoading}>
              {modalLoading ? 'Saving...' : 'Save Diary Entry'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
