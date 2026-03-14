import { useAudit } from '../contexts/AuditContext';
import SalaryChart from '../components/SalaryChart';
import CityMap from '../components/CityMap';

function AuditImageDisplay({ auditImage }: { auditImage: string | null }) {
  if (auditImage) {
    return (
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Audit Image</h2>
        <img
          src={auditImage}
          alt="Audit capture with signature overlay"
          className="max-w-full rounded border border-gray-200 shadow-sm"
        />
      </section>
    );
  }

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Audit Image</h2>
      <p className="text-gray-500 italic">No audit image available.</p>
    </section>
  );
}

function AnalyticsPage() {
  const { auditImage, employees } = useAudit();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Analytics</h1>

      <AuditImageDisplay auditImage={auditImage} />

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Salary Distribution by City</h2>
        <div className="overflow-x-auto">
          <SalaryChart employees={employees} width={700} height={320} />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Employee Locations</h2>
        <CityMap employees={employees} />
      </section>
    </div>
  );
}

export default AnalyticsPage;
