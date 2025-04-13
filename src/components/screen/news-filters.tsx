import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpAZIcon, ArrowUpZAIcon, PlusIcon } from "lucide-react";
import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export enum TimeDirection {
  NEWEST = "nyeste",
  OLDEST = "eldste",
}
function NewsFilters() {
  const [filters, setFilters] = useQueryStates({
    orderBy: parseAsStringEnum<TimeDirection>(
      Object.values(TimeDirection),
    ).withDefault(TimeDirection.NEWEST),
    q: parseAsString,
  });
  return (
    <div className="flex flex-row gap-5">
      <Button
        className="overflow-hidden"
        variant={"outline"}
        onClick={() => {
          void setFilters((prev) => ({
            ...prev,
            orderBy:
              prev.orderBy === TimeDirection.NEWEST
                ? TimeDirection.OLDEST
                : TimeDirection.NEWEST,
          }));
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {filters.orderBy === TimeDirection.NEWEST && (
            <motion.div
              key={"newest"}
              className="flex flex-row items-center gap-2"
              initial={{
                opacity: 0,
                x: -20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: 20,
              }}
              transition={{
                duration: 0.2,
              }}
            >
              <ArrowUpAZIcon /> Nyeste først
            </motion.div>
          )}
          {filters.orderBy === TimeDirection.OLDEST && (
            <motion.div
              key={"oldest"}
              className="flex flex-row items-center gap-2"
              initial={{
                opacity: 0,
                x: -20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: 20,
              }}
              transition={{
                duration: 0.2,
              }}
            >
              <ArrowUpZAIcon /> Eldste først
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
      <Input
        placeholder="Søk..."
        className="w-56"
        defaultValue={filters.q ?? ""}
        onChange={(e) =>
          setFilters((prev) => {
            return { ...prev, q: e.target.value };
          })
        }
      />
      <div className="flex w-full justify-end">
        <Button>
          <PlusIcon /> Opprett
        </Button>
      </div>
    </div>
  );
}

export default NewsFilters;
