import { PageShell } from "@/components/ui/page-shell";
import { FeedbackForm } from "./feedback-form";

export const metadata = { title: "Feedback" };

export default function FeedbackPage() {
  return (
    <PageShell
      title="Feedback"
      subtitle="Spotted a bug? Have a feature idea? Tell the team. Goes straight to the admins."
    >
      <FeedbackForm />
    </PageShell>
  );
}
