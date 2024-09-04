import React, { useState, useEffect } from 'react';

const WorkspaceIconUploader: React.FC<{ onIconChange: (file: File) => void }> = ({ onIconChange }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      onIconChange(file);

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file, onIconChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImageClick = () => {
    document.getElementById('workspace-icon-input')?.click();
  };

  return (
    <div onClick={handleImageClick} className="cursor-pointer">
      <input
        id="workspace-icon-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      {previewUrl ? (
        <img src={previewUrl} alt="Workspace Icon Preview" className="rounded-full w-14 h-14" />
      ) : (
        <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
          {/* Default icon or placeholder */}
          <span>Upload Icon</span>
        </div>
      )}
    </div>
  );
};

export default WorkspaceIconUploader;
