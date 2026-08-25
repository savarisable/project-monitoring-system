import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { DataTable } from '../../components/DataTable';
import { Modal } from '../../components/Modal';
import { StatusBadge } from '../../components/StatusBadge';
import {
  Bell,
  Plus,
  FileSpreadsheet,
  Download,
  Printer,
  ShieldAlert,
  Calendar,
  AlertCircle,
  FileText,
  Award,
} from 'lucide-react';

export const NoticesPage = () => {
  const [notices, setNotices] = useState([]);
  const [groups, setGroups] = useState([]);
  const { selectedYearId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'HIGH',
    targetRole: 'ALL',
    targetGroupId: '',
    fromDate: new Date().toISOString().split('T')[0],
    toDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const loadNotices = async () => {
    setLoading(true);
    try {
      const [noticesData, groupsData] = await Promise.all([
        api.head.getNotices(),
        api.head.getGroups(selectedYearId),
      ]);
      setNotices(Array.isArray(noticesData) ? noticesData : []);
      setGroups(Array.isArray(groupsData) ? groupsData : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, [selectedYearId]);

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and description are required.');
      return;
    }

    try {
      await api.head.createNotice({
        ...formData,
        targetGroupId: formData.targetGroupId ? Number(formData.targetGroupId) : null,
      });

      setIsModalOpen(false);
      setMessage('Notice published and broadcasted successfully.');
      setFormData({
        title: '',
        description: '',
        priority: 'HIGH',
        targetRole: 'ALL',
        targetGroupId: '',
        fromDate: new Date().toISOString().split('T')[0],
        toDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
      loadNotices();
    } catch (err) {
      setError(err.message || 'Failed to publish notice.');
    }
  };

  const columns = [
    {
      header: 'Title & Description',
      render: (n) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{n.title}</div>
          <div style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '2px' }}>{n.description}</div>
        </div>
      ),
    },
    {
      header: 'Priority',
      accessor: 'priority',
      render: (n) => <StatusBadge status={n.priority} />,
    },
    {
      header: 'Target Audience',
      render: (n) => {
        const target = n.targetRole || n.target || 'ALL';
        return (
          <span className="badge badge-neutral">
            {target === 'SPECIFIC_GROUP' ? `Group: ${n.targetGroupNumber || n.targetGroupId}` : target.replace('ROLE_', '')}
          </span>
        );
      },
    },
    {
      header: 'Published By',
      render: (n) => <span style={{ fontWeight: 500 }}>{n.createdByName || n.publishedByName || 'Project Head'}</span>,
    },
    {
      header: 'Active Window',
      render: (n) => (
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
          {n.fromDate ? new Date(n.fromDate).toLocaleDateString() : '-'} - {n.toDate ? new Date(n.toDate).toLocaleDateString() : '-'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>Notices & Circulars Board</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Publish official departmental notifications, schedule reminders, and targeted notices.
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
        <DataTable
          columns={columns}
          data={notices}
          searchPlaceholder="Search notices by title or content..."
        />
      </div>

      {/* Publish Notice Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Publish Official Department Notice"
        maxWidth="600px"
      >
        <form onSubmit={handleCreateNotice}>
          {error && (
            <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Notice Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Mandatory Guidelines for Presentation 1"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Notice Content / Instructions *</label>
            <textarea
              className="form-control"
              rows="4"
              placeholder="Enter full notice instructions for students and guides..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            ></textarea>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-control"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Target Audience</label>
              <select
                className="form-control"
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
              >
                <option value="ALL">All (Guides & Students)</option>
                <option value="ROLE_STUDENT">All Students</option>
                <option value="ROLE_GUIDE">All Faculty Guides</option>
                <option value="SPECIFIC_GROUP">Specific Student Group</option>
              </select>
            </div>
          </div>

          {formData.targetRole === 'SPECIFIC_GROUP' && (
            <div className="form-group">
              <label className="form-label">Select Target Group *</label>
              <select
                className="form-control"
                value={formData.targetGroupId}
                onChange={(e) => setFormData({ ...formData, targetGroupId: e.target.value })}
                required
              >
                <option value="">-- Choose Group --</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.groupNumber} ({g.project ? g.project.title : 'No project'})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Active From Date</label>
              <input
                type="date"
                className="form-control"
                value={formData.fromDate}
                onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Active Until Date</label>
              <input
                type="date"
                className="form-control"
                value={formData.toDate}
                onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Publish Notice & Notify
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export const ReportsPage = () => {
  const { selectedYearId } = useAuth();
  const [reportType, setReportType] = useState('PROJECT_PROGRESS');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadReport = async () => {
    setLoading(true);
    try {
      const data = await api.head.getReports(reportType, selectedYearId, null, statusFilter);
      setReportData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [reportType, selectedYearId, statusFilter]);

  const exportToCSV = () => {
    if (!reportData) return;

    let csvContent = 'data:text/csv;charset=utf-8,';
    if (reportType === 'PROJECT_PROGRESS') {
      csvContent += 'Group,Project Title,Domain,Guide,Status,Completed Milestones,Total Milestones,Progress %,Delayed\n';
      reportData.projectProgressReport?.forEach((item) => {
        csvContent += `"${item.groupNumber}","${item.projectTitle}","${item.domain || ''}","${item.guideName}","${item.status}",${item.completedMilestones},${item.totalMilestones},${item.progressPercentage}%,${item.delayed}\n`;
      });
    } else if (reportType === 'GUIDE') {
      csvContent += 'Guide Name,Department,Designation,Assigned Groups,Max Capacity,Active Projects,Completed Projects,Pending Reviews\n';
      reportData.guideReport?.forEach((item) => {
        csvContent += `"${item.guideName}","${item.department}","${item.designation}",${item.assignedGroupsCount},${item.maxCapacity},${item.activeProjects},${item.completedProjects},${item.pendingReviews}\n`;
      });
    } else if (reportType === 'MARKS') {
      csvContent += 'Group,Project Title,Presentation No,Title,Date,Status,Guide,Marks Obtained,Max Marks,Attendance\n';
      reportData.marksReport?.forEach((item) => {
        csvContent += `"${item.groupNumber}","${item.projectTitle}",${item.presentationNumber},"${item.presentationTitle}","${item.scheduledDate}","${item.status}","${item.guideName}",${item.marksObtained || '-'},${item.maxMarks || '-'},"${item.attendanceStatus || '-'}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${reportType}_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>Institutional Reports & Marksheets</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Comprehensive analytics, stage progress sheets, guide workloads, and marks exports.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <Printer size={16} /> Print Report
          </button>
          <button className="btn btn-primary" onClick={exportToCSV}>
            <Download size={16} /> Export to CSV
          </button>
        </div>
      </div>

      {/* Report Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          className={`btn btn-sm ${reportType === 'PROJECT_PROGRESS' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setReportType('PROJECT_PROGRESS')}
        >
          <FileText size={16} /> Project Progress Report
        </button>
        <button
          className={`btn btn-sm ${reportType === 'GUIDE' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setReportType('GUIDE')}
        >
          <Award size={16} /> Guide Performance & Workload
        </button>
        <button
          className={`btn btn-sm ${reportType === 'MARKS' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setReportType('MARKS')}
        >
          <FileSpreadsheet size={16} /> Presentation Marksheet
        </button>
      </div>

      {/* Render Selected Report Table */}
      <div className="card">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Generating institutional report...</div>
        ) : reportType === 'PROJECT_PROGRESS' ? (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Group</th>
                  <th>Project Title</th>
                  <th>Faculty Guide</th>
                  <th>Status</th>
                  <th>Current Stage</th>
                  <th>Completed</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {reportData?.projectProgressReport?.map((r, i) => (
                  <tr key={i}>
                    <td><strong>{r.groupNumber}</strong></td>
                    <td style={{ fontWeight: 600 }}>{r.projectTitle}</td>
                    <td>{r.guideName}</td>
                    <td><StatusBadge status={r.status} /></td>
                    <td>{r.currentStage}</td>
                    <td>{r.completedMilestones} / {r.totalMilestones}</td>
                    <td style={{ fontWeight: 700, color: 'var(--primary-700)' }}>{r.progressPercentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : reportType === 'GUIDE' ? (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Faculty Guide</th>
                  <th>Department & Designation</th>
                  <th>Assigned Groups</th>
                  <th>Active Projects</th>
                  <th>Completed Projects</th>
                  <th>Pending Submissions</th>
                </tr>
              </thead>
              <tbody>
                {reportData?.guideReport?.map((g, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{g.guideName}</td>
                    <td>{g.department} ({g.designation})</td>
                    <td><span className="badge badge-info">{g.assignedGroupsCount} / {g.maxCapacity}</span></td>
                    <td>{g.activeProjects}</td>
                    <td><span style={{ color: '#10b981', fontWeight: 600 }}>{g.completedProjects}</span></td>
                    <td><span style={{ color: g.pendingReviews > 0 ? '#ef4444' : '#64748b', fontWeight: 600 }}>{g.pendingReviews}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Group</th>
                  <th>Project Title</th>
                  <th>Presentation Stage</th>
                  <th>Date</th>
                  <th>Faculty Guide</th>
                  <th>Marks Obtained</th>
                  <th>Max Marks</th>
                  <th>Attendance</th>
                </tr>
              </thead>
              <tbody>
                {reportData?.marksReport?.map((m, i) => (
                  <tr key={i}>
                    <td><strong>{m.groupNumber}</strong></td>
                    <td style={{ fontWeight: 600 }}>{m.projectTitle}</td>
                    <td>Stage {m.presentationNumber}: {m.presentationTitle}</td>
                    <td>{new Date(m.scheduledDate).toLocaleDateString()}</td>
                    <td>{m.guideName}</td>
                    <td style={{ fontWeight: 700, color: m.marksObtained != null ? 'var(--primary-700)' : '#94a3b8' }}>
                      {m.marksObtained != null ? m.marksObtained : 'Not Evaluated'}
                    </td>
                    <td>{m.maxMarks || '-'}</td>
                    <td><StatusBadge status={m.attendanceStatus || m.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      setLoading(true);
      try {
        const data = await api.head.getAuditLogs();
        setLogs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadLogs();
  }, []);

  const columns = [
    {
      header: 'Timestamp',
      accessor: 'createdAt',
      render: (l) => <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>{new Date(l.createdAt).toLocaleString()}</span>,
    },
    {
      header: 'User / Role',
      render: (l) => (
        <div>
          <div style={{ fontWeight: 600 }}>{l.username}</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{l.userRole?.replace('ROLE_', '')}</div>
        </div>
      ),
    },
    {
      header: 'Action Performed',
      accessor: 'action',
      render: (l) => <span className="badge badge-neutral" style={{ fontFamily: 'monospace' }}>{l.action}</span>,
    },
    {
      header: 'Entity / ID',
      render: (l) => (
        <span style={{ fontSize: '0.8125rem' }}>
          {l.entityType} #{l.entityId}
        </span>
      ),
    },
    {
      header: 'Details',
      accessor: 'details',
      render: (l) => <span style={{ fontSize: '0.8125rem' }}>{l.details}</span>,
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>System Audit Trail</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Tamper-evident audit logs capturing administrative modifications, reviews, mark entries, and uploads.
        </p>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={logs}
          searchPlaceholder="Search audit logs by username, action, details..."
        />
      </div>
    </div>
  );
};
