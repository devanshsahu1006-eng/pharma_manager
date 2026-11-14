'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { RadarIllustration } from './illustrations/RadarIllustration';
import { InsightsIllustration } from './illustrations/InsightsIllustration';
import { ReportingIllustration } from './illustrations/ReportingIllustration';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
const cards = [
  {
    title: 'Real-Time Signals',
    description:
      'Stay ahead with live system data and continuous performance tracking across all nodes.',
    Illustration: RadarIllustration,
  },
  {
    title: 'Actionable Insights',
    description:
      'Turn complex data into clear decisions with instant, intelligent analysis.',
    Illustration: InsightsIllustration,
  },
  {
    title: 'Automated Reporting',
    description:
      'Generate structured reports that reveal system health at a glance.',
    Illustration: ReportingIllustration,
  },
];

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */
const fadeUp = (delay: number) => ({
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
  },
});

const ruleDrawVariant = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 },
  },
};

const cardVariant = (i: number) => ({
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.7 + i * 0.15,
    },
  },
});

const illustrationVariants = [
  // Radar — scale up
  {
    hidden: { opacity: 0, scale: 0.72 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 1.15 },
    },
  },
  // Insights — upward wipe (clipPath)
  {
    hidden: { clipPath: 'inset(100% 0 0 0)' },
    visible: {
      clipPath: 'inset(0% 0 0 0)',
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 1.3 },
    },
  },
  // Reporting — left-to-right wipe
  {
    hidden: { clipPath: 'inset(0 100% 0 0)' },
    visible: {
      clipPath: 'inset(0 0% 0 0)',
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 1.45 },
    },
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function CapabilitiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });
  const prefersReduced = useReducedMotion();

  const animate = prefersReduced ? 'visible' : isInView ? 'visible' : 'hidden';

  return (
    <section
      ref={sectionRef}
      className="capabilities-section"
    >
      {/* Vertical hairline guides */}
      <div className="capabilities-guide capabilities-guide--left" />
      <div className="capabilities-guide capabilities-guide--right" />

      <div className="capabilities-inner">
        {/* ── Top Context Strip ── */}
        <motion.div
          className="capabilities-strip"
          variants={fadeUp(0)}
          initial={prefersReduced ? 'visible' : 'hidden'}
          animate={animate}
        >
          <span className="capabilities-strip__left">
            <span>01</span>
            <motion.span
              className="capabilities-strip__rule"
              variants={ruleDrawVariant}
              initial={prefersReduced ? 'visible' : 'hidden'}
              animate={animate}
            />
          </span>
          <span>// CAPABILITIES</span>
          <span className="capabilities-strip__right">FULL VISIBILITY</span>
        </motion.div>

        {/* ── Main Headline ── */}
        <div className="capabilities-headline-mask">
          <motion.h2
            className="capabilities-headline"
            variants={fadeUp(0.2)}
            initial={prefersReduced ? 'visible' : 'hidden'}
            animate={animate}
          >
            <span className="capabilities-headline__clarity">Clarity</span>{' '}
            <span className="capabilities-headline__rest">across every layer</span>
          </motion.h2>
        </div>

        {/* ── Description ── */}
        <motion.p
          className="capabilities-desc"
          variants={fadeUp(0.45)}
          initial={prefersReduced ? 'visible' : 'hidden'}
          animate={animate}
        >
          A unified view of your infrastructure. Detect patterns, anticipate
          issues, and optimize performance before problems arise.
        </motion.p>

        {/* ── Cards ── */}
        <div className="capabilities-grid">
          {cards.map((card, i) => {
            const Illust = card.Illustration;
            return (
              <motion.div
                key={card.title}
                className="capabilities-card"
                variants={cardVariant(i)}
                initial={prefersReduced ? 'visible' : 'hidden'}
                animate={animate}
              >
                {/* Amber radial glow overlay */}
                <div className="capabilities-card__glow" />

                {/* Illustration stage */}
                <motion.div
                  className="capabilities-card__stage"
                  variants={prefersReduced ? undefined : illustrationVariants[i]}
                  initial={prefersReduced ? 'visible' : 'hidden'}
                  animate={animate}
                >
                  <Illust />
                </motion.div>

                {/* Text */}
                <h3 className="capabilities-card__title">{card.title}</h3>
                <p className="capabilities-card__desc">{card.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
