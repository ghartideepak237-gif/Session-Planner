import React from 'react';
import { X, Check, Folder } from 'lucide-react';
import { useStore } from '../store';

export default function ManageFoldersModal({ isOpen, onClose, activity }) {
  const { folders, toggleActivityInFolder } = useStore();

  if (!isOpen || !activity) return null;

  const currentFolderIds = Array.isArray(activity.folder_ids) ? activity.folder_ids : [];

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div className="modal-content-glass" style={{ maxWidth: '440px', width: '90%', maxHeight: '80vh', display: 'flex', flexDirection: 'column', padding: '0' }}>
        <div style={{ padding: '24px 32px', borderBottom: '0.5px solid var(--border-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Folder size={18} color="var(--accent-silver)" />
            <h3 style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', margin: 0 }}>Folder <span style={{ fontStyle: 'italic', color: 'var(--accent-silver)' }}>Assignment</span></h3>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '60vh', overflowY: 'auto' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontFamily: 'var(--font-sans)' }}>
            Assign <strong>{activity.title}</strong> to specific organization buckets.
          </p>
          
          {folders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border-soft)' }}>
              <p style={{ fontSize: '13px', margin: 0 }}>No folders architected.</p>
              <p style={{ fontSize: '10px', marginTop: '4px', opacity: 0.5 }}>Create folders in the Repository sidebar.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {folders.map(folder => {
                const isSelected = currentFolderIds.includes(folder.id);
                return (
                  <div 
                    key={folder.id}
                    onClick={() => toggleActivityInFolder(activity.id, folder.id)}
                    className={`sidebar-link-v9 ${isSelected ? 'active' : ''}`}
                    style={{ 
                      padding: '16px', borderRadius: '14px', border: '1px solid',
                      cursor: 'pointer', transition: 'all 0.2s',
                      background: isSelected ? 'rgba(125, 211, 252, 0.1)' : 'rgba(255,255,255,0.02)',
                      borderColor: isSelected ? 'var(--accent-silver)' : 'var(--border-soft)',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '20px', height: '20px', borderRadius: '6px', border: '1.5px solid',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderColor: isSelected ? 'var(--accent-silver)' : 'var(--border-soft)',
                        background: isSelected ? 'var(--accent-silver)' : 'transparent',
                        transition: 'all 0.2s'
                      }}>
                        {isSelected && <Check size={14} color="var(--bg-deep)" strokeWidth={3} />}
                      </div>
                      <span style={{ fontSize: '14px', color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: isSelected ? '700' : '500' }}>
                        {folder.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ padding: '24px 32px', borderTop: '0.5px solid var(--border-soft)', display: 'flex', justifyContent: 'flex-end', background: 'rgba(255,255,255,0.02)' }}>
          <button className="btn-primary" onClick={onClose} style={{ width: '100%', borderRadius: '12px', padding: '12px' }}>Confirm Repository Update</button>
        </div>
      </div>
    </div>
  );
}
