import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { formatDate } from '../../utils/dateUtils';
import { Modal } from '../../components/Modal';
import {
  BookOpen,
  Plus,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Users,
  Trash2,
  FileText,
  ShieldCheck,
  Hourglass,
  CheckCircle,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export const GuideDiaryPage = () => {
  const [activeTab, setActiveTab] = useState('meetings'); // 'meetings' | 'student-logs'
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [studentWorkLogs, setStudentWorkLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State for new Diary Entry
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Form State for new Diary Entry
  const [meetingDate, setMeetingDate] = useState(new Date().toISOString().split('T')[0]);
  const [meetingTime, setMeetingTime] = useState('11:00');
  const [venue, setVenue] = useState('Guide Cabin / Project Lab');
  const [discussionPoints, setDiscussionPoints] = useState('');
  const [guidanceGiven, setGuidanceGiven] = useState('');
  const [targetForNextMeeting, setTargetForNextMeeting] = useState('');
  const [attendanceList, setAttendanceList] = useState([]);

  // Verification Modal State for Student Work Log
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [guideRemark, setGuideRemark] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);

  useEffect(() => {
    loadAssignedGroups();
  }, []);

  const loadAssignedGroups = async () => {
    setLoading(true);
    try {
      const myGroups = await api.guide.getMyGroups();
      setGroups(myGroups);
      if (myGroups.length > 0) {
        setSelectedGroupId(myGroups[0].id);
        loadGroupData(myGroups[0].id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const loadGroupData = async (groupId) => {
    setLoading(true);
    try {
      const [entries, logs] = await Promise.all([
        api.guide.getDiary(groupId).catch(() => []),
        api.guide.getStudentWorkLogs(groupId).catch(() => []),
      ]);
      setDiaryEntries(entries || []);
      setStudentWorkLogs(logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGroupChange = (e) => {
    const gId = Number(e.target.value);
    setSelectedGroupId(gId);
    loadGroupData(gId);
  };

  const handleOpenNewEntryModal = () => {
    const group = groups.find((g) => g.id === Number(selectedGroupId));
    if (!group) return;

    const initialAttendance = (group.members || []).map((m) => ({
      studentId: m.studentId || m.id,
      fullName: m.fullName,
      rollNumber: m.rollNumber,
      present: true,
      workSummary: '',
      remarks: '',
    }));

    setAttendanceList(initialAttendance);
    setDiscussionPoints('');
    setGuidanceGiven('');
    setTargetForNextMeeting('');
    setError('');
    setIsModalOpen(true);
  };

  const handleToggleAttendance = (studentId) => {
    setAttendanceList((prev) =>
      prev.map((item) =>
        item.studentId === studentId ? { ...item, present: !item.present } : item
      )
    );
  };

  const handleWorkSummaryChange = (studentId, value) => {
    setAttendanceList((prev) =>
      prev.map((item) =>
        item.studentId === studentId ? { ...item, workSummary: value } : item
      )
    );
  };

  const handleSaveDiaryEntry = async (e) => {
    e.preventDefault();
    if (!discussionPoints.trim()) {
      setError('Please provide the discussion points / agenda reviewed.');
      return;
    }

    setModalLoading(true);
    setError('');
    try {
      const payload = {
        groupId: Number(selectedGroupId),
        meetingDate,
        meetingTime: meetingTime ? `${meetingTime}:00` : null,
        venue,
        discussionPoints,
        guidanceGiven,
        targetForNextMeeting,
        attendances: attendanceList.map((a) => ({
          studentId: a.studentId,
          present: a.present,
          workSummary: a.workSummary,
          remarks: a.remarks,
        })),
      };

      await api.guide.createDiary(payload);
      setMessage('Project diary entry and attendance recorded successfully.');
      setIsModalOpen(false);
      loadGroupData(selectedGroupId);
      setTimeout(() => setMessage(''), 5000);
    } catch (err) {
      setError(err.message || 'Failed to save diary entry.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteEntry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this diary entry?')) return;
    try {
      await api.guide.deleteDiary(id);
      setMessage('Diary entry deleted successfully.');
      loadGroupData(selectedGroupId);
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to delete diary entry.');
    }
  };

  const handleOpenVerifyModal = (log) => {
    setSelectedLog(log);
    setGuideRemark(log.guideRemark || 'Reviewed and verified. Good progress.');
    setVerifyModalOpen(true);
  };

  const handleConfirmVerify = async (e) => {
    e.preventDefault();
    if (!selectedLog) return;
    setVerifyLoading(true);
    try {
      await api.guide.verifyStudentWorkLog(selectedLog.id, guideRemark);
      setMessage(`Work log entry for ${selectedLog.studentName} verified successfully.`);
      setVerifyModalOpen(false);
      loadGroupData(selectedGroupId);
      setTimeout(() => setMessage(''), 5000);
    } catch (err) {
      alert(err.message || 'Failed to verify work log.');
    } finally {
      setVerifyLoading(false);
    }
  };

  const currentGroup = groups.find((g) => g.id === Number(selectedGroupId));

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen className="text-primary" size={24} /> Project Diary & Attendance Record
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Record weekly student discussions, log attendance, and review individual student work diaries.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {groups.length > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>Group:</span>
              <select
                className="form-control"
                style={{ width: '180px' }}
                value={selectedGroupId}
                onChange={handleGroupChange}
              >
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.groupNumber} ({g.members?.length || 0} Students)
                  </option>
                ))}
              </select>
            </div>
          )}

          {groups.length > 0 && (
            <button className="btn btn-primary" onClick={handleOpenNewEntryModal}>
              <Plus size={16} /> New Diary & Attendance Entry
            </button>
          )}
        </div>
      </div>

      {message && (
        <div style={{ padding: '0.75rem 1rem', backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={16} /> {message}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem', paddingBottom: '0.25rem' }}>
        <button
          onClick={() => setActiveTab('meetings')}
          className={`btn btn-sm ${activeTab === 'meetings' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', borderRadius: 'var(--radius-full)' }}
        >
          <Users size={15} /> Faculty Review Sessions & Attendance ({diaryEntries.length})
        </button>

        <button
          onClick={() => setActiveTab('student-logs')}
          className={`btn btn-sm ${activeTab === 'student-logs' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', borderRadius: 'var(--radius-full)' }}
        >
          <BookOpen size={15} /> Student Individual Work Logs ({studentWorkLogs.length})
        </button>
      </div>

      {groups.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <BookOpen size={48} style={{ color: 'var(--text-subtle)', margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)' }}>No Groups Allocated</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>You have not been assigned any project student groups yet.</p>
        </div>
      ) : loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading records...</div>
      ) : activeTab === 'meetings' ? (
        /* TAB 1: FACULTY MEETINGS */
        diaryEntries.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <FileText size={48} style={{ color: 'var(--text-subtle)', margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)' }}>No Diary Entries Logged Yet</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Begin tracking weekly progress and student attendance for {currentGroup?.groupNumber}.
            </p>
            <button className="btn btn-primary" onClick={handleOpenNewEntryModal}>
              <Plus size={16} /> Create First Diary Entry
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {diaryEntries.map((entry, idx) => (
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
                      Group: <strong>{entry.groupNumber}</strong> &bull; {entry.projectTitle || 'Project Registered'}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="btn btn-secondary btn-sm"
                    style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)', padding: '0.35rem 0.6rem' }}
                    title="Delete entry"
                  >
                    <Trash2 size={15} /> Delete
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-500)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      📝 Discussion Points / Agenda Reviewed
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', margin: 0, whiteSpace: 'pre-wrap' }}>
                      {entry.discussionPoints}
                    </p>
                  </div>

                  {entry.guidanceGiven && (
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                        💡 Faculty Guidance Given
                      </div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', margin: 0, whiteSpace: 'pre-wrap' }}>
                        {entry.guidanceGiven}
                      </p>
                    </div>
                  )}

                  {entry.targetForNextMeeting && (
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                        🎯 Target For Next Meeting
                      </div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', margin: 0, whiteSpace: 'pre-wrap' }}>
                        {entry.targetForNextMeeting}
                      </p>
                    </div>
                  )}
                </div>

                {/* Attendance Summary */}
                {entry.attendances && entry.attendances.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Users size={15} /> Student Attendance & Individual Work Notes
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
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                              {att.studentName}
                            </span>
                            <span
                              className={`badge ${att.present ? 'badge-success' : 'badge-danger'}`}
                              style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}
                            >
                              {att.present ? 'PRESENT' : 'ABSENT'}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Roll: {att.rollNumber}
                          </div>
                          {att.workSummary && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-main)', marginTop: '0.35rem', fontStyle: 'italic' }}>
                              &ldquo;{att.workSummary}&rdquo;
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      ) : (
        /* TAB 2: STUDENT INDIVIDUAL WORK LOGS */
        studentWorkLogs.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <BookOpen size={48} style={{ color: 'var(--text-subtle)', margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)' }}>No Student Work Logs Submitted</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Students in {currentGroup?.groupNumber} have not logged any personal diary entries yet.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {studentWorkLogs.map((log) => (
              <div key={log.id} className="card" style={{ borderLeft: log.verifiedByGuide ? '4px solid #10b981' : '4px solid #f59e0b' }}>
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
                          <Clock size={11} /> {log.hoursSpent} Hours
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-main)', marginTop: '3px', fontWeight: 600 }}>
                      Student: <strong>{log.studentName}</strong> ({log.rollNumber}) &bull; Group: {log.groupNumber}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span
                      className={`badge ${log.verifiedByGuide ? 'badge-success' : 'badge-warning'}`}
                      style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}
                    >
                      {log.verifiedByGuide ? <ShieldCheck size={13} /> : <Hourglass size={13} />}
                      {log.verifiedByGuide ? 'Verified by You' : 'Pending Verification'}
                    </span>

                    <button
                      onClick={() => handleOpenVerifyModal(log)}
                      className={`btn btn-sm ${log.verifiedByGuide ? 'btn-secondary' : 'btn-primary'}`}
                      style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <CheckCircle2 size={14} /> {log.verifiedByGuide ? 'Update Remark' : 'Verify Entry'}
                    </button>
                  </div>
                </div>

                {/* Tasks & Details */}
                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-500)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    🔨 Tasks Accomplished by Student
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                    {log.tasksAccomplished}
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
                  {log.challengesFaced && (
                    <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                        ⚠️ Challenges / Blockers
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-main)', margin: 0, whiteSpace: 'pre-wrap' }}>
                        {log.challengesFaced}
                      </p>
                    </div>
                  )}

                  {log.nextPlans && (
                    <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                        🎯 Next Plan
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-main)', margin: 0, whiteSpace: 'pre-wrap' }}>
                        {log.nextPlans}
                      </p>
                    </div>
                  )}
                </div>

                {log.guideRemark && (
                  <div style={{ marginTop: '0.75rem', padding: '0.65rem 0.85rem', backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', marginBottom: '0.15rem' }}>
                      💬 Your Guide Verification Remark
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

      {/* Log New Faculty Meeting Diary Entry Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`New Diary & Attendance Entry — ${currentGroup?.groupNumber}`}
        maxWidth="750px"
      >
        <form onSubmit={handleSaveDiaryEntry} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {error && (
            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', borderRadius: '8px', fontSize: '0.8125rem' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
            <div>
              <label className="form-label">Meeting Date *</label>
              <input
                type="date"
                className="form-control"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Time</label>
              <input
                type="time"
                className="form-control"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Venue / Cabin</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Guide Cabin / Lab 3"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Discussion Points & Work Reviewed *</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Detail the modules, code logic, architecture, or documentation reviewed during this session..."
              value={discussionPoints}
              onChange={(e) => setDiscussionPoints(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="form-label">Guidance / Instructions Given</label>
              <textarea
                className="form-control"
                rows={2}
                placeholder="Specific guidance, corrections, or methodology recommendations..."
                value={guidanceGiven}
                onChange={(e) => setGuidanceGiven(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Target for Next Meeting</label>
              <textarea
                className="form-control"
                rows={2}
                placeholder="Deliverables expected before next review session..."
                value={targetForNextMeeting}
                onChange={(e) => setTargetForNextMeeting(e.target.value)}
              />
            </div>
          </div>

          {/* Attendance Checklist */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
            <label className="form-label" style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={16} /> Student Attendance & Individual Contribution
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {attendanceList.map((att) => (
                <div
                  key={att.studentId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    padding: '0.5rem 0.75rem',
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div style={{ minWidth: '180px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                      {att.fullName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Roll: {att.rollNumber}
                    </div>
                  </div>

                  <div style={{ flex: 1 }}>
                    <input
                      type="text"
                      className="form-control"
                      style={{ fontSize: '0.8125rem', padding: '0.35rem 0.5rem' }}
                      placeholder="Student work summary / task accomplished (Optional)"
                      value={att.workSummary}
                      onChange={(e) => handleWorkSummaryChange(att.studentId, e.target.value)}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleAttendance(att.studentId)}
                    className={`btn btn-sm ${att.present ? 'btn-primary' : 'btn-secondary'}`}
                    style={{
                      minWidth: '90px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      backgroundColor: att.present ? '#10b981' : 'transparent',
                      color: att.present ? '#ffffff' : '#ef4444',
                      borderColor: att.present ? '#10b981' : '#ef4444',
                    }}
                  >
                    {att.present ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    {att.present ? 'Present' : 'Absent'}
                  </button>
                </div>
              ))}
            </div>
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
              {modalLoading ? 'Saving Entry...' : 'Save Diary Entry'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Guide Verification Modal */}
      <Modal
        isOpen={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
        title={`Verify Student Work Log — ${selectedLog?.studentName}`}
        maxWidth="550px"
      >
        <form onSubmit={handleConfirmVerify} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Module & Task Logged:</div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '2px' }}>
              {selectedLog?.moduleName} ({selectedLog?.hoursSpent} Hours on {formatDate(selectedLog?.logDate)})
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-main)', marginTop: '0.35rem', fontStyle: 'italic' }}>
              &ldquo;{selectedLog?.tasksAccomplished}&rdquo;
            </div>
          </div>

          <div>
            <label className="form-label">Faculty Verification Feedback / Remarks</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Provide constructive feedback, approval, or next action steps for this student..."
              value={guideRemark}
              onChange={(e) => setGuideRemark(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setVerifyModalOpen(false)}
              disabled={verifyLoading}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={verifyLoading}>
              {verifyLoading ? 'Verifying...' : 'Approve & Verify Log'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
