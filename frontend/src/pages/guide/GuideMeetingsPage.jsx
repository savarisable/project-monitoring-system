import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { DataTable } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import {
  Calendar,
  Clock,
  Plus,
  Bell,
  MessageSquareQuote,
  CheckCircle,
  HelpCircle,
  MessageSquare,
} from 'lucide-react';

export const GuideMeetingsPage = () => {
  const [meetings, setMeetings] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    groupId: '',
    title: '',
    meetingDate: new Date().toISOString().split('T')[0],
    meetingTime: '11:00 AM',
    venue: 'Guide Cabin / Project Lab',
    purpose: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [meetingsData, groupsData] = await Promise.all([
        api.guide.getMeetings(),
        api.guide.getMyGroups(),
      ]);
      setMeetings(meetingsData);
      setGroups(groupsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    if (!formData.groupId || !formData.title.trim()) {
      setError('Please select a group and enter meeting title.');
      return;
    }

    try {
      await api.guide.createMeeting({
        ...formData,
        groupId: Number(formData.groupId),
      });

      setIsModalOpen(false);
      setMessage('Project meeting scheduled and student team notified.');
      setFormData({
        groupId: '',
        title: '',
        meetingDate: new Date().toISOString().split('T')[0],
        meetingTime: '11:00 AM',
        venue: 'Guide Cabin / Project Lab',
        purpose: '',
      });
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to schedule meeting.');
    }
  };

  const columns = [
    {
      header: 'Group',
      accessor: 'groupNumber',
      render: (m) => <strong>{m.groupNumber}</strong>,
    },
    {
      header: 'Meeting Title & Purpose',
      render: (m) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{m.title}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{m.purpose || 'Project guidance and progress discussion'}</div>
        </div>
      ),
    },
    {
      header: 'Date & Time',
      render: (m) => (
        <span style={{ fontSize: '0.8125rem' }}>
          {new Date(m.meetingDate).toLocaleDateString()} at {m.meetingTime}
        </span>
      ),
    },
    {
      header: 'Venue',
      accessor: 'venue',
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (m) => <StatusBadge status={m.status} />,
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>Schedule Project Meetings</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Schedule advisory sessions, architecture reviews, and lab meetings with your assigned batches.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Schedule Meeting
        </button>
      </div>

      {message && (
        <div style={{ padding: '0.75rem 1rem', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
          {message}
        </div>
      )}

      <div className="card">
        <DataTable
          columns={columns}
          data={meetings}
          searchPlaceholder="Search meetings by group, title..."
        />
      </div>

      {/* Schedule Meeting Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Meeting with Student Group"
        maxWidth="550px"
      >
        <form onSubmit={handleCreateMeeting}>
          {error && (
            <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Select Group *</label>
            <select
              className="form-control"
              value={formData.groupId}
              onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
              required
            >
              <option value="">-- Choose Assigned Group --</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.groupNumber} ({g.project ? g.project.title : 'No project'})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Meeting Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Architecture & Database Design Review"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Meeting Date *</label>
              <input
                type="date"
                className="form-control"
                value={formData.meetingDate}
                onChange={(e) => setFormData({ ...formData, meetingDate: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Meeting Time *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 11:30 AM"
                value={formData.meetingTime}
                onChange={(e) => setFormData({ ...formData, meetingTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Venue / Room Location *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Project Lab 304 / Guide Cabin"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Agenda & Purpose</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Points to discuss, required documents to bring..."
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Schedule & Notify Team
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export const GuideNoticesPage = () => {
  const [groups, setGroups] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'HIGH',
    targetGroupId: '',
    fromDate: new Date().toISOString().split('T')[0],
    toDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const data = await api.guide.getMyGroups();
        setGroups(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadGroups();
  }, []);

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and description are required.');
      return;
    }

    try {
      await api.guide.createNotice({
        ...formData,
        targetGroupId: formData.targetGroupId ? Number(formData.targetGroupId) : null,
      });

      setIsModalOpen(false);
      setMessage('Notice published and sent to group students.');
      setFormData({
        title: '',
        description: '',
        priority: 'HIGH',
        targetGroupId: '',
        fromDate: new Date().toISOString().split('T')[0],
        toDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
    } catch (err) {
      setError(err.message || 'Failed to publish notice.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>Group Notices & Broadcasts</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Publish announcements and guidance circulars directly to your supervised project groups.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Publish Notice
        </button>
      </div>

      {message && (
        <div style={{ padding: '0.75rem 1rem', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
          {message}
        </div>
      )}

      <div className="card">
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
          Use the <strong>Publish Notice</strong> button to broadcast instructions to your assigned groups. Notices are immediately sent as in-app notifications to all students in the selected group.
        </p>
      </div>

      {/* Notice Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Publish Notice to Assigned Group"
        maxWidth="550px"
      >
        <form onSubmit={handleCreateNotice}>
          {error && (
            <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Target Group *</label>
            <select
              className="form-control"
              value={formData.targetGroupId}
              onChange={(e) => setFormData({ ...formData, targetGroupId: e.target.value })}
              required
            >
              <option value="">-- Choose Assigned Group --</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.groupNumber} ({g.project ? g.project.title : 'No project'})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Notice Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Prepare Presentation Slides by Friday"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Instructions / Message *</label>
            <textarea
              className="form-control"
              rows="4"
              placeholder="Detailed instructions..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Publish & Broadcast
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export const GuideStudentRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReq, setSelectedReq] = useState(null);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [guideResponse, setGuideResponse] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await api.guide.getStudentRequests();
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

  const handleOpenRespond = (req) => {
    setSelectedReq(req);
    setGuideResponse(req.guideResponse || '');
    setError('');
    setIsResponseModalOpen(true);
  };

  const handleSendResponse = async (e) => {
    e.preventDefault();
    if (!guideResponse.trim()) {
      setError('Please enter your response remarks.');
      return;
    }

    try {
      await api.guide.respondStudentRequest(selectedReq.id, guideResponse.trim());
      setIsResponseModalOpen(false);
      setMessage(`Response sent to ${selectedReq.studentName}.`);
      loadRequests();
    } catch (err) {
      setError(err.message || 'Failed to send response.');
    }
  };

  const columns = [
    {
      header: 'Group & Student',
      render: (r) => (
        <div>
          <div style={{ fontWeight: 700 }}>{r.groupNumber}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{r.studentName}</div>
        </div>
      ),
    },
    {
      header: 'Predefined Inquiry',
      accessor: 'questionLabel',
      render: (r) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--primary-700)' }}>{r.questionLabel}</div>
          {r.additionalNote && (
            <div style={{ fontSize: '0.75rem', color: '#475569', fontStyle: 'italic', marginTop: '2px' }}>
              "{r.additionalNote}"
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Received At',
      accessor: 'createdAt',
      render: (r) => <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{new Date(r.createdAt).toLocaleString()}</span>,
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      header: 'Guide Response',
      render: (r) => (
        r.guideResponse ? (
          <span style={{ fontSize: '0.8125rem', color: '#065f46' }}>{r.guideResponse}</span>
        ) : (
          <span style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 600 }}>Awaiting Reply</span>
        )
      ),
    },
    {
      header: 'Action',
      render: (r) => (
        <button className="btn btn-secondary btn-sm" onClick={() => handleOpenRespond(r)}>
          <MessageSquare size={14} /> {r.guideResponse ? 'Edit Reply' : 'Reply'}
        </button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>Student Inquiries & Academic Requests</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Review and respond to structured academic questions and meeting requests from student groups.
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
          data={requests}
          searchPlaceholder="Search student inquiries..."
        />
      </div>

      {/* Response Modal */}
      <Modal
        isOpen={isResponseModalOpen}
        onClose={() => setIsResponseModalOpen(false)}
        title={selectedReq ? `Reply to ${selectedReq.studentName} (${selectedReq.groupNumber})` : 'Reply'}
        maxWidth="500px"
      >
        <form onSubmit={handleSendResponse}>
          {error && (
            <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <div style={{ padding: '0.75rem', backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>
            <div style={{ fontWeight: 700, color: '#0369a1' }}>{selectedReq?.questionLabel}</div>
            {selectedReq?.additionalNote && (
              <div style={{ color: '#334155', marginTop: '4px', fontSize: '0.8125rem' }}>
                "{selectedReq.additionalNote}"
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Your Response / Guidance Remarks *</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="e.g. Sure, let us meet on Thursday at 11:30 AM in the IoT lab."
              value={guideResponse}
              onChange={(e) => setGuideResponse(e.target.value)}
              required
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsResponseModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Send Response to Student
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
