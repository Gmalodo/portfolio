"use client";
import React, {useEffect, useRef, useState} from "react";
import {AnimatePresence, motion, useMotionValueEvent, useScroll} from "framer-motion";
import classNames from "classnames";
import {Link} from "@components/Link.tsx";
import {BackgroundColor} from "@components/BackgroundColor.tsx";

const content: { text: React.ReactNode; media: React.ReactNode, theme?: string }[] = [
    {
        text: (
            <>
                <h3 className="text-headline-small text-primary">Spécialisez des models d'IA generative de text</h3>
                <p className="lg:mt-6 mt-2 text-body-large">Grâce aux RAG de LLM, je conçois des
                    chatbot spécialiser dans le ou les domaine(s) dont vous avez besoin.
                </p>
            </>),
        media: (
            <video className={"h-full w-full object-cover"} autoPlay loop muted>
                <source src="/video/my_compressed_video.mp4" type="video/mp4"/>
                Sorry, your browser doesn't support embedded videos.
            </video>
        ),
    },
    {
        text: (
            <>
                <h3 className="text-headline-small text-primary">Documentez vos solutions grace à l'IA</h3>
                <p className="lg:mt-6 mt-2 text-body-large">Permettez à vos clients ou à votre équipe de trouver
                    les solutions possible pour des problèmes precis.
                    Rendez votre documentation plus rapide et efficace pour vos utilisateur.
                </p>
            </>),
        media: (
            <img className={"h-full w-full object-cover"} loading={"lazy"} src={'/images/material-theme.webp'}/>
        ),
        theme: "purple"
    },
    {
        text: (
            <>
                <h3 className="text-headline-small text-primary">Devenez un expert dans le domaine de votre choix</h3>
                <p className="lg:mt-6 mt-2 text-body-large">
                    Augmentez les connaissances d'un model sur certains sujets pour vous instruire a ces propos.
                    Devenez un professionnelle, ou développez votre savoir dans n'importe quelle discipline.
                </p>
            </>),
        media: (
            <img className={"h-full w-full object-cover"} loading={"lazy"} src={'/images/material-theme.webp'}/>
        ),
        theme: "orange"
    },

]

export const StickyScroll = ({

                                 className,
                             }: {
    className?: string;
}) => {

    const [isLg, setIsLg] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const initialIsLg = window.innerWidth > 1024;
            setIsLg(initialIsLg);

            const handleResize = () => {
                setIsLg(window.innerWidth > 1024);
            }

            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
            }
        }
    }, []);

    const [activeCard, setActiveCard] = React.useState<number | null>(null);
    const ref = useRef<any>(null);
    const {scrollYProgress} = useScroll({
        target: ref,
        offset: ["start center", "end center"],
    });
    const cardLength = content.length;
    const [displayText, setDisplayText] = useState(false)
    const [isOverlay, setIsOverlay] = useState(false)

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        setIsOverlay(latest > 0 && latest < 1)
        if (!isLg) return
        const cardsBreakpoints = content.map((_, index) => index / cardLength);
        let closestBreakpointIndex = 0;
        for (let i = 0; i < cardsBreakpoints.length; i += 1) {
            if (cardsBreakpoints[i] > latest) {
                break;
            }
            window.screenX
            closestBreakpointIndex = i;
        }
        setDisplayText(latest > 0)
        setActiveCard(closestBreakpointIndex);
    });


    return (<>
        <AnimatePresence>
            {
                isOverlay && <motion.div
                    initial={"hidden"}
                    variants={{
                        hidden: {opacity: 0},
                        visible: {opacity: 1}
                    }}
                    animate={"visible"}
                    transition={{duration: 1}}
                    exit={"hidden"}
                    className={"fixed h-screen w-screen bg-surface top-0  z-10 left-0 " + (activeCard != null ? "theme-" + content[activeCard!]?.theme : "")}>

                    {isLg &&
                        <BackgroundColor/>}
                </motion.div>
            }
        </AnimatePresence>

        <motion.div
            className={"flex relative padding-x rounded-md z-20 " + className + ' ' + (activeCard != null ? "theme-" + content[activeCard!]?.theme : "")}
            ref={ref}
        >

            <motion.div
                variants={{
                    hidden: {opacity: 0, marginLeft: '-400px', filter: 'blur(10px)'},
                    visible: {opacity: 1, marginLeft: '0%', filter: 'blur(0px)'}
                }}
                initial={isLg ? "hidden" : "visible"}
                transition={{
                    duration: 0.75,
                    ease: [0.1, 0.25, 0.3, 1]
                }}
                animate={displayText || !isLg ? "visible" : "hidden"} layout
                className={"div mask-inverse left lg:w-[400px] w-full relative flex flex-col lg:gap-32 gap-16 "}>
                {content.map((item, index) => (
                    <div className={"max-w-lg lg:max-w-full " + (index == 1 ? "self-end" : '')}>
                        {!isLg && <div
                            className={classNames("rounded-2xl mb-4 overflow-hidden")}
                        >{item.media}</div>}
                        <motion.div
                            key={index}
                            variants={{
                                hidden: {
                                    opacity: 0, x: '-400px', filter: 'blur(10px)',
                                    transition: {x: {delay: 1}, filter: {delay: 1}}
                                },
                                visible: {opacity: 1, x: '0%', filter: 'blur(0px)'}
                            }}
                            initial={isLg ? "hidden" : "visible"}
                            transition={{
                                duration: 0.4,
                                ease: [0.1, 0.2, 0.4, 1]
                            }}
                            animate={activeCard == index || !isLg ? "visible" : "hidden"}
                            className={'lg:my-40 '}
                        >
                            {item.text}
                        </motion.div>
                    </div>
                ))}
            </motion.div>

            {isLg &&
                <motion.div layout
                            variants={{
                                hidden: {x: '0%'},
                                visible: {x: '0%', marginLeft: '4rem'}
                            }}
                            initial="hidden"
                            animate={displayText ? "visible" : "hidden"}
                            className={classNames(
                                "right hidden lg:flex flex-2 items-start rounded-md",
                            )}
                            transition={{
                                duration: 0.75,
                                ease: [0.1, 0.25, 0.3, 1]
                            }}
                >
                    <motion.div
                        layout
                        layoutRoot
                        style={{
                            top: 'calc(50% - ' + 500 / 2 + 'px)',
                            minWidth: '100%',
                        }}
                        variants={{
                            hidden: {height: "auto",},
                            visible: {height: 500,}
                        }}
                        initial="hidden"
                        animate={displayText ? "visible" : "hidden"}
                        className={"rounded-2xl sticky overflow-hidden"}
                        transition={{
                            duration: 0.75,
                            // ease: [0.1, 0.25, 0.3, 1]
                        }}
                    >

                        {content.map((card, index) => {
                            return <motion.div
                                layout
                                variants={{
                                    hidden: {
                                        opacity: '0', visibility: 'hidden', transitionEnd: {
                                            display: "none",
                                        },
                                    },
                                    visible: {
                                        opacity: '1', visibility: 'visible', transitionEnd: {
                                            display: "block",
                                        },
                                    }
                                }}
                                className={classNames("w-full h-full", {"!block": (index == activeCard) || (activeCard == null && index == 0)})}
                                initial="hidden"
                                animate={(index == activeCard) || (activeCard == null && index == 0) ? "visible" : "hidden"}
                                transition={{duration: 0}}
                            >{card.media}</motion.div>
                        })}
                    </motion.div>
                </motion.div>
            }
        </motion.div>
    </>);
};
