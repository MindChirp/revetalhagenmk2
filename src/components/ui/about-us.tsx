"use client";

import { authClient } from "@/server/auth/client";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import AboutGrid from "./about-grid";
import { Button } from "./button";
import CreateAreaDialog from "./create-area-dialog";

function AboutUs() {
  const { data: session } = authClient.useSession();
  const [addSectionOpen, setAddSectionOpen] = useState(false);
  return (
    <div className="flex w-full flex-col items-center justify-center gap-20 px-10 py-10">
      <AboutGrid
        title="Revetalhagen har et levende miljø"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem deserunt repellendus nostrum at, corporis natus eligendi, odit iure, aperiam modi delectus fugiat laborum laboriosam totam sapiente consequuntur voluptates et assumenda."
        imageTitle="Levende miljø"
        titleHighlightIndex={3}
      />
      <AboutGrid
        title="Revetalhagen har et levende miljø"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem deserunt repellendus nostrum at, corporis natus eligendi, odit iure, aperiam modi delectus fugiat laborum laboriosam totam sapiente consequuntur voluptates et assumenda."
        imageTitle="Levende miljø"
        titleHighlightIndex={3}
        mirrored
      />
      {session?.user.role === "admin" && (
        <>
          <CreateAreaDialog
            open={addSectionOpen}
            onOpenChange={setAddSectionOpen}
          />
          <Button onClick={() => setAddSectionOpen(true)}>
            <PlusIcon /> Legg til område
          </Button>
        </>
      )}
    </div>
  );
}

export default AboutUs;
