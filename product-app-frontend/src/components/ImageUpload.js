import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';

const DropzoneContainer = styled.div`
  border: 2px dashed #6C63FF;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
  background: ${props => props.$isDragActive ? 'rgba(108, 99, 255, 0.1)' : 'white'};
  
  &:hover {
    border-color: #5A52E0;
  }
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 200px;
  margin-top: 1rem;
  border-radius: 4px;
`;

const Instructions = styled.p`
  color: #4A5568;
  margin-bottom: 0.5rem;
`;

const ErrorText = styled.div`
  color: #E53E3E;
  margin-top: 0.5rem;
  font-size: 0.875rem;
`;

const ImageUpload = ({ onImageChange, initialImage }) => {
  const [preview, setPreview] = useState(initialImage || null);
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError('');
    
    if (rejectedFiles && rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0].code === 'file-too-large') {
        setError('File is too large (max 5MB)');
      } else if (rejection.errors[0].code === 'file-invalid-type') {
        setError('Invalid file type. Only images are allowed.');
      }
      return;
    }
    
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
        onImageChange(file);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  return (
    <div>
      <DropzoneContainer {...getRootProps()} $isDragActive={isDragActive}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <Instructions>Drop the image here...</Instructions>
        ) : (
          <Instructions>Drag & drop an image here, or click to select</Instructions>
        )}
        <Instructions>Supports: JPEG, JPG, PNG, GIF (max 5MB)</Instructions>
      </DropzoneContainer>
      
      {error && <ErrorText>{error}</ErrorText>}
      
      {preview && (
        <div>
          <h4>Preview:</h4>
          <PreviewImage 
            src={preview} 
            alt="Preview" 
            onError={(e) => {
              e.target.src = '/images/default-product.png';
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;