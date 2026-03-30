import { motion, useReducedMotion } from "framer-motion";
import { albumItems } from "../../data/albumCatalog";
import {
  musicStaggerContainer,
  musicStaggerContainerReduced,
  musicStaggerItem,
  musicStaggerItemReduced,
} from "../../motion/presets";
import AlbumCard from "./components/AlbumCard";
import { useMusicLoadCursor } from "./hooks/useMusicLoadCursor";

export default function MusicPage() {
  const { musicLoadCursor, advanceMusicSlot } = useMusicLoadCursor(albumItems.length);
  const reduceMotion = useReducedMotion();
  const itemVariants = reduceMotion ? musicStaggerItemReduced : musicStaggerItem;
  const containerVariants = reduceMotion ? musicStaggerContainerReduced : musicStaggerContainer;

  return (
    <motion.div
      className="grid grid-cols-1 gap-4 min-[560px]:grid-cols-2 min-[960px]:grid-cols-3 min-[1360px]:grid-cols-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {albumItems.map((item, i) => (
        <motion.div key={item.id} variants={itemVariants} className="min-w-0">
          <AlbumCard item={item} index={i} loadCursor={musicLoadCursor} onSlotReady={advanceMusicSlot} />
        </motion.div>
      ))}
    </motion.div>
  );
}
