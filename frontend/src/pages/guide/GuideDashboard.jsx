import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { StatCard } from '../../components/StatusBadge';
import { StatusBadge } from '../../components/StatusBadge';
import { ProjectStepper } from '../../components/ProjectStepper';
import { Modal } from '../../components/Modal';
import {
  FolderKanban,
  FileCheck2,
  CalendarCheck,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  UserCheck,
  CheckCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const GuideDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await api.guide.getStats();
        setStats(data);
      } catch (err) {
        setError('Failed to load guide dashboard.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading faculty advisor dashboard...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>Faculty Guide Dashboard</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Supervise assigned student batches, verify document submissions, and conduct evaluations.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/guide/submissions" className="btn btn-primary btn-sm">
            <FileCheck2 size={16} /> Pending Reviews ({stats?.pendingReviews || 0})
          </Link>
          <Link to="/guide/meetings" className="btn btn-secondary btn-sm">
            <Clock size={16} /> Schedule Meeting
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="metrics-grid">
        <StatCard title="Assigned Groups" value={stats?.totalGroups || 0} icon={FolderKanban} color="blue" />
        <StatCard title="Active Projects" value={stats?.activeProjects || 0} icon={TrendingUp} color="green" />
        <StatCard title="Pending Submissions" value={stats?.pendingReviews || 0} icon={FileCheck2} color="amber" subtitle="Requires verification" />
        <StatCard title="Upcoming Presentations" value={stats?.upcomingPresentationsCount || 0} icon={CalendarCheck} color="purple" />
      </div>

      {/* Actionable Sections Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Pending Submissions Queue */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Pending Submissions Requiring Review</div>
            <Link to="/guide/submissions" style={{ fontSize: '0.8125rem' }}>Review All &rarr;</Link>
          </div>
          {stats?.pendingSubmissionsList?.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#10b981', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={32} />
              <p style={{ fontWeight: 500 }}>All submissions have been reviewed and verified!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {stats?.pendingSubmissionsList?.map((s) => (
                <div
                  key={s.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.875rem',
                    backgroundColor: '#fafbfc',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      {s.groupNumber}: {s.milestoneTitle}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {s.projectTitle} &bull; <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>V{s.currentVersion}</span>
                    </div>
                  </div>
                  <Link to="/guide/submissions" className="btn btn-primary btn-sm">
                    Review Now
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Presentations */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Upcoming Presentation Reviews</div>
            <Link to="/guide/presentations" style={{ fontSize: '0.8125rem' }}>View Marksheets &rarr;</Link>
          </div>
          {stats?.upcomingPresentations?.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              No upcoming scheduled presentations.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {stats?.upcomingPresentations?.map((p) => (
                <div
                  key={p.id}
                  style={{
                    padding: '0.875rem',
                    backgroundColor: '#fafbfc',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{p.groupNumber}: {p.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Date: {new Date(p.scheduledDate).toLocaleDateString()} {p.startTime ? `at ${p.startTime}` : ''} ({p.venue})</div>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const GuideGroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadGroups = async () => {
      setLoading(true);
      try {
        const data = await api.guide.getMyGroups();
        setGroups(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadGroups();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>My Assigned Groups & Projects</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Student teams allocated under your academic supervision.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>
        {groups.map((g) => (
          <div key={g.id} className="card" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FolderKanban size={20} color="var(--primary-600)" />
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{g.groupNumber}</h3>
              </div>
              {g.project && <StatusBadge status={g.project.status} />}
            </div>

            {g.project ? (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                  {g.project.title}
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', lineHeight: 1.4, marginBottom: '0.5rem' }}>
                  {g.project.description || 'No description provided.'}
                </p>
                <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                  <strong>Domain:</strong> {g.project.domain} &bull; <strong>Tech:</strong> {g.project.technologies}
                </div>

                <div style={{ marginTop: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>
                    <span>Project Milestone Progress</span>
                    <span>{g.project.progressPercentage}%</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${g.project.progressPercentage}%`, backgroundColor: '#2563eb' }} />
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)', color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' }}>
                Project has not yet been registered by Project Head.
              </div>
            )}

            {/* Team Members List */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Team Members ({g.members?.length || 0})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {g.members?.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#f1f5f9',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8125rem',
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{m.fullName}</span>
                    <span style={{ color: '#64748b', fontSize: '0.75rem' }}>({m.rollNumber})</span>
                    {m.leader && <span className="badge badge-info" style={{ fontSize: '0.6rem', padding: '0.1rem 0.3rem' }}>Lead</span>}
                  </div>
                ))}
              </div>
            </div>

            {g.project && (
              <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setSelectedGroup(g);
                    setIsModalOpen(true);
                  }}
                >
                  <ExternalLink size={14} /> Full Stepper Roadmap
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Stepper Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedGroup ? `${selectedGroup.groupNumber} Lifecycle Stepper` : 'Project Stepper'}
        maxWidth="700px"
      >
        {selectedGroup?.project && (
          <ProjectStepper milestones={selectedGroup.project.milestones} />
        )}
      </Modal>
    </div>
  );
};
