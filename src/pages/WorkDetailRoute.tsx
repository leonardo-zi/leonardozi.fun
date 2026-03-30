import { Navigate, useNavigate, useParams } from "react-router-dom";
import WorkDetailPage from "./WorkDetailPage";
import { works } from "../works";
import { useSitePreferences } from "../layouts/SitePreferencesContext";

export default function WorkDetailRoute() {
  const { workId } = useParams();
  const navigate = useNavigate();
  const { lang } = useSitePreferences();

  const work = workId ? works.find((w) => w.id === workId) ?? null : null;

  if (!work) {
    return <Navigate to="/" replace />;
  }

  return <WorkDetailPage work={work} lang={lang} onBack={() => navigate("/")} />;

}
