import React from 'react';
import { X, Check, Folder } from 'lucide-react';
import { useStore } from '../store';

export default function ManageFoldersModal({ isOpen, onClose, activity }) {
  const { folders, toggleActivityInFolder } = useStore();

  if (!isOpen || !activity) return null;

  const currentFolderIds = Array.isArray(activity.folder_ids) ? activity.folder_ids : [];

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <div style={{ padding: 'var(--spacing-3)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Folder size={18} color="var(--accent)" />
            <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Add to Folder</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: 'var(--spacing-4)', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '60vh', overflowY: 'auto' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '8px' }}>
            Select folders for <strong>{activity.title}</strong>
          </p>
          
          {folders.length === 0 ? (
            <p style={{ fontSize: '13px', color: 'var(--text-dim)', textAlign: 'center', padding: '20px' }}>
              No folders created yet. Create one in the repository sidebar.
            </p>
          ) : (
            folders.map(folder => {
              const isSelected = currentFolderIds.includes(folder.id);
              return (
                <div 
                  key={folder.id}
                  onClick={() => toggleActivityInFolder(activity.id, folder.id)}
                  style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px', borderRadius: '8px', border: '1px solid',
                    cursor: 'pointer', transition: 'all 0.2s',
                    background: isSelected ? 'rgba(255, 122, 47, 0.05)' : 'var(--bg-surface)',
                    borderColor: isSelected ? 'var(--accent)' : 'var(--border)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ 
                      width: '18px', height: '18px', borderRadius: '4px', border: '2px solid',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderColor: isSelected ? 'var(--accent)' : 'var(--border)',
                      background: isSelected ? 'var(--accent)' : 'transparent'
                    }}>
                      {isSelected && <Check size={12} color="white" strokeWidth={3} />}
                    </div>
                    <span style={{ fontSize: '14px', color: isSelected ? 'var(--text-main)' : 'var(--text-secondary)', fontWeight: isSelected ? '600' : '500' }}>
                      {folder.name}
                    </span>
                  </div>
                  {isSelected && (
                    <span style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                      Already in folder
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div style={{ padding: 'var(--spacing-3)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-primary" onClick={onClose} style={{ width: '100%' }}>Done</button>
        </div>
      </div>
    </div>
  );
}
