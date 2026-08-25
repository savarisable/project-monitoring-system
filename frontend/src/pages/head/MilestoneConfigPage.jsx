import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Plus, Trash2, Save, MoveUp, MoveDown, CalendarCheck, Settings2 } from 'lucide-react';

export const MilestoneConfigPage = () => {
  const { selectedYearId } = useAuth();
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadMilestones = async () => {
    setLoading(true);
    try {
      const data = await api.head.getMilestones(selectedYearId);
      setMilestones(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMilestones();
  }, [selectedYearId]);

  const handleAddMilestone = () => {
    const nextOrder = milestones.length + 1;
    setMilestones([
      ...milestones,
      {
        id: null,
        milestoneOrder: nextOrder,
        title: `New Stage ${nextOrder}`,
        description: '',
        defaultDeadlineDays: 14,
        required: true,
      },
    ]);
  };

  const handleRemoveMilestone = (index) => {
    const updated = milestones.filter((_, idx) => idx !== index);
    // Re-index orders
    const reordered = updated.map((m, idx) => ({ ...m, milestoneOrder: idx + 1 }));
    setMilestones(reordered);
  };

  const handleFieldChange = (index, field, value) => {
    const updated = [...milestones];
    updated[index][field] = value;
    setMilestones(updated);
  };

  const handleMove = (index, direction) => {
    if (
      (direction === -1 && index === 0) ||
      (direction === 1 && index === milestones.length - 1)
    ) {
      return;
    }
    const updated = [...milestones];
    const targetIdx = index + direction;
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    const reordered = updated.map((m, idx) => ({ ...m, milestoneOrder: idx + 1 }));
    setMilestones(reordered);
  };

  const handleSave = async () => {
    setError('');
    setMessage('');
    setSaving(true);
    try {
      await api.head.saveMilestoneConfig({
        academicYearId: selectedYearId,
        milestones: milestones.map((m) => ({
          milestoneOrder: m.milestoneOrder,
          title: m.title,
          description: m.description,
          defaultDeadlineDays: Number(m.defaultDeadlineDays),
          required: m.required,
        })),
      });
      setMessage('Milestone configuration saved successfully for this academic year.');
      loadMilestones();
    } catch (err) {
      setError(err.message || 'Failed to save milestone configuration.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>Milestones Workflow Configuration</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Define custom academic lifecycle stages, standard deadline windows, and mandatory review gates.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={handleAddMilestone}>
            <Plus size={18} /> Add Stage
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            <Save size={18} /> {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {milestones.map((m, index) => (
          <div
            key={index}
            className="card"
            style={{
              marginBottom: 0,
              padding: '1.25rem',
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
            }}
          >
            {/* Order & Reorder Arrows */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '40px' }}>
              <button
                type="button"
                style={{ background: 'none', border: 'none', cursor: index === 0 ? 'default' : 'pointer', opacity: index === 0 ? 0.3 : 1 }}
                onClick={() => handleMove(index, -1)}
                disabled={index === 0}
              >
                <MoveUp size={16} />
              </button>
              <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--primary-700)', padding: '2px 0' }}>
                {m.milestoneOrder}
              </span>
              <button
                type="button"
                style={{ background: 'none', border: 'none', cursor: index === milestones.length - 1 ? 'default' : 'pointer', opacity: index === milestones.length - 1 ? 0.3 : 1 }}
                onClick={() => handleMove(index, 1)}
                disabled={index === milestones.length - 1}
              >
                <MoveDown size={16} />
              </button>
            </div>

            {/* Inputs */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '2fr 3fr 120px 100px', gap: '1rem', alignItems: 'center' }}>
              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Stage Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={m.title}
                  onChange={(e) => handleFieldChange(index, 'title', e.target.value)}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Description / Expected Deliverables</label>
                <input
                  type="text"
                  className="form-control"
                  value={m.description || ''}
                  placeholder="e.g. SRS, Architecture Diagram, Prototype"
                  onChange={(e) => handleFieldChange(index, 'description', e.target.value)}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Deadline (Days)</label>
                <input
                  type="number"
                  className="form-control"
                  value={m.defaultDeadlineDays}
                  onChange={(e) => handleFieldChange(index, 'defaultDeadlineDays', e.target.value)}
                />
              </div>

              <div style={{ textAlign: 'center' }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Mandatory</label>
                <input
                  type="checkbox"
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  checked={m.required}
                  onChange={(e) => handleFieldChange(index, 'required', e.target.checked)}
                />
              </div>
            </div>

            {/* Delete button */}
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ color: '#ef4444' }}
              onClick={() => handleRemoveMilestone(index)}
              title="Remove Stage"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
