import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { StatCard } from '../../components/StatusBadge';
import { StatusBadge } from '../../components/StatusBadge';
import {
  Layers,
  FolderCheck,
  Clock,
  AlertTriangle,
  UserCheck,
  GraduationCap,
  FileCheck2,
  Calendar,
  ChevronRight,
  TrendingUp,
  Award,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const HeadDashboard = () => {
  const { selectedYearId } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await api.head.getStats(selectedYearId);
        setStats(data);
      } catch (err) {
        setError('Failed to load dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [selectedYearId]);

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading management dashboard...</div>;
  }

  if (error) {
    return <div style={{ padding: '2rem', color: '#ef4444' }}>{error}</div>;
  }

  return (
    <div>
      {/* Page Title */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>Project Head Dashboard</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Overview and health monitoring of all academic capstone and mini projects.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/head/projects" className="btn btn-primary btn-sm">
            <Layers size={16} /> Register Project
          </Link>
          <Link to="/head/groups" className="btn btn-secondary btn-sm">
            Create Group
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="metrics-grid">
        <StatCard title="Total Projects" value={stats?.totalProjects || 0} icon={Layers} color="blue" />
        <StatCard title="Active Projects" value={stats?.activeProjects || 0} icon={TrendingUp} color="green" />
        <StatCard title="Completed Projects" value={stats?.completedProjects || 0} icon={Award} color="purple" />
        <StatCard title="Delayed Projects" value={stats?.delayedProjects || 0} icon={AlertTriangle} color="red" />
        <StatCard title="Total Faculty Guides" value={stats?.totalGuides || 0} icon={UserCheck} color="blue" />
        <StatCard title="Total Students" value={stats?.totalStudents || 0} icon={GraduationCap} color="amber" />
        <StatCard title="Pending Submissions" value={stats?.pendingSubmissions || 0} icon={FileCheck2} color="amber" />
        <StatCard title="Upcoming Presentations" value={stats?.upcomingPresentationsCount || 0} icon={Calendar} color="blue" />
      </div>

      {/* Charts & Analytics Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Project Status Breakdown */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Project Status Breakdown</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stats?.projectStatusDistribution && Object.entries(stats.projectStatusDistribution).map(([status, count]) => {
              const total = stats.totalProjects || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={status}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <StatusBadge status={status} />
                    </span>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${pct}%`,
                        backgroundColor:
                          status === 'COMPLETED' ? '#10b981' :
                          status === 'DELAYED' ? '#ef4444' :
                          status === 'CORRECTION_REQUIRED' ? '#f59e0b' : '#3b82f6',
                        borderRadius: '4px',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Guide Workload Distribution */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Faculty Guide Workload (Allocated Groups)</div>
            <Link to="/head/allocations" style={{ fontSize: '0.8125rem' }}>Manage Allocations &rarr;</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {stats?.guideWorkloadDistribution && Object.entries(stats.guideWorkloadDistribution).map(([guideName, groupCount]) => (
              <div
                key={guideName}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)' }}>{guideName}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Faculty Guide</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-info" style={{ fontSize: '0.8125rem', padding: '0.25rem 0.625rem' }}>
                    {groupCount} Groups Assigned
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Projects Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Registered Projects (Recent)</div>
          <Link to="/head/projects" className="btn btn-secondary btn-sm">
            View All Projects <ChevronRight size={14} />
          </Link>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Group</th>
                <th>Project Title</th>
                <th>Domain</th>
                <th>Allocated Guide</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentProjects?.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    No projects registered yet for this academic year.
                  </td>
                </tr>
              ) : (
                stats?.recentProjects?.map((p) => (
                  <tr key={p.id}>
                    <td><strong>{p.groupNumber}</strong></td>
                    <td style={{ fontWeight: 600 }}>{p.title}</td>
                    <td>{p.domain}</td>
                    <td>{p.guide ? p.guide.fullName : <span style={{ color: '#ef4444' }}>Unassigned</span>}</td>
                    <td><StatusBadge status={p.status} /></td>
                    <td style={{ width: '120px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ flex: 1, height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${p.progressPercentage}%`, backgroundColor: '#2563eb' }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{p.progressPercentage}%</span>
                      </div>
                    </td>
                    <td>
                      <Link to="/head/projects" className="btn btn-secondary btn-sm">Details</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
