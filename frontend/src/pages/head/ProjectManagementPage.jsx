import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { DataTable } from '../../components/DataTable';
import { Modal } from '../../components/Modal';
import { StatusBadge } from '../../components/StatusBadge';
import { ProjectStepper } from '../../components/ProjectStepper';
import { Layers, Plus, ExternalLink, Calendar, Code2 } from 'lucide-react';

export const ProjectManagementPage = () => {
  const { selectedYearId } = useAuth();
  const [projects, setProjects] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    groupId: '',
    title: '',
    description: '',
    domain: '',
    technologies: '',
    startDate: new Date().toISOString().split('T')[0],
    expectedEndDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [projectsData, groupsData] = await Promise.all([
        api.head.getProjects(selectedYearId),
        api.head.getGroups(selectedYearId),
      ]);
      setProjects(projectsData);
      setGroups(groupsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedYearId]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!formData.groupId || !formData.title.trim()) {
      setError('Please select a group and enter project title.');
      return;
    }

    try {
      await api.head.createProject({
        ...formData,
        groupId: Number(formData.groupId),
        academicYearId: selectedYearId,
      });

      setIsAddModalOpen(false);
      setMessage(`Project '${formData.title}' registered successfully.`);
      setFormData({
        groupId: '',
        title: '',
        description: '',
        domain: '',
        technologies: '',
        startDate: new Date().toISOString().split('T')[0],
        expectedEndDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to create project.');
    }
  };

  const unassignedGroups = groups.filter((g) => !g.project);

  const columns = [
    {
      header: 'Group',
      accessor: 'groupNumber',
      render: (p) => <strong>{p.groupNumber}</strong>,
    },
    {
      header: 'Project Title & Domain',
      render: (p) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{p.title}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Domain: {p.domain || 'General'}</div>
        </div>
      ),
    },
    {
      header: 'Faculty Guide',
      render: (p) => (
        p.guide ? (
          <span style={{ fontWeight: 500 }}>{p.guide.fullName}</span>
        ) : (
          <span style={{ color: '#ef4444', fontSize: '0.8125rem' }}>Unassigned</span>
        )
      ),
    },
    {
      header: 'Status',
      render: (p) => <StatusBadge status={p.status} />,
    },
    {
      header: 'Progress',
      render: (p) => (
        <div style={{ width: '130px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, marginBottom: '2px' }}>
            <span>{p.progressPercentage}%</span>
          </div>
          <div style={{ height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${p.progressPercentage}%`, backgroundColor: p.status === 'COMPLETED' ? '#10b981' : '#2563eb' }} />
          </div>
        </div>
      ),
    },
    {
      header: 'Actions',
      render: (p) => (
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => {
            setSelectedProject(p);
            setIsDetailsModalOpen(true);
          }}
        >
          <ExternalLink size={14} /> View Lifecycle
        </button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>Project Lifecycle & Monitoring</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Register new projects and monitor real-time milestone workflows and deadlines.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={18} /> Register New Project
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
          data={projects}
          searchPlaceholder="Search projects by title, domain, group..."
        />
      </div>

      {/* Register Project Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Student Project"
        maxWidth="650px"
      >
        <form onSubmit={handleCreateProject}>
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
              <option value="">-- Choose Student Group --</option>
              {unassignedGroups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.groupNumber} ({g.members?.map((m) => m.fullName).join(', ')})
                </option>
              ))}
            </select>
            {unassignedGroups.length === 0 && (
              <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                All existing groups already have registered projects. Form a new group first if needed.
              </p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Project Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. AI-Powered Smart Campus Monitoring System"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Domain / Subject Area</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Machine Learning, IoT, Cloud"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Technologies / Tech Stack</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. React, Spring Boot, MySQL, MQTT"
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Abstract / Problem Description</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Describe the problem definition, scope and architectural approach..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Expected Completion Date</label>
              <input
                type="date"
                className="form-control"
                value={formData.expectedEndDate}
                onChange={(e) => setFormData({ ...formData, expectedEndDate: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={!formData.groupId}>
              Register Project
            </button>
          </div>
        </form>
      </Modal>

      {/* Project Details & Stepper Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title={selectedProject ? `${selectedProject.groupNumber}: ${selectedProject.title}` : 'Project Lifecycle'}
        maxWidth="750px"
      >
        {selectedProject && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>Domain: <strong>{selectedProject.domain || 'N/A'}</strong></div>
                <div style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '2px' }}>Technologies: <strong>{selectedProject.technologies || 'N/A'}</strong></div>
                <div style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '2px' }}>Guide: <strong>{selectedProject.guide ? selectedProject.guide.fullName : 'Unassigned'}</strong></div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <StatusBadge status={selectedProject.status} />
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--primary-700)', marginTop: '4px' }}>
                  {selectedProject.progressPercentage}% Completed
                </div>
              </div>
            </div>

            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Milestones Lifecycle Stepper</h3>
            <ProjectStepper milestones={selectedProject.milestones} />
          </div>
        )}
      </Modal>
    </div>
  );
};
