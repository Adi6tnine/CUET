import React from 'react';
import SimpleStudyTracker from './SimpleStudyTracker';

class StudyTrackerErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error for debugging
    console.error('StudyTracker Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback to SimpleStudyTracker
      return <SimpleStudyTracker onClose={this.props.onClose} />;
    }

    return this.props.children;
  }
}

export default StudyTrackerErrorBoundary;