import React, { useState, useEffect } from 'react';
import { studentApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import FileUploadModal from '../../components/FileUploadModal';
import { 
  FileCheck, 
  Upload, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  FileText, 
  ShieldAlert, 
  Crown, 
  Users, 
  Sparkles 
} from 'lucide-react';

const StudentSubmissionsPage = () => {
  const { user } = useAuth();
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [bannerNotice, setBannerNotice] = useState('');

  const fetchMilestones = async () => {
    try {
      setLoading(true);
      const res = await studentApi.getMilestones();
      setMilestones(res.data || []);
    } catch (err) {
      console.error('Failed to fetch milestone submissions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, []);

  const handleUploadClick = (milestone) => {
    setSelectedMilestone(milestone);
    setIsUploadOpen(true);
  };

  const handleUploadSuccess = () => {
    setBannerNotice('Milestone Deliverable Uploaded Successfully! All team members and guide synchronized.');
    fetchMilestones();
    setTimeout(() => setBannerNotice(''), 6000);
  };

  const isLeader = milestones.length > 0 ? milestones[0].isLeader : true;
  const leaderName = milestones.length > 0 ? milestones[0].leaderName : 'Group Leader';

  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn pb-8">
      
      {/* Top Banner Notice */}
      {bannerNotice && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm flex items-center gap-3 shadow-md animate-bounce">
          <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" />
          <span className="font-semibold">{bannerNotice}</span>
        </div>
      )}

      {/* Header Info */}
      <div className="bg-white dark:bg-slate-800/80 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Project Deliverables &amp; Submissions
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50">
              Team Synced
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Upload project documents, synopsis, demo screen recordings, and code packages.
          </p>
        </div>

        {/* Leader Info Pill */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
          <Crown size={16} className="text-amber-500 flex-shrink-0" />
          <div>
            <p className="font-bold leading-tight">{isLeader ? 'You are Group Leader' : `Leader: ${leaderName}`}</p>
            <p className="text-[10px] text-slate-400 leading-tight">
              {isLeader ? 'Full Deliverable Upload Authority' : 'Automatic Live Synchronization Active'}
            </p>
          </div>
        </div>
      </div>

      {/* Milestones Submission List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">
          <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs">Loading project milestones...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {milestones.map((m, idx) => {
            const hasSubmission = Boolean(m.submissionStatus);
            const isApproved = m.submissionStatus === 'APPROVED' || m.status === 'COMPLETED';

            return (
              <div
                key={m.id}
                className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/60 p-4 sm:p-5 shadow-sm hover:border-blue-400/50 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Milestone Info */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${
                    isApproved
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : hasSubmission
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    {idx + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                        {m.title}
                      </h3>
                      {isApproved ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                          ✓ Verified &amp; Approved
                        </span>
                      ) : hasSubmission ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                          Submitted (v{m.currentVersion || 1}) - Under Review
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                          Pending Submission
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {m.description || 'Deliverable milestone for project progress tracking.'}
                    </p>

                    {/* Meta info */}
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400 flex-wrap">
                      {m.deadline && <span>📅 Deadline: <strong className="text-slate-700 dark:text-slate-300">{m.deadline}</strong></span>}
                      {m.submittedByName && <span>👤 Uploaded by: <strong className="text-slate-700 dark:text-slate-300">{m.submittedByName}</strong></span>}
                      {m.guideRemarks && <span className="text-orange-500 font-semibold">💬 Guide Note: {m.guideRemarks}</span>}
                    </div>
                  </div>
                </div>

                {/* Upload / View Actions */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-700/50">
                  {m.fileUrl && (
                    <a
                      href={m.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 transition flex items-center gap-1.5"
                    >
                      <FileText size={14} />
                      <span>View File</span>
                    </a>
                  )}

                  <button
                    onClick={() => handleUploadClick(m)}
                    className="flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5"
                  >
                    <Upload size={14} />
                    <span>{hasSubmission ? 'Upload New Version' : 'Upload Deliverable'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      <FileUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        milestone={selectedMilestone}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
};

export default StudentSubmissionsPage;
