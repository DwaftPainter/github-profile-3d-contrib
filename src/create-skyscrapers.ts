import * as d3 from 'd3';
import * as util from './utils';
import * as type from './type';
import * as langIcons from './language-icons';

const ANGLE = 30;
const toRad = (deg: number) => (deg * Math.PI) / 180;
const atan = (tan: number) => (Math.atan(tan) * 180) / Math.PI;

export const createSkyscrapers = (
    svg: d3.Selection<SVGSVGElement, unknown, null, unknown>,
    userInfo: type.UserInfo,
    x: number,
    y: number,
    width: number,
    height: number,
    settings: type.PieLangSettings,
    isForcedAnimation: boolean,
): void => {
    if (userInfo.contributesLanguage.length === 0) {
        return;
    }

    const languages = userInfo.contributesLanguage.slice(0, 5);
    const maxContrib = Math.max(...languages.map((l) => l.contributions), 1);

    const group = svg
        .append('g')
        .attr('class', 'skyscrapers-group')
        .attr('transform', `translate(${x}, ${y})`);

    const dx = width / 14;
    const dy = dx * Math.tan(toRad(ANGLE));
    const dxx = dx * 0.85;
    const dyy = dy * 0.85;

    const isAnimate = settings.growingAnimation || isForcedAnimation;

    languages.forEach((lang, index) => {
        const posX = (index % 5) * (dx * 1.5) + dx;
        const posY = height - dy * 3;
        const towerHeight = Math.max(30, (lang.contributions / maxContrib) * (height - 60));

        const buildingGroup = group
            .append('g')
            .attr(
                'transform',
                `translate(${util.toFixed(posX)} ${util.toFixed(posY - towerHeight)})`,
            );

        if (isAnimate) {
            buildingGroup
                .append('animateTransform')
                .attr('attributeName', 'transform')
                .attr('type', 'translate')
                .attr(
                    'values',
                    `${util.toFixed(posX)} ${util.toFixed(posY - 10)};${util.toFixed(
                        posX,
                    )} ${util.toFixed(posY - towerHeight)}`,
                )
                .attr('dur', '2s')
                .attr('repeatCount', '1');
        }

        // Top Roof Panel
        buildingGroup
            .append('rect')
            .attr('stroke', 'none')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', util.toFixed(dxx))
            .attr('height', util.toFixed(dxx))
            .attr('fill', lang.color)
            .attr(
                'transform',
                `skewY(${-ANGLE}) skewX(${util.toFixed(
                    atan(dxx / 2 / dyy),
                )}) scale(1 ${util.toFixed((2 * dyy) / dxx)})`,
            );

        // Left Facade Panel
        buildingGroup
            .append('rect')
            .attr('stroke', 'none')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', util.toFixed(dxx / 2))
            .attr('height', util.toFixed(towerHeight))
            .attr('fill', d3.hsl(lang.color).darker(0.5).formatHex())
            .attr(
                'transform',
                `translate(0 ${util.toFixed(dyy)}) skewY(${ANGLE}) scale(${util.toFixed(
                    dxx / 2 / (dxx / 2),
                )} 1)`,
            );

        // Right Facade Panel
        buildingGroup
            .append('rect')
            .attr('stroke', 'none')
            .attr('x', util.toFixed(dxx / 2))
            .attr('y', 0)
            .attr('width', util.toFixed(dxx / 2))
            .attr('height', util.toFixed(towerHeight))
            .attr('fill', d3.hsl(lang.color).darker(1.2).formatHex())
            .attr(
                'transform',
                `translate(0 ${util.toFixed(dyy)}) skewY(${-ANGLE}) scale(${util.toFixed(
                    dxx / 2 / (dxx / 2),
                )} 1)`,
            );

        // Language Label / Icon
        const labelGroup = group
            .append('g')
            .attr(
                'transform',
                `translate(${util.toFixed(posX + dxx / 4)}, ${util.toFixed(posY + dyy + 15)})`,
            );

        const iconInfo = langIcons.getLanguageIcon(lang.language);
        if (iconInfo) {
            labelGroup
                .append('path')
                .attr('d', iconInfo.path)
                .attr('fill', lang.color)
                .attr('transform', 'scale(0.5)');
        }

        labelGroup
            .append('text')
            .attr('x', iconInfo ? 16 : 0)
            .attr('y', 10)
            .attr('font-size', '10px')
            .attr('class', 'fill-fg')
            .text(lang.language);
    });
};
