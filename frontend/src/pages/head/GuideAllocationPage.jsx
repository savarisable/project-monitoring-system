import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { DataTable } from '../../components/DataTable';
import { Modal } from '../../components/Modal';
import { UserCheck, ArrowRightLeft, UserPlus } from 'lucide-react';

export const GuideAllocationPage = () => {
  const { selectedYearId } = useAuth();
  const [groups, setGroups] = useState([]);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedGuideId, setSelectedGuideId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [groupsData, guidesData] = await Promise.all([
        api.head.getGroups(selectedYearId),
        api.head.getGuides(),
      ]);
      setGroups(groupsData);
      setGuides(guidesData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedYearId]);

  const handleOpenAllocate = (group) => {
    setSelectedGroup(group);
    setSelectedGuideId(group.guide?.id ? String(group.guide.id) : '');
    setError('');
    setIsModalOpen(true);
  };

  const handleSaveAllocation = async (e) => {
    e.preventDefault();
    if (!selectedGuideId) {
      setError('Please select a faculty guide.');
      return;
    }

    try {
      await api.head.allocateGuide({
        groupId: selectedGroup.id,
        guideId: Number(selectedGuideId),
      });

      setIsModalOpen(false);
      setMessage(`Faculty guide successfully allocated to ${selectedGroup.groupNumber}.`);
      loadData();
    } catch (err) {
      setError(err.message || 'Allocation failed.');
    }
  };

  const columns = [
    {
      header: 'Group Number',
      accessor: 'groupNumber',
      render: (g) => <strong>{g.groupNumber}</strong>,
    },
    {
      header: 'Registered Project Title',
      render: (g) => (g.project ? g.project.title : <span style={{ color: '#94a3b8' }}>Pending registration</span>),
    },
    {
      header: 'Team Members',
      render: (g) => (
        <span style={{ fontSize: '0.8125rem' }}>
          {g.members?.map((m) => m.fullName).join(', ')} ({g.members?.length || 0})
        </span>
      ),
    },
    {
      header: 'Allocated Guide',
      render: (g) => (
        g.guide ? (
          <div>
            <div style={{ fontWeight: 600, color: 'var(--primary-700)' }}>{g.guide.fullName}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{g.guide.designation}</div>
          </div>
        ) : (
          <span className="badge badge-danger">Unassigned</span>
        )
      ),
    },
    {
      header: 'Actions',
      render: (g) => (
        <button className="btn btn-secondary btn-sm" onClick={() => handleOpenAllocate(g)}>
          <ArrowRightLeft size={14} /> {g.guide ? 'Change Guide' : 'Allocate Guide'}
        </button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>Faculty Guide Allocation</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Assign academic advisors and project supervisors to project student batches.
        </p>
      </div>

      {message && (
        <div style={{ padding: '0.75rem 1rem', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
          {message}
        </div>
      )}

      {/* Guide Workload Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {guides.map((g) => {
          const isAtCapacity = g.allocatedGroupsCount >= g.maxGroupsCapacity;
          return (
            <div
              key={g.id}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '1rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{g.fullName}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>{g.designation}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem' }}>
                <span>Workload:</span>
                <span className={`badge ${isAtCapacity ? 'badge-danger' : 'badge-info'}`}>
                  {g.allocatedGroupsCount} / {g.maxGroupsCapacity} Groups
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={groups}
          searchPlaceholder="Search groups or guides..."
        />
      </div>

      {/* Allocation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Allocate Guide to ${selectedGroup?.groupNumber}`}
        maxWidth="500px"
      >
        <form onSubmit={handleSaveAllocation}>
          {error && (
            <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Select Faculty Guide *</label>
            <select
              className="form-control"
              value={selectedGuideId}
              onChange={(e) => setSelectedGuideId(e.target.value)}
              required
            >
              <option value="">-- Choose Faculty Guide --</option>
              {guides.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.fullName} - {g.designation} ({g.allocatedGroupsCount}/{g.maxGroupsCapacity} active)
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Confirm Allocation
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
