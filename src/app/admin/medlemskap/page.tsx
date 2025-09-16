import ApplicationCard from "@/components/ui/application-card";
import { api } from "@/trpc/server";

const MembershipPage = async () => {
  const applications = await api.member.getApplications();
  return (
    <div>
      <h1 className="text-6xl font-black">Medlemskap</h1>

      <h2>Aktive forespørsler</h2>
      <main className="flex flex-row flex-wrap gap-5">
        {applications.map((app, index) => (
          <ApplicationCard
            applicationId={app.id}
            key={index}
            name={app.name}
            email={app.email}
            phoneNumber={app.phone}
          />
        ))}
      </main>
    </div>
  );
};

export default MembershipPage;
