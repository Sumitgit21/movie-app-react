import { useState, useEffect, useCallback, useRef } from 'react';

/** Enumeration for axis values */
export enum Axis {
    /**
     * The x-axis represents the horizontal direction.
     */
    X = 'x',
    /**
     * The y-axis represents the vertical direction.
     */
    Y = 'y'
}

/** Enumeration for direction values */
export enum Direction {
    /**
     * The up direction represents the scroll direction moving towards the top.
     */
    Up = 'UP',
    /**
     * The down direction represents the scroll direction moving towards the bottom.
     */
    Down = 'DOWN',
    /**
     * The left direction represents the scroll direction moving towards the left.
     */
    Left = 'LEFT',
    /**
     * The right direction represents the scroll direction moving towards the right.
     */
    Right = 'RIGHT',
    /**
     * The still direction represents the scroll direction when the user is not scrolling.
     */
    Still = 'still'
}

type ScrollPosition = {
    /**
     * The top position represents the distance from the top edge of the page.
     */
    top: number;
    /**
     * The bottom position represents the distance from the bottom edge of the page.
     */
    bottom: number;
    /**
     * The left position represents the distance from the left edge of the page.
     */
    left: number;
    /**
     * The right position represents the distance from the right edge of the page.
     */
    right: number;
};

/** Type declaration for the returned scroll information */
type ScrollInfo = {
    /**
     * The scrollDirection represents the current scroll direction.
     */
    scrollDirection: Direction;
    /**
     * The scrollPosition represents the current scroll position.
     */
    scrollPosition: ScrollPosition;
};

/** Type declaration for scroll properties */
type ScrollProps = {
    /**
     * The thresholdValue represents the threshold value for scroll detection.
     */
    thresholdValue?: number;
    /** 
     * The axis represents the scroll axis (x or y).
     */
    axis?: Axis;
    /**
     * The scrollUp represents the scroll direction when moving up.
     */
    scrollUp?: Direction;
    /**
     * The scrollDown represents the scroll direction when moving down.
     */
    scrollDown?: Direction;
    /**
     * The still represents the scroll direction when the user is not scrolling.
     */
    still?: Direction;
};

/**
 *
 * @param {ScrollProps} props - The properties related to scrolling.
 * @returns {ScrollInfo} - The current direction and position of scrolling.
 */
function useDetectScroll(props: ScrollProps = {}): ScrollInfo {
    const {
        thresholdValue = 0,
        axis = Axis.Y,
        scrollUp = axis === Axis.Y ? Direction.Up : Direction.Left,
        scrollDown = axis === Axis.Y ? Direction.Down : Direction.Right,
        still = Direction.Still
    } = props;


    const [scrollDirection, setScrollDirection] = useState<Direction>(still);
    const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    });

    const threshold = Math.max(0, thresholdValue);
    const ticking = useRef(false);
    const lastScroll = useRef(0);

    /** Function to update scroll direction */
    const updateScrollDir = useCallback(() => {
        const scroll = axis === Axis.Y ? window.scrollY : window.scrollX;

        if (Math.abs(scroll - lastScroll.current) >= threshold) {
            setScrollDirection(scroll > lastScroll.current ? scrollDown : scrollUp);
            lastScroll.current = Math.max(0, scroll);
        }
        ticking.current = false;
    }, [axis, threshold, scrollDown, scrollUp]);

    useEffect(() => {
        /** Function to update scroll position */
        const updateScrollPosition = () => {
            const top = window.scrollY;
            const left = window.scrollX;
            const bottom =
                document.documentElement.scrollHeight - window.innerHeight - top;
            const right =
                document.documentElement.scrollWidth - window.innerWidth - left;

            setScrollPosition({ top, bottom, left, right });
        };

        /** Call the update function when the component mounts */
        updateScrollPosition();

        window.addEventListener('scroll', updateScrollPosition);

        return () => {
            window.removeEventListener('scroll', updateScrollPosition);
        };
    }, []);

    useEffect(() => {
        lastScroll.current = axis === Axis.Y ? window.scrollY : window.scrollX;

        /** Function to handle onScroll event */
        const onScroll = () => {
            if (!ticking.current) {
                window.requestAnimationFrame(updateScrollDir);
                ticking.current = true;
            }
        };

        window.addEventListener('scroll', onScroll);

        return () => window.removeEventListener('scroll', onScroll);
    }, [axis, updateScrollDir]);

    return { scrollDirection, scrollPosition };
}

export default useDetectScroll;