import * as React from "react";
import { memo, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";
import Link from 'next/link';
import { useInvertedBorderRadius } from "../../utils/useInvertedBorderRadius";
import { CardData } from "@/types/type";
import { ContentPlaceholder } from "./contentPlaceholder";
import { Title } from "./title";
import { Image } from "./image";
import { openSpring, closeSpring } from "./animation";
import { useScrollConstraints } from "../../utils/useScrollConstraints";
import { useWheelScroll } from "../../utils/useWheelScroll";

interface Props extends CardData {
  isSelected: boolean;
  history: {
    push: (route: string) => void;
  };
}

const dismissDistance = 150;

export const Card = memo(
  ({
    isSelected,
    id,
    title,
    category,
    history,
    pointOfInterest,
    backgroundColor
  }: Props) => {
    const y = useMotionValue(0);
    const zIndex = useMotionValue(isSelected ? 2 : 0);
    const inverted = useInvertedBorderRadius(20);
    const cardRef = useRef(null);
    const constraints = useScrollConstraints(cardRef, isSelected);

    function checkSwipeToDismiss() {
      y.get() > dismissDistance && history.push("/");
    }

    function checkZIndex(latest: any) {
      if (isSelected) {
        zIndex.set(2);
      } else if (!isSelected && latest.scaleX < 1.01) {
        zIndex.set(0);
      }
    }

    const containerRef = useRef(null);
    useWheelScroll(
      containerRef,
      y,
      constraints,
      checkSwipeToDismiss,
      isSelected
    );

    return (
      <li ref={containerRef} className={`card`}>
        <Overlay isSelected={isSelected} />
        <div className={`card-content-container ${isSelected && "open"}`}>
          <motion.div
            ref={cardRef}
            className="card-content"
            style={{ ...inverted, zIndex, y }}
            layout
            transition={isSelected ? openSpring : closeSpring}
            drag={isSelected ? "y" : false}
            dragConstraints={constraints}
            onDrag={checkSwipeToDismiss}
            onUpdate={checkZIndex}
          >
            <Image
              id={id}
              isSelected={isSelected}
              pointOfInterest={pointOfInterest}
              backgroundColor={backgroundColor}
            />
            <Title title={title} category={category} isSelected={isSelected} />
            <ContentPlaceholder />
          </motion.div>
        </div>
        {!isSelected && <Link href={id} className={`card-open-link`} />}
      </li>
    );
  },
  (prev, next) => prev.isSelected === next.isSelected
);

const Overlay = ({ isSelected }: any) => (
  <motion.div
    initial={false}
    animate={{ opacity: isSelected ? 1 : 0 }}
    transition={{ duration: 0.2 }}
    style={{ pointerEvents: isSelected ? "auto" : "none" }}
    className="overlay"
  >
    <Link href="/" />
  </motion.div>
);