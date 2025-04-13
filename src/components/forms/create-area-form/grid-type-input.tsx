import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { UploadIcon } from "lucide-react";

function GridTypeInput() {
  return (
    <motion.div
      className="flex items-center justify-center overflow-hidden"
      variants={{
        initial: { opacity: 0, translateX: "20%" },
        animate: {
          opacity: 1,
          translateX: 0,
        },
        exit: {
          opacity: 0,
          translateX: "-20%",
        },
      }}
      initial={"initial"}
      animate={"animate"}
      exit={"exit"}
    >
      <div className="flex h-fit w-fit flex-row gap-5">
        <div className="flex flex-col gap-2.5">
          <Input placeholder="Bildeoverskrift" className="bg-background" />
          <div className="bg-accent relative flex aspect-[3/4] h-52 items-center justify-center rounded-3xl">
            <Button className="">
              <UploadIcon />
              Velg bilde
            </Button>
          </div>
        </div>
        <div className="flex h-auto flex-col gap-5">
          <Input placeholder="Overskrift" />
          <Textarea
            className="h-full w-lg resize-none rounded-xl"
            placeholder="Beskrivelse"
          />
        </div>
      </div>
    </motion.div>
  );
}

export default GridTypeInput;
