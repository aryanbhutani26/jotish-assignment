import { useParams, useNavigate } from 'react-router-dom';
import { useAudit } from '../contexts/AuditContext';
import CameraInterface from '../components/CameraInterface';
import SignatureCanvas from '../components/SignatureCanvas';
import { useState } from 'react';

function DetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { employees, setAuditImage } = useAudit();
  const navigate = useNavigate();
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [canvasDims, setCanvasDims] = useState<{ width: number; height: number } | null>(null);
  const [showSignature, setShowSignature] = useState(false);

  // Show not-found if employees not loaded or id doesn't match
  if (employees.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.notFound}>
          <p>No employee data available. Please go back to the list.</p>
          <button style={styles.backBtn} onClick={() => navigate('/list')}>
            Back to List
          </button>
        </div>
      </div>
    );
  }

  const employee = employees.find((e) => String(e.id) === String(id));

  if (!employee) {
    return (
      <div style={styles.container}>
        <div style={styles.notFound}>
          <p>Employee not found.</p>
          <button style={styles.backBtn} onClick={() => navigate('/list')}>
            Back to List
          </button>
        </div>
      </div>
    );
  }

  const knownKeys = ['id', 'name', 'city', 'salary', 'department', 'email'];
  const extraFields = Object.entries(employee).filter(
    ([k]) => !knownKeys.includes(k) && employee[k] !== undefined && employee[k] !== null
  );

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/list')}>
          ← Back
        </button>
        <h1 style={styles.title}>Employee Details</h1>
      </header>

      <main style={styles.main}>
        {/* Employee Info */}
        <section style={styles.card}>
          <h2 style={styles.employeeName}>{employee.name}</h2>
          <dl style={styles.fieldList}>
            <div style={styles.fieldRow}>
              <dt style={styles.fieldLabel}>ID</dt>
              <dd style={styles.fieldValue}>{String(employee.id)}</dd>
            </div>
            <div style={styles.fieldRow}>
              <dt style={styles.fieldLabel}>City</dt>
              <dd style={styles.fieldValue}>{employee.city}</dd>
            </div>
            <div style={styles.fieldRow}>
              <dt style={styles.fieldLabel}>Salary</dt>
              <dd style={styles.fieldValue}>
                {typeof employee.salary === 'number'
                  ? `$${employee.salary.toLocaleString()}`
                  : String(employee.salary)}
              </dd>
            </div>
            {employee.department && (
              <div style={styles.fieldRow}>
                <dt style={styles.fieldLabel}>Department</dt>
                <dd style={styles.fieldValue}>{employee.department}</dd>
              </div>
            )}
            {employee.email && (
              <div style={styles.fieldRow}>
                <dt style={styles.fieldLabel}>Email</dt>
                <dd style={styles.fieldValue}>{employee.email}</dd>
              </div>
            )}
            {extraFields.map(([key, value]) => (
              <div key={key} style={styles.fieldRow}>
                <dt style={styles.fieldLabel}>{key}</dt>
                <dd style={styles.fieldValue}>{String(value)}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Camera / Signature section */}
        <section style={styles.card}>
          <h3 style={styles.sectionTitle}>Capture Audit Photo</h3>

          {cameraError && (
            <div role="alert" style={styles.errorBox}>
              {cameraError}
            </div>
          )}

          {capturedImage && showSignature && canvasDims ? (
            <SignatureCanvas
              backgroundImage={capturedImage}
              width={canvasDims.width}
              height={canvasDims.height}
              onConfirm={(mergedDataUrl) => {
                setAuditImage(mergedDataUrl);
                navigate('/analytics');
              }}
            />
          ) : capturedImage ? (
            <div>
              <img
                src={capturedImage}
                alt="Captured audit photo"
                style={styles.capturedImg}
                onLoad={(e) => {
                  const img = e.currentTarget;
                  setCanvasDims({ width: img.naturalWidth || img.width, height: img.naturalHeight || img.height });
                }}
              />
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                  style={styles.primaryBtn}
                  onClick={() => setShowSignature(true)}
                >
                  Add Signature
                </button>
                <button
                  style={styles.secondaryBtn}
                  onClick={() => {
                    setCapturedImage(null);
                    setShowSignature(false);
                    setCanvasDims(null);
                    setCameraActive(false);
                    setCameraError(null);
                  }}
                >
                  Retake
                </button>
              </div>
            </div>
          ) : cameraActive ? (
            <CameraInterface
              onCapture={(dataUrl) => {
                setCapturedImage(dataUrl);
                setCameraActive(false);
                setCameraError(null);
              }}
              onError={(msg) => {
                setCameraError(msg);
                setCameraActive(false);
              }}
            />
          ) : (
            <button
              style={styles.primaryBtn}
              onClick={() => {
                setCameraError(null);
                setCameraActive(true);
              }}
            >
              Activate Camera
            </button>
          )}
        </section>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    fontFamily: 'system-ui, sans-serif',
    backgroundColor: '#f9fafb',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 24px',
    backgroundColor: '#1e40af',
    color: '#fff',
    borderBottom: '1px solid #1e3a8a',
  },
  title: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: 700,
  },
  main: {
    maxWidth: '640px',
    margin: '24px auto',
    padding: '0 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    padding: '20px',
  },
  employeeName: {
    margin: '0 0 16px',
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#111827',
  },
  sectionTitle: {
    margin: '0 0 16px',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#374151',
  },
  fieldList: {
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  fieldRow: {
    display: 'flex',
    gap: '12px',
  },
  fieldLabel: {
    width: '120px',
    flexShrink: 0,
    fontWeight: 600,
    color: '#6b7280',
    fontSize: '0.875rem',
  },
  fieldValue: {
    color: '#111827',
    fontSize: '0.875rem',
    margin: 0,
  },
  notFound: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: '16px',
    color: '#6b7280',
  },
  errorBox: {
    padding: '12px 16px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fca5a5',
    borderRadius: '6px',
    color: '#b91c1c',
    fontSize: '0.875rem',
    marginBottom: '12px',
  },
  capturedImg: {
    width: '100%',
    borderRadius: '6px',
    marginBottom: '12px',
    display: 'block',
  },
  primaryBtn: {
    padding: '10px 20px',
    backgroundColor: '#1e40af',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    fontWeight: 600,
  },
  secondaryBtn: {
    padding: '8px 16px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '0.875rem',
    cursor: 'pointer',
  },
  backBtn: {
    padding: '6px 14px',
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: '6px',
    fontSize: '0.875rem',
    cursor: 'pointer',
  },
};

export default DetailsPage;
