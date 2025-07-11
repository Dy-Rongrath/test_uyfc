import { expandCollapse } from 'helpers/animations/expand-collapse';
import { fadeIn, fadeInBottom, fadeInCustom, fadeInLeft, fadeInRight, fadeInTop, fadeOut, fadeOutBottom, fadeOutLeft, fadeOutRight, fadeOutTop } from 'helpers/animations/fade';
import { shake } from 'helpers/animations/shake';
import { slideInBottom, slideInLeft, slideInRight, slideInTop, slideOutBottom, slideOutLeft, slideOutRight, slideOutTop } from 'helpers/animations/slide';
import { zoomIn, zoomOut } from 'helpers/animations/zoom';

export const helpersAnimations = [
    expandCollapse,
    fadeIn, fadeInCustom, fadeInTop, fadeInBottom, fadeInLeft, fadeInRight,
    fadeOut, fadeOutTop, fadeOutBottom, fadeOutLeft, fadeOutRight,
    shake,
    slideInTop, slideInBottom, slideInLeft, slideInRight,
    slideOutTop, slideOutBottom, slideOutLeft, slideOutRight,
    zoomIn, zoomOut,
];
