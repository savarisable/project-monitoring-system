import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Plus, Trash2, Save, Calendar, FileText, Download, CheckCircle2 } from 'lucide-react';
import { DataTable } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';

export const PresentationConfigPage = () => {
  const { selectedYearId } = useAuth();
  const [stagesCount, setStagesCount] = useState(3);
  const [stages, setStages] = useState([
    {
      presentationNumber: 1,
      title: 'Presentation 1 (Problem Definition & SRS)',
      description: 'Review of problem statement, SRS requirements, and initial architecture',
      maxMarks: 50,
      daysFromStart: 30,
    },
    {
      presentationNumber: 2,
      title: 'Presentation 2 (Mid-Term Progress & Prototype)',
      description: 'Midterm demo of working modules, core algorithm testing, and UI integration',
      maxMarks: 50,
      daysFromStart: 75,
    },
    {
      presentationNumber: 3,
      title: 'Final Presentation & Viva Voce',
      description: 'Comprehensive project exhibition, test results, code walkthrough and viva voce',
      maxMarks: 100,
      daysFromStart: 120,
    },
  ]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleStageCountChange = (count) => {
    const newCount = Math.max(1, Math.min(6, count));
    setStagesCount(newCount);

    let updated = [...stages];
    if (newCount > updated.length) {
      for (let i = updated.length + 1; i <= newCount; i++) {
        updated.push({
          presentationNumber: i,
          title: `Presentation ${i}`,
          description: `Stage ${i} evaluation and marks assessment`,
          maxMarks: 50,
          daysFromStart: i * 30,
        });
      }
    } else {
      updated = updated.slice(0, newCount);
    }
    setStages(updated);
  };

  const handleFieldChange = (index, field, value) => {
    const updated = [...stages];
    updated[index][field] = value;
    setStages(updated);
  };

  const handleSave = async () => {
    setError('');
    setMessage('');
    setSaving(true);
    try {
      await api.head.configurePresentations({
        academicYearId: selectedYearId,
        totalPresentationsCount: stagesCount,
        stages: stages.map((s) => ({
          presentationNumber: s.presentationNumber,
          title: s.title,
          description: s.description,
          maxMarks: Number(s.maxMarks),
          daysFromStart: Number(s.daysFromStart),
        })),
      });
      setMessage('Presentation stages successfully generated for all active projects.');
    } catch (err) {
      setError(err.message || 'Failed to configure presentations.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>Presentations Configuration</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Configure multiple evaluation presentation stages (e.g. 2, 3, or 4 stages) for all projects.
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          <Save size={18} /> {saving ? 'Applying...' : 'Save & Generate Presentation Slots'}
        </button>
      </div>

      {message && (
        <div style={{ padding: '0.75rem 1rem', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
          {message}
        </div>
      )}

      {error && (
        <div style={{ padding: '0.75rem 1rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      {/* Stage count selector */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div>
            <label className="form-label" style={{ marginBottom: '0.25rem' }}>Total Presentation Reviews Required</label>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Select number of evaluation stages (1 to 6)</div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[1, 2, 3, 4, 5].map((cnt) => (
              <button
                key={cnt}
                type="button"
                className={`btn btn-sm ${stagesCount === cnt ? 'btn-primary' : 'btn-secondary'}`}
                style={{ width: '40px', fontWeight: 700 }}
                onClick={() => handleStageCountChange(cnt)}
              >
                {cnt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Presentation stages cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {stages.map((stage, idx) => (
          <div key={idx} className="card" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <div style={{ fontWeight: 700, color: 'var(--primary-700)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={18} /> Stage {stage.presentationNumber} Details
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr 120px 140px', gap: '1rem' }}>
              <div>
                <label className="form-label">Presentation Title *</label>
                <input
                  type="text"
                  className="form-control"
                  value={stage.title}
                  onChange={(e) => handleFieldChange(idx, 'title', e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">Scope & Evaluation Focus</label>
                <input
                  type="text"
                  className="form-control"
                  value={stage.description}
                  onChange={(e) => handleFieldChange(idx, 'description', e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">Max Marks</label>
                <input
                  type="number"
                  className="form-control"
                  value={stage.maxMarks}
                  onChange={(e) => handleFieldChange(idx, 'maxMarks', e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">Days After Start</label>
                <input
                  type="number"
                  className="form-control"
                  value={stage.daysFromStart}
                  onChange={(e) => handleFieldChange(idx, 'daysFromStart', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SubmissionsMonitoringPage = () => {
  const { selectedYearId } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubmissions = async () => {
      setLoading(true);
      try {
        const report = await api.head.getReports('SUBMISSIONS', selectedYearId);
        setSubmissions(report.submissionReport || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadSubmissions();
  }, [selectedYearId]);

  const columns = [
    {
      header: 'Group',
      accessor: 'groupNumber',
      render: (s) => <strong>{s.groupNumber}</strong>,
    },
    {
      header: 'Project Title',
      accessor: 'projectTitle',
      render: (s) => <span style={{ fontWeight: 600 }}>{s.projectTitle}</span>,
    },
    {
      header: 'Submission Type',
      accessor: 'submissionType',
      render: (s) => <span style={{ fontWeight: 500 }}>{s.submissionType?.replace(/_/g, ' ')}</span>,
    },
    {
      header: 'Version',
      accessor: 'currentVersion',
      render: (s) => <span className="badge badge-neutral">V{s.currentVersion}</span>,
    },
    {
      header: 'Allocated Guide',
      accessor: 'guideName',
    },
    {
      header: 'Submission Status',
      accessor: 'status',
      render: (s) => <StatusBadge status={s.status} />,
    },
    {
      header: 'Last Verdict',
      accessor: 'lastVerdict',
      render: (s) => <StatusBadge status={s.lastVerdict} />,
    },
    {
      header: 'Submitted At',
      accessor: 'lastSubmittedAt',
      render: (s) => (s.lastSubmittedAt ? new Date(s.lastSubmittedAt).toLocaleString() : '-'),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>Submissions Monitoring</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Real-time global tracking of synopsis and progress report document submissions across all groups.
        </p>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={submissions}
          searchPlaceholder="Search submissions by group, project, or type..."
        />
      </div>
    </div>
  );
};
