import { useAuth } from "@/context/auth";
import { useOnboard } from "@/context/onboard";
import { Fragment, useEffect } from "react";

export default function ProjectDispatch() {
  const { project } = useAuth();
  const { setForm } = useOnboard();

  useEffect(() => {
    if (project) {
      setForm({ projectId: project.id });
    }
  }, [project, setForm]);

  useEffect(() => {
    console.log(project);
  }, [project]);

  return <Fragment />;
}
