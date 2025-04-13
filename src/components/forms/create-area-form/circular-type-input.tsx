import { motion } from "framer-motion";

function CircularTypeInput() {
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
        <div className="bg-accent aspect-[1] h-52 rounded-full"></div>
        <div className="flex h-auto flex-col gap-5">
          <div className="bg-accent h-20 w-lg rounded-xl"></div>
          <div className="bg-accent h-full w-lg rounded-xl"></div>
        </div>
      </div>
    </motion.div>
  );
}

export default CircularTypeInput;
