import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { DataTable } from '../../components/DataTable';
import { Modal } from '../../components/Modal';
import { StatusBadge } from '../../components/StatusBadge';
import {
  FolderPlus,
  Users,
  UserCheck,
  Plus,
  Check,
  Trash2,
  UserMinus,
  UserPlus,
  AlertTriangle,
} from 'lucide-react';

export const GroupManagementPage = () => {
  const { selectedYearId } = useAuth();
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [targetGroupForMember, setTargetGroupForMember] = useState(null);
  const [selectedStudentToAdd, setSelectedStudentToAdd] = useState('');
  const [isLeaderToAdd, setIsLeaderToAdd] = useState(false);
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

  const handleDeleteGroup = async (group) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${group.groupNumber}"? This will unassign its members and remove associated project data.`
      )
    ) {
      return;
    }
    try {
      await api.head.deleteGroup(group.id);
      setMessage(`Group ${group.groupNumber} has been deleted.`);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete group.');
    }
  };

  const handleRemoveStudent = async (groupId, studentId, studentName, groupNum) => {
    if (
      !window.confirm(
        `Remove student "${studentName}" from ${groupNum}? They will become unassigned and available for other groups.`
      )
    ) {
      return;
    }
    try {
      await api.head.removeStudentFromGroup(groupId, studentId);
      setMessage(`Student "${studentName}" removed from ${groupNum}.`);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to remove student from group.');
    }
  };

  const handleOpenAddMemberModal = (group) => {
    setTargetGroupForMember(group);
    setSelectedStudentToAdd('');
    setIsLeaderToAdd(false);
    setError('');
    setIsAddMemberModalOpen(true);
  };

  const handleAddMemberSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudentToAdd) {
      setError('Please select a student to add.');
      return;
    }
    try {
      await api.head.addStudentToGroup(
        targetGroupForMember.id,
        Number(selectedStudentToAdd),
        isLeaderToAdd
      );
      setMessage(`Student added to ${targetGroupForMember.groupNumber} successfully.`);
      setIsAddMemberModalOpen(false);
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to add student to group.');
    }
  };

  const availableStudents = students.filter((s) => !s.groupId);

  const columns = [
    {
      header: 'Group Number',
      accessor: 'groupNumber',
      render: (g) => <strong style={{ fontSize: '0.95rem' }}>{g.groupNumber}</strong>,
    },
    {
      header: 'Members (Students)',
      render: (g) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          {g.members?.map((m) => (
            <div
              key={m.id}
              style={{
                fontSize: '0.8125rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem',
                backgroundColor: 'var(--bg-subtle)',
                padding: '0.25rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <div>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{m.fullName}</span>{' '}
                <span style={{ color: 'var(--text-muted)' }}>({m.rollNumber})</span>
                {m.leader && (
                  <span className="badge badge-info" style={{ marginLeft: '6px', fontSize: '0.65rem' }}>
                    Leader
                  </span>
                )}
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.15rem 0.4rem', color: '#ef4444', height: 'auto' }}
                title="Remove from group"
                onClick={() =>
                  handleRemoveStudent(g.id, m.studentId || m.id, m.fullName, g.groupNumber)
                }
              >
                <UserMinus size={12} />
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.75rem', marginTop: '0.25rem', alignSelf: 'flex-start' }}
            onClick={() => handleOpenAddMemberModal(g)}
          >
            <UserPlus size={13} /> Add Member
          </button>
        </div>
      ),
    },
    {
      header: 'Allocated Guide',
      render: (g) =>
        g.guide ? (
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{g.guide.fullName}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{g.guide.designation}</div>
          </div>
        ) : (
          <span style={{ color: '#ef4444', fontSize: '0.8125rem', fontWeight: 600 }}>
            No Guide Allocated
          </span>
        ),
    },
    {
      header: 'Registered Project',
      render: (g) =>
        g.project ? (
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{g.project.title}</div>
            <div style={{ marginTop: '4px' }}>
              <StatusBadge status={g.project.status} />
            </div>
          </div>
        ) : (
          <span style={{ color: 'var(--text-subtle)', fontSize: '0.8125rem' }}>No project created</span>
        ),
    },
    {
      header: 'Actions',
      render: (g) => (
        <button
          className="btn btn-secondary btn-sm"
          style={{ color: '#ef4444' }}
          title="Delete Group"
          onClick={() => handleDeleteGroup(g)}
        >
          <Trash2 size={14} /> Delete
        </button>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Student Groups Management
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Form project batches, designate team leaders, manage members, and assign faculty guides.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <FolderPlus size={18} /> Create New Group
        </button>
      </div>

      {message && (
        <div
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#10b981',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            fontSize: '0.875rem',
          }}
        >
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
            <div
              style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1rem',
                fontSize: '0.875rem',
              }}
            >
              {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
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
            <label className="form-label">
              Select Unassigned Students ({availableStudents.length} available)
            </label>
            {availableStudents.length === 0 ? (
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-muted)',
                  fontSize: '0.875rem',
                }}
              >
                All registered students in this academic year are already assigned to groups.
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
                        backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'var(--bg-card)',
                        border: '1px solid',
                        borderColor: isSelected ? 'var(--primary-500)' : 'var(--border-color)',
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
                            border: '1px solid var(--border-color)',
                            backgroundColor: isSelected ? 'var(--primary-500)' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                          }}
                        >
                          {isSelected && <Check size={14} />}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                          {s.fullName}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          ({s.rollNumber})
                        </span>
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

      {/* Add Member to Existing Group Modal */}
      <Modal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        title={`Add Student to ${targetGroupForMember?.groupNumber}`}
        maxWidth="500px"
      >
        <form onSubmit={handleAddMemberSubmit}>
          {error && (
            <div
              style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1rem',
                fontSize: '0.875rem',
              }}
            >
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Select Unassigned Student *</label>
            {availableStudents.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No unassigned students available. Register new student accounts first.
              </p>
            ) : (
              <select
                className="form-control"
                value={selectedStudentToAdd}
                onChange={(e) => setSelectedStudentToAdd(e.target.value)}
                required
              >
                <option value="">-- Choose Student --</option>
                {availableStudents.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} ({s.rollNumber})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              id="isLeaderAdd"
              checked={isLeaderToAdd}
              onChange={(e) => setIsLeaderToAdd(e.target.checked)}
            />
            <label htmlFor="isLeaderAdd" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>
              Designate as Group Leader
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsAddMemberModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!selectedStudentToAdd || availableStudents.length === 0}
            >
              Add to Group
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
