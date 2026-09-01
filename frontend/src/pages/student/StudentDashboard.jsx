import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { StatCard } from '../../components/StatusBadge';
import { StatusBadge } from '../../components/StatusBadge';
import { ProjectStepper } from '../../components/ProjectStepper';
import { ScrollJourneyRoadmap } from '../../components/ScrollJourneyRoadmap';
import {
  Layers,
  FolderKanban,
  CalendarCheck,
  Clock,
  UserCheck,
  Upload,
  AlertCircle,
  CheckCircle2,
  FileCheck2,
  HelpCircle,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentDashboard = () => {
  const [project, setProject] = useState(null);
  const [group, setGroup] = useState(null);
  const [stats, setStats] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const [statsData, groupData, projectData, subsData] = await Promise.all([
          api.student.getStats(),
          api.student.getMyGroup().catch(() => null),
          api.student.getMyProject().catch(() => null),
          api.student.getSubmissions().catch(() => []),
        ]);
        setStats(statsData);
        setGroup(groupData);
        setProject(projectData);
        setSubmissions(subsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading student portal...</div>;
  }

  const latestCorrection = submissions.find((s) => s.status === 'CORRECTION_REQUIRED');

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>Student Project Dashboard</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Track project milestones, upload synopsis & reports, view presentation scores and faculty feedback.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/student/diary" className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <BookOpen size={16} /> Log Project Diary
          </Link>
          <Link to="/student/submissions" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Upload size={16} /> Submissions
          </Link>
          <Link to="/student/requests" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <HelpCircle size={16} /> Contact Guide
          </Link>
        </div>
      </div>

      {/* Actionable Alert Banner for Correction Required */}
      {latestCorrection && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.25rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle size={24} color="#ef4444" />
            <div>
              <div style={{ fontWeight: 700, color: '#991b1b', fontSize: '0.9375rem' }}>
                Correction Required on {latestCorrection.milestoneTitle}
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#7f1d1d' }}>
                Your faculty guide requested updates. Please review remarks and upload a new version.
              </div>
            </div>
          </div>
          <Link to="/student/submissions" className="btn btn-danger btn-sm">
            Resubmit Document &rarr;
          </Link>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="metrics-grid">
        <StatCard
          title="Overall Project Progress"
          value={`${project ? project.progressPercentage : 0}%`}
          icon={Layers}
          color="blue"
        />
        <StatCard
          title="Project Status"
          value={project ? project.status.replace(/_/g, ' ') : 'NOT STARTED'}
          icon={CheckCircle2}
          color={project?.status === 'COMPLETED' ? 'green' : project?.status === 'DELAYED' ? 'red' : 'blue'}
        />
        <StatCard
          title="Assigned Guide"
          value={group?.guide ? group.guide.fullName : 'Pending'}
          icon={UserCheck}
          color="purple"
          subtitle={group?.guide?.designation}
        />
        <StatCard
          title="Upcoming Presentations"
          value={stats?.upcomingPresentationsCount || 0}
          icon={CalendarCheck}
          color="amber"
        />
      </div>

      {/* Active Project Overview Card */}
      {project ? (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-header">
            <div className="card-title">
              <Sparkles size={18} color="var(--primary-600)" /> {project.title}
            </div>
            <StatusBadge status={project.status} />
          </div>
          <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5, marginBottom: '1rem' }}>
            {project.description}
          </p>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', fontSize: '0.8125rem', color: '#64748b' }}>
            <div><strong>Domain:</strong> {project.domain || 'N/A'}</div>
            <div><strong>Technologies:</strong> {project.technologies || 'N/A'}</div>
            <div><strong>Group:</strong> {group?.groupNumber}</div>
            <div><strong>Guide:</strong> {group?.guide?.fullName || 'Unassigned'}</div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
          No active project registered yet for your group.
        </div>
      )}

      {/* Milestone Lifecycle Stepper */}
      {project?.milestones && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Project Milestones & Verification Roadmap</div>
            <Link to="/student/submissions" style={{ fontSize: '0.8125rem' }}>Manage Submissions &rarr;</Link>
          </div>
          <ProjectStepper milestones={project.milestones} />
        </div>
      )}

      {/* Interactive Scroll-Driven Horizontal Journey Track */}
      <ScrollJourneyRoadmap
        milestones={project?.milestones}
        progressPercentage={project?.progressPercentage || 0}
      />
    </div>
  );
};

export const StudentGroupPage = () => {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGroup = async () => {
      setLoading(true);
      try {
        const data = await api.student.getMyGroup();
        setGroup(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadGroup();
  }, []);

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading group info...</div>;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>My Project Group & Faculty Guide</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Assigned team batch, student members, and faculty advisor contact details.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {/* Group Details */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">{group?.groupNumber} Members</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {group?.members?.map((m) => (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.875rem',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{m.fullName}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Roll: {m.rollNumber} &bull; Sem: {m.semester}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{m.email}</div>
                </div>
                {m.leader ? (
                  <span className="badge badge-info">Team Leader</span>
                ) : (
                  <span className="badge badge-neutral">Member</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Guide Details */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Allocated Faculty Guide</div>
          </div>
          {group?.guide ? (
            <div style={{ padding: '0.5rem 0' }}>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                {group.guide.fullName}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#475569', marginTop: '4px' }}>
                {group.guide.designation}, {group.guide.department}
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '2px' }}>
                <strong>Specialization:</strong> {group.guide.specialization || 'Computer Science & Engineering'}
              </div>
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
                <Link to="/student/requests" className="btn btn-primary btn-sm">
                  <HelpCircle size={14} /> Send Academic Inquiry
                </Link>
                <Link to="/student/meetings" className="btn btn-secondary btn-sm">
                  View Scheduled Meetings
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
              No faculty guide has been allocated to your group yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const StudentProjectPage = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      setLoading(true);
      try {
        const data = await api.student.getMyProject();
        setProject(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, []);

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading project details...</div>;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>Project Architecture & Roadmap</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Complete project specification, timeline gates, and milestone status.
          </p>
        </div>
        {project && <StatusBadge status={project.status} />}
      </div>

      {project && (
        <>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '0.5rem' }}>
              {project.title}
            </h2>
            <p style={{ fontSize: '0.9375rem', color: '#334155', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              {project.description}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Domain</span>
                <div style={{ fontWeight: 600 }}>{project.domain || 'N/A'}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Technologies</span>
                <div style={{ fontWeight: 600 }}>{project.technologies || 'N/A'}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Start Date</span>
                <div style={{ fontWeight: 600 }}>{project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Completion Date</span>
                <div style={{ fontWeight: 600 }}>{project.expectedEndDate ? new Date(project.expectedEndDate).toLocaleDateString() : 'N/A'}</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Project Stages & Verification Stepper</div>
            </div>
            <ProjectStepper milestones={project.milestones} />
          </div>
        </>
      )}
    </div>
  );
};
