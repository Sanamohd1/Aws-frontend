import React, { useState } from 'react';
import './RepositoryCreation.css';
import Navbar from "../Navbar";


const RepositoryCreation = () => {
  const [formData, setFormData] = useState({
    repositoryName: '',
    description: '',
    visibility: 'public',
    initialize: false,
    gitignore: 'none',
    license: 'none'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.repositoryName.trim()) {
      newErrors.repositoryName = 'Repository name is required';
    } else if (!/^[a-zA-Z0-9-_]+$/.test(formData.repositoryName)) {
      newErrors.repositoryName = 'Only letters, numbers, hyphens, and underscores allowed';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const userId = localStorage.getItem('userId');
      
      if (!userId || userId === "undefined" || userId === "null") {
        alert('Please log in to create a repository');
        setIsSubmitting(false);
        return;
      }

      const repositoryData = {
        owner: userId,
        name: formData.repositoryName,
        description: formData.description,
        visibility: formData.visibility === 'public',
        content: formData.initialize ? ['README.md'] : [],
        issues: []
      };

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3002';

      const response = await fetch(`${apiUrl}/repo/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(repositoryData)
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Repository "${formData.repositoryName}" created successfully!`);        
        setFormData({
          repositoryName: '',
          description: '',
          visibility: 'public',
          initialize: false,
          gitignore: 'none',
          license: 'none'
        });

        window.location.href = '/repositories';
      } else {
        alert(data.error || 'Failed to create repository');
      }
    } catch (error) {
      console.error('Error creating repository:', error);
      alert('Failed to create repository. Please check if the backend server is running on port 3002.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
    <div className="repository-creation-container">
      <div className="repo-header">
        <h3 className="repo-title">Create a new repository</h3> 

        <p className="repo-subtitle">
          A repository contains all project files, including the revision history.
        </p>
      </div>
      <div className="repo-form-container">
        <div className="form-content">
          <div className="form-section">
            <label htmlFor="repositoryName" className="form-label">
              Repository name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="repositoryName"
              name="repositoryName"
              value={formData.repositoryName}
              onChange={handleInputChange}
              className={`form-input ${errors.repositoryName ? 'input-error' : ''}`}
              placeholder="my-awesome-project"
            />
            {errors.repositoryName && (
              <span className="error-message">{errors.repositoryName}</span>
            )}
            <span className="input-hint">
              Great repository names are short and memorable.
            </span>
          </div>

          <div className="form-section">
            <label htmlFor="description" className="form-label">
              Description <span className="optional">(optional)</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="A brief description of your project..."
              rows="3"
            />
          </div>

          <div className="form-section">
            <div className="form-label-row">
              <span className="form-label">Visibility</span>
            </div>
            <div className="radio-group">
              <label className="radio-card">
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  checked={formData.visibility === 'public'}
                  onChange={handleInputChange}
                />
                <div className="radio-content">
                  <div className="radio-header">
                    <svg className="icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7-3.25v2.992l2.028.812a.75.75 0 0 1-.557 1.392l-2.5-1A.751.751 0 0 1 7 8.25v-3.5a.75.75 0 0 1 1.5 0Z"/>
                    </svg>
                    <span className="radio-title">Public</span>
                  </div>
                  <p className="radio-description">
                    Anyone on the internet can see this repository
                  </p>
                </div>
              </label>

              <label className="radio-card">
                <input
                  type="radio"
                  name="visibility"
                  value="private"
                  checked={formData.visibility === 'private'}
                  onChange={handleInputChange}
                />
                <div className="radio-content">
                  <div className="radio-header">
                    <svg className="icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M4 4v2h-.25A1.75 1.75 0 0 0 2 7.75v5.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0 0 14 13.25v-5.5A1.75 1.75 0 0 0 12.25 6H12V4a4 4 0 1 0-8 0Zm6.5 2V4a2.5 2.5 0 0 0-5 0v2Z"/>
                    </svg>
                    <span className="radio-title">Private</span>
                  </div>
                  <p className="radio-description">
                    You choose who can see and commit to this repository
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="form-divider"></div>

          <div className="form-section">
            <div className="form-label-row">
              <span className="form-label">Initialize this repository with:</span>
            </div>
            
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="initialize"
                checked={formData.initialize}
                onChange={handleInputChange}
                className="checkbox-input"
              />
              <span className="checkbox-text">Add a README file</span>
            </label>
            <p className="checkbox-description">
              This is where you can write a long description for your project.
            </p>
          </div>

          <div className="form-row">
            <div className="form-section">
              <label htmlFor="gitignore" className="form-label">
                Add .gitignore
              </label>
              <select
                id="gitignore"
                name="gitignore"
                value={formData.gitignore}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="none">None</option>
                <option value="node">Node</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="ruby">Ruby</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
              </select>
              <span className="input-hint">
                Choose which files not to track
              </span>
            </div>

            <div className="form-section">
              <label htmlFor="license" className="form-label">
                Choose a license
              </label>
              <select
                id="license"
                name="license"
                value={formData.license}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="none">None</option>
                <option value="mit">MIT License</option>
                <option value="apache">Apache License 2.0</option>
                <option value="gpl">GNU GPLv3</option>
                <option value="bsd">BSD 3-Clause</option>
                <option value="unlicense">The Unlicense</option>
              </select>
              <span className="input-hint">
                A license tells others what they can and can't do
              </span>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Creating...
                </>
              ) : (
                'Create repository'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
     </>
  );
};


export default RepositoryCreation;