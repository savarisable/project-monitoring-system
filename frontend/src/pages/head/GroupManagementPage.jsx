import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { DataTable } from '../../components/DataTable';
import { Modal } from '../../components/Modal';
import { StatusBadge } from '../../components/StatusBadge';
import { FolderPlus, Users, UserCheck, Plus, Check } from 'lucide-react';

export const GroupManagementPage = () => {
  const { selectedYearId } = useAuth();
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Form State
  const [groupNumber, setGroupNumber] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [leaderStudentId, setLeaderStudentId] = useState(null);
  const [selectedGuideId, setSelectedGuideId] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [groupsData, studentsData, guidesData] = await Promise.all([
        api.head.getGroups(selectedYearId),
        api.head.getStudents(selectedYearId),
        api.head.getGuides(),
      ]);
      setGroups(groupsData);
      setStudents(studentsData);
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

  const handleStudentToggle = (studentId) => {
    if (selectedStudentIds.includes(studentId)) {
      setSelectedStudentIds(selectedStudentIds.filter((id) => id !== studentId));
      if (leaderStudentId === studentId) setLeaderStudentId(null);
    } else {
      setSelectedStudentIds([...selectedStudentIds, studentId]);
      if (!leaderStudentId) setLeaderStudentId(studentId);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupNumber.trim()) {
      setError('Group number is required.');
      return;
    }
    if (selectedStudentIds.length === 0) {
      setError('Please select at least one student.');
      return;
    }

    setError('');
    try {
      await api.head.createGroup({
        groupNumber: groupNumber.trim(),
        academicYearId: selectedYearId,
        studentIds: selectedStudentIds,
        leaderStudentId,
        guideId: selectedGuideId ? Number(selectedGuideId) : null,
      });

      setIsModalOpen(false);
      setMessage(`Group '${groupNumber}' created successfully.`);
      setGroupNumber('');
      setSelectedStudentIds([]);
      setLeaderStudentId(null);
      setSelectedGuideId('');
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to create group.');
    }
  };

  const availableStudents = students.filter((s) => !s.groupId);

  const columns = [
    {
      header: 'Group Number',
      accessor: 'groupNumber',
      render: (g) => <strong>{g.groupNumber}</strong>,
    },
    {
      header: 'Members (Students)',
      render: (g) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {g.members?.map((m) => (
            <div key={m.id} style={{ fontSize: '0.8125rem' }}>
              <span style={{ fontWeight: 600 }}>{m.fullName}</span> ({m.rollNumber})
              {m.leader && (
                <span className="badge badge-info" style={{ marginLeft: '6px', fontSize: '0.65rem' }}>
                  Leader
                </span>
              )}
            </div>
          ))}
        </div>
      ),
    },
    {
      header: 'Allocated Guide',
      render: (g) => (
        g.guide ? (
          <div>
            <div style={{ fontWeight: 600 }}>{g.guide.fullName}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{g.guide.designation}</div>
          </div>
        ) : (
          <span style={{ color: '#ef4444', fontSize: '0.8125rem', fontWeight: 600 }}>No Guide Allocated</span>
        )
      ),
    },
    {
      header: 'Registered Project',
      render: (g) => (
        g.project ? (
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{g.project.title}</div>
            <div style={{ marginTop: '4px' }}><StatusBadge status={g.project.status} /></div>
          </div>
        ) : (
          <span style={{ color: '#94a3b8', fontSize: '0.8125rem' }}>No project created</span>
        )
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>Student Groups Management</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Form project batches, designate team leaders, and assign faculty guides.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <FolderPlus size={18} /> Create New Group
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
          data={groups}
          searchPlaceholder="Search groups by number, student name..."
        />
      </div>

      {/* Create Group Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Form New Project Group"
        maxWidth="650px"
      >
        <form onSubmit={handleCreateGroup}>
          {error && (
            <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Group Number / Code *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Group 03"
                value={groupNumber}
                onChange={(e) => setGroupNumber(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Allocate Guide (Optional)</label>
              <select
                className="form-control"
                value={selectedGuideId}
                onChange={(e) => setSelectedGuideId(e.target.value)}
              >
                <option value="">-- Assign Later --</option>
                {guides.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.fullName} ({g.allocatedGroupsCount}/{g.maxGroupsCapacity} groups)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Select Unassigned Students ({availableStudents.length} available)</label>
            {availableStudents.length === 0 ? (
              <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', color: '#64748b', fontSize: '0.875rem' }}>
                All registered students in this academic year are already assigned to groups. Create student accounts first if needed.
              </div>
            ) : (
              <div
                style={{
                  maxHeight: '220px',
                  overflowY: 'auto',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.375rem',
                }}
              >
                {availableStudents.map((s) => {
                  const isSelected = selectedStudentIds.includes(s.id);
                  const isLeader = leaderStudentId === s.id;
                  return (
                    <div
                      key={s.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.5rem 0.75rem',
                        backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                        border: '1px solid',
                        borderColor: isSelected ? '#bfdbfe' : 'var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleStudentToggle(s.id)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '3px',
                            border: '1px solid #94a3b8',
                            backgroundColor: isSelected ? '#2563eb' : 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                          }}
                        >
                          {isSelected && <Check size={14} />}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{s.fullName}</span>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>({s.rollNumber})</span>
                      </div>

                      {isSelected && (
                        <button
                          type="button"
                          className={`btn btn-sm ${isLeader ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setLeaderStudentId(s.id);
                          }}
                        >
                          {isLeader ? 'Leader ✓' : 'Make Leader'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={selectedStudentIds.length === 0}>
              Create Group ({selectedStudentIds.length} Students)
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
