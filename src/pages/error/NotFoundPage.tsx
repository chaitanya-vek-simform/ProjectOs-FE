import { Compass, Home } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/common/error-state/error-state";
import { LABELS } from "@/constants/labels";
import { ROUTES } from "@/constants/routes";

const L = LABELS.ERROR.NOT_FOUND;

/** Branded 404 page for unknown routes. */
function NotFoundPage() {
  return (
    <ErrorState
      icon={<Compass className="size-7" aria-hidden="true" />}
      code={L.CODE}
      title={L.TITLE}
      body={L.BODY}
      actions={
        <Button asChild>
          <Link to={ROUTES.DASHBOARD}>
            <Home aria-hidden="true" />
            {L.HOME}
          </Link>
        </Button>
      }
    />
  );
}

export default NotFoundPage;
