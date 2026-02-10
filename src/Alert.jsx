
const Alert = ({ message, type }) => {
  // Logic to change colors based on "type"
  const isError = type === 'error';
  
  const alertStyle = {
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '10px',
    border: '1px solid',
    backgroundColor: isError ? '#fee2e2' : '#dcfce7',
    color: isError ? '#991b1b' : '#166534',
    borderColor: isError ? '#f87171' : '#4ade80',
    fontWeight: '500'
  };

  return (
    <div style={alertStyle}>
      {message}
    </div>
  );
};

export default Alert;